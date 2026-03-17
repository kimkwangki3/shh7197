// 활동사진 게시글 시드 스크립트
// 실행: node seed-activity-photos.mjs

const ADMIN_TOKEN = "shh7197-admin-valid-token";
const BASE_URL = "http://localhost:5000";

const posts = [
  // ── 신대지구발전위원회 (dev1~5) ──
  {
    type: "activity-shinday",
    title: "제6기 신대지구발전위원회 출범식",
    content: "2021년 3월 4일, 신대건강생활지원센터에서 제6기 신대지구발전위원회 출범식이 열렸습니다. '미래를 여는 신대, 주민과 함께하는 신대'를 슬로건으로 새로운 출발을 다짐했습니다.",
    imageUrl: "/activity-photos/dev1.jpg",
    isPinned: false,
  },
  {
    type: "activity-shinday",
    title: "신대지구발전위원회 주민 간담회",
    content: "신대지구의 발전 방향을 논의하기 위해 주민 대표들이 한자리에 모여 현안을 점검하고 해결책을 모색했습니다.",
    imageUrl: "/activity-photos/dev2.jpg",
    isPinned: false,
  },
  {
    type: "activity-shinday",
    title: "신대 초고층 오피스텔 신축 문제 간담회",
    content: "신대지구 초고층 오피스텔 신축 문제와 관련하여 서동용 국회의원, 시·도의원, 해룡면 관계자 등 30여 명이 참석한 간담회가 열렸습니다. 주민들의 목소리를 직접 전달했습니다.",
    imageUrl: "/activity-photos/dev3.jpg",
    isPinned: false,
  },
  {
    type: "activity-shinday",
    title: "신대지구발전위원회 정기 회의",
    content: "신대지구 발전을 위한 정기 회의를 개최하여 지역 현안과 향후 추진 방향을 논의했습니다.",
    imageUrl: "/activity-photos/dev4.jpg",
    isPinned: false,
  },
  {
    type: "activity-shinday",
    title: "신대지구 발전 논의 회의",
    content: "신대지구의 지속가능한 발전을 위해 각계 관계자들이 모여 심도 있는 논의를 진행했습니다.",
    imageUrl: "/activity-photos/dev5.jpg",
    isPinned: false,
  },

  // ── 장애인 교육지원 (edu1~9) ──
  {
    type: "activity-welfare",
    title: "발달장애인 평생교육 지원금 200만원 전달 (1)",
    content: "2025년 8월 12일, 순천교육발전협력위원회가 전남동부권 발달장애인 평생교육지원센터에 교육지원금 200만원을 전달했습니다. 장애인 교육 환경 개선을 위한 따뜻한 마음을 모았습니다.",
    imageUrl: "/activity-photos/edu1.jpg",
    isPinned: false,
  },
  {
    type: "activity-welfare",
    title: "발달장애인 평생교육 지원금 200만원 전달 (2)",
    content: "순천교육발전협력위원회의 발달장애인 교육지원 전달식 현장입니다. 많은 분들이 참여하여 의미 있는 시간을 가졌습니다.",
    imageUrl: "/activity-photos/edu2.jpg",
    isPinned: false,
  },
  {
    type: "activity-welfare",
    title: "발달장애인 평생교육 지원금 전달식 (3)",
    content: "발달장애인 평생교육지원센터 교육지원금 전달식 참여 현장입니다.",
    imageUrl: "/activity-photos/edu3.jpg",
    isPinned: false,
  },
  {
    type: "activity-welfare",
    title: "발달장애인 평생교육 지원금 전달식 (4)",
    content: "발달장애인의 교육 기회 확대를 위해 전달된 지원금은 평생교육 프로그램 운영에 사용됩니다.",
    imageUrl: "/activity-photos/edu4.jpg",
    isPinned: false,
  },
  {
    type: "activity-welfare",
    title: "발달장애인 평생교육 지원금 전달식 (5)",
    content: "순천교육발전협력위원회 발달장애인 교육지원 행사 현장입니다.",
    imageUrl: "/activity-photos/edu5.jpg",
    isPinned: false,
  },
  {
    type: "activity-welfare",
    title: "발달장애인 평생교육 지원금 전달식 (6)",
    content: "발달장애인들의 평생교육을 지원하기 위한 뜻깊은 전달식 현장입니다.",
    imageUrl: "/activity-photos/edu6.jpg",
    isPinned: false,
  },
  {
    type: "activity-welfare",
    title: "발달장애인 평생교육 지원금 전달식 (7)",
    content: "지역사회와 함께하는 발달장애인 교육지원 활동 현장입니다.",
    imageUrl: "/activity-photos/edu7.jpg",
    isPinned: false,
  },
  {
    type: "activity-welfare",
    title: "발달장애인 평생교육 지원금 전달식 (8)",
    content: "더 나은 교육 환경을 만들기 위한 소중한 기부 현장입니다.",
    imageUrl: "/activity-photos/edu8.jpg",
    isPinned: false,
  },
  {
    type: "activity-welfare",
    title: "발달장애인 평생교육 지원금 전달식 (9)",
    content: "장애인 평생교육 지원을 위한 활동으로 지역 내 따뜻한 공동체 문화를 만들어 가고 있습니다.",
    imageUrl: "/activity-photos/edu9.jpg",
    isPinned: false,
  },

  // ── 교육발전협력위원회 (edu10~15) ──
  {
    type: "activity-edu",
    title: "매안초등학교 교육발전협력위원회 발대식 및 회장 취임식",
    content: "2025년 3월 27일, 신대지구 매안초등학교 시청각실에서 교육발전협력위원회 발대식 및 초대 취임회장 김정환 취임식이 열렸습니다. 아이들의 교육 환경 개선을 위한 뜻깊은 출발을 함께했습니다.",
    imageUrl: "/activity-photos/edu10.jpg",
    isPinned: false,
  },
  {
    type: "activity-edu",
    title: "'3등급도 인서울 GoGo~' 입시설명회",
    content: "2024년 12월 21일, 신대도서관 2층에서 EBS교재 강사, 진로로드맵연구소 소장 등이 참여한 입시설명회를 개최했습니다. 순천교육발전협력위원회 주최로 지역 학생들에게 유익한 시간을 제공했습니다.",
    imageUrl: "/activity-photos/edu11.jpg",
    isPinned: false,
  },
  {
    type: "activity-edu",
    title: "교육발전협력위원회 활동 (1)",
    content: "순천교육발전협력위원회의 교육 활동 현장입니다. 지역 교육 발전을 위해 다양한 프로그램을 운영하고 있습니다.",
    imageUrl: "/activity-photos/edu12.jpg",
    isPinned: false,
  },
  {
    type: "activity-edu",
    title: "교육발전협력위원회 활동 (2)",
    content: "교육발전협력위원회의 다양한 교육지원 활동 현장입니다.",
    imageUrl: "/activity-photos/edu13.jpg",
    isPinned: false,
  },
  {
    type: "activity-edu",
    title: "교육발전협력위원회 활동 (3)",
    content: "더 나은 교육 환경을 만들기 위한 교육발전협력위원회 활동 현장입니다.",
    imageUrl: "/activity-photos/edu14.jpg",
    isPinned: false,
  },
  {
    type: "activity-edu",
    title: "순천 초등학생 무료 생존수영교육 운영",
    content: "순천교육발전협력위원회가 아이들의 안전한 여름철 물놀이를 위해 신대 아쿠아차일드어린이수영장에서 무료 생존수영교육을 운영했습니다. 아이들의 안전을 지키는 소중한 활동입니다.",
    imageUrl: "/activity-photos/edu15.jpg",
    isPinned: false,
  },

  // ── 지역소통 활동 (rep1~8) ──
  {
    type: "activity-community",
    title: "순천교육발전협력위원회 지역소통 활동 (1)",
    content: "순천교육발전협력위원회 회원들이 모여 지역 교육 현안과 소통 방향을 논의했습니다.",
    imageUrl: "/activity-photos/rep1.jpg",
    isPinned: false,
  },
  {
    type: "activity-community",
    title: "순천교육발전협력위원회 지역소통 활동 (2)",
    content: "지역 교육 발전을 위한 순천교육발전협력위원회의 소통 활동 현장입니다.",
    imageUrl: "/activity-photos/rep2.jpg",
    isPinned: false,
  },
  {
    type: "activity-community",
    title: "순천교육발전협력위원회 지역소통 활동 (3)",
    content: "교육발전협력위원회 회원들의 지역소통 활동 현장입니다.",
    imageUrl: "/activity-photos/rep3.jpg",
    isPinned: false,
  },
  {
    type: "activity-community",
    title: "순천교육발전협력위원회 지역소통 활동 (4)",
    content: "지역 주민들과 함께하는 교육발전협력위원회의 소통 현장입니다.",
    imageUrl: "/activity-photos/rep4.jpg",
    isPinned: false,
  },
  {
    type: "activity-community",
    title: "순천교육발전협력위원회 지역소통 활동 (5)",
    content: "순천교육발전협력위원회의 활발한 지역소통 활동 현장입니다.",
    imageUrl: "/activity-photos/rep5.jpg",
    isPinned: false,
  },
  {
    type: "activity-community",
    title: "순천교육발전협력위원회 지역소통 활동 (6)",
    content: "지역 교육과 소통을 위한 위원회 활동 현장입니다.",
    imageUrl: "/activity-photos/rep6.jpg",
    isPinned: false,
  },
  {
    type: "activity-community",
    title: "순천교육발전협력위원회 지역소통 활동 (7)",
    content: "교육발전을 위한 지역소통 활동이 활발하게 이루어지고 있습니다.",
    imageUrl: "/activity-photos/rep7.jpg",
    isPinned: false,
  },
  {
    type: "activity-community",
    title: "순천교육발전협력위원회 지역소통 활동 (8)",
    content: "순천교육발전협력위원회가 지역 주민들과 함께하는 소통 활동 현장입니다.",
    imageUrl: "/activity-photos/rep8.jpg",
    isPinned: false,
  },
];

async function seed() {
  console.log(`총 ${posts.length}개 게시글 등록 시작...`);
  let success = 0;
  for (const post of posts) {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/board`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": ADMIN_TOKEN,
        },
        body: JSON.stringify(post),
      });
      const data = await res.json();
      if (data.success) {
        console.log(`✅ [${post.type}] ${post.title}`);
        success++;
      } else {
        console.log(`❌ 실패: ${post.title}`, data);
      }
    } catch (e) {
      console.error(`❌ 오류: ${post.title}`, e.message);
    }
  }
  console.log(`\n완료: ${success}/${posts.length}개 등록`);
}

seed();
