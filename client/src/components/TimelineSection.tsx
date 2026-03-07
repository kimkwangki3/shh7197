import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import meetingScene from "@assets/신대메인_1759163144206.png";
import educationScene from "@assets/교육메인_1759163227211.png";
import poscoScene from "@assets/unnamed (2)_1759163227210.png";
import democraticPartyScene from "@assets/123_1759163444072.png";

export default function TimelineSection() {
  const timelineData = [
    {
      year: "현재",
      title: "신대지구 중흥2차 입주자 대표회의 현)회장",
      organization: "신대 중흥 2차 아파트",
      description: "쾌적하고 안전한 주거 환경 조성을 위해 입주민의 권익을 대변하고, 투명한 아파트 운영과 공동체 활성화를 주도하며 살기 좋은 신대지구 만들기에 앞장서고 있습니다.",
      image: "/attached_assets/jungheung_president.png"
    },
    {
      year: "2019-현재",
      title: "신대지구 발전위원회 위원장(전)",
      organization: "신대지구발전위원회",
      description: "주민 의견을 모아 행정기관에 전달하는 가교 역할을 수행하며 지역 발전에 기여",
      image: meetingScene
    },
    {
      year: "현재",
      title: "순천교육발전협력위원회 (현)회장",
      organization: "순천 교육 발전 협력 위원회",
      description: "학부모, 주민단체와 협력하여 청소년 진로 및 교육 환경 개선 활동 추진",
      image: educationScene
    },
    {
      year: "현재",
      title: "㈜포스코 플랜텍 리튬TF",
      organization: "㈜포스코 플랜텍",
      description: "이차전지 소재 및 관련 플랜트 사업 전략 분야에서 전문성을 발휘하며 근무 중",
      image: poscoScene
    }
  ];

  return (
    <section className="py-16 px-6 bg-white">
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">경력과 발자취</h2>
        <p className="text-sm text-slate-400">신대지구와 교육 발전을 위한 활동 기록입니다.</p>
      </div>

      <div className="relative pl-4 border-l-2 border-primary/20 space-y-12">
        {timelineData.map((item, idx) => (idx % 2 === 0 ? (
          <motion.div
            key={idx}
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {/* Timeline Node */}
            <div className="absolute -left-[25px] top-0 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-sm" />

            <Badge variant="outline" className="mb-3 text-primary border-primary/20 bg-primary/5">
              {item.year}
            </Badge>

            <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
              <div className="aspect-video w-full overflow-hidden bg-slate-100">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-5">
                <p className="text-[10px] text-slate-400 font-bold mb-1">{item.organization}</p>
                <h4 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-normal">{item.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key={idx}
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="absolute -left-[25px] top-0 w-4 h-4 bg-accent rounded-full border-4 border-white shadow-sm" />

            <Badge variant="outline" className="mb-3 text-accent border-accent/20 bg-accent/5">
              {item.year}
            </Badge>

            <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
              <div className="aspect-video w-full overflow-hidden bg-slate-100">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-5">
                <p className="text-[10px] text-slate-400 font-bold mb-1">{item.organization}</p>
                <h4 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-normal">{item.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        )))}
      </div>
    </section>
  );
}