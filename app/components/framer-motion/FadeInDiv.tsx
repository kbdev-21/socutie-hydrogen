import {motion} from 'framer-motion';
import React from 'react';

export function FadeInDiv({children, offsetY = 20}: {children: React.ReactNode, offsetY?: number}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: offsetY }}          // start hidden & slightly down
      whileInView={{ opacity: 1, y: 0 }}       // fade in & move up
      transition={{ duration: 0.4, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
    >
      {children}
    </motion.div>
  )
}