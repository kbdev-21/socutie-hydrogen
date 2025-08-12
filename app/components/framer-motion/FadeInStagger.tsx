import { motion } from "framer-motion";
import React from "react";

type FadeInStaggerProps = {
  children: React.ReactNode;
  stagger?: number;
  delayChildren?: number;
};

export function FadeInStagger({
                                children,
                                stagger = 0.1,
                                delayChildren = 0,
                              }: FadeInStaggerProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: stagger, delayChildren },
        },
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      {children}
    </motion.div>
  );
}


type FadeInItemProps = {
  children: React.ReactNode;
  duration?: number;
  offsetY?: number;
};

export function FadeInItem({
                             children,
                             duration = 0.4,
                             offsetY = 20,
                           }: FadeInItemProps) {
  return (
    <motion.div
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: { opacity: 0, y: offsetY },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration, ease: "easeOut" },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
