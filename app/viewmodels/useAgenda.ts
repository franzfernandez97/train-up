import { useEffect, useState } from 'react';
import { AtletaRutina } from '../models/AtletaRutina';
import { getTodasLasRutinasAsignadas } from '../services/AtletaRutinaService';

export interface DiaSemana {
  label: string;
  dia: number;
  fechaCompleta: string;
  tieneRutina: boolean;
  esHoy: boolean;
  esSeleccionado: boolean;
}

export default function useAgenda(fechaInicial?: string) {
  const hoy = new Date();

    function parseISOToLocalDate(isoString: string): Date {
    const [year, month, day] = isoString.split('-').map(Number);
    return new Date(year, month - 1, day);
    }

const fechaDesdeProp = fechaInicial ? parseISOToLocalDate(fechaInicial) : hoy;
const fechaIsoInicial = fechaDesdeProp.toISOString().split('T')[0];

  console.log('🔽 useAgenda inicializado');
  console.log('📆 fechaInicial prop:', fechaInicial);
  console.log('📆 fechaDesdeProp (objeto Date):', fechaDesdeProp.toString());
  console.log('📆 fechaIsoInicial:', fechaIsoInicial);

  const [dias, setDias] = useState<DiaSemana[]>([]);
  const [tituloSemana, setTituloSemana] = useState('');
  const [fechaBase, setFechaBase] = useState<Date>(fechaDesdeProp);
  const [diaSeleccionado, setDiaSeleccionado] = useState<string>(fechaIsoInicial);
  const [rutinas, setRutinas] = useState<AtletaRutina[]>([]);
  const [rutinaSeleccionada, setRutinaSeleccionada] = useState<AtletaRutina | null>(null);

  // ✅ Cargar todas las rutinas una vez
  useEffect(() => {
    const fetchRutinas = async () => {
      try {
        const data = await getTodasLasRutinasAsignadas();
        console.log('✅ Rutinas obtenidas:', data);
        setRutinas(data);
      } catch (error) {
        console.error('❌ Error al cargar rutinas:', error);
      }
    };

    fetchRutinas();
  }, []);

  // ✅ Generar la semana cuando cambia fecha base, día o rutinas
  useEffect(() => {
    console.log('📦 Dependencias cambiaron');
    console.log('🔄 fechaBase:', fechaBase.toISOString());
    console.log('🔄 diaSeleccionado:', diaSeleccionado);
    generarSemanaDesdeFecha(fechaBase, diaSeleccionado);
  }, [fechaBase, diaSeleccionado, rutinas]);

  const generarSemanaDesdeFecha = (
    fechaReferencia: Date,
    diaSeleccionadoParam: string
  ) => {
    console.log('📅 Generando semana desde fecha:', fechaReferencia.toISOString());
    console.log('📍 Día seleccionado (param):', diaSeleccionadoParam);

    const fecha = new Date(fechaReferencia); // copia segura
    const diaSemana = (fecha.getDay() + 6) % 7; // Lunes=0

    const lunes = new Date(fecha);
    lunes.setDate(fecha.getDate() - diaSemana);

    const domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);

    const mesAnio = lunes.toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric',
    });

    setTituloSemana(
      `${capitalizeFirst(mesAnio)} - Semana ${lunes.getDate()} al ${domingo.getDate()}`
    );

    const hoyIso = hoy.toISOString().split('T')[0];
    const etiquetas = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

    const nuevosDias: DiaSemana[] = etiquetas.map((label, i) => {
      const fechaDia = new Date(lunes);
      fechaDia.setDate(lunes.getDate() + i);
      const fechaIso = fechaDia.toISOString().split('T')[0];

      const esSeleccionado = fechaIso === diaSeleccionadoParam;

      if (esSeleccionado) {
        console.log(`🎯 Día marcado como seleccionado (${label}):`, fechaIso);
      }

      return {
        label,
        dia: fechaDia.getDate(),
        fechaCompleta: fechaIso,
        tieneRutina: rutinas.some(r => r.dia === fechaIso),
        esHoy: fechaIso === hoyIso,
        esSeleccionado,
      };
    });

    console.log('📋 Días generados:', nuevosDias);
    setDias(nuevosDias);

    const encontrada = rutinas.find(r => r.dia === diaSeleccionadoParam);
    setRutinaSeleccionada(encontrada ?? null);

    if (encontrada) {
      console.log('✅ Rutina encontrada para el día seleccionado:', encontrada);
    } else {
      console.log('ℹ️ No hay rutina para el día seleccionado');
    }
  };

  const irSemanaAnterior = () => {
    const nuevaFecha = new Date(fechaBase);
    nuevaFecha.setDate(fechaBase.getDate() - 7);
    console.log('⬅️ Semana anterior:', nuevaFecha.toISOString());
    setFechaBase(nuevaFecha);
  };

  const irSemanaSiguiente = () => {
    const nuevaFecha = new Date(fechaBase);
    nuevaFecha.setDate(fechaBase.getDate() + 7);
    console.log('➡️ Semana siguiente:', nuevaFecha.toISOString());
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
    irSemanaAnterior,
    irSemanaSiguiente,
  };
}
