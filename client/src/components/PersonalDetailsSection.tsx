import React from "react";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Building, GraduationCap, Award, ChevronRight } from "lucide-react";
import candidatePortrait from "@assets/new_profile.png";
import appointment1 from "@assets/KakaoTalk_20250916_133547719_02_1758009010519.jpg";
import appointment2 from "@assets/KakaoTalk_20250916_133547719_03_1758009010520.jpg";

export default function PersonalDetailsSection() {
  const personalInfo = [
    { icon: CalendarDays, label: "생년월일", value: "1975년 2월 28일" },
    { icon: MapPin, label: "출생지", value: "전라남도 장흥군" },
    { icon: Building, label: "직장", value: "㈜플랜텍 근무 (구 포스코플랜텍)" }
  ];

  const educationHistory = [
    { school: "순천공업고등학교", major: "졸업 (24회)" },
    { school: "순천공업전문대학교 건축설비학과", major: "졸업 (현 순천제일대학교)" },
    { school: "진주산업대학교 융합기술공과대학 기계공학과", major: "졸업 (현 경상국립대학교)" }
  ];

  return (
    <section className="py-10 px-6 relative overflow-hidden bg-white">
      {/* Clean Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#f8fafc]/50 pointer-events-none" />

      {/* Basic Info & Profile Image */}
      <div className="relative z-10 flex flex-col items-center mb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative px-4 mb-12"
        >
          <h2 className="font-black mb-3 flex items-baseline justify-center gap-2 whitespace-nowrap">
            <span className="text-amber-400 text-7xl font-black drop-shadow-[0_2px_0_rgba(0,0,0,0.3)]" style={{ WebkitTextStroke: '1.5px rgba(0,0,0,0.2)' }}>3</span>
            <span className="text-[#1e3a5f] text-6xl tracking-[0.25em]">홍 성 훈</span>
          </h2>
          <p className="text-primary font-bold text-xl tracking-wide">신대지구 도의원 예비후보</p>
          <p className="text-slate-500 font-semibold text-base mb-8 tracking-wider">조국혁신당</p>
          <div className="w-16 h-1 bg-primary/30 mx-auto rounded-full" />
        </motion.div>

        <div className="relative mb-12 pt-4">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] w-[380px] h-[380px] bg-gradient-to-b from-primary/15 to-transparent blur-[80px] rounded-full opacity-60 pointer-events-none" />

          <motion.div
            className="relative w-64 h-72 flex items-end justify-center"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 60, damping: 20 }}
          >
            <img
              src="/attached_assets/profile_transparent.png"
              alt="홍성훈"
              className="h-full w-auto object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)] filter brightness-[1.02] contrast-[1.05] hover:scale-105 transition-transform duration-1000 select-none"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="relative px-4"
        >
          <p className="text-slate-500 text-xl leading-relaxed max-w-[400px] mx-auto font-medium">
            순천 신대지구의 더 나은 미래를 위해<br />
            <span className="text-slate-900 font-extrabold border-b-4 border-primary/20 pb-1">주민과 함께 활동하는 실천가</span>입니다.
          </p>
        </motion.div>
      </div>

      {/* Info Cards */}
      <div className="space-y-4 mb-12">
        {personalInfo.map((item, idx) => (
          <motion.div
            key={idx}
            className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
              <item.icon size={20} />
            </div>
            <div>
              <p className="text-[12px] text-slate-800 font-black uppercase tracking-wider mb-0.5">{item.label}</p>
              <p className="text-slate-950 font-black text-xl leading-tight">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Education & Appointments Sections */}
      <div className="space-y-6">
        {/* Education History */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 px-1">
            <GraduationCap className="text-primary" size={20} />
            학력 사항
          </h3>
          <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50 overflow-hidden shadow-sm">
            {educationHistory.map((edu, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between group">
                <div>
                  <p className="font-black text-slate-950 text-xl">{edu.school}</p>
                  <p className="text-sm text-slate-800 font-bold">{edu.major}</p>
                </div>
                <ChevronRight className="text-slate-900 group-hover:text-primary transition-colors" size={20} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}