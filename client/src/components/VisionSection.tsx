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
      title: "교육 혁신",
      description: "모든 아이들이 꿈을 키울 수 있는 교육 환경 조성",
      keyPoints: [
        "공교육 품질 향상 및 사교육비 부담 경감",
        "디지털 교육 인프라 확충",
        "진로 맞춤형 교육과정 도입"
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
        "청년 주거 지원 확대"
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
        "지역 균형 발전 추진"
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
          국민과 함께 만들어가는 더 나은 미래를 위한 실천을 약속합니다.
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
              "모든 국민이 행복한 포용 국가"
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              차별과 격차 없는 사회, 지속 가능한 발전을 통해 모든 국민이 존중받는 나라를 만들겠습니다.
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