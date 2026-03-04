import { motion } from "framer-motion";

export default function Background3D() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Floating geometric shapes */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-primary/5 rounded-lg backdrop-blur-sm"
          style={{
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Moving gradient orbs - fixed positions */}
      <motion.div
        className="absolute w-96 h-96 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl"
        style={{
          left: "15%",
          top: "20%",
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-72 h-72 bg-gradient-to-l from-accent/10 to-primary/10 rounded-full blur-3xl"
        style={{
          right: "15%",
          bottom: "20%",
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -40, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Animated grid lines */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`h-${i}`}
            className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
            style={{ top: `${i * 10}%` }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scaleX: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`v-${i}`}
            className="absolute h-full w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent"
            style={{ left: `${i * 10}%` }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scaleY: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
    </div>
  );
}