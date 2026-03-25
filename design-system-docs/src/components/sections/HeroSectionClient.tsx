"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";

import { InfiniteLogoMarquee } from "@/components/blocks/InfiniteLogoMarquee";
import { rocketmindHeroRotatingLines } from "@/content/rocketmind-hero";
import type { PartnerLogo } from "@/lib/partner-logos";

import { RocketmindMenu } from "./RocketmindMenu";

const HERO_BACKGROUND_IMAGE = "/hero-art/hero-lens.png";

const ROUND_GLASS_VERTEX_SHADER = `
  attribute vec2 aPosition;

  void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const ROUND_GLASS_FRAGMENT_SHADER = `
  precision mediump float;

  uniform sampler2D uSceneTexture;
  uniform vec2 uCanvasSize;
  uniform vec2 uLensSize;
  uniform vec2 uLensCenter;
  uniform vec2 uHeroSize;
  uniform float uRefractionStrength;
  uniform float uDepthStrength;
  uniform float uDispersionStrength;
  uniform float uDistortionRadius;
  uniform float uShadowRadius;
  uniform float uBlurStrength;
  uniform float uShadowEnabled;

  float luminance(vec3 color) {
    return dot(color, vec3(0.2126, 0.7152, 0.0722));
  }

  vec4 sampleScene(vec2 uv) {
    return texture2D(
      uSceneTexture,
      clamp(uv, vec2(0.0), vec2(1.0))
    );
  }

  void main() {
    vec2 pixel = vec2(gl_FragCoord.x, uCanvasSize.y - gl_FragCoord.y);
    vec2 localOffset = (pixel - (0.5 * uCanvasSize)) * (uLensSize / uCanvasSize);
    float radius = min(uLensSize.x, uLensSize.y) * 0.5;
    float distanceToCenter = length(localOffset);

    if (distanceToCenter > radius) {
      discard;
    }

    float normalized = clamp(distanceToCenter / radius, 0.0, 1.0);
    vec2 direction = distanceToCenter > 0.0001
      ? localOffset / distanceToCenter
      : vec2(1.0, 0.0);
    vec2 tangent = vec2(-direction.y, direction.x);

    float distortionCenter = clamp(uDistortionRadius / 1.5, 0.18, 1.0);
    float distortionBand = smoothstep(
      max(0.0, distortionCenter - 0.24),
      min(1.0, distortionCenter + 0.04),
      normalized
    );
    float distortionFalloff = pow(normalized, 2.35) * distortionBand;
    vec2 refractOffset = direction * radius * uRefractionStrength *
      (0.65 + uDepthStrength * 2.2) * distortionFalloff;
    vec2 sampleOffset = localOffset - refractOffset;

    vec2 baseUv = (uLensCenter + sampleOffset) / uHeroSize;
    vec4 baseSample = sampleScene(baseUv);

    float blurAmount = radius * uBlurStrength * 0.0085 * distortionBand;
    vec2 blurDirUv = (direction * blurAmount) / uHeroSize;
    vec2 blurTanUv = (tangent * blurAmount) / uHeroSize;

    vec4 blurredBase = (
      baseSample * 2.0 +
      sampleScene(baseUv + blurDirUv) +
      sampleScene(baseUv - blurDirUv) +
      sampleScene(baseUv + blurTanUv) +
      sampleScene(baseUv - blurTanUv)
    ) / 6.0;

    vec3 baseColor = mix(
      baseSample.rgb,
      blurredBase.rgb,
      clamp(uBlurStrength * 0.22 * distortionBand, 0.0, 0.85)
    );

    float chromaticBand = smoothstep(
      max(0.0, distortionCenter - 0.18),
      min(1.0, distortionCenter + 0.16 + uDispersionStrength * 0.035),
      normalized
    );

    float dispersionDistance = radius *
      (0.0018 + uDispersionStrength * 0.0026) *
      (0.55 + chromaticBand);
    vec2 chromaticUvOffset = (direction * dispersionDistance) / uHeroSize;
    vec2 fringeBlurUv = ((direction + tangent * 0.75) * blurAmount * 1.3) / uHeroSize;
    vec2 fringeBlurOppositeUv = ((direction - tangent * 0.75) * blurAmount * 1.3) / uHeroSize;

    vec2 warmUv = baseUv + chromaticUvOffset;
    vec2 coolUv = baseUv - chromaticUvOffset;

    vec4 warmSample = (
      sampleScene(warmUv) * 2.0 +
      sampleScene(warmUv + fringeBlurUv) +
      sampleScene(warmUv - fringeBlurUv) +
      sampleScene(warmUv + fringeBlurOppositeUv) +
      sampleScene(warmUv - fringeBlurOppositeUv)
    ) / 6.0;

    vec4 coolSample = (
      sampleScene(coolUv) * 2.0 +
      sampleScene(coolUv + fringeBlurUv) +
      sampleScene(coolUv - fringeBlurUv) +
      sampleScene(coolUv + fringeBlurOppositeUv) +
      sampleScene(coolUv - fringeBlurOppositeUv)
    ) / 6.0;

    float baseLum = luminance(baseSample.rgb);
    float warmContrast = max(0.0, luminance(warmSample.rgb) - baseLum);
    float coolContrast = max(0.0, luminance(coolSample.rgb) - baseLum);
    float contrastMask = smoothstep(0.012, 0.24, warmContrast + coolContrast);

    vec3 warmTint = vec3(1.0, 0.913, 0.0);
    vec3 coolTint = vec3(0.631, 0.447, 0.973);

    float warmMask = chromaticBand * contrastMask *
      (0.22 + uDispersionStrength * 0.42);
    float coolMask = chromaticBand * contrastMask *
      (0.26 + uDispersionStrength * 0.54);

    vec3 warmFringe = max(warmSample.rgb - baseSample.rgb, vec3(0.0));
    vec3 coolFringe = max(coolSample.rgb - baseSample.rgb, vec3(0.0));

    vec3 color = baseColor;
    color += warmFringe * warmTint * warmMask * 2.2;
    color += coolFringe * coolTint * coolMask * 2.8;

    vec3 fringeBlurredColor = (
      baseColor +
      warmSample.rgb +
      coolSample.rgb +
      blurredBase.rgb
    ) / 4.0;

    color = mix(
      color,
      fringeBlurredColor,
      clamp(uBlurStrength * chromaticBand * contrastMask * 0.42, 0.0, 0.9)
    );

    float logoMask = smoothstep(0.62, 0.94, baseLum);
    float shadowBand = smoothstep(
      max(0.0, clamp(uShadowRadius / 1.5, 0.18, 1.0) - 0.18),
      1.0,
      normalized
    );
    float shadowStrength = uShadowEnabled *
      shadowBand *
      (1.0 - logoMask) *
      0.12;
    color = mix(color, color * 0.58, shadowStrength);

    float alpha = 1.0 - smoothstep(0.985, 1.0, normalized);
    gl_FragColor = vec4(color, baseSample.a * alpha);
  }
`;

const HERO_ROTATION_INTERVAL_MS = 2800;
const HERO_ROTATION_TRANSITION_MS = 640;
const HERO_ROTATION_ENTRY_DELAY_MS = 220;
const HERO_ROTATING_LINE_HEIGHT_EM = 1.08;
const LENS_CAPTURE_INTERVAL_MS = 180;
const LENS_CAPTURE_THROTTLE_MS = 90;
const LENS_MAX_CAPTURE_SCALE = 2.0;
const LENS_STORAGE_KEY = "rocketmind:lens-controls:v2";
const SHOW_LENS_CONTROLS = false;

const platformTextStyle = {
  textShadow: "0 4px 4px rgba(0, 0, 0, 0.25)",
} satisfies CSSProperties;

const heroBackgroundImageStyle = {
  height: "115.42%",
  left: "-8.38%",
  maxWidth: "none",
  top: "-15.42%",
  width: "120.19%",
} satisfies CSSProperties;

const heroRotatingLineViewportStyle = {
  height: `${HERO_ROTATING_LINE_HEIGHT_EM}em`,
} satisfies CSSProperties;

type HeroSectionClientProps = {
  logos: PartnerLogo[];
};

type BreakpointKey = "mobile" | "tablet" | "desktop" | "wide";
type LensTab = "position" | "size" | "distortion";

type LensControlSettings = {
  smallLensXOffset: number;
  smallLensYOffset: number;
  largeLensXOffset: number;
  largeLensYOffset: number;
  smallLensSize: number;
  largeLensSize: number;
  refraction: number;
  depth: number;
  dispersion: number;
  distortionRadius: number;
  shadowRadius: number;
  blur: number;
  gradientAngle: number;
  shadowEnabled: boolean;
};

type StoredLensSettings = Partial<Record<BreakpointKey, Partial<LensControlSettings>>>;

type BreakpointPreset = LensControlSettings & {
  label: string;
  largeLensBaseGapX: number;
  largeLensBaseGapY: number;
};

const BREAKPOINT_PRESETS: Record<BreakpointKey, BreakpointPreset> = {
  mobile: {
    label: "Mobile",
    smallLensXOffset: 36,
    smallLensYOffset: 22,
    largeLensXOffset: 0,
    largeLensYOffset: 0,
    smallLensSize: 220,
    largeLensSize: 380,
    refraction: 0.028,
    depth: 0.12,
    dispersion: 0.24,
    distortionRadius: 0.9,
    shadowRadius: 0.98,
    blur: 0.14,
    gradientAngle: 205,
    shadowEnabled: true,
    largeLensBaseGapX: 360,
    largeLensBaseGapY: 40,
  },
  tablet: {
    label: "Tablet",
    smallLensXOffset: 64,
    smallLensYOffset: 44,
    largeLensXOffset: 0,
    largeLensYOffset: 0,
    smallLensSize: 280,
    largeLensSize: 520,
    refraction: 0.028,
    depth: 0.16,
    dispersion: 0.3,
    distortionRadius: 1.0,
    shadowRadius: 0.98,
    blur: 0.16,
    gradientAngle: 205,
    shadowEnabled: true,
    largeLensBaseGapX: 520,
    largeLensBaseGapY: 60,
  },
  desktop: {
    label: "Desktop",
    smallLensXOffset: 96,
    smallLensYOffset: 72,
    largeLensXOffset: 0,
    largeLensYOffset: 0,
    smallLensSize: 320,
    largeLensSize: 620,
    refraction: 0.03,
    depth: 0.18,
    dispersion: 0.36,
    distortionRadius: 1.08,
    shadowRadius: 0.98,
    blur: 0.18,
    gradientAngle: 205,
    shadowEnabled: true,
    largeLensBaseGapX: 640,
    largeLensBaseGapY: 72,
  },
  wide: {
    label: "Wide Desktop",
    smallLensXOffset: 120,
    smallLensYOffset: 72,
    largeLensXOffset: 0,
    largeLensYOffset: 0,
    smallLensSize: 360,
    largeLensSize: 706,
    refraction: 0.032,
    depth: 0.22,
    dispersion: 0.42,
    distortionRadius: 1.12,
    shadowRadius: 0.98,
    blur: 0.2,
    gradientAngle: 205,
    shadowEnabled: true,
    largeLensBaseGapX: 772,
    largeLensBaseGapY: 84,
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getBreakpointKey(width: number): BreakpointKey {
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  if (width < 1440) return "desktop";
  return "wide";
}

function normalizeNumber(
  value: unknown,
  fallback: number,
  min: number,
  max: number,
) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }

  return clamp(value, min, max);
}

function resolveLensSettings(
  partial: Partial<LensControlSettings> | undefined,
  breakpointKey: BreakpointKey,
): LensControlSettings {
  const preset = BREAKPOINT_PRESETS[breakpointKey];

  return {
    smallLensXOffset: normalizeNumber(
      partial?.smallLensXOffset,
      preset.smallLensXOffset,
      -400,
      400,
    ),
    smallLensYOffset: normalizeNumber(
      partial?.smallLensYOffset,
      preset.smallLensYOffset,
      -240,
      420,
    ),
    largeLensXOffset: normalizeNumber(
      partial?.largeLensXOffset,
      preset.largeLensXOffset,
      -1200,
      1200,
    ),
    largeLensYOffset: normalizeNumber(
      partial?.largeLensYOffset,
      preset.largeLensYOffset,
      -600,
      600,
    ),
    smallLensSize: normalizeNumber(
      partial?.smallLensSize,
      preset.smallLensSize,
      180,
      900,
    ),
    largeLensSize: normalizeNumber(
      partial?.largeLensSize,
      preset.largeLensSize,
      240,
      2000,
    ),
    refraction: normalizeNumber(partial?.refraction, preset.refraction, 0, 0.12),
    depth: normalizeNumber(partial?.depth, preset.depth, 0, 0.5),
    dispersion: normalizeNumber(partial?.dispersion, preset.dispersion, 0, 5),
    distortionRadius: normalizeNumber(
      partial?.distortionRadius,
      preset.distortionRadius,
      0.2,
      1.5,
    ),
    shadowRadius: normalizeNumber(
      partial?.shadowRadius,
      preset.shadowRadius,
      0.2,
      1.5,
    ),
    blur: normalizeNumber(partial?.blur, preset.blur, 0, 2),
    gradientAngle: normalizeNumber(
      partial?.gradientAngle,
      preset.gradientAngle,
      0,
      360,
    ),
    shadowEnabled:
      typeof partial?.shadowEnabled === "boolean"
        ? partial.shadowEnabled
        : preset.shadowEnabled,
  };
}

function readStoredLensSettings(): StoredLensSettings {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(LENS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredLensSettings) : {};
  } catch {
    return {};
  }
}

function saveStoredLensSettings(settings: StoredLensSettings) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LENS_STORAGE_KEY, JSON.stringify(settings));
}

function ControlSlider({
  label,
  value,
  min,
  max,
  step,
  disabled,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
  format?: (value: number) => string;
  onChange: (value: number) => void;
}) {
  return (
    <label className={`lens-controls-row${disabled ? " is-disabled" : ""}`}>
      <div className="lens-controls-row__header">
        <span>{label}</span>
        <span>{format ? format(value) : value.toFixed(3)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
      />
    </label>
  );
}

export function HeroSectionClient({ logos }: HeroSectionClientProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const wordmarkRef = useRef<HTMLDivElement | null>(null);
  const glassRef = useRef<HTMLDivElement | null>(null);
  const staticGlassRef = useRef<HTMLDivElement | null>(null);
  const lensCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const syncRef = useRef<(() => void) | null>(null);
  const settingsRef = useRef<LensControlSettings>(BREAKPOINT_PRESETS.wide);
  const breakpointRef = useRef<BreakpointKey>("wide");

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<LensTab>("distortion");
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [breakpointKey, setBreakpointKey] = useState<BreakpointKey>("wide");
  const [activeRotatingLineIndex, setActiveRotatingLineIndex] = useState(0);
  const [settings, setSettings] = useState<LensControlSettings>(
    BREAKPOINT_PRESETS.wide,
  );

  const breakpointPreset = BREAKPOINT_PRESETS[breakpointKey];

  const effectiveLargeLensSize = useMemo(() => {
    return clamp(
      breakpointPreset.largeLensSize +
        (settings.largeLensSize - breakpointPreset.largeLensSize) * 2,
      240,
      2200,
    );
  }, [breakpointPreset.largeLensSize, settings.largeLensSize]);

  const smallLensStyle = useMemo(
    () =>
      ({
        "--lens-gradient-angle": `${settings.gradientAngle}deg`,
        height: `${settings.smallLensSize}px`,
        width: `${settings.smallLensSize}px`,
      }) as CSSProperties,
    [settings.gradientAngle, settings.smallLensSize],
  );

  const largeLensStyle = useMemo(
    () =>
      ({
        "--lens-gradient-angle": `${settings.gradientAngle}deg`,
        height: `${effectiveLargeLensSize}px`,
        width: `${effectiveLargeLensSize}px`,
      }) as CSSProperties,
    [effectiveLargeLensSize, settings.gradientAngle],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const syncViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const nextBreakpoint = getBreakpointKey(width);

      setViewport({ width, height });

      if (breakpointRef.current !== nextBreakpoint) {
        breakpointRef.current = nextBreakpoint;
        setBreakpointKey(nextBreakpoint);
        const stored = readStoredLensSettings();
        const nextSettings = resolveLensSettings(stored[nextBreakpoint], nextBreakpoint);
        settingsRef.current = nextSettings;
        setSettings(nextSettings);
      }
    };

    const width = window.innerWidth;
    const initialBreakpoint = getBreakpointKey(width);
    const stored = readStoredLensSettings();
    const initialSettings = resolveLensSettings(stored[initialBreakpoint], initialBreakpoint);

    breakpointRef.current = initialBreakpoint;
    settingsRef.current = initialSettings;
    setBreakpointKey(initialBreakpoint);
    setViewport({ width, height: window.innerHeight });
    setSettings(initialSettings);

    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  useEffect(() => {
    settingsRef.current = settings;
    syncRef.current?.();
  }, [settings, effectiveLargeLensSize]);

  useEffect(() => {
    if (rocketmindHeroRotatingLines.length <= 1) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveRotatingLineIndex((prev) => (prev + 1) % rocketmindHeroRotatingLines.length);
    }, HERO_ROTATION_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    const wordmark = wordmarkRef.current;
    const glass = glassRef.current;
    const staticGlass = staticGlassRef.current;
    const canvas = lensCanvasRef.current;

    if (!hero || !wordmark || !glass || !staticGlass || !canvas) {
      return;
    }

    const scene = hero;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: true,
    });

    const prefersFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!gl) {
      return;
    }

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);

      if (!shader) {
        return null;
      }

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Round glass shader error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, ROUND_GLASS_VERTEX_SHADER);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, ROUND_GLASS_FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) {
      return;
    }

    const program = gl.createProgram();

    if (!program) {
      return;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Round glass program error:", gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return;
    }

    const positionLocation = gl.getAttribLocation(program, "aPosition");
    const sceneTextureLocation = gl.getUniformLocation(program, "uSceneTexture");
    const canvasSizeLocation = gl.getUniformLocation(program, "uCanvasSize");
    const lensSizeLocation = gl.getUniformLocation(program, "uLensSize");
    const lensCenterLocation = gl.getUniformLocation(program, "uLensCenter");
    const heroSizeLocation = gl.getUniformLocation(program, "uHeroSize");
    const refractionLocation = gl.getUniformLocation(program, "uRefractionStrength");
    const depthLocation = gl.getUniformLocation(program, "uDepthStrength");
    const dispersionLocation = gl.getUniformLocation(program, "uDispersionStrength");
    const distortionRadiusLocation = gl.getUniformLocation(program, "uDistortionRadius");
    const shadowRadiusLocation = gl.getUniformLocation(program, "uShadowRadius");
    const blurLocation = gl.getUniformLocation(program, "uBlurStrength");
    const shadowEnabledLocation = gl.getUniformLocation(program, "uShadowEnabled");

    if (
      positionLocation < 0 ||
      !sceneTextureLocation ||
      !canvasSizeLocation ||
      !lensSizeLocation ||
      !lensCenterLocation ||
      !heroSizeLocation ||
      !refractionLocation ||
      !depthLocation ||
      !dispersionLocation ||
      !distortionRadiusLocation ||
      !shadowRadiusLocation ||
      !blurLocation ||
      !shadowEnabledLocation
    ) {
      gl.deleteProgram(program);
      return;
    }

    const positionBuffer = gl.createBuffer();
    const sceneTexture = gl.createTexture();

    if (!positionBuffer || !sceneTexture) {
      gl.deleteProgram(program);
      return;
    }

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sceneTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(sceneTextureLocation, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let frameId = 0;
    let captureIntervalId = 0;
    let resizeObserver: ResizeObserver | null = null;
    let disposed = false;
    let html2canvasModule: null | ((typeof import("html2canvas"))["default"]) = null;
    let captureInFlight = false;
    let pendingCapture = false;
    let hasSceneTexture = false;
    let lastCaptureRequest = 0;

    const canvasSize = { width: 1, height: 1 };
    const lensSize = { width: 1, height: 1 };
    const heroSize = { width: 1, height: 1 };
    const base = { x: 0, y: 0 };
    const staticBase = { x: 0, y: 0 };
    const lensCenter = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const staticCurrent = { x: 0, y: 0 };
    const staticTarget = { x: 0, y: 0 };
    const limit = 102.4;

    const syncBasePosition = () => {
      const currentSettings = settingsRef.current;
      const preset = BREAKPOINT_PRESETS[breakpointRef.current];
      const heroRect = hero.getBoundingClientRect();
      const wordmarkImage =
        wordmark.querySelector("img") ||
        wordmark.querySelector("svg") ||
        wordmark;
      const wordmarkRect = wordmarkImage.getBoundingClientRect();
      const parentRect = (glass.parentElement ?? hero).getBoundingClientRect();
      const parentLeft = parentRect.left - heroRect.left;
      const parentTop = parentRect.top - heroRect.top;

      const primaryLensLeft = heroRect.width / 2 + currentSettings.smallLensXOffset;
      const primaryLensTop =
        wordmarkRect.top -
        heroRect.top +
        wordmarkRect.height / 2 +
        currentSettings.smallLensYOffset;

      const staticLensLeft =
        primaryLensLeft +
        preset.largeLensBaseGapX +
        currentSettings.largeLensXOffset * 2;
      const staticLensTop =
        primaryLensTop +
        preset.largeLensBaseGapY +
        currentSettings.largeLensYOffset * 2;

      base.x = primaryLensLeft;
      base.y = primaryLensTop;
      staticBase.x = staticLensLeft;
      staticBase.y = staticLensTop;
      heroSize.width = heroRect.width;
      heroSize.height = heroRect.height;

      glass.style.left = `${base.x - parentLeft}px`;
      glass.style.top = `${base.y - parentTop}px`;
      staticGlass.style.left = `${staticBase.x - parentLeft}px`;
      staticGlass.style.top = `${staticBase.y - parentTop}px`;
    };

    const syncLensCenter = () => {
      const glassRect = glass.getBoundingClientRect();
      const heroRect = hero.getBoundingClientRect();

      lensCenter.x = glassRect.left - heroRect.left + glassRect.width / 2;
      lensCenter.y = glassRect.top - heroRect.top + glassRect.height / 2;
    };

    const resizeCanvas = () => {
      const nextWidth = Math.max(1, glass.clientWidth);
      const nextHeight = Math.max(1, glass.clientHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      lensSize.width = nextWidth;
      lensSize.height = nextHeight;
      canvasSize.width = Math.round(nextWidth * dpr);
      canvasSize.height = Math.round(nextHeight * dpr);
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;
      canvas.style.width = `${nextWidth}px`;
      canvas.style.height = `${nextHeight}px`;
    };

    const drawLens = () => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      if (!hasSceneTexture) {
        return;
      }

      const currentSettings = settingsRef.current;

      gl.useProgram(program);
      syncLensCenter();
      gl.uniform2f(canvasSizeLocation, canvasSize.width, canvasSize.height);
      gl.uniform2f(lensSizeLocation, lensSize.width, lensSize.height);
      gl.uniform2f(lensCenterLocation, lensCenter.x, lensCenter.y);
      gl.uniform2f(heroSizeLocation, heroSize.width, heroSize.height);
      gl.uniform1f(refractionLocation, currentSettings.refraction);
      gl.uniform1f(depthLocation, currentSettings.depth);
      gl.uniform1f(dispersionLocation, currentSettings.dispersion);
      gl.uniform1f(distortionRadiusLocation, currentSettings.distortionRadius);
      gl.uniform1f(shadowRadiusLocation, currentSettings.shadowRadius);
      gl.uniform1f(blurLocation, currentSettings.blur);
      gl.uniform1f(
        shadowEnabledLocation,
        currentSettings.shadowEnabled ? 1 : 0,
      );
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const render = () => {
      frameId = 0;
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      staticCurrent.x += (staticTarget.x - staticCurrent.x) * 0.08;
      staticCurrent.y += (staticTarget.y - staticCurrent.y) * 0.08;

      glass.style.transform = `translate3d(calc(-50% + ${current.x}px), calc(-50% + ${current.y}px), 0)`;
      staticGlass.style.transform = `translate3d(calc(-50% + ${staticCurrent.x}px), calc(-50% + ${staticCurrent.y}px), 0)`;
      drawLens();

      if (
        Math.abs(target.x - current.x) > 0.1 ||
        Math.abs(target.y - current.y) > 0.1 ||
        Math.abs(staticTarget.x - staticCurrent.x) > 0.1 ||
        Math.abs(staticTarget.y - staticCurrent.y) > 0.1
      ) {
        frameId = window.requestAnimationFrame(render);
      }
    };

    const scheduleRender = () => {
      if (!frameId) {
        frameId = window.requestAnimationFrame(render);
      }
    };

    const syncLayout = () => {
      syncBasePosition();
      resizeCanvas();
      drawLens();
      scheduleRender();
      requestCapture(true);
    };

    const captureScene = async () => {
      if (disposed) {
        return;
      }

      if (captureInFlight) {
        pendingCapture = true;
        return;
      }

      captureInFlight = true;

      try {
        if (!html2canvasModule) {
          const imported = await import("html2canvas");
          html2canvasModule = imported.default;
        }

        const captureScale = Math.min(
          window.devicePixelRatio || 1,
          LENS_MAX_CAPTURE_SCALE,
        );

        const snapshot = await html2canvasModule(scene, {
          backgroundColor: null,
          logging: false,
          scale: captureScale,
          useCORS: true,
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0,
          width: scene.offsetWidth,
          height: scene.offsetHeight,
          onclone: (clonedDocument) => {
            clonedDocument
              .querySelectorAll<HTMLElement>("[data-lens-hide='true']")
              .forEach((element) => {
                element.style.visibility = "hidden";
              });
          },
          ignoreElements: (element) =>
            element instanceof HTMLElement &&
            element.dataset.lensIgnore === "true",
        });

        if (disposed) {
          return;
        }

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, sceneTexture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          snapshot,
        );
        hasSceneTexture = true;
        drawLens();
      } catch (error) {
        console.error("Failed to capture round glass scene:", error);
      } finally {
        captureInFlight = false;

        if (pendingCapture) {
          pendingCapture = false;
          void captureScene();
        }
      }
    };

    const requestCapture = (force = false) => {
      const now = performance.now();

      if (!force && now - lastCaptureRequest < LENS_CAPTURE_THROTTLE_MS) {
        return;
      }

      lastCaptureRequest = now;
      void captureScene();
    };

    const handleMove = (event: PointerEvent) => {
      if (!prefersFinePointer || prefersReducedMotion) {
        return;
      }

      const rect = hero.getBoundingClientRect();
      const relativeX = event.clientX - rect.left - rect.width / 2;
      const relativeY = event.clientY - rect.top - rect.height / 2;

      target.x = clamp(relativeX * 0.032, -limit, limit);
      target.y = clamp(relativeY * 0.032, -limit, limit);
      staticTarget.x = clamp(relativeX * 0.008, -limit, limit);
      staticTarget.y = clamp(relativeY * 0.008, -limit, limit);
      scheduleRender();
      requestCapture();
    };

    const reset = () => {
      target.x = 0;
      target.y = 0;
      staticTarget.x = 0;
      staticTarget.y = 0;
      scheduleRender();
    };

    const handleResize = () => {
      syncLayout();
    };

    syncRef.current = syncLayout;
    syncLayout();
    glass.style.transform = "translate3d(-50%, -50%, 0)";
    staticGlass.style.transform = "translate3d(-50%, -50%, 0)";
    scheduleRender();

    if (!prefersReducedMotion) {
      captureIntervalId = window.setInterval(() => {
        requestCapture(true);
      }, LENS_CAPTURE_INTERVAL_MS);
    }

    if (prefersFinePointer && !prefersReducedMotion) {
      hero.addEventListener("pointermove", handleMove);
      hero.addEventListener("pointerleave", reset);
    }

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        syncLayout();
      });
      resizeObserver.observe(hero);
      resizeObserver.observe(wordmark);
      resizeObserver.observe(glass);
      resizeObserver.observe(staticGlass);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      disposed = true;
      syncRef.current = null;

      if (captureIntervalId) {
        window.clearInterval(captureIntervalId);
      }

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      hero.removeEventListener("pointermove", handleMove);
      hero.removeEventListener("pointerleave", reset);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", handleResize);
      gl.deleteTexture(sceneTexture);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  const handleSave = () => {
    const stored = readStoredLensSettings();
    stored[breakpointKey] = settings;
    saveStoredLensSettings(stored);
  };

  const controls = mounted && SHOW_LENS_CONTROLS
    ? createPortal(
        <div className="lens-controls-panel" data-lens-hide="true">
          <div className="lens-controls-panel__header">
            <div>
              <div className="lens-controls-panel__title">LENS CONTROLS</div>
              <div className="lens-controls-panel__meta">
                {breakpointPreset.label} · {viewport.width}px × {viewport.height}px
              </div>
            </div>
            <button
              type="button"
              className="lens-controls-panel__save"
              onClick={handleSave}
            >
              СОХРАНИТЬ
            </button>
          </div>

          <div className="lens-controls-tabs">
            {[
              { id: "position", label: "ПОЗИЦИЯ" },
              { id: "size", label: "РАЗМЕР" },
              { id: "distortion", label: "ИСКАЖЕНИЕ" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`lens-controls-tab${
                  activeTab === tab.id ? " is-active" : ""
                }`}
                onClick={() => setActiveTab(tab.id as LensTab)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "position" ? (
            <div className="lens-controls-group">
              <ControlSlider
                label="МАЛАЯ ЛИНЗА X"
                value={settings.smallLensXOffset}
                min={-400}
                max={400}
                step={1}
                format={(value) => `${Math.round(value)}PX`}
                onChange={(value) =>
                  setSettings((prev) => ({ ...prev, smallLensXOffset: value }))
                }
              />
              <ControlSlider
                label="МАЛАЯ ЛИНЗА Y"
                value={settings.smallLensYOffset}
                min={-240}
                max={420}
                step={1}
                format={(value) => `${Math.round(value)}PX`}
                onChange={(value) =>
                  setSettings((prev) => ({ ...prev, smallLensYOffset: value }))
                }
              />
              <ControlSlider
                label="БОЛЬШАЯ ЛИНЗА X"
                value={settings.largeLensXOffset}
                min={-1200}
                max={1200}
                step={1}
                format={(value) => `${Math.round(value)}PX`}
                onChange={(value) =>
                  setSettings((prev) => ({ ...prev, largeLensXOffset: value }))
                }
              />
              <ControlSlider
                label="БОЛЬШАЯ ЛИНЗА Y"
                value={settings.largeLensYOffset}
                min={-600}
                max={600}
                step={1}
                format={(value) => `${Math.round(value)}PX`}
                onChange={(value) =>
                  setSettings((prev) => ({ ...prev, largeLensYOffset: value }))
                }
              />
            </div>
          ) : null}

          {activeTab === "size" ? (
            <div className="lens-controls-group">
              <ControlSlider
                label="МАЛАЯ ЛИНЗА"
                value={settings.smallLensSize}
                min={180}
                max={900}
                step={1}
                format={(value) => `${Math.round(value)}PX`}
                onChange={(value) =>
                  setSettings((prev) => ({ ...prev, smallLensSize: value }))
                }
              />
              <ControlSlider
                label="БОЛЬШАЯ ЛИНЗА"
                value={settings.largeLensSize}
                min={240}
                max={2000}
                step={1}
                format={(value) => `${Math.round(value)}PX`}
                onChange={(value) =>
                  setSettings((prev) => ({ ...prev, largeLensSize: value }))
                }
              />
            </div>
          ) : null}

          {activeTab === "distortion" ? (
            <div className="lens-controls-group">
              <ControlSlider
                label="REFRACTION"
                value={settings.refraction}
                min={0}
                max={0.12}
                step={0.001}
                onChange={(value) =>
                  setSettings((prev) => ({ ...prev, refraction: value }))
                }
              />
              <ControlSlider
                label="DEPTH"
                value={settings.depth}
                min={0}
                max={0.5}
                step={0.001}
                onChange={(value) =>
                  setSettings((prev) => ({ ...prev, depth: value }))
                }
              />
              <ControlSlider
                label="DISPARSION"
                value={settings.dispersion}
                min={0}
                max={5}
                step={0.001}
                onChange={(value) =>
                  setSettings((prev) => ({ ...prev, dispersion: value }))
                }
              />
              <ControlSlider
                label="РАДИУС ИСКАЖЕНИЯ"
                value={settings.distortionRadius}
                min={0.2}
                max={1.5}
                step={0.001}
                onChange={(value) =>
                  setSettings((prev) => ({ ...prev, distortionRadius: value }))
                }
              />
              <div className="lens-controls-inline">
                <ControlSlider
                  label="РАДИУС ЗАТЕМНЕНИЯ"
                  value={settings.shadowRadius}
                  min={0.2}
                  max={1.5}
                  step={0.001}
                  disabled={!settings.shadowEnabled}
                  onChange={(value) =>
                    setSettings((prev) => ({ ...prev, shadowRadius: value }))
                  }
                />
                <label className="lens-controls-checkbox">
                  <input
                    type="checkbox"
                    checked={!settings.shadowEnabled}
                    onChange={(event) =>
                      setSettings((prev) => ({
                        ...prev,
                        shadowEnabled: !event.currentTarget.checked,
                      }))
                    }
                  />
                  <span>OFF</span>
                </label>
              </div>
              <ControlSlider
                label="BLUR"
                value={settings.blur}
                min={0}
                max={2}
                step={0.001}
                onChange={(value) =>
                  setSettings((prev) => ({ ...prev, blur: value }))
                }
              />
              <ControlSlider
                label="УГОЛ ГРАДИЕНТА"
                value={settings.gradientAngle}
                min={0}
                max={360}
                step={1}
                format={(value) => `${Math.round(value)}DEG`}
                onChange={(value) =>
                  setSettings((prev) => ({ ...prev, gradientAngle: value }))
                }
              />
            </div>
          ) : null}

          <div className="lens-controls-panel__hint">
            Сохраняется отдельно для текущего адаптива.
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <section
        ref={heroRef}
        className="relative isolate overflow-hidden bg-background text-foreground dark"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-30 mix-blend-exclusion">
            <div className="absolute inset-[0_0_0.12%_0] overflow-hidden">
              <img
                alt=""
                aria-hidden="true"
                src={HERO_BACKGROUND_IMAGE}
                className="absolute"
                style={heroBackgroundImageStyle}
              />
            </div>
          </div>
          <div className="hero-background-noise" />
          <div className="hero-background-fade" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1512px] flex-col px-5 pb-10 pt-10 md:px-8 xl:px-14">
          <div className="relative z-20 flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <InfiniteLogoMarquee logos={logos} />

            <div
              data-lens-hide="true"
              className="w-full max-w-[312px] text-left xl:pt-0.5 xl:text-right"
            >
              <p className="font-heading text-[24px] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-foreground">
                <span className="text-muted-foreground">120+ клиентов </span>
                19 лет опыта
              </p>
              <p className="font-heading text-[24px] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-foreground">
                в бизнес-моделировании
              </p>
            </div>
          </div>

          <div className="relative flex flex-1 flex-col justify-center gap-[44px] py-8">
            <div ref={wordmarkRef} className="relative z-0 w-full">
              <Image
                src="/text_logo_dark_background_en.svg"
                alt="Rocketmind"
                width={1600}
                height={267}
                priority
                className="mx-auto h-auto w-full max-w-none"
              />
            </div>

            <div
              ref={glassRef}
              aria-hidden="true"
              data-lens-ignore="true"
              className="round-glass-lens pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={smallLensStyle}
            >
              <canvas
                ref={lensCanvasRef}
                aria-hidden="true"
                className="round-glass-lens-canvas"
              />
            </div>

            <div
              ref={staticGlassRef}
              aria-hidden="true"
              data-lens-ignore="true"
              className="round-glass-lens round-glass-lens--static pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={largeLensStyle}
            />

            <div data-lens-hide="true" className="relative z-30">
              <RocketmindMenu className="flex w-full flex-wrap items-center justify-end gap-x-12 gap-y-4 text-right" />
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,888px)_212px] lg:items-end lg:justify-between">
            <div className="flex flex-col items-start gap-10">
              <h1 className="w-full max-w-[888px] font-heading text-[52px] font-bold uppercase leading-[1.08] tracking-[-0.02em]">
                <span className="block text-foreground">Помогаем бизнесу расти</span>
                <span className="block text-foreground">и масштабироваться</span>
                <span
                  className="hero-rotating-line-viewport relative block text-muted-foreground"
                  style={heroRotatingLineViewportStyle}
                >
                  <AnimatePresence initial={false}>
                    <motion.p
                      key={activeRotatingLineIndex}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{
                        delay: HERO_ROTATION_ENTRY_DELAY_MS / 1000,
                        duration: HERO_ROTATION_TRANSITION_MS / 1000,
                        ease: [0.23, 1, 0.32, 1],
                      }}
                      className="absolute inset-x-0 top-0 whitespace-nowrap"
                    >
                      {rocketmindHeroRotatingLines[activeRotatingLineIndex]}
                    </motion.p>
                  </AnimatePresence>
                </span>
              </h1>

              <Link
                href="#contact"
                className="inline-flex items-center gap-3 font-heading text-[24px] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-foreground transition-[opacity,color] duration-150 hover:opacity-88"
              >
                <span>Обсудить стратегию</span>
                <ArrowRight size={18} strokeWidth={2.1} />
              </Link>
            </div>

            <div className="flex flex-col items-start gap-5 self-end lg:items-end">
              <Image
                src="/hero-art/pik-logo.svg"
                alt="Platform Innovation Kit"
                width={200}
                height={45}
                className="h-[45px] w-[200px]"
              />
              <p
                className="w-full max-w-[200px] text-right font-mono text-[14px] uppercase leading-[1.32] tracking-[0.01em] text-muted-foreground"
                style={platformTextStyle}
              >
                Развиваем методологию
                <br />
                и представляем PIK
                <br />
                в России и странах Азии
              </p>
            </div>
          </div>
        </div>
      </section>
      {controls}
    </>
  );
}
