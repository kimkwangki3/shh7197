import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function HeroSection() {
  const handleContactClick = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLearnMoreClick = () => {
    const element = document.querySelector("#timeline");
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-10 pb-16 px-6 bg-white overflow-hidden">
      {/* Subtitle Badge */}
      <motion.div
        className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        순천 신대지구 공동체 활동가
      </motion.div>

      {/* Main Title */}
      <motion.div
        className="space-y-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-slate-900 leading-tight tracking-tight">
          <span className="text-2xl font-medium opacity-80">더 나은 신대지구,</span><br />
          <span className="text-6xl font-black text-primary inline-block my-2">홍성훈</span>
          <span className="text-2xl font-medium opacity-80">과 함께</span>
        </h1>

        {/* Policy News Image */}
        <motion.div
          className="my-8 rounded-2xl overflow-hidden shadow-2xl border-4 border-white"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <img
            src="/attached_assets/hero-policy.png"
            alt="TODAY 신대정책"
            className="w-full h-auto object-cover"
          />
        </motion.div>

        <p className="text-slate-500 text-lg leading-relaxed">
          주민의 목소리를 듣고, 발로 뛰며<br />
          행복한 지역 공동체를 만들어갑니다.
        </p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="flex flex-col gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          size="lg"
          onClick={handleContactClick}
          className="bg-accent hover:bg-accent/90 text-white font-bold h-14 rounded-2xl shadow-lg shadow-accent/20"
        >
          제안 및 소통하기
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={handleLearnMoreClick}
          className="border-slate-200 text-slate-600 font-bold h-14 rounded-2xl"
        >
          활동 내역 보기
        </Button>
      </motion.div>

      {/* Decorative Gradient Blob */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl -z-10" />
    </section>
  );
}