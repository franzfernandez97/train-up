import { useEffect, useState } from 'react';
import { getTodasLasRutinasAsignadas } from '../services/AtletaRutinaService';

type DiasDelMesMap = { [fecha: string]: boolean };

export interface DiaMesItem {
  fecha: string;      // YYYY-MM-DD
  dia: number;        // número de día
  tieneRutina: boolean;
  esHoy: boolean;
  esDelMes: boolean;
}

export default function useCalendarioMensual(atletaId?: number) {
  const [diasDelMes, setDiasDelMes] = useState<DiasDelMesMap>({});
  const [mesActual, setMesActual] = useState(new Date());

  useEffect(() => {
    cargarRutinas();
    // recargar cuando cambie el mes o el atleta seleccionado
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mesActual, atletaId]);

  const cargarRutinas = async () => {
    try {
      // 👉 si atletaId viene, el backend filtra por ese atleta (modo entrenador)
      const rutinas = await getTodasLasRutinasAsignadas(atletaId);
      const rutinasPorFecha: DiasDelMesMap = {};
      (rutinas ?? []).forEach((r) => {
        if (r?.dia) rutinasPorFecha[r.dia] = true;
      });
      setDiasDelMes(rutinasPorFecha);
    } catch (e) {
      console.error('Error al cargar rutinas del calendario:', e);
      setDiasDelMes({});
    }
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

  const generarDiasMes = (): DiaMesItem[] => {
    const dias: DiaMesItem[] = [];
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
    const primerDiaSemana = new Date(año, mes, 1).getDay(); // 0 (Dom) - 6 (Sáb)
    const offset = (primerDiaSemana + 6) % 7; // Lunes como 0
    const diasTotales = new Date(año, mes + 1, 0).getDate();
    const totalCeldas = offset + diasTotales;
    return Math.ceil(totalCeldas / 7);
  };

  // (Opcional) utilidad pública por si quieres refrescar manualmente
  const refresh = () => cargarRutinas();

  return {
    diasMes: generarDiasMes(),
    mesActual,
    cambiarMes,
    numeroFilas: calcularNumeroFilas(),
    refresh,
  };
}
