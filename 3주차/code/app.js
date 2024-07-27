import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY;
const port = 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 회원가입
app.post('/signup', async (req, res) => {
    const { name, phoneNumber, email, password } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10); // 비밀번호 해싱

        const user = await prisma.users.create({
            data: {
                name,
                phoneNumber,
                email,
                password: hashedPassword,
            },
        });
        res.status(201).json(user);
    } catch (error) {
        console.error('사용자 생성 중 에러:', error);
        res.status(500).json({ error: '사용자 생성 중 에러 발생' });
    }
});

// 로그인
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.users.findUnique({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error('로그인 중 에러:', error);
        res.status(500).json({ error: '로그인 중 에러 발생' });
    }
});

// JWT 인증 미들웨어
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

// 글 전체 목록 조회
app.get('/posts', authenticateJWT, async (req, res) => {
    const { offset = 0, limit = 10, order = 'newest' } = req.query;
    let orderBy;
    switch (order) {
        case 'oldest':
            orderBy = { createdAt: 'asc' };
            break;
        case 'newest':
        default:
            orderBy = { createdAt: 'desc' };
    }
    const posts = await prisma.posts.findMany({
        orderBy,
        skip: parseInt(offset),
        take: parseInt(limit),
    });
    res.send(posts);
});

// 특정 게시물에 달린 댓글 조회
app.get('/comments', authenticateJWT, async (req, res) => {
    const { offset = 0, limit = 10, order = 'newest', commentPost_id } = req.query;

    if (!commentPost_id) {
        return res.status(400).send("commentPost_id가 필요합니다.");
    }

    let orderBy;
    switch (order) {
        case 'oldest':
            orderBy = { createdAt: 'asc' };
            break;
        case 'newest':
        default:
            orderBy = { createdAt: 'desc' };
    }
    const where = { commentPost_id };
    const comments = await prisma.comments.findMany({
        where,
        orderBy,
        skip: parseInt(offset),
        take: parseInt(limit),
    });
    res.send(comments);
});


//로그인 후 게시글 작성하기
app.post('/posts', authenticateJWT, async (req, res) => {
    const { body } = req.body;
    const { userId } = req.user;    //JWT에서 사용자 ID 가져오기
    
    try{
        const post = await prisma.posts.create({
            data: {
                writerId: userId,
                body,
                likes: 0,
            },
        });
        res.status(201).json(post);
    } catch(error){
        console.error('게시글 작성 중 에러:', error);
        res.status(500).json({error: '게시글 작성 중 에러 발생'});
    }
})


// 댓글 작성
app.post('/comments', authenticateJWT, async (req, res) => {
    const { content, commentPostId } = req.body;
    const { userId } = req.user;

    try {
        const comment = await prisma.comments.create({
            data: {
                commentWriterId: userId,
                commentPostId,
                content,
            },
        });

        res.status(201).json(comment);
    } catch (error) {
        console.error('댓글 작성 중 에러:', error);
        res.status(500).json({ error: '댓글 작성 중 에러 발생' });
    }
});


// 특정 사용자의 이메일을 통해 작성한 게시물 조회 -- 특정 사용자가 올린 [게시물 검색]
app.get('/posts/email/:email', authenticateJWT, async(req, res) => {
    const { email } = req.params;

    try{
        // 이메일을 통해 사용자 정보 조회
        const user = await prisma.users.findUnique({where: { email }});

        if(!user){
            return res.status(404).json({ error: '사용자를 찾을 수 없습니다.'});
        }

        //사용자의 ID를 통해 게시물 조회
        const posts = await prisma.posts.findMany({
            where: { writerId: user.id },
            orderBy: { createdAt: 'desc'},
        });

        if(posts.length === 0){
            return res.json({message: '게시물이 없습니다.'});
        }

        res.json(posts);
    }catch(error){
        console.error('게시물 검색 중 에러:', error);
        res.status(500).json({error: '게시물 검색 중 에러 발생'});
    }
});


//스크랩 추가
app.post('/scraps', authenticateJWT, async(req, res) => {
    const { scrapPostId } = req.body;
    const { userId } = req.user;

    try{
        const scrap = await prisma.scraps.create({
            data: {
                scrapperId: userId,         //로그인한 사용자의 ID
                scrapPostId: scrapPostId
            },
        });
        res.status(201).json(scrap);
    }catch(error){
        console.error('스크랩 추가 중 에러발생:', error);
        res.status(500).json({error: '스크랩 추가 중 에러 발생'});
    }
});

//스크랩 삭제
app.delete('/scraps', authenticateJWT, async(req, res) => {
    const { scrapPostId } = req.body;
    const { userId } = req.user;

    try{
        const scrap = await prisma.scraps.deleteMany({
            where: {
                scrapperId: userId,
                scrapPostId: scrapPostId
            },
        });

        if(scrap.count === 0){
            return res.status(404).json({error: '스크랩이 없습니다.'});
        }
        res.status(200).json({message: '스크랩이 제거되었습니다.'});
    }catch(error){
        console.error('스크랩 제거 중 에러 발생:', error);
        res.status(500).json({error: '스크랩 제거 중 에러 발생'});
    }
})

//스크랩 조회
app.get('/scraps', authenticateJWT, async (req, res) => {
    const { userId } = req.user;

    try {
        const scraps = await prisma.scraps.findMany({
            where: { scrapperId: userId },
            include: { scrapPost: true } // 관계된 Posts 모델을 포함
        });

        if (scraps.length === 0) {
            return res.status(404).json({ error: '스크랩된 게시물이 없습니다.' });
        }
        res.json(scraps.map(scrap => scrap.scrapPost)); // 수정된 필드 이름 사용
    } catch (error) {
        console.error('스크랩 조회 중 에러:', error);
        res.status(500).json({ error: '스크랩 조회 중 에러 발생' });
    }
});

app.listen(port, () => {
    console.log("Server Port :", port);
});
