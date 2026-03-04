import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import meetingScene from "@assets/신대메인_1759163144206.png";
import educationScene from "@assets/교육메인_1759163227211.png";
import poscoScene from "@assets/unnamed (2)_1759163227210.png";
import democraticPartyScene from "@assets/123_1759163444072.png";

interface TimelineItem {
  year: string;
  title: string;
  organization: string;
  description: string;
  achievements: string[];
  examples?: string[];
  image?: string;
}

export default function TimelineSection() {
  const timelineData: TimelineItem[] = [
    {
      year: "2025",
      title: "더불어민주당 특보·위원 임명",
      organization: "더불어민주당",
      description: "제21대 대통령선거 후보총괄특보단 전남특보단 '광양 특보' 및 노무현정신계승연대 위원으로 임명되어 정치 참여 및 민주주의 발전에 기여",
      achievements: [
        "광양 지역 특보 역할 수행 (2025.05.29 임명)", 
        "노무현정신계승연대 위원 활동 (2025.05.30 임명)", 
        "노무현 전 대통령의 민주주의 정신 계승 및 실천",
        "지역 사회와 정치 발전을 위한 교량 역할",
        "더불어민주당 당원으로서 정치 참여 확대"
      ],
      image: democraticPartyScene
    },
    {
      year: "2019-현재",
      title: "신대지구발전위원회",
      organization: "신대지구발전위원회",
      description: "자발적 주민조직으로 아파트 입주민, 상인, 학부모, 전문가 등이 참여하는 비영리적 성격의 지역 발전 조직입니다. 지역 발전을 목표로 하며 수익 사업이 아닌 공익적 활동을 중심으로 하여 주민 의견을 모아 행정기관(순천시, 전남도, 교육청 등)에 전달하는 가교 역할을 수행합니다.",
      achievements: [
        "순천 신대지구 발전위원회 고문 (전 위원장)",
        "전) 신대지구 중흥2차 입주자 대표회의 회장 다선",
        "전) 신대지구 E1 부지 정상화 촉구 위원회 활동",
        "교육·문화 인프라 유치: 학교, 병원, 복지관 등 지역에 필요한 시설 건의",
        "교육 발전 협력, 장학 사업, 문화행사 추진",
        "주민 소통 및 화합: 버스킹, 마라톤, 축제 등 주민 참여형 행사 개최",
        "발전 위원회 발대식, 월례 회의 등 정기적 소통",
        "지역 현안 대응: 외국인 학교 부지 활용 문제, 의료 부지 활용 논의",
        "교통·환경 개선 요구",
        "시·도 의원, 교육청과 정책 협의"
      ],
      image: meetingScene
    },
    {
      year: "현재",
      title: "순천 교육 발전 협력 위원회",
      organization: "순천 교육 발전 협력 위원회 등",
      description: "비영리적 주민 협의체로 교육에 관심 있는 학부모, 교사, 지역 인사, 시민단체 등이 참여하는 공공–민간 협력 기구입니다. 순천시·전남교육청 등 행정기관과 협력하며 자율적으로 운영되는 조직으로, 법적 의무 기구는 아니지만 필요시 비영리 민간 단체로 등록 가능합니다.",
      achievements: [
        "장학·교육 지원: 장학금·교육 지원금 전달, 취약 계층·발달 장애 학생 교육 지원",
        "지역 학교와 협력해 교육 프로그램 후원",
        "교육 환경 개선: 학교 신설·특성화고 유치 건의",
        "교육 인프라(도서관, 체육 시설 등) 확충 요구",
        "청소년 진로·체험 프로그램 추진",
        "지역 사회 연계: 주민, 학부모, 교사, 기업과 협력 네트워크 구축",
        "교육 관련 세미나·포럼 개최",
        "문화·체육·봉사 활동 연계"
      ],
      examples: [
        "전남 동부권 발달 장애인 평생 교육 지원 센터에 교육 지원금 전달",
        "순천지역 학생 대상 장학금 수여식 개최",
        "신대지구 등 신도심 교육 환경 개선 요구"
      ],
      image: educationScene
    },
    {
      year: "현재",
      title: "㈜포스코 플랜텍 리튬TF 근무",
      organization: "㈜포스코 플랜텍",
      description: "플랜텍(포스코플랜텍 계열 또는 관련 회사)은 최근 이차전지 소재 및 관련 플랜트 사업을 주요 전략 사업으로 삼고 있습니다.",
      achievements: ["리튬 추출, 리사이클링 등 이차전지 소재 사업을 수행하고 있으며, 2030년까지 이차전지 소재 EPC 전문업체로 도약하겠다는 비전을 제시",
                     "이차전지 산업 밸류체인 상에서 원가 절감, 공정 최적화, 품질 및 안전 확보 역량을 강조",
                     "2025년 8월, 중견 반도체 소부장 기업인 미코(MICO)가 플랜텍 지분 71.9%를 인수",
                     "전통적으로 철강, 환경, 에너지 등 분야에도 사업을 영위하고 있으며, 수소 인프라 사업과 이차전지 사업을 병행",
                    "2030년 매출 1조 원 이상, 탈탄소 중심 사업 포트폴리오 확장 등을 포함한 중장기 비전을 수립"],
      image: poscoScene
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      x: -100,
      rotateY: -15,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      x: 0,
      rotateY: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hidden: { 
      opacity: 0, 
      x: 100,
      rotateY: 15,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      x: 0,
      rotateY: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const nodeVariants = {
    hidden: { scale: 0, rotateZ: -180 },
    visible: { 
      scale: 1, 
      rotateZ: 0,
      transition: {
        duration: 0.6,
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    }
  };

  return (
    <section id="timeline" className="py-20 bg-muted/30" data-testid="timeline-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-6">
            경력과 발자취
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            신대지구 발전과 교육 발전, 정치 참여를 통한 지역 사회 기여와 발자취를 소개합니다
          </p>
        </motion.div>

        <motion.div 
          className="relative max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Enhanced Timeline Line with 3D effect - Hidden on mobile */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-px top-0 bottom-0 w-1 bg-gradient-to-b from-primary/20 via-primary/60 to-primary/20 rounded-full shadow-lg z-0 pointer-events-none" />
          <div className="hidden md:block absolute left-1/2 transform -translate-x-px top-0 bottom-0 w-px bg-primary/80 z-0 pointer-events-none" />

          <div className="space-y-16 lg:space-y-24">
            {timelineData.map((item, index) => {
              const isLeft = index % 2 === 0;
              
              return (
                <motion.div
                  key={index}
                  className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pl-6 border-l border-primary/20 md:pl-0 md:border-0"
                  style={{ perspective: 1000 }}
                >
                  {/* Timeline Node with enhanced 3D animation - Hidden on mobile */}
                  <motion.div 
                    className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-primary rounded-full border-4 border-background shadow-2xl z-20 lg:relative lg:col-start-6 lg:col-span-2 lg:justify-self-center"
                    variants={nodeVariants}
                    whileHover={{ 
                      scale: 1.3,
                      boxShadow: "0 0 25px rgba(0,0,0,0.3)",
                      rotateZ: 360
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="absolute inset-1 bg-background rounded-full" />
                    <div className="absolute inset-2 bg-primary rounded-full animate-pulse" />
                  </motion.div>

                  {/* Content arrangement for alternating layout */}
                  {isLeft ? (
                    <>
                      {/* Left side: Content Card */}
                      <motion.div 
                        className="lg:col-start-1 lg:col-span-5 order-2 lg:order-1"
                        variants={cardVariants}
                        whileHover={{ 
                          scale: 1.03,
                          rotateY: 5,
                          z: 50,
                          transition: { duration: 0.3 }
                        }}
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        <Card className="relative z-10 bg-background hover-elevate transition-all duration-500 shadow-xl border-2 border-primary/10">
                          <CardContent className="p-6 lg:p-8">
                            <div className="space-y-6">
                              <div className="flex items-center justify-between flex-wrap gap-3">
                                <Badge variant="outline" className="text-primary border-primary font-semibold px-4 py-2">
                                  {item.year}
                                </Badge>
                                <span className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                                  {item.organization}
                                </span>
                              </div>
                              
                              <h3 className="text-2xl lg:text-3xl font-bold text-primary leading-tight" data-testid={`text-timeline-title-${index}`}>
                                {item.title}
                              </h3>
                              
                              <p className="text-muted-foreground leading-relaxed text-lg">
                                {item.description}
                              </p>

                              <div className="space-y-3">
                                <h4 className="font-bold text-foreground text-lg flex items-center gap-2">
                                  <div className="w-2 h-2 bg-primary rounded-full" />
                                  주요 활동
                                </h4>
                                <ul className="space-y-2">
                                  {item.achievements.map((achievement, achIndex) => (
                                    <motion.li
                                      key={achIndex}
                                      className="flex items-start space-x-3 text-muted-foreground"
                                      initial={{ opacity: 0, x: -20 }}
                                      whileInView={{ opacity: 1, x: 0 }}
                                      transition={{ delay: achIndex * 0.1 }}
                                      data-testid={`text-achievement-${index}-${achIndex}`}
                                    >
                                      <div className="w-2 h-2 bg-accent rounded-full mt-2.5 flex-shrink-0" />
                                      <span className="font-medium">{achievement}</span>
                                    </motion.li>
                                  ))}
                                </ul>
                              </div>

                              {item.examples && (
                                <div className="space-y-3">
                                  <h4 className="font-bold text-foreground text-lg flex items-center gap-2">
                                    <div className="w-2 h-2 bg-primary rounded-full" />
                                    활동 사례(추정)
                                  </h4>
                                  <ul className="space-y-2">
                                    {item.examples.map((example, exIndex) => (
                                      <motion.li
                                        key={exIndex}
                                        className="flex items-start space-x-3 text-muted-foreground"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: (item.achievements.length + exIndex) * 0.1 }}
                                        data-testid={`text-example-${index}-${exIndex}`}
                                      >
                                        <div className="w-2 h-2 bg-accent rounded-full mt-2.5 flex-shrink-0" />
                                        <span className="font-medium">{example}</span>
                                      </motion.li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      {/* Right side: Image */}
                      {item.image && (
                        <motion.div 
                          className="lg:col-start-8 lg:col-span-5 order-1 lg:order-2"
                          variants={imageVariants}
                          whileHover={{ 
                            scale: 1.05,
                            rotateY: -5,
                            z: 30,
                            transition: { duration: 0.3 }
                          }}
                          style={{ transformStyle: "preserve-3d" }}
                        >
                          <div className="relative overflow-hidden rounded-2xl shadow-2xl border-2 border-primary/10">
                            <img
                              src={item.image}
                              alt={`${item.title} 관련 이미지`}
                              className="w-full h-72 lg:h-80 object-cover transition-transform duration-500"
                              data-testid={`img-timeline-${index}`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-60" />
                            <div className="absolute bottom-4 left-4 right-4">
                              <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3">
                                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Left side: Image */}
                      {item.image && (
                        <motion.div 
                          className="lg:col-start-1 lg:col-span-5 order-1"
                          variants={imageVariants}
                          whileHover={{ 
                            scale: 1.05,
                            rotateY: 5,
                            z: 30,
                            transition: { duration: 0.3 }
                          }}
                          style={{ transformStyle: "preserve-3d" }}
                        >
                          <div className="relative overflow-hidden rounded-2xl shadow-2xl border-2 border-primary/10">
                            <img
                              src={item.image}
                              alt={`${item.title} 관련 이미지`}
                              className="w-full h-72 lg:h-80 object-cover transition-transform duration-500"
                              data-testid={`img-timeline-${index}`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-60" />
                            <div className="absolute bottom-4 left-4 right-4">
                              <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3">
                                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Right side: Content Card */}
                      <motion.div 
                        className="lg:col-start-8 lg:col-span-5 order-2"
                        variants={cardVariants}
                        whileHover={{ 
                          scale: 1.03,
                          rotateY: -5,
                          z: 50,
                          transition: { duration: 0.3 }
                        }}
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        <Card className="relative z-10 bg-background hover-elevate transition-all duration-500 shadow-xl border-2 border-primary/10">
                          <CardContent className="p-6 lg:p-8">
                            <div className="space-y-6">
                              <div className="flex items-center justify-between flex-wrap gap-3">
                                <Badge variant="outline" className="text-primary border-primary font-semibold px-4 py-2">
                                  {item.year}
                                </Badge>
                                <span className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                                  {item.organization}
                                </span>
                              </div>
                              
                              <h3 className="text-2xl lg:text-3xl font-bold text-primary leading-tight" data-testid={`text-timeline-title-${index}`}>
                                {item.title}
                              </h3>
                              
                              <p className="text-muted-foreground leading-relaxed text-lg">
                                {item.description}
                              </p>

                              <div className="space-y-3">
                                <h4 className="font-bold text-foreground text-lg flex items-center gap-2">
                                  <div className="w-2 h-2 bg-primary rounded-full" />
                                  주요 활동
                                </h4>
                                <ul className="space-y-2">
                                  {item.achievements.map((achievement, achIndex) => (
                                    <motion.li
                                      key={achIndex}
                                      className="flex items-start space-x-3 text-muted-foreground"
                                      initial={{ opacity: 0, x: -20 }}
                                      whileInView={{ opacity: 1, x: 0 }}
                                      transition={{ delay: achIndex * 0.1 }}
                                      data-testid={`text-achievement-${index}-${achIndex}`}
                                    >
                                      <div className="w-2 h-2 bg-accent rounded-full mt-2.5 flex-shrink-0" />
                                      <span className="font-medium">{achievement}</span>
                                    </motion.li>
                                  ))}
                                </ul>
                              </div>

                              {item.examples && (
                                <div className="space-y-3">
                                  <h4 className="font-bold text-foreground text-lg flex items-center gap-2">
                                    <div className="w-2 h-2 bg-primary rounded-full" />
                                    활동 사례(추정)
                                  </h4>
                                  <ul className="space-y-2">
                                    {item.examples.map((example, exIndex) => (
                                      <motion.li
                                        key={exIndex}
                                        className="flex items-start space-x-3 text-muted-foreground"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: (item.achievements.length + exIndex) * 0.1 }}
                                        data-testid={`text-example-${index}-${exIndex}`}
                                      >
                                        <div className="w-2 h-2 bg-accent rounded-full mt-2.5 flex-shrink-0" />
                                        <span className="font-medium">{example}</span>
                                      </motion.li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}