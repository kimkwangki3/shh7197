import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Heart, 
  Building2, 
  Leaf, 
  Users, 
  Globe,
  Target,
  CheckCircle 
} from "lucide-react";

interface PolicyArea {
  icon: any;
  title: string;
  description: string;
  keyPoints: string[];
  priority: "최우선" | "우선" | "중점";
}

export default function VisionSection() {
  // TODO: remove mock functionality - replace with real policy data
  const policyAreas: PolicyArea[] = [
    {
      icon: GraduationCap,
      title: "교육 혁신",
      description: "모든 아이들이 꿈을 키울 수 있는 교육 환경 조성",
      keyPoints: [
        "공교육 품질 향상 및 사교육비 부담 경감",
        "디지털 교육 인프라 확충",
        "진로 맞춤형 교육과정 도입",
        "교사 처우 개선 및 교육 자율성 확대"
      ],
      priority: "최우선"
    },
    {
      icon: Heart,
      title: "복지 확대",
      description: "생애 주기별 맞춤형 복지로 국민 삶의 질 향상",
      keyPoints: [
        "건강보험 보장성 확대",
        "돌봄 서비스 공공성 강화",
        "청년 주거 지원 확대",
        "노인 일자리 창출 및 연금 개선"
      ],
      priority: "최우선"
    },
    {
      icon: Building2,
      title: "경제 활성화",
      description: "혁신과 포용이 조화된 지속 가능한 경제 성장",
      keyPoints: [
        "중소기업 및 스타트업 지원 확대",
        "일자리 창출 및 근로환경 개선",
        "지역 균형 발전 추진",
        "4차 산업혁명 대응 인프라 구축"
      ],
      priority: "우선"
    },
    {
      icon: Leaf,
      title: "환경 보호",
      description: "미래 세대를 위한 깨끗하고 지속 가능한 환경 조성",
      keyPoints: [
        "탄소 중립 실현을 위한 정책 추진",
        "재생에너지 확대 및 에너지 전환",
        "폐기물 감량 및 순환경제 구축",
        "대기질 개선 및 녹지 공간 확대"
      ],
      priority: "중점"
    },
    {
      icon: Users,
      title: "사회 통합",
      description: "차별 없는 포용 사회 구현과 사회적 갈등 해소",
      keyPoints: [
        "성별·세대·지역 간 갈등 해소",
        "사회적 약자 보호 및 인권 증진",
        "다문화 가정 지원 확대",
        "시민사회와의 소통 강화"
      ],
      priority: "우선"
    },
    {
      icon: Globe,
      title: "국제 협력",
      description: "평화와 번영을 위한 국제사회 기여 확대",
      keyPoints: [
        "한반도 평화 프로세스 지속 추진",
        "국제개발협력 확대",
        "글로벌 공급망 안정성 확보",
        "외교 역량 강화 및 다자협력 확대"
      ],
      priority: "중점"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "최우선": return "bg-red-100 text-red-800 border-red-200";
      case "우선": return "bg-blue-100 text-blue-800 border-blue-200";
      case "중점": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <section id="vision" className="py-20 bg-background" data-testid="vision-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-primary mb-6">
            정책 비전과 공약
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            국민과 함께 만들어가는 더 나은 미래를 위한 구체적인 정책 방향과 공약을 제시합니다
          </p>
        </motion.div>

        {/* Vision Statement */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card className="max-w-4xl mx-auto border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-8 lg:p-12">
              <div className="flex items-center justify-center mb-6">
                <Target className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-serif font-bold text-primary mb-6">
                "모든 국민이 행복한 포용 국가"
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                차별과 격차 없는 사회, 지속 가능한 발전, 그리고 미래 세대를 위한 책임감 있는 정치를 통해 
                모든 국민이 존중받고 행복한 나라를 만들어가겠습니다.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Policy Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {policyAreas.map((area, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card 
                className="h-full hover-elevate transition-all duration-300 group"
                data-testid={`policy-card-${index}`}
              >
                <CardHeader className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <area.icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge 
                      variant="outline" 
                      className={getPriorityColor(area.priority)}
                    >
                      {area.priority}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-primary mb-2" data-testid={`text-policy-title-${index}`}>
                      {area.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {area.description}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 p-4 sm:p-6">
                  <div className="space-y-2 sm:space-y-3">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      핵심 공약
                    </h4>
                    <ul className="space-y-2">
                      {area.keyPoints.map((point, pointIndex) => (
                        <li
                          key={pointIndex}
                          className="flex items-start space-x-2 text-sm text-muted-foreground"
                          data-testid={`text-policy-point-${index}-${pointIndex}`}
                        >
                          <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Card className="max-w-2xl mx-auto border-accent/20 bg-gradient-to-r from-accent/5 to-primary/5">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-primary mb-4">
                함께 만들어가는 변화
              </h3>
              <p className="text-muted-foreground mb-6">
                더 자세한 정책과 공약에 대해 알고 싶으시거나, 
                직접 의견을 나누고 싶으시다면 언제든 연락주세요.
              </p>
              <motion.button
                onClick={() => {
                  const element = document.querySelector("#contact");
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-md font-semibold transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-testid="button-contact-vision"
              >
                정책 문의하기
              </motion.button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}