import * as React from 'react';
import { cn } from './utils';
import { motion } from 'framer-motion';

export interface IoTWidgetProps {
  label: string;
  value: string | number;
  unit?: string;
  status?: 'normal' | 'warning' | 'alert';
  className?: string;
}

export const IoTWidget: React.FC<IoTWidgetProps> = ({
  label,
  value,
  unit,
  status = 'normal',
  className,
}) => {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        'flex items-center space-x-3 bg-white/90 backdrop-blur-sm border rounded-r2 p-3 shadow-sm',
        {
          'border-sage text-charcoal': status === 'normal',
          'border-yellow-500 text-yellow-700': status === 'warning',
          'border-error text-error': status === 'alert',
        },
        className
      )}
    >
      <div className="flex flex-col">
        <span className="text-xs uppercase tracking-wider font-semibold opacity-70">
          {label}
        </span>
        <div className="flex items-baseline space-x-1">
          <span className="font-sans font-bold text-lg leading-none">{value}</span>
          {unit && <span className="text-sm font-medium opacity-80">{unit}</span>}
        </div>
      </div>
      {status === 'alert' && (
        <motion.div
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-2 h-2 rounded-full bg-error"
        />
      )}
      {status === 'normal' && (
        <div className="w-2 h-2 rounded-full bg-sage" />
      )}
    </motion.div>
  );
};
