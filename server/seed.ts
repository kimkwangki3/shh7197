import { storage } from "./storage.ts";

async function seed() {
    console.log("Seeding started...");

    // Hero Vote
    await storage.createVote({
        title: "홍성군 복합문화센터 건립, 어떻게 생각하시나요?",
        description: "청년과 어르신이 함께 어우러지는 공간을 제안합니다.",
        category: "문화/예술",
        agreeCount: 124,
        disagreeCount: 32,
        isHero: true,
    });

    // Regular Vote
    await storage.createVote({
        title: "주말 버스 노선 증편안",
        description: "내포신도시-홍성읍 간 주말 버스 배차 간격 단축",
        category: "교통",
        agreeCount: 45,
        disagreeCount: 12,
        isHero: false,
    });

    // Suggestions
    await storage.createSuggestion({
        title: "전통시장 바닥 분수 설치",
        content: "여름철 아이들이 즐겁게 놀 수 있고 시장 활성화에도 기여할 것 같습니다.",
        category: "경제",
        likeCount: 28,
    });

    await storage.createSuggestion({
        title: "가로등 LED 교체 요청",
        content: "홍성천 산책로가 밤에 너무 어둡습니다. 밝은 LED로 교체해주세요.",
        category: "안전",
        likeCount: 15,
    });

    // Board
    await storage.createBoardItem({
        title: "[공지] 홍성훈 시민 참여 플랫폼이 새롭게 단장했습니다!",
        content: "반갑습니다. 여러분의 목소리를 더 잘 듣기 위해 디자인과 기능을 개선했습니다.",
        type: "notice",
        isPinned: true,
        viewCount: 120,
    });

    // Promises
    await storage.createPromise({
        title: "홍성역 주변 역세권 개발 사업 조기 착공",
        description: "교통 허브로서의 홍성역 위상을 강화하겠습니다.",
        category: "교통",
        status: "in-progress",
        progress: 40,
    });

    await storage.createPromise({
        title: "어르신 무상 교통 지원 확대",
        description: "70세 이상 어르신들을 위한 버스비 전액 지원",
        category: "복지",
        status: "completed",
        progress: 100,
    });

    console.log("Seeding completed!");
}

seed().catch(console.error);
