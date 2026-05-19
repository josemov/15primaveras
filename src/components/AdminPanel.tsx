import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getGuests, addGuest } from '../services/googleSheets';
import { LogOut, Plus, Users, Settings as SettingsIcon } from 'lucide-react';

export const AdminPanel = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [guests, setGuests] = useState<any[]>([]);
  const [newGuest, setNewGuest] = useState({ name: '', email: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // En producción esto se validaría contra una ENV en el servidor
    if (password === 'valeria15') {
      setIsLoggedIn(true);
      fetchGuests();
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const fetchGuests = async () => {
    const data = await getGuests();
    setGuests(data);
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    await addGuest(newGuest);
    setNewGuest({ name: '', email: '' });
    fetchGuests();
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-8 w-full max-w-md">
          <h2 className="text-2xl font-serif mb-6 text-center">Panel Administrativo</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Contraseña" 
              className="w-full p-4 rounded-xl border"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="btn-premium w-full">Entrar</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-serif">Gestión del Evento</h1>
          <button onClick={() => setIsLoggedIn(false)} className="flex items-center text-gray-500 hover:text-red-500">
            <LogOut className="w-5 h-5 mr-2" /> Salir
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quick Stats */}
          <div className="glass-card p-6 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full"><Users className="text-blue-600" /></div>
            <div>
              <p className="text-gray-500 text-sm">Invitados</p>
              <p className="text-2xl font-bold">{guests.length}</p>
            </div>
          </div>
          <div className="glass-card p-6 flex items-center space-x-4">
            <div className="p-3 bg-pink-100 rounded-full"><SettingsIcon className="text-pink-600" /></div>
            <div>
              <p className="text-gray-500 text-sm">Estado</p>
              <p className="text-2xl font-bold">Activo</p>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Guest List */}
          <div className="lg:col-span-2 glass-card p-6 overflow-hidden">
            <h2 className="text-xl mb-4 font-bold">Lista de Invitados</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-2">Nombre</th>
                    <th className="py-2">Correo</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.map((g, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="py-3">{g.name}</td>
                      <td className="py-3">{g.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Guest Form */}
          <div className="glass-card p-6 h-fit">
            <h2 className="text-xl mb-4 font-bold">Añadir Invitado</h2>
            <form onSubmit={handleAddGuest} className="space-y-4">
              <input 
                type="text" 
                placeholder="Nombre Completo" 
                className="w-full p-3 rounded-lg border"
                value={newGuest.name}
                onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                required
              />
              <input 
                type="email" 
                placeholder="Correo Electrónico" 
                className="w-full p-3 rounded-lg border"
                value={newGuest.email}
                onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                required
              />
              <button type="submit" className="btn-premium w-full flex items-center justify-center">
                <Plus className="w-5 h-5 mr-2" /> Añadir
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
