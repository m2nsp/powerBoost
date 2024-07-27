import { PrismaClient } from '@prisma/client';
import { USERS, COMMENTS, POSTS } from './mock.js';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// 기존 데이터 암호화
async function encryptSeedData() {
    try {
        // 기존 사용자 데이터 가져오기
        const users = await prisma.users.findMany();

        // 모든 사용자 데이터를 암호화하여 업데이트
        for (let user of users) {
            const hashedPassword = await bcrypt.hash(user.password, 10); // 기존 비밀번호를 해싱

            // 암호화된 비밀번호로 사용자 업데이트
            await prisma.users.update({
                where: { id: user.id },
                data: { password: hashedPassword },
            });
        }

        console.log('기존 데이터 암호화 완료');
    } catch (error) {
        console.error('기존 데이터 암호화 중 에러:', error);
    }
}

// 데이터베이스 초기화 및 데이터 삽입
async function main() {
    try {
        // 데이터 삭제 및 새로운 데이터 삽입
        await prisma.comments.deleteMany();
        await prisma.posts.deleteMany();
        await prisma.users.deleteMany();

        await prisma.users.createMany({
            data: USERS.map(user => ({
                ...user,
                password: user.password // 비밀번호는 여기서 해싱하지 않음
            })),
            skipDuplicates: true,
        });

        await prisma.posts.createMany({
            data: POSTS,
            skipDuplicates: true,
        });

        await prisma.comments.createMany({
            data: COMMENTS,
            skipDuplicates: true,
        });

        // 기존 데이터 암호화 실행
        await encryptSeedData();
    } catch (error) {
        console.error('데이터베이스 초기화 및 씨드 작업 중 에러:', error);
    }
}

// 스크립트 실행
main()
    .then(() => {
        console.log('데이터베이스 초기화 및 씨드 작업 완료');
    })
    .catch((e) => {
        console.error('스크립트 실행 중 에러:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
