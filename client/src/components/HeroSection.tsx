import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative pt-6 pb-10 px-6 bg-white overflow-hidden">
      {/* Policy News Image Only */}
      <motion.div
        className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <img
          src="/attached_assets/hero-policy.png"
          alt="TODAY 신대정책"
          className="w-full h-auto object-cover"
        />
      </motion.div>

      {/* Decorative Gradient Blob */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl -z-10" />
    </section>
  );
}