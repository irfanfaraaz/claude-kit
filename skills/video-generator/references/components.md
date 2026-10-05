# Reusable Components

All components use Remotion APIs (`useCurrentFrame`, `useVideoConfig`, `interpolate`, `spring`). For text/captions/3D patterns see remotion-best-practices rules.

## Animated Background

```tsx
import { useCurrentFrame, interpolate } from "remotion";

export const AnimatedBackground = ({ frame }: { frame: number }) => {
  const hueShift = interpolate(frame, [0, 300], [0, 360]);
  const gradientAngle = interpolate(frame, [0, 300], [0, 180]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(${gradientAngle}deg,
          hsl(${hueShift}, 70%, 15%),
          hsl(${hueShift + 60}, 60%, 10%))`,
      }}
    />
  );
};
```

## Terminal Window

```tsx
import { useCurrentFrame, useVideoConfig } from "remotion";

export const TerminalWindow = ({ lines }: { lines: string[] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const visibleLines = Math.floor(frame / (fps * 0.3));

  return (
    <div className="bg-gray-900 rounded-xl p-6 font-mono text-sm shadow-2xl border border-gray-700">
      <div className="flex gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
      </div>
      {lines.slice(0, visibleLines).map((line, i) => (
        <div key={i} className="text-green-400 leading-relaxed">
          <span className="text-gray-500">$ </span>{line}
        </div>
      ))}
      {visibleLines <= lines.length && (
        <span className="inline-block w-2 h-5 bg-green-400 animate-pulse" />
      )}
    </div>
  );
};
```

## Feature Card

Icon must be a Lucide React component, never an emoji.

```tsx
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const FeatureCard = ({
  icon: Icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.FC<{ size?: number; color?: string }>;
  title: string;
  description: string;
  delay?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { stiffness: 300, damping: 20 },
  });

  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{ transform: `scale(${scale})`, opacity }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
    >
      <div className="mb-4"><Icon size={40} color="white" /></div>
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};
```

## Stats Display

```tsx
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const StatsDisplay = ({ value, label }: { value: number; label: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = interpolate(frame, [0, fps * 1.5], [0, 1], {
    extrapolateRight: "clamp",
  });
  const displayValue = Math.round(value * progress);

  return (
    <div className="text-center">
      <div className="text-7xl font-black text-white tracking-tight">
        {displayValue.toLocaleString()}
      </div>
      <div className="text-lg text-gray-400 uppercase tracking-widest mt-2">
        {label}
      </div>
    </div>
  );
};
```

## CTA Button

```tsx
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const CTAButton = ({ text }: { text: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { stiffness: 200, damping: 15 },
  });

  const shimmer = interpolate(frame, [0, fps * 2], [-100, 200]);

  return (
    <div
      style={{ transform: `scale(${scale})` }}
      className="relative inline-block px-12 py-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white text-2xl font-bold overflow-hidden"
    >
      {text}
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        style={{ transform: `translateX(${shimmer}%)` }}
      />
    </div>
  );
};
```

## Text Reveal

```tsx
import { interpolate, useCurrentFrame } from "remotion";

export const TextReveal = ({
  text,
  charDelay = 2,
}: {
  text: string;
  charDelay?: number;
}) => {
  const frame = useCurrentFrame();

  return (
    <div className="flex flex-wrap">
      {text.split("").map((char, i) => {
        const charFrame = frame - i * charDelay;
        const opacity = interpolate(charFrame, [0, 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const y = interpolate(charFrame, [0, 8], [20, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <span
            key={i}
            style={{ opacity, transform: `translateY(${y}px)` }}
            className="text-6xl font-bold text-white"
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
    </div>
  );
};
```

## Persistent Shape (Remotion-only)

One element that moves between positions per scene; use frame-based scene index. Place outside `<Sequence>` blocks so it spans the whole composition.

```tsx
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

const SCENE_STARTS = [0, 90, 210, 330]; // frame where each scene starts

export const PersistentShape = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneIndex = SCENE_STARTS.findIndex((start, i) => {
    const next = SCENE_STARTS[i + 1];
    return frame >= start && (next === undefined || frame < next);
  });
  const safeIndex = sceneIndex >= 0 ? sceneIndex : 0;

  const positions = [
    { x: 100, y: 100, scale: 1, opacity: 0.3 },
    { x: 800, y: 200, scale: 2, opacity: 0.5 },
    { x: 400, y: 600, scale: 0.5, opacity: 1 },
    { x: 200, y: 400, scale: 1.2, opacity: 0.6 },
  ];
  const current = positions[safeIndex] ?? positions[0];
  const prev = positions[safeIndex - 1] ?? current;

  const sceneStart = SCENE_STARTS[safeIndex] ?? 0;
  const progress = interpolate(
    frame,
    [sceneStart, sceneStart + fps * 0.8],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const x = interpolate(progress, [0, 1], [prev.x, current.x]);
  const y = interpolate(progress, [0, 1], [prev.y, current.y]);
  const scale = interpolate(progress, [0, 1], [prev.scale, current.scale]);
  const opacity = interpolate(progress, [0, 1], [prev.opacity, current.opacity]);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 128,
        height: 128,
        borderRadius: "50%",
        background: "linear-gradient(to right, #ff6b6b, #feca57)",
        transform: `scale(${scale})`,
        opacity,
      }}
    />
  );
};
```
