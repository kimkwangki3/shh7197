import React from "react";
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
  const policyAreas: PolicyArea[] = [
    {
      icon: GraduationCap,
      title: "신대 교육 특화",
      description: "신대지구 아이들이 꿈을 키울 수 있는 최상의 교육 인프라 조성",
      keyPoints: [
        "명품 교육 환경 조성 및 과밀 학급 해소",
        "디지털 인재 양성을 위한 교육 거점화",
        "방과 후 프로그램 다변화 및 지원 확대"
      ],
      priority: "최우선"
    },
    {
      icon: Heart,
      title: "신대 생활 복지",
      description: "주민 맞춤형 생활 밀착형 복지로 신대지구 삶의 질 향상",
      keyPoints: [
        "주민 건강 증진 및 스포츠 인프라 확충",
        "시니어 및 아이 돌봄 돌봄 거점 센터 강화",
        "신대 주민 이동 편의 및 대중교통 개선"
      ],
      priority: "최우선"
    },
    {
      icon: Building2,
      title: "지역 경제 활성화",
      description: "신대지구 상권 활력 제고와 지속 가능한 지역 경제 성장",
      keyPoints: [
        "소상공인 및 지역 상권 디지털 전환 지원",
        "신대지구 특화 문화 거리 조성 지원",
        "지역 화폐 연계 및 커뮤니티 경제 활성화"
      ],
      priority: "우선"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "최우선": return "bg-red-50 text-red-600 border-red-100";
      case "우선": return "bg-primary/5 text-primary border-primary/10";
      default: return "bg-slate-50 text-slate-500 border-slate-100";
    }
  };

  return (
    <section id="vision" className="py-16 px-6 bg-[#F8FAFC]">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-4">정책 비전</h2>
        <p className="text-slate-500 leading-relaxed max-w-[280px] mx-auto">
          신대지구와 함께 만들어가는 더 나은 미래를 위한 실천을 약속합니다.
        </p>
      </div>

      {/* Vision Statement Card */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <Card className="border-primary/20 bg-primary/5 rounded-3xl overflow-hidden">
          <CardContent className="p-8 text-center">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary mx-auto mb-6 shadow-sm">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              "신대지구의 내일을 여는 행복 프로젝트"
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              생활의 질을 높이고 교육과 문화가 살아 숨 쉬는, 신대지구 주민 모두가 자부심을 느끼는 명품 도시를 만들겠습니다.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Policy Areas Stack */}
      <div className="space-y-6">
        {policyAreas.map((area, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
              <CardHeader className="p-5 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                    <area.icon size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{area.title}</h3>
                </div>
                <Badge variant="outline" className={getPriorityColor(area.priority)}>
                  {area.priority}
                </Badge>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-0">
                <p className="text-sm text-slate-500 mb-4 font-normal leading-normal">
                  {area.description}
                </p>
                <div className="space-y-2 pt-4 border-t border-slate-50">
                  {area.keyPoints.map((point, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2">
                      <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={14} />
                      <span className="text-xs text-slate-600 font-medium leading-relaxed">{point}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}