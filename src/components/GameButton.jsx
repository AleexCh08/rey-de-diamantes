import { motion } from 'framer-motion';
import { playSound } from '../utils/audio';

export const GameButton = ({ children, onClick, variant = 'primary', className = "" }) => {
  const themes = {
    primary: {
      casing: "bg-red-950 border-red-900",
      surface: "bg-gradient-to-t from-red-800 to-red-600 border-red-500/50",
      text: "text-white",
      glow: "hover:shadow-[0_0_25px_rgba(220,38,38,0.6)]",
    },
    secondary: {
      casing: "bg-gray-900 border-gray-800",
      surface: "bg-gradient-to-t from-gray-800 to-gray-600 border-gray-500/50",
      text: "text-white",
      glow: "hover:shadow-[0_0_20px_rgba(156,163,175,0.4)]",
    },
    success: {
      casing: "bg-emerald-950 border-emerald-900",
      surface: "bg-gradient-to-t from-emerald-800 to-emerald-600 border-emerald-500/50",
      text: "text-white",
      glow: "hover:shadow-[0_0_25px_rgba(16,185,129,0.6)]",
    },
    disabled: {
      casing: "bg-gray-950 border-gray-900",
      surface: "bg-gray-900 border-gray-800 text-gray-700",
      text: "text-gray-700",
      glow: "",
    },
    alert: {
      casing: "bg-red-950 border-red-900",
      surface: "bg-black border-2 border-red-600",
      text: "text-red-500 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]",
      glow: "hover:shadow-[0_0_25px_rgba(220,38,38,0.6)] shadow-[0_0_15px_rgba(220,38,38,0.3)]",
    }
  };

  const t = themes[variant];

  const handleClick = (e) => {
    if (variant !== 'disabled') {
      playSound('click'); 
      if (onClick) onClick(e); 
    }
  };

  return (
    <motion.button
      disabled={variant === 'disabled'}
      onClick={handleClick}
      whileHover="hover"
      whileTap="tap"
      className={`relative w-full group outline-none block ${className}`}
    >
      <div className={`absolute inset-0 rounded-xl border-b-8 border-r border-l ${t.casing}`} />
      
      <motion.div 
        variants={{
          hover: { y: 2 }, 
          tap: { y: 8 }    
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={`relative flex items-center justify-center py-4 px-6 rounded-xl border-t ${t.surface} ${t.glow} transition-shadow duration-300 overflow-hidden`}
      >
        <span className={`relative z-10 font-black text-sm uppercase tracking-[0.2em] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] ${t.text}`}>
          {children}
        </span>
      </motion.div>
    </motion.button>
  );
}