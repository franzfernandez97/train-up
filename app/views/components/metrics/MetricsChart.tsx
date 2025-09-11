import React, { useMemo } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import Svg, { Circle, Line, Path, Rect, Text as SvgText } from "react-native-svg";

type Point = { idx: number; date: string; y: number };

// Escala superior "bonita" para el eje Y
const niceMax = (n: number) => Math.max(Math.ceil(n / 5) * 5, 10);

/**
 * Gráfico de área/línea con scroll horizontal.
 * Ahora:
 * - Si hay 1 solo punto, se dibuja un círculo centrado (sin línea/área).
 * - Si hay ≥ 2 puntos, se dibuja línea/área + marcadores.
 */
export function MetricsChart({
  points,
  yLabel,
}: {
  points: Point[];
  yLabel: string; // "Repeticiones" | "Peso"
}) {
  const { width } = Dimensions.get("window");
  const baseChartWidth = Math.min(width - 32, 720);
  const chartHeight = 300;
  const padding = 44;

  // Paso horizontal fijo por punto para permitir scroll cuando hay muchos
  const stepX = 84;
  const steps = Math.max(points.length - 1, 0);
  const contentWidth = Math.max(baseChartWidth, padding * 2 + steps * stepX);

  const { area, line, scaleX, scaleY, yMax, hasSeriesLine } = useMemo(() => {
    const innerW = Math.max(contentWidth - padding * 2, 1);
    const innerH = Math.max(chartHeight - padding * 2, 1);

    // Sin datos: ejes vacíos
    if (!points.length) {
      const yMax = 10;
      const scaleX = (_i: number) => padding + innerW / 2;
      const scaleY = (_y: number) => padding + innerH;
      return { area: "", line: "", scaleX, scaleY, yMax, hasSeriesLine: false };
    }

    // Con datos: calcula escalas
    const yVals = points.map((p) => p.y);
    const yMax = niceMax(Math.max(...yVals, 0));
    const yMin = 0;
    const iMin = points[0].idx;

    const scaleX = (i: number) => padding + (i - iMin) * stepX;
    const scaleY = (y: number) => {
      if (yMax === yMin) return padding + innerH;
      return padding + innerH - ((y - yMin) / (yMax - yMin)) * innerH;
    };

    // Con 1 punto: no dibujamos línea/área (serían degeneradas)
    if (points.length === 1) {
      return { area: "", line: "", scaleX, scaleY, yMax, hasSeriesLine: false };
    }

    // ≥ 2 puntos: construye línea y área
    let line = `M ${scaleX(points[0].idx)} ${scaleY(points[0].y)}`;
    for (let k = 1; k < points.length; k++) {
      line += ` L ${scaleX(points[k].idx)} ${scaleY(points[k].y)}`;
    }

    let area = line;
    area += ` L ${scaleX(points[points.length - 1].idx)} ${scaleY(0)}`;
    area += ` L ${scaleX(points[0].idx)} ${scaleY(0)} Z`;

    return { area, line, scaleX, scaleY, yMax, hasSeriesLine: true };
  }, [points, contentWidth, chartHeight]);

  const yTicks = useMemo(() => {
    const t0 = 0;
    const t1 = Math.round(yMax * 0.33);
    const t2 = Math.round(yMax * 0.66);
    const t3 = yMax;
    return [t0, t1, t2, t3];
  }, [yMax]);

  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#eee",
        paddingVertical: 6,
        paddingHorizontal: 6,
        width: "100%",
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        contentContainerStyle={{ width: contentWidth }}
      >
        <Svg width={contentWidth} height={chartHeight}>
          {/* Fondo */}
          <Rect x={0} y={0} width={contentWidth} height={chartHeight} fill="white" />

          {/* Grid Y + labels */}
          {yTicks.map((tick, idx) => (
            <React.Fragment key={`yt-${idx}`}>
              <Line
                x1={padding}
                x2={contentWidth - padding + 8}
                y1={scaleY(tick)}
                y2={scaleY(tick)}
                stroke="#eee"
                strokeWidth={1}
              />
              <SvgText
                x={padding - 8}
                y={scaleY(tick) + 4}
                fontSize="10"
                fill="#666"
                textAnchor="end"
              >
                {tick}
              </SvgText>
            </React.Fragment>
          ))}

          {/* Eje X: marcas/fechas */}
          {points.map((p) => (
            <React.Fragment key={`xt-${p.idx}`}>
              <Line
                x1={scaleX(p.idx)}
                x2={scaleX(p.idx)}
                y1={chartHeight - padding}
                y2={chartHeight - padding + 6}
                stroke="#999"
                strokeWidth={1}
              />
              <SvgText
                x={scaleX(p.idx)}
                y={chartHeight - padding + 18}
                fontSize="10"
                fill="#666"
                textAnchor="middle"
              >
                {p.date}
              </SvgText>
            </React.Fragment>
          ))}

          {/* Ejes */}
          <Line
            x1={padding}
            x2={contentWidth - padding}
            y1={chartHeight - padding}
            y2={chartHeight - padding}
            stroke="#999"
            strokeWidth={1}
          />
          <Line
            x1={padding}
            x2={padding}
            y1={padding}
            y2={chartHeight - padding}
            stroke="#999"
            strokeWidth={1}
          />

          {/* Área + Línea solo si hay ≥ 2 puntos */}
          {hasSeriesLine && area ? <Path d={area} fill="#3b82f6" opacity={0.2} /> : null}
          {hasSeriesLine && line ? <Path d={line} fill="none" stroke="#3b82f6" strokeWidth={2} /> : null}

          {/* 🔵 Marcadores: SIEMPRE dibujar círculos (1 o más puntos) */}
          {points.map((p) => (
            <Circle
              key={`pt-${p.idx}`}
              cx={scaleX(p.idx)}
              cy={scaleY(p.y)}
              r={4}
              fill="#3b82f6"
              stroke="#1d4ed8"
              strokeWidth={1}
            />
          ))}

          {/* Etiquetas de ejes */}
          <SvgText
            x={contentWidth / 2}
            y={chartHeight - 8}
            fontSize="11"
            fill="#666"
            textAnchor="middle"
          >
            Fecha (marca_personal)
          </SvgText>
          <SvgText
            x={12}
            y={padding - 16}
            fontSize="11"
            fill="#666"
            textAnchor="start"
          >
            {yLabel}
          </SvgText>
        </Svg>
      </ScrollView>
    </View>
  );
}
