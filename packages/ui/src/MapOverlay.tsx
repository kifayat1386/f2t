"use client";

import * as React from 'react';
import { cn } from './utils';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface MapOverlayProps extends HTMLMotionProps<"div"> {}

export const MapOverlay = React.forwardRef<HTMLDivElement, MapOverlayProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className={cn(
          'backdrop-blur-md bg-white/80 border border-white/20 shadow-lg rounded-r2 p-4 text-charcoal',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
MapOverlay.displayName = 'MapOverlay';
