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

export default function useAgenda() {
  const [dias, setDias] = useState<DiaSemana[]>([]);
  const [tituloSemana, setTituloSemana] = useState('');
  const [fechaBase, setFechaBase] = useState(new Date());
  const [diaSeleccionado, setDiaSeleccionado] = useState<string | null>(null);
  const [rutinas, setRutinas] = useState<AtletaRutina[]>([]);
  const [rutinaSeleccionada, setRutinaSeleccionada] = useState<AtletaRutina | null>(null);

  // ✅ Cargar todas las rutinas al iniciar
  useEffect(() => {
    const fetchRutinas = async () => {
      try {
        const data = await getTodasLasRutinasAsignadas();
        console.log('✅ Rutinas cargadas:', data);
        setRutinas(data);
      } catch (error) {
        console.error('❌ Error al cargar rutinas:', error);
      }
    };

    fetchRutinas();
  }, []);

  // ✅ Establecer día actual como seleccionado la primera vez
  useEffect(() => {
    if (!diaSeleccionado) {
      const hoyIso = new Date().toISOString().split('T')[0];
      setDiaSeleccionado(hoyIso);
    }
  }, []);

  // ✅ Generar la semana y actualizar rutina seleccionada cada vez que cambien dependencias
  useEffect(() => {
    generarSemanaDesdeFecha(fechaBase);
  }, [fechaBase, diaSeleccionado, rutinas]);

  const generarSemanaDesdeFecha = (fecha: Date) => {
    const diaSemana = fecha.getDay();
    const lunes = new Date(fecha);
    lunes.setDate(fecha.getDate() - ((diaSemana + 6) % 7));
    const domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);

    const mesAnio = lunes.toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric',
    });
    setTituloSemana(`${capitalizeFirst(mesAnio)} - Semana ${lunes.getDate()} al ${domingo.getDate()}`);

    const hoyIso = new Date().toISOString().split('T')[0];
    const etiquetas = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

    const nuevosDias: DiaSemana[] = etiquetas.map((label, i) => {
      const fechaDia = new Date(lunes);
      fechaDia.setDate(lunes.getDate() + i);
      const fechaIso = fechaDia.toISOString().split('T')[0];

      return {
        label,
        dia: fechaDia.getDate(),
        fechaCompleta: fechaIso,
        tieneRutina: rutinas.some(r => r.dia === fechaIso),
        esHoy: fechaIso === hoyIso,
        esSeleccionado: fechaIso === diaSeleccionado,
      };
    });

    setDias(nuevosDias);

    // ✅ Actualizar rutina seleccionada (si existe)
    const encontrada = rutinas.find(r => r.dia === diaSeleccionado);
    setRutinaSeleccionada(encontrada ?? null);
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
    irSemanaAnterior,
    irSemanaSiguiente,
  };
}
