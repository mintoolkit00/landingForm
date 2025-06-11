
export const HOURS_CONFIG = {
    openingHour: 8,      // Hora de apertura (por ejemplo, 8 = 08:00)
    closingHour: 17,     // Hora de cierre (por ejemplo, 17 = 17:00)
    slotInterval: 1,     // Intervalo en horas (1 = franjas de 1 hora)
    timeZone: 'Europe/Madrid',
};

// Disponibilidad semanal: los días deben estar en minúscula y en inglés
// Las horas deben estar en formato "HH:MM" con dos dígitos
export const availability = {
    monday: ["08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"],
    tuesday: ["08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"],
    wednesday: ["08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"],
    thursday: ["08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"],
    friday: ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00"],
    saturday: [], // Cerrado
    sunday: [], // Cerrado
};
