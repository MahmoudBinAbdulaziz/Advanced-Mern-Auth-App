import {motion} from 'framer-motion'

function FloatingShape({color, size, top,left,delay}) {
  return (
    <motion.div className={`absolute rounded-full ${color} ${size} opacity-20 blur-xl`} 
    style={{top:top, left:left}}
    animate={{y:["0%","100%","0%"], transition:{duration:20,ease:"linear",repeat:Infinity,delay:delay}}}
    aria-hidden="true"
    />
  )
}

export default FloatingShape