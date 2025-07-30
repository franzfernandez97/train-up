import { useEffect, useState } from 'react';
import { getTodasLasRutinasAsignadas } from '../services/AtletaRutinaService';

export default function useCalendarioMensual() {
  const [diasDelMes, setDiasDelMes] = useState<{ [fecha: string]: boolean }>({});
  const [mesActual, setMesActual] = useState(new Date());

  useEffect(() => {
    cargarRutinas();
  }, [mesActual]);

  const cargarRutinas = async () => {
    const rutinas = await getTodasLasRutinasAsignadas();
    const rutinasPorFecha: { [fecha: string]: boolean } = {};
    rutinas.forEach(r => {
      rutinasPorFecha[r.dia] = true;
    });
    setDiasDelMes(rutinasPorFecha);
  };

  const cambiarMes = (offset: number) => {
    const nuevoMes = new Date(mesActual);
    nuevoMes.setMonth(nuevoMes.getMonth() + offset);
    setMesActual(nuevoMes);
  };

  // ✅ Utilidad para formato local YYYY-MM-DD
  const getLocalISODate = (fecha: Date): string => {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

const generarDiasMes = (): {
  fecha: string;
  dia: number;
  tieneRutina: boolean;
  esHoy: boolean;
  esDelMes: boolean;
}[] => {
  const dias: any[] = [];
  const año = mesActual.getFullYear();
  const mes = mesActual.getMonth();

  const primerDiaMes = new Date(año, mes, 1);
  const diaSemana = (primerDiaMes.getDay() + 6) % 7; // Lunes = 0

  // Fecha del primer lunes visible
  const fechaInicio = new Date(año, mes, 1 - diaSemana);

  for (let i = 0; i < 42; i++) {
    const fecha = new Date(fechaInicio);
    fecha.setDate(fechaInicio.getDate() + i);
    const iso = getLocalISODate(fecha);
    const esDelMes = fecha.getMonth() === mes;

    dias.push({
      fecha: iso,
      dia: fecha.getDate(),
      tieneRutina: !!diasDelMes[iso],
      esHoy: iso === getLocalISODate(new Date()),
      esDelMes,
    });
  }

  return dias;
};


  // ✅ Calcular número de filas (semanas) para ajustar altura del calendario
  const calcularNumeroFilas = (): number => {
    const año = mesActual.getFullYear();
    const mes = mesActual.getMonth();
    const primerDiaSemana = new Date(año, mes, 1).getDay(); // 0 (Domingo) - 6 (Sábado)
    const offset = (primerDiaSemana + 6) % 7; // Ajustamos para que Lunes sea 0
    const diasTotales = new Date(año, mes + 1, 0).getDate();
    const totalCeldas = offset + diasTotales;
    return Math.ceil(totalCeldas / 7); // Total de filas necesarias
  };

  return {
    diasMes: generarDiasMes(),
    mesActual,
    cambiarMes,
    numeroFilas: calcularNumeroFilas(), // ✅ Nuevo valor devuelto
  };
}
