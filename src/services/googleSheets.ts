import axios from 'axios';

// Usaremos una URL de Sheet.best como puente fácil o una función de Vercel
// Por ahora, simularemos la conexión.
const SHEET_API_URL = import.meta.env.VITE_SHEET_API_URL || '';

export const getGuests = async () => {
  if (!SHEET_API_URL) return [];
  try {
    const response = await axios.get(SHEET_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching guests:', error);
    return [];
  }
};

export const updateGuest = async (id: string, data: any) => {
  if (!SHEET_API_URL) return;
  try {
    await axios.patch(`${SHEET_API_URL}/${id}`, data);
  } catch (error) {
    console.error('Error updating guest:', error);
  }
};

export const addGuest = async (guest: any) => {
  if (!SHEET_API_URL) return;
  try {
    await axios.post(SHEET_API_URL, guest);
  } catch (error) {
    console.error('Error adding guest:', error);
  }
};
