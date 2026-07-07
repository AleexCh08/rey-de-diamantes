import { motion } from 'framer-motion'

export const PageTransition = ({ children, transitionKey }) => {
  return (
    <motion.div
      key={transitionKey}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="absolute inset-0 p-6 w-full h-full flex flex-col overflow-hidden [&>div]:min-h-0"
    >
      {children}
    </motion.div>
  )
}