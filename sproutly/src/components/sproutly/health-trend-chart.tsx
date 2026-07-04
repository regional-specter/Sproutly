import Svg, { Circle, Line, Polyline, Text as SvgText } from 'react-native-svg';

import { FontFamily, SproutlyColors } from '@/constants/theme';
import type { Scan } from '@/types/database';

type HealthTrendChartProps = {
  scans: Scan[];
  width: number;
  height?: number;
};

type ChartPoint = {
  x: number;
  y: number;
  score: number;
  label: string;
};

const PADDING = { top: 12, right: 12, bottom: 28, left: 36 };

function formatChartDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function buildPoints(scans: Scan[], width: number, height: number): ChartPoint[] {
  const scored = scans.filter((scan) => scan.health_score != null);
  if (scored.length === 0) return [];

  const chartWidth = width - PADDING.left - PADDING.right;
  const chartHeight = height - PADDING.top - PADDING.bottom;

  return scored.map((scan, index) => {
    const x =
      scored.length === 1
        ? PADDING.left + chartWidth / 2
        : PADDING.left + (index / (scored.length - 1)) * chartWidth;
    const y = PADDING.top + chartHeight - ((scan.health_score ?? 0) / 100) * chartHeight;

    return {
      x,
      y,
      score: scan.health_score ?? 0,
      label: formatChartDate(scan.created_at),
    };
  });
}

export function HealthTrendChart({ scans, width, height = 180 }: HealthTrendChartProps) {
  const points = buildPoints(scans, width, height);

  if (points.length === 0) {
    return null;
  }

  const chartHeight = height - PADDING.top - PADDING.bottom;
  const gridLines = [0, 25, 50, 75, 100];
  const polylinePoints = points.map((point) => `${point.x},${point.y}`).join(' ');

  return (
    <Svg width={width} height={height}>
      {gridLines.map((value) => {
        const y = PADDING.top + chartHeight - (value / 100) * chartHeight;
        return (
          <Line
            key={value}
            x1={PADDING.left}
            y1={y}
            x2={width - PADDING.right}
            y2={y}
            stroke={SproutlyColors.cardBorder}
            strokeWidth={1}
          />
        );
      })}

      {gridLines.map((value) => {
        const y = PADDING.top + chartHeight - (value / 100) * chartHeight;
        return (
          <SvgText
            key={`label-${value}`}
            x={PADDING.left - 8}
            y={y + 4}
            fontSize={10}
            fill={SproutlyColors.textMuted}
            textAnchor="end"
            fontFamily={FontFamily.interMedium}>
            {value}%
          </SvgText>
        );
      })}

      {points.length > 1 ? (
        <Polyline
          points={polylinePoints}
          fill="none"
          stroke={SproutlyColors.secondary}
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      ) : null}

      {points.map((point, index) => (
        <Circle
          key={`${point.label}-${index}`}
          cx={point.x}
          cy={point.y}
          r={4}
          fill={SproutlyColors.secondary}
          stroke={SproutlyColors.white}
          strokeWidth={2}
        />
      ))}

      {points.map((point, index) => (
        <SvgText
          key={`x-${point.label}-${index}`}
          x={point.x}
          y={height - 8}
          fontSize={10}
          fill={SproutlyColors.textMuted}
          textAnchor="middle"
          fontFamily={FontFamily.interMedium}>
          {point.label}
        </SvgText>
      ))}
    </Svg>
  );
}
