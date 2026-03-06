/**
 * 활동 사진을 게시판에 삽입하는 시드 스크립트
 * 실행: npx tsx seed_activity_photos.ts
 */
import "dotenv/config";
import pg from "pg";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    console.error("DATABASE_URL 환경변수가 설정되지 않았습니다.");
    process.exit(1);
}

const pool = new pg.Pool({ connectionString: DATABASE_URL });

const posts = [
    {
        type: "activity",
        title: "📚 교육발전위원회 활동 사진",
        content: `홍성훈 후보의 교육발전위원회 활동 사진입니다.

지역 교육 발전을 위한 다양한 활동에 참여하여, 신대지구 주민들의 교육 환경 개선을 위해 최선을 다하고 있습니다.

아래는 교육발전위원회 활동 사진 모음입니다.`,
        imageUrl: "/activity-photos/edu1.jpg",
        isPinned: false,
        extraImages: [
            "/activity-photos/edu2.jpg",
            "/activity-photos/edu3.jpg",
            "/activity-photos/edu4.jpg",
            "/activity-photos/edu5.jpg",
            "/activity-photos/edu6.jpg",
            "/activity-photos/edu7.jpg",
            "/activity-photos/edu8.jpg",
            "/activity-photos/edu9.jpg",
            "/activity-photos/edu10.jpg",
            "/activity-photos/edu11.jpg",
            "/activity-photos/edu12.jpg",
            "/activity-photos/edu13.jpg",
            "/activity-photos/edu14.jpg",
            "/activity-photos/edu15.jpg",
        ],
    },
    {
        type: "activity",
        title: "🏙️ 신대지구 발전위원회 활동 사진",
        content: `홍성훈 후보의 신대지구 발전위원회 활동 사진입니다.

신대지구의 발전과 주민들의 삶의 질 향상을 위한 다양한 활동에 참여하고 있습니다.

아래는 신대지구 발전위원회 활동 사진 모음입니다.`,
        imageUrl: "/activity-photos/dev1.jpg",
        isPinned: false,
        extraImages: [
            "/activity-photos/dev2.jpg",
            "/activity-photos/dev3.jpg",
            "/activity-photos/dev4.jpg",
            "/activity-photos/dev5.jpg",
        ],
    },
    {
        type: "activity",
        title: "❤️ 사회공헌활동 사진",
        content: `홍성훈 후보의 사회공헌활동 사진입니다.

지역사회를 위한 봉사활동과 나눔의 실천으로 더 따뜻한 신대지구를 만들어가고 있습니다.

아래는 사회공헌활동 사진 모음입니다.`,
        imageUrl: "/activity-photos/rep1.jpg",
        isPinned: false,
        extraImages: [
            "/activity-photos/rep2.jpg",
            "/activity-photos/rep3.jpg",
            "/activity-photos/rep4.jpg",
            "/activity-photos/rep5.jpg",
            "/activity-photos/rep6.jpg",
            "/activity-photos/rep7.jpg",
            "/activity-photos/rep8.jpg",
        ],
    },
];

async function seedActivityPhotos() {
    const client = await pool.connect();
    try {
        console.log("활동 사진 게시글 삽입 시작...");

        // 기존 'activity' 타입 게시글 삭제 (중복 방지)
        const deleteResult = await client.query(
            "DELETE FROM boards WHERE type = 'activity'"
        );
        console.log(`기존 활동사진 게시글 ${deleteResult.rowCount}개 삭제됨`);

        for (const post of posts) {
            // 추가 이미지들을 content에 포함시켜 갤러리 형태로 표현
            const imageLinks = post.extraImages.map(url => `![활동사진](${url})`).join('\n');
            const fullContent = post.content + '\n\n' + imageLinks;

            const result = await client.query(
                `INSERT INTO boards (type, title, content, image_url, is_pinned, view_count, like_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, title`,
                [post.type, post.title, fullContent, post.imageUrl, post.isPinned, 0, 0]
            );
            console.log(`✅ 삽입 완료: ${result.rows[0].title} (ID: ${result.rows[0].id})`);
        }

        console.log("\n🎉 모든 활동 사진 게시글이 성공적으로 추가되었습니다!");
    } finally {
        client.release();
        await pool.end();
    }
}

seedActivityPhotos().catch(console.error);
