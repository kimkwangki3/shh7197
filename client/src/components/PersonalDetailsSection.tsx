import { motion } from "framer-motion";
import { CalendarDays, MapPin, GraduationCap, User, Building, Mail, Phone, Award } from "lucide-react";
import candidatePortrait from "@assets/new_profile.png";
import appointment1 from "@assets/KakaoTalk_20250916_133547719_02_1758009010519.jpg";
import appointment2 from "@assets/KakaoTalk_20250916_133547719_03_1758009010520.jpg";

export default function PersonalDetailsSection() {
  const personalInfo = [
    {
      icon: User,
      label: "이름",
      value: "홍성훈",
      detail: "Hong Seong-hoon"
    },
    {
      icon: CalendarDays,
      label: "생년월일",
      value: "1975년 2월 28일",
      detail: "50세 (물고기자리)"
    },
    {
      icon: MapPin,
      label: "출생지",
      value: "전라남도 장흥군",
      detail: "대한민국"
    },
    {
      icon: Building,
      label: "직장",
      value: "㈜포스코 플랜텍 리튬TF",
      detail: "전라남도 광양시"
    }
  ];

  const educationHistory = [
    {
      period: "졸업",
      school: "국립 경상대학교",
      major: "기계공학과 졸",
      location: "경상남도 진주시"
    },
    {
      period: "졸업",
      school: "순천공업고등학교",
      major: "공업계열",
      location: "전라남도 순천시"
    },
    {
      period: "졸업",
      school: "회덕중학교",
      major: "중학교 과정",
      location: "전라남도 장흥군"
    }
  ];

  return (
    <section className="py-20 bg-background" data-testid="personal-details-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-foreground mb-6">개인 정보</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            순천 신대지구 발전 위원회 · 순천 교육 발전 위원회 · ㈜플랜텍 리튬TF에서 활동하며 지역 사회에 기여하고 있는 홍성훈입니다.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto items-start">
          {/* 왼쪽: 기본정보 */}
          <motion.div
            className="order-2 xl:order-1"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
              <User className="w-6 h-6 text-primary" />
              기본 정보
            </h3>
            <div className="space-y-8">
              {personalInfo.map((info, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  data-testid={`info-${index}`}
                >
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3">
                      <p className="text-sm font-medium text-muted-foreground min-w-[80px]">{info.label}</p>
                      <p className="text-xl font-semibold text-foreground">{info.value}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 ml-[92px]">{info.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 중앙: 인물사진 */}
          <motion.div
            className="order-1 xl:order-2 flex justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <motion.div
                className="w-72 h-80 lg:w-80 lg:h-96 xl:w-72 xl:h-80 relative overflow-hidden rounded-2xl shadow-lg border border-border"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={candidatePortrait}
                  alt="홍성훈 사진"
                  className="w-full h-full object-cover"
                  data-testid="img-portrait"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
              </motion.div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <Building className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>

          {/* 오른쪽: 학력사항 */}
          <motion.div
            className="order-3 xl:order-3"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
              <GraduationCap className="w-6 h-6 text-primary" />
              학력 사항
            </h3>
            <div className="space-y-6">
              {educationHistory.map((education, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  data-testid={`education-${index}`}
                >
                  <div className="w-20 flex-shrink-0 mt-1">
                    <p className="text-sm font-medium text-primary">{education.period}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-foreground mb-1">{education.school}</p>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{education.major}</p>
                    <p className="text-sm text-muted-foreground">{education.location}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* 임명장 섹션 */}
        <motion.div
          className="mt-20 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
              <Award className="w-8 h-8 text-primary" />
              공식 임명장
            </h3>
            <p className="text-lg text-muted-foreground">
              더불어민주당에서 공식 발급한 임명장으로 공인된 역할과 책임을 보여줍니다
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 첫 번째 임명장 */}
            <motion.div
              className="group"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              viewport={{ once: true }}
            >
              <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover-elevate">
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img
                    src={appointment1}
                    alt="더불어민주당 노무현정신계승연대 위원 임명장"
                    className="w-full h-full object-contain bg-white transition-transform duration-300 group-hover:scale-105"
                    data-testid="appointment-1"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-bold text-foreground mb-2">
                    노무현정신계승연대 위원
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    더불어민주당 제21대 대통령선거 후보
                  </p>
                  <p className="text-xs text-muted-foreground">
                    임명일: 2025년 05월 30일
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 두 번째 임명장 */}
            <motion.div
              className="group"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              viewport={{ once: true }}
            >
              <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover-elevate">
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img
                    src={appointment2}
                    alt="더불어민주당 전남특보단 광양 특보 임명장"
                    className="w-full h-full object-contain bg-white transition-transform duration-300 group-hover:scale-105"
                    data-testid="appointment-2"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-bold text-foreground mb-2">
                    전남특보단 광양 특보
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    후보총괄특보단 전남특보단
                  </p>
                  <p className="text-xs text-muted-foreground">
                    임명일: 2025년 05월 29일
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}