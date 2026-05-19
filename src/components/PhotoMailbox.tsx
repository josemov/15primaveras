import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, CheckCircle2, Loader2, Camera } from 'lucide-react';
import axios from 'axios';
import { CONFIG } from '../config';
import { getGuests } from '../services/googleSheets';

export const PhotoMailbox = () => {
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestEmail || photos.length === 0) return;

    setStatus('loading');
    try {
      // 1. Verificar invitado contra Google Sheets
      const guestList = await getGuests();
      const isValid = guestList.some((g: any) => 
        g.email?.toLowerCase() === guestEmail.toLowerCase() || 
        g.name?.toLowerCase() === guestName.toLowerCase()
      );

      if (!isValid) {
        alert('Lo sentimos, no hemos podido validar tu nombre o correo en la lista de invitados.');
        setStatus('idle');
        return;
      }

      // 2. Proceder con la carga
      const base64Photos = await Promise.all(
        photos.map(async (file) => ({
          filename: file.name,
          content: await toBase64(file),
        }))
      );

      await axios.post('/api/send-photos', {
        guestName,
        guestEmail,
        photos: base64Photos,
        targetEmail: CONFIG.CONTACT_EMAIL
      });

      setStatus('success');
      setPhotos([]);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="glass-card p-10 text-center animate-fade">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl mb-2">¡Fotos enviadas!</h2>
        <p>Gracias por compartir estos momentos con Valeria.</p>
        <button onClick={() => setStatus('idle')} className="btn-premium mt-6">Subir más</button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 md:p-12 max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <Camera className="w-12 h-12 text-primary mx-auto mb-2" />
        <h2 className="text-3xl">Buzón de Recuerdos</h2>
        <p className="text-gray-500 italic">Captura la magia de hoy y envíasela a Valeria</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" 
            placeholder="Tu Nombre" 
            className="w-full p-4 rounded-xl border border-pink-100 bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
          />
          <input 
            type="email" 
            placeholder="Tu Correo" 
            className="w-full p-4 rounded-xl border border-pink-100 bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            required
          />
        </div>

        <div className="relative border-2 border-dashed border-primary/30 rounded-2xl p-10 text-center hover:bg-primary/5 transition-colors cursor-pointer">
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />
          <Upload className="w-10 h-10 text-primary/50 mx-auto mb-2" />
          <p className="text-sm text-gray-500">
            {photos.length > 0 
              ? `${photos.length} fotos seleccionadas` 
              : 'Toca para abrir la galería o cámara'}
          </p>
        </div>

        <button 
          type="submit" 
          disabled={status === 'loading'}
          className="btn-premium w-full flex items-center justify-center space-x-2 text-lg"
        >
          {status === 'loading' ? (
            <Loader2 className="animate-spin" />
          ) : (
            <><span>Enviar Fotos</span></>
          )}
        </button>
      </form>
    </motion.div>
  );
};
