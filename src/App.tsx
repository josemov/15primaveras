import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Countdown } from './components/Countdown';
import { PhotoMailbox } from './components/PhotoMailbox';
import { AdminPanel } from './components/AdminPanel';
import { CONFIG } from './config';
import './index.css';

function App() {
  const [isEventStarted, setIsEventStarted] = useState(false);
  const [view, setView] = useState<'invitation' | 'admin'>('invitation');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setView('admin');
    }
  }, []);

  if (view === 'admin') {
    return <AdminPanel />;
  }

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center py-10 px-4 md:py-20"
      style={{
        backgroundImage: 'url("/bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Header Section */}
      <motion.header 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="text-center mb-12"
      >
        <p className="uppercase tracking-[0.5em] text-accent mb-4 text-sm md:text-base">Estás invitado a celebrar</p>
        <h1 className="text-6xl md:text-9xl text-text-dark mb-2 drop-shadow-sm">Valeria</h1>
        <h2 className="text-2xl md:text-4xl italic font-serif text-primary">Mis Quince Años</h2>
      </motion.header>

      {/* Main Content Area */}
      <main className="w-full max-w-4xl space-y-12">
        
        {/* Invitation Text */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-center space-y-6 px-4"
        >
          <p className="text-xl md:text-2xl font-light leading-relaxed">
            Un momento soñado, una noche mágica.<br />
            Quiero compartir contigo la alegría de cumplir mis quince años.
          </p>
        </motion.div>

        {/* Countdown / PhotoMailbox Toggle */}
        <AnimatePresence mode="wait">
          {!isEventStarted ? (
            <motion.div 
              key="countdown"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-8"
            >
              <h3 className="text-center text-gray-500 uppercase tracking-widest text-sm">Faltan</h3>
              <Countdown 
                targetDate={CONFIG.EVENT_DATE} 
                onComplete={() => setIsEventStarted(true)} 
              />
              <div className="text-center text-sm text-gray-500">
                <p>20 de Diciembre de 2026 | 20:00 HS</p>
                <p>Quinta "Las Camelias", Caracas</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="mailbox"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <PhotoMailbox />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating RSVP Button (Simulado) */}
        <div className="flex justify-center mt-8">
           <button 
            className="btn-premium px-12 py-4 text-lg"
            onClick={() => window.open('https://wa.me/yournumber', '_blank')}
           >
             Confirmar Asistencia
           </button>
        </div>

      </main>

      <footer className="mt-20 text-center text-gray-400 text-xs tracking-widest uppercase">
        Hecho con amor para Valeria
      </footer>
    </div>
  );
}

export default App;
