import { SymbolView as ExpoSymbolView, type SymbolViewProps as ExpoSymbolViewProps } from 'expo-symbols';
import { Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { LeafIcon } from '@/components/sproutly/figma-icons';
import { SproutlyColors } from '@/constants/theme';

export type SymbolViewProps = ExpoSymbolViewProps;

const iconStrokeWidth = 2.25;

function FallbackChevron({ direction, size, color }: { direction: 'left' | 'right'; size: number; color: string }) {
  const d =
    direction === 'right' ? 'M9 6l6 6-6 6' : direction === 'left' ? 'M15 6l-6 6 6 6' : undefined;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {d ? (
        <Path
          d={d}
          stroke={color}
          strokeWidth={iconStrokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}
    </Svg>
  );
}

function FallbackPlus({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14" stroke={color} strokeWidth={iconStrokeWidth} strokeLinecap="round" />
      <Path d="M5 12h14" stroke={color} strokeWidth={iconStrokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

function FallbackCheck({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 6L9 17l-5-5"
        stroke={color}
        strokeWidth={iconStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function FallbackBolt({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M13 2L3 14h7l-1 8 12-14h-7l-1-6z" fill={color} />
    </Svg>
  );
}

function FallbackSparkles({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2l2.7 6.2L21 11l-6.3 2.8L12 21l-2.7-7.2L3 11l6.3-2.8L12 2z"
        fill={color}
      />
    </Svg>
  );
}

function FallbackBell({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7"
        stroke={color}
        strokeWidth={iconStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.7 21a2 2 0 01-3.4 0"
        stroke={color}
        strokeWidth={iconStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function FallbackPerson({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8.5} r={4} stroke={color} strokeWidth={iconStrokeWidth} />
      <Path
        d="M4.5 20c1.6-4.3 4.7-6 7.5-6s5.9 1.7 7.5 6"
        stroke={color}
        strokeWidth={iconStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function FallbackCamera({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={5} y={7} width={14} height={12} rx={2.5} stroke={color} strokeWidth={iconStrokeWidth} />
      <Circle cx={12} cy={13} r={3.25} stroke={color} strokeWidth={iconStrokeWidth} />
      <Path d="M9 7l1-2h4l1 2" stroke={color} strokeWidth={iconStrokeWidth} strokeLinejoin="round" />
    </Svg>
  );
}

function FallbackHeart({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 21s-7-4.6-9.3-9.1C.7 7.6 3.2 4.7 6.4 4.7c1.7 0 3.3.8 4.1 2c.8-1.2 2.4-2 4.1-2 3.2 0 5.7 2.9 3.7 7.2C19 16.4 12 21 12 21z"
        fill={color}
      />
    </Svg>
  );
}

function FallbackPencil({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 21l3.9-1 12.3-12.3-2.9-2.9L4.1 17.1 3 21z"
        stroke={color}
        strokeWidth={iconStrokeWidth}
        strokeLinejoin="round"
      />
      <Path d="M14.5 4.5l2.9 2.9" stroke={color} strokeWidth={iconStrokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

function FallbackTrash({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 7h12M9 7V5h6v2m-8 0l1 14h8l1-14"
        stroke={color}
        strokeWidth={iconStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M10 11v6M14 11v6" stroke={color} strokeWidth={iconStrokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

function FallbackCalendarPlus({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={4.5} y={6} width={15} height={15} rx={2.5} stroke={color} strokeWidth={iconStrokeWidth} />
      <Path d="M7.5 3v6M16.5 3v6" stroke={color} strokeWidth={iconStrokeWidth} strokeLinecap="round" />
      <Path d="M4.5 10h15" stroke={color} strokeWidth={iconStrokeWidth} strokeLinecap="round" />
      <Path d="M12 14v6" stroke={color} strokeWidth={iconStrokeWidth} strokeLinecap="round" />
      <Path d="M9 17h6" stroke={color} strokeWidth={iconStrokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

function FallbackStar({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2l3.1 6.7 7.4 1.1-5.4 5.2 1.3 7.4L12 18.9 5.6 22.4l1.3-7.4L1.5 9.8l7.4-1.1L12 2z"
        fill={color}
      />
    </Svg>
  );
}

function FallbackGlobe({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={8.5} stroke={color} strokeWidth={iconStrokeWidth} />
      <Path
        d="M3.5 12h17"
        stroke={color}
        strokeWidth={iconStrokeWidth}
        strokeLinecap="round"
      />
      <Path
        d="M12 3.5c2.8 2.7 4.2 5.8 4.2 8.5S14.8 17.7 12 20.5C9.2 17.7 7.8 14.6 7.8 12S9.2 6.2 12 3.5z"
        stroke={color}
        strokeWidth={iconStrokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function FallbackShieldCheck({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2l8 4v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4z"
        stroke={color}
        strokeWidth={iconStrokeWidth}
        strokeLinejoin="round"
      />
      <Path
        d="M8.2 12.4l2.3 2.3 5.3-5.3"
        stroke={color}
        strokeWidth={iconStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function FallbackDoc({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={6} y={3.5} width={12} height={17.5} rx={2.5} stroke={color} strokeWidth={iconStrokeWidth} />
      <Path d="M9 8h6" stroke={color} strokeWidth={iconStrokeWidth} strokeLinecap="round" />
      <Path d="M9 12h6" stroke={color} strokeWidth={iconStrokeWidth} strokeLinecap="round" />
      <Path d="M9 16h4" stroke={color} strokeWidth={iconStrokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

function FallbackEnvelope({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={5} y={7} width={14} height={12} rx={2.5} stroke={color} strokeWidth={iconStrokeWidth} />
      <Path
        d="M6.5 9l5.5 5 5.5-5"
        stroke={color}
        strokeWidth={iconStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function FallbackRectanglePortraitArrowRight({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={5} y={3.5} width={10} height={17} rx={2.5} stroke={color} strokeWidth={iconStrokeWidth} />
      <Circle cx={10} cy={9} r={2.2} stroke={color} strokeWidth={iconStrokeWidth} />
      <Path
        d="M16 11h5m0 0l-2-2m2 2l-2 2"
        stroke={color}
        strokeWidth={iconStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function toAndroidSymbolName(name: string) {
  // Basic best-effort conversion; if the Android symbol name is wrong, we still show a fallback icon.
  return name
    .replaceAll('.fill', '')
    .replaceAll('.', '_')
    .replaceAll('-', '_')
    .replaceAll('__', '_');
}

const ANDROID_SYMBOL_NAME_MAP: Record<string, string> = {
  checkmark: 'check',
  'chevron.right': 'chevron_right',
  'chevron.left': 'chevron_left',
  plus: 'add',
  'bolt.fill': 'bolt',
  sparkles: 'auto_awesome',
  bell: 'notifications',
  'person.fill': 'person',
  'camera.fill': 'photo_camera',
  'heart.fill': 'favorite',
  pencil: 'edit',
  trash: 'delete',
  'trash.fill': 'delete',
  'calendar.badge.plus': 'event_available',
  'leaf.fill': 'eco',
  globe: 'public',
  'star.fill': 'star',
  'checkmark.shield.fill': 'verified',
  'doc.text.fill': 'description',
  'envelope.fill': 'mail',
  'rectangle.portrait.and.arrow.right': 'logout',
};

function FallbackIcon({
  name,
  size,
  color,
}: {
  name: string;
  size: number;
  color: string;
}) {
  switch (name) {
    case 'chevron.right':
      return <FallbackChevron direction="right" size={size} color={color} />;
    case 'chevron.left':
      return <FallbackChevron direction="left" size={size} color={color} />;
    case 'plus':
      return <FallbackPlus size={size} color={color} />;
    case 'checkmark':
      return <FallbackCheck size={size} color={color} />;
    case 'bolt.fill':
      return <FallbackBolt size={size} color={color} />;
    case 'sparkles':
      return <FallbackSparkles size={size} color={color} />;
    case 'bell':
      return <FallbackBell size={size} color={color} />;
    case 'person.fill':
      return <FallbackPerson size={size} color={color} />;
    case 'camera.fill':
      return <FallbackCamera size={size} color={color} />;
    case 'heart.fill':
      return <FallbackHeart size={size} color={color} />;
    case 'pencil':
      return <FallbackPencil size={size} color={color} />;
    case 'trash':
    case 'trash.fill':
      return <FallbackTrash size={size} color={color} />;
    case 'calendar.badge.plus':
      return <FallbackCalendarPlus size={size} color={color} />;
    case 'leaf.fill':
      return <LeafIcon size={size} color={color} />;
    case 'globe':
      return <FallbackGlobe size={size} color={color} />;
    case 'star.fill':
      return <FallbackStar size={size} color={color} />;
    case 'checkmark.shield.fill':
      return <FallbackShieldCheck size={size} color={color} />;
    case 'doc.text.fill':
      return <FallbackDoc size={size} color={color} />;
    case 'envelope.fill':
      return <FallbackEnvelope size={size} color={color} />;
    case 'rectangle.portrait.and.arrow.right':
      return <FallbackRectanglePortraitArrowRight size={size} color={color} />;
    default:
      return (
        <View
          style={{
            width: size,
            height: size,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ color, fontSize: Math.max(10, size * 0.55), lineHeight: size * 0.6, fontWeight: '700' }}>
            ?
          </Text>
        </View>
      );
  }
}

export function SymbolView(props: SymbolViewProps) {
  const size = props.size ?? 24;
  const color = typeof props.tintColor === 'string' ? props.tintColor : SproutlyColors.icon;

  const fallback =
    typeof props.name === 'string' ? (
      <FallbackIcon name={props.name} size={size} color={color} />
    ) : typeof (props.name as any)?.ios === 'string' ? (
      <FallbackIcon name={(props.name as any).ios} size={size} color={color} />
    ) : (
      <FallbackIcon name="checkmark" size={size} color={color} />
    );

  if (typeof props.name === 'string') {
    const androidName = ANDROID_SYMBOL_NAME_MAP[props.name] ?? toAndroidSymbolName(props.name);

    return (
      <ExpoSymbolView
        {...props}
        // Pass per-platform symbol names so Android doesn't treat this as SF-only.
        name={{ ios: props.name as any, android: androidName as any, web: androidName as any }}
        fallback={fallback}
      />
    );
  }

  // If a call site already provided per-platform names, just attach a fallback.
  return <ExpoSymbolView {...props} fallback={fallback} />;
}

