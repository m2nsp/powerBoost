export const USERS = [
  {
      id: 'b8f11e76-0a9e-4b3f-bccf-8d9b4fbf331e',
      name: '홍길동',
      email: 'honggd@example.com',
      phoneNumber: '01045311214',  
      password: 'imhonggildong15@',
  },
  {
      id: '6c3a18b0-11c5-4d97-9019-9ebe3c4d1317',
      name: '김영희',
      email: 'kimyh@example.com',
      phoneNumber: '01046541789',  
      password: 'prettyandyoung01',
  },
  {
      id: 'fd3ae0a5-8dd5-40b6-b8fd-48870f731db1',
      name: '이철수',
      email: 'lee.cs@example.com',
      phoneNumber: '01074154851',  
      password: 'cslove4851',
  },
  {
      id: '70e1e61d-f2ae-4d7d-bf8f-d65eafdb6a45',
      name: '박지영',
      email: 'parkjy@example.com',
      phoneNumber: '01054329841',  
      password: 'happylife92!',
  },
  {
      id: '73cb9639-d8b7-4f11-9a62-53f4187f3f11',
      name: '정민수',
      email: 'jungminsoo@example.com',
      phoneNumber: '01012345678',  
      password: 'letsgominsoo0574',
  },
];

export const POSTS = [
  {
      id: 'f8013040-b076-4dc4-8677-11be9a17162f',
      writerId: 'b8f11e76-0a9e-4b3f-bccf-8d9b4fbf331e',  // writer_id -> writerId
      likes: 88,
      body: '우와 내 첫번째 게시물이다',
      createdAt: new Date('2023-07-14T10:00:00Z'),  // createdAt 수정
      updatedAt: new Date('2023-07-14T10:00:00Z'),  // updatedAt 수정
  },
  {
      id: 'd2ff3048-83bc-425a-8ad3-d6d9af1c7c6d',
      writerId: 'b8f11e76-0a9e-4b3f-bccf-8d9b4fbf331e',  // writer_id -> writerId
      likes: 52,
      body: '멋진 길동이',
      createdAt: new Date('2023-07-14T11:00:00Z'),  // createdAt 수정
      updatedAt: new Date('2023-07-14T11:00:00Z'),  // updatedAt 수정
  },
  {
      id: '4e0d9424-3a16-4a5e-9725-0e9d2f9722b3',
      writerId: '6c3a18b0-11c5-4d97-9019-9ebe3c4d1317',  // writer_id -> writerId
      likes: 23,
      body: '비가 너무 많이 오는 하루',
      createdAt: new Date('2023-07-14T14:30:00Z'),  // createdAt 수정
      updatedAt: new Date('2023-07-14T14:30:00Z'),  // updatedAt 수정
  },
];

export const COMMENTS = [
  {
      commentId: 'a4ff201c-48f7-4963-b317-2e9e4e3e43b7',  // comment_id -> commentId
      commentWriterId: '70e1e61d-f2ae-4d7d-bf8f-d65eafdb6a45',  // commentWriter_id -> commentWriterId
      commentPostId: '4e0d9424-3a16-4a5e-9725-0e9d2f9722b3',  // commentPost_id -> commentPostId
      createdAt: new Date('2023-07-14T14:50:00Z'),  // createdAt 수정
      content: '언니 예뻐요~~',
  },
  {
      commentId: 'c6a5975a-42e7-4f7f-8b7c-72714d59f44a',  // comment_id -> commentId
      commentWriterId: '73cb9639-d8b7-4f11-9a62-53f4187f3f11',  // commentWriter_id -> commentWriterId
      commentPostId: 'd2ff3048-83bc-425a-8ad3-d6d9af1c7c6d',  // commentPost_id -> commentPostId
      createdAt: new Date('2023-07-14T14:30:00Z'),  // createdAt 수정
      content: '뭐하냐ㅡ.ㅡ',
  },
  {
      commentId: 'a33d441f-57a9-4618-8f46-07e7418ef3c9',  // comment_id -> commentId
      commentWriterId: 'fd3ae0a5-8dd5-40b6-b8fd-48870f731db1',  // commentWriter_id -> commentWriterId
      commentPostId: 'd2ff3048-83bc-425a-8ad3-d6d9af1c7c6d',  // commentPost_id -> commentPostId
      createdAt: new Date('2023-07-14T14:50:00Z'),  // createdAt 수정
      content: '우웨에엑',
  },
];
