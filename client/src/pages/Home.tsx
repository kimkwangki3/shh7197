import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PersonalDetailsSection from "@/components/PersonalDetailsSection";
import TimelineSection from "@/components/TimelineSection";
import ActivityPhotosSection from "@/components/ActivityPhotosSection";
import NewsSection from "@/components/NewsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import Background3D from "@/components/Background3D";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // Add smooth scrolling behavior to the whole page
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-background relative" data-testid="home-page">
      <Background3D />
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loading" onLoadingComplete={handleLoadingComplete} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full relative z-10"
          >
            <Header />
            <main>
              <HeroSection />
              <PersonalDetailsSection />
              <TimelineSection />
              <ActivityPhotosSection />
              <NewsSection />
              <ContactSection />
            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}