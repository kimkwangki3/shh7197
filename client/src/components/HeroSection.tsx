import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Typewriter from 'typewriter-effect';

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
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/20"
      data-testid="hero-section"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-primary/5 rounded-full blur-xl"
            style={{
              width: Math.random() * 200 + 100,
              height: Math.random() * 200 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center space-y-12 max-w-4xl mx-auto">
          {/* Text Content */}
          <motion.div
            className="text-foreground space-y-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="space-y-6">
              <motion.div
                className="inline-block px-6 py-3 bg-primary/10 backdrop-blur-sm rounded-full text-base font-medium text-primary border border-primary/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                순천 신대지구를 위해 지금도 달리고 있습니다.
              </motion.div>
              
              <div className="space-y-4">
                <motion.h1
                  className="text-5xl sm:text-6xl lg:text-8xl font-bold leading-tight text-primary"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  홍성훈
                </motion.h1>

                <motion.div
                  className="text-2xl sm:text-3xl lg:text-4xl text-muted-foreground leading-relaxed h-20 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <Typewriter
                    options={{
                      strings: [
                        '순천 신대지구를 위해',
                        '지역사회 발전에 기여',
                        '젊은 열정으로 한걸음',
                        '순천 신대지구의', 
                        '밝은 미래를 만들어갑니다'
                      ],
                      autoStart: true,
                      loop: true,
                      delay: 80,
                      deleteSpeed: 50,
                    }}
                  />
                </motion.div>
              </div>
              
              <motion.p
                className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                순천 신대지구 지역 사회 발전과 지역 교육을 위해 다양한 활동에 참여
              </motion.p>
            </div>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  rotateX: 5,
                  rotateY: 5,
                  z: 50
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ 
                  transformStyle: "preserve-3d",
                  perspective: 1000
                }}
              >
                <Button
                  size="lg"
                  onClick={handleContactClick}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-10 py-4 text-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  data-testid="button-contact-hero"
                >
                  연락하기
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  rotateX: -5,
                  rotateY: -5,
                  z: 50
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ 
                  transformStyle: "preserve-3d",
                  perspective: 1000
                }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleLearnMoreClick}
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-10 py-4 text-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  data-testid="button-learn-more"
                >
                  더 알아보기
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}