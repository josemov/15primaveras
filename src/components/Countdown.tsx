import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CountdownProps {
  targetDate: string;
  onComplete: () => void;
}

export const Countdown = ({ targetDate, onComplete }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft: any = {};

    if (difference > 0) {
      timeLeft = {
        días: Math.floor(difference / (1000 * 60 * 60 * 24)),
        horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((difference / 1000 / 60) % 60),
        segundos: Math.floor((difference / 1000) % 60),
      };
    } else {
      onComplete();
    }
    return timeLeft;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const timerComponents = Object.keys(timeLeft).map((interval) => (
    <div key={interval} className="flex flex-col items-center mx-2 md:mx-4">
      <span className="text-3xl md:text-5xl font-light text-primary">{timeLeft[interval]}</span>
      <span className="text-xs uppercase tracking-widest text-gray-500">{interval}</span>
    </div>
  ));

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-8 text-center flex justify-center space-x-6 items-center"
      style={{ background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(10px)' }}
    >
      {timerComponents.length ? timerComponents : <span>¡Llegó el gran día!</span>}
    </motion.div>
  );
};
