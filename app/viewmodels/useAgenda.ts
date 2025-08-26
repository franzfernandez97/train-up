import { useEffect, useMemo, useState } from 'react';
import { AtletaRutina } from '../models/AtletaRutina';
import { getRutinasAsignadasPorDia, getTodasLasRutinasAsignadas } from '../services/AtletaRutinaService';

export interface DiaSemana {
  label: string;
  dia: number;
  fechaCompleta: string;
  tieneRutina: boolean;
  esHoy: boolean;
  esSeleccionado: boolean;
}

// ✅ helper seguro para YYYY-MM-DD en zona local (evita desfases con toISOString)
function toYMDLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function parseYMDLocal(ymd: string): Date {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export default function useAgenda(fechaInicial?: string, atletaId?: number) {
  const hoy = useMemo(() => new Date(), []);
  const fechaDesdeProp = fechaInicial ? parseYMDLocal(fechaInicial) : hoy;
  const fechaIsoInicial = toYMDLocal(fechaDesdeProp);

  const [dias, setDias] = useState<DiaSemana[]>([]);
  const [tituloSemana, setTituloSemana] = useState('');
  const [fechaBase, setFechaBase] = useState<Date>(fechaDesdeProp);
  const [diaSeleccionado, setDiaSeleccionado] = useState<string>(fechaIsoInicial);
  const [rutinas, setRutinas] = useState<AtletaRutina[]>([]);
  const [rutinaSeleccionada, setRutinaSeleccionada] = useState<AtletaRutina | null>(null);
  const [rutinasDelDia, setRutinasDelDia] = useState<AtletaRutina[]>([]);

  // ✅ Cargar todas las rutinas (del atleta autenticado o del atleta seleccionado por entrenador)
  useEffect(() => {
    let mounted = true;
    const fetchRutinas = async () => {
      try {
        const data = await getTodasLasRutinasAsignadas(atletaId);
        if (mounted) setRutinas(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('❌ Error al cargar rutinas:', error);
        if (mounted) setRutinas([]);
      }
    };
    fetchRutinas();
    return () => { mounted = false; };
  }, [atletaId]);

  // ✅ Actualizar semana cuando cambia fecha base, seleccionado o rutinas
  useEffect(() => {
    generarSemanaDesdeFecha(fechaBase, diaSeleccionado);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fechaBase, diaSeleccionado, rutinas]);

  // ✅ Consultar rutinas del día seleccionado (filtrando por atletaId si viene)
  useEffect(() => {
    let mounted = true;
    const fetchRutinasDelDia = async () => {
      try {
        const data = await getRutinasAsignadasPorDia(diaSeleccionado, atletaId);
        if (mounted) setRutinasDelDia(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('❌ Error al obtener rutinas del día:', error);
        if (mounted) setRutinasDelDia([]);
      }
    };
    if (diaSeleccionado) fetchRutinasDelDia();
    return () => { mounted = false; };
  }, [diaSeleccionado, atletaId]);

  const generarSemanaDesdeFecha = (fechaReferencia: Date, diaSeleccionadoParam: string) => {
    const fecha = new Date(fechaReferencia); // copia segura
    const diaSemana = (fecha.getDay() + 6) % 7; // Lunes=0

    const lunes = new Date(fecha);
    lunes.setDate(fecha.getDate() - diaSemana);

    const domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);

    const mesAnio = lunes.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    setTituloSemana(`${capitalizeFirst(mesAnio)} - Semana ${lunes.getDate()} al ${domingo.getDate()}`);

    const hoyIso = toYMDLocal(hoy);
    const etiquetas = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

    const nuevosDias: DiaSemana[] = etiquetas.map((label, i) => {
      const fechaDia = new Date(lunes);
      fechaDia.setDate(lunes.getDate() + i);
      const fechaIso = toYMDLocal(fechaDia);
      const esSeleccionado = fechaIso === diaSeleccionadoParam;

      return {
        label,
        dia: fechaDia.getDate(),
        fechaCompleta: fechaIso,
        tieneRutina: rutinas.some((r) => r.dia === fechaIso),
        esHoy: fechaIso === hoyIso,
        esSeleccionado,
      };
    });

    setDias(nuevosDias);

    const encontrada = rutinas.find((r) => r.dia === diaSeleccionadoParam) ?? null;
    setRutinaSeleccionada(encontrada);
  };

  const irSemanaAnterior = () => {
    const nuevaFecha = new Date(fechaBase);
    nuevaFecha.setDate(fechaBase.getDate() - 7);
    setFechaBase(nuevaFecha);
  };

  const irSemanaSiguiente = () => {
    const nuevaFecha = new Date(fechaBase);
    nuevaFecha.setDate(fechaBase.getDate() + 7);
    setFechaBase(nuevaFecha);
  };

  const capitalizeFirst = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return {
    dias,
    tituloSemana,
    diaSeleccionado,
    setDiaSeleccionado,
    rutinaSeleccionada,
    rutinasDelDia,
    irSemanaAnterior,
    irSemanaSiguiente,
  };
}
