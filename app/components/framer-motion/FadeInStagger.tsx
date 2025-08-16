import { motion } from "framer-motion";
import React from "react";

type FadeInStaggerProps = {
  children: React.ReactNode;
  stagger?: number;
  delayChildren?: number;
  viewportAmount?: number; // new prop
};

export function FadeInStagger({
                                children,
                                stagger = 0.1,
                                delayChildren = 0,
                                viewportAmount = 0.3, // default
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
      viewport={{ once: true, amount: viewportAmount }}
    >
      {children}
    </motion.div>
  );
}

type FadeInItemProps = {
  children: React.ReactNode;
  duration?: number;
  offsetY?: number;
  viewportAmount?: number; // new prop
};

export function FadeInItem({
                             children,
                             duration = 0.4,
                             offsetY = 40,
                             viewportAmount = 0.3, // default
                           }: FadeInItemProps) {
  return (
    <motion.div
      viewport={{ once: true, amount: viewportAmount }}
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
