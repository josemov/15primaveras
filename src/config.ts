export const CONFIG = {
  EVENT_NAME: "Mis 15 Años - Valeria",
  BIRTHDAY_GIRL: "Valeria",
  EVENT_DATE: "2026-12-20T20:00:00", // Formato ISO: YYYY-MM-DDTHH:mm:ss
  CONTACT_EMAIL: "valeria@ejemplo.com", // Se sobrescribirá por ENV en producción
  ADMIN_USER: "admin",
  // La contraseña y el ID de Google Sheet deben ir en .env
};

export const getEnv = (key: string) => {
  return import.meta.env[key] || "";
};
