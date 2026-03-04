import { storage } from "../server/storage";

async function seedData() {
  console.log("데이터베이스에 기본 데이터를 추가하는 중...");

  try {
    // 후보자 기본 정보
    await storage.updateCandidateInfo({
      name: "홍성훈",
      slogan: "믿음과 변화",
      electionYear: "2024",
      heroTitle: "믿음과 변화를 함께 만들어가겠습니다",
      heroDescription: "지역사회와 국가의 발전을 위해 헌신하며, 투명하고 정직한 정치로 국민과 함께하겠습니다.",
      profileImageUrl: null
    });

    console.log("✓ 후보자 기본 정보 추가됨");

    // 타임라인 데이터
    const timelineData = [
      {
        year: "2020-현재",
        title: "국회의원",
        organization: "대한민국 국회",
        description: "국민의 목소리를 대변하며 다양한 법안 발의와 정책 개발에 참여",
        achievements: ["교육법 개정안 발의", "지역경제 활성화 정책 추진", "복지제도 개선안 제출"],
        imageUrl: null,
        sortOrder: 0
      },
      {
        year: "2016-2020",
        title: "시의회의원",
        organization: "○○시의회",
        description: "지역사회 발전을 위한 조례 제정과 시민복지 향상에 기여",
        achievements: ["청년일자리 창출 조례 제정", "어린이집 확충 사업 추진", "교통인프라 개선 프로젝트 진행"],
        imageUrl: null,
        sortOrder: 1
      },
      {
        year: "2010-2016",
        title: "변호사",
        organization: "○○법무법인",
        description: "시민의 권익 보호와 사회정의 실현을 위한 법률 서비스 제공",
        achievements: ["시민 무료 법률상담 1000건 이상", "사회적 약자 변론 담당", "공익소송 참여"],
        imageUrl: null,
        sortOrder: 2
      },
      {
        year: "2005-2010",
        title: "공무원",
        organization: "○○시청",
        description: "행정 업무를 통해 시민들에게 실질적인 도움을 제공하는 경험 축적",
        achievements: ["민원 만족도 98% 달성", "업무 효율성 개선 시스템 도입", "시민소통 프로그램 운영"],
        imageUrl: null,
        sortOrder: 3
      }
    ];

    for (const entry of timelineData) {
      await storage.createTimelineEntry(entry);
    }

    console.log("✓ 타임라인 데이터 추가됨");

    // 정책 공약 데이터
    const policyAreas = [
      {
        iconName: "GraduationCap",
        title: "교육 혁신",
        description: "모든 아이들이 꿈을 키울 수 있는 교육 환경 조성",
        keyPoints: [
          "공교육 품질 향상 및 사교육비 부담 경감",
          "디지털 교육 인프라 확충",
          "진로 맞춤형 교육과정 도입",
          "교사 처우 개선 및 교육 자율성 확대"
        ],
        priority: "최우선",
        sortOrder: 0
      },
      {
        iconName: "Heart",
        title: "복지 확대",
        description: "생애주기별 맞춤형 복지로 국민 삶의 질 향상",
        keyPoints: [
          "건강보험 보장성 확대",
          "돌봄 서비스 공공성 강화",
          "청년 주거 지원 확대",
          "노인 일자리 창출 및 연금 개선"
        ],
        priority: "최우선",
        sortOrder: 1
      },
      {
        iconName: "Building2",
        title: "경제 활성화",
        description: "혁신과 포용이 조화된 지속 가능한 경제 성장",
        keyPoints: [
          "중소기업 및 스타트업 지원 확대",
          "일자리 창출 및 근로환경 개선",
          "지역 균형 발전 추진",
          "4차 산업혁명 대응 인프라 구축"
        ],
        priority: "우선",
        sortOrder: 2
      },
      {
        iconName: "Leaf",
        title: "환경 보호",
        description: "미래 세대를 위한 깨끗하고 지속 가능한 환경 조성",
        keyPoints: [
          "탄소 중립 실현을 위한 정책 추진",
          "재생에너지 확대 및 에너지 전환",
          "폐기물 감량 및 순환경제 구축",
          "대기질 개선 및 녹지 공간 확대"
        ],
        priority: "중점",
        sortOrder: 3
      },
      {
        iconName: "Users",
        title: "사회 통합",
        description: "차별 없는 포용 사회 구현과 사회적 갈등 해소",
        keyPoints: [
          "성별·세대·지역 간 갈등 해소",
          "사회적 약자 보호 및 인권 증진",
          "다문화 가정 지원 확대",
          "시민사회와의 소통 강화"
        ],
        priority: "우선",
        sortOrder: 4
      },
      {
        iconName: "Globe",
        title: "국제 협력",
        description: "평화와 번영을 위한 국제사회 기여 확대",
        keyPoints: [
          "한반도 평화 프로세스 지속 추진",
          "국제개발협력 확대",
          "글로벌 공급망 안정성 확보",
          "외교 역량 강화 및 다자협력 확대"
        ],
        priority: "중점",
        sortOrder: 5
      }
    ];

    for (const area of policyAreas) {
      await storage.createPolicyArea(area);
    }

    console.log("✓ 정책 공약 데이터 추가됨");

    // 연락처 정보
    const contactDetails = [
      {
        type: "phone",
        title: "전화",
        content: "02-1234-5678",
        description: "평일 9:00-18:00",
        iconName: "Phone",
        isActive: true,
        sortOrder: 0
      },
      {
        type: "email",
        title: "이메일",
        content: "contact@politician.kr",
        description: "24시간 접수 가능",
        iconName: "Mail",
        isActive: true,
        sortOrder: 1
      },
      {
        type: "office",
        title: "사무실",
        content: "서울특별시 종로구 세종대로 1",
        description: "방문 상담 가능 (예약 필수)",
        iconName: "MapPin",
        isActive: true,
        sortOrder: 2
      }
    ];

    for (const detail of contactDetails) {
      await storage.createContactDetail(detail);
    }

    console.log("✓ 연락처 정보 추가됨");

    // 운영시간
    const officeHours = [
      { day: "월-금", time: "09:00 - 18:00", status: "운영", sortOrder: 0 },
      { day: "토", time: "10:00 - 14:00", status: "운영", sortOrder: 1 },
      { day: "일", time: "휴무", status: "휴무", sortOrder: 2 }
    ];

    for (const hour of officeHours) {
      await storage.createOfficeHour(hour);
    }

    console.log("✓ 운영시간 추가됨");

    // 소셜미디어 링크
    const socialLinks = [
      { name: "페이스북", iconName: "Facebook", href: "#", color: "text-blue-600", isActive: true, sortOrder: 0 },
      { name: "인스타그램", iconName: "Instagram", href: "#", color: "text-pink-600", isActive: true, sortOrder: 1 },
      { name: "유튜브", iconName: "Youtube", href: "#", color: "text-red-600", isActive: true, sortOrder: 2 }
    ];

    for (const link of socialLinks) {
      await storage.createSocialLink(link);
    }

    console.log("✓ 소셜미디어 링크 추가됨");

    // 통계 정보
    const statistics = [
      { label: "경력", value: "20+", suffix: "년", sortOrder: 0 },
      { label: "시민 만남", value: "5000+", suffix: "회", sortOrder: 1 },
      { label: "투명성", value: "100", suffix: "%", sortOrder: 2 }
    ];

    for (const stat of statistics) {
      await storage.createStatistic(stat);
    }

    console.log("✓ 통계 정보 추가됨");

    console.log("\n🎉 모든 기본 데이터가 성공적으로 데이터베이스에 추가되었습니다!");

  } catch (error) {
    console.error("❌ 데이터 추가 중 오류 발생:", error);
    process.exit(1);
  }
}

// 스크립트 실행
seedData().then(() => {
  console.log("데이터 시딩 완료");
  process.exit(0);
}).catch((error) => {
  console.error("데이터 시딩 실패:", error);
  process.exit(1);
});

export { seedData };