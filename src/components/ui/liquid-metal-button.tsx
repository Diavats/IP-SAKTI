"use client";

// Adapted from 21st.dev "Liquid Metal Button" (johuniq), built on
// @paper-design/shaders. Two deliberate deviations from the source:
//  - label color #666666 -> #FFFFFF (source was 2.9:1 on the black fill,
//    fails WCAG AA; white clears 4.5:1 with the same text-shadow)
//  - idle shader speed 0.6 -> 0 (source kept the shader rendering at all
//    times; 0 fully stops the rAF loop until hover/click, per ShaderMount's
//    own docs: "If set to 0, rAF will stop entirely so static shaders have
//    no recurring performance costs")
// Single-instance component: mount this for the Ask Sahayak button only.
// A second shader canvas on the page will noticeably slow the app down.
import { liquidMetalFragmentShader, ShaderMount } from "@paper-design/shaders";
import { Sparkles } from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

interface LiquidMetalButtonProps {
  label?: string;
  onClick?: () => void;
  viewMode?: "text" | "icon";
}

const IDLE_SPEED = 0;
const HOVER_SPEED = 1;
const CLICK_SPEED = 2.4;

export function LiquidMetalButton({
  label = "Get Started",
  onClick,
  viewMode = "text",
}: LiquidMetalButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const shaderRef = useRef<HTMLDivElement>(null);
  const shaderMount = useRef<ShaderMount | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleId = useRef(0);

  const dimensions = useMemo(() => {
    if (viewMode === "icon") {
      return { width: 46, height: 46, innerWidth: 42, innerHeight: 42, shaderWidth: 46, shaderHeight: 46 };
    }
    return { width: 172, height: 46, innerWidth: 168, innerHeight: 42, shaderWidth: 172, shaderHeight: 46 };
  }, [viewMode]);

  useEffect(() => {
    const styleId = "liquid-metal-button-style";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .liquid-metal-button-shader canvas {
          width: 100% !important;
          height: 100% !important;
          display: block !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          border-radius: 100px !important;
        }
        @keyframes liquid-metal-ripple {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    if (shaderRef.current) {
      shaderMount.current?.dispose();
      shaderMount.current = new ShaderMount(
        shaderRef.current,
        liquidMetalFragmentShader,
        {
          u_repetition: 4,
          u_softness: 0.5,
          u_shiftRed: 0.3,
          u_shiftBlue: 0.3,
          u_distortion: 0,
          u_contour: 0,
          u_angle: 45,
          u_scale: 8,
          u_shape: 1,
          u_offsetX: 0.1,
          u_offsetY: -0.1,
        },
        undefined,
        IDLE_SPEED
      );
    }

    return () => {
      shaderMount.current?.dispose();
      shaderMount.current = null;
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    shaderMount.current?.setSpeed(HOVER_SPEED);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
    shaderMount.current?.setSpeed(IDLE_SPEED);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    shaderMount.current?.setSpeed(CLICK_SPEED);
    window.setTimeout(() => {
      shaderMount.current?.setSpeed(isHovered ? HOVER_SPEED : IDLE_SPEED);
    }, 300);

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const ripple = { x: e.clientX - rect.left, y: e.clientY - rect.top, id: rippleId.current++ };
      setRipples((prev) => [...prev, ripple]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }, 600);
    }

    onClick?.();
  };

  return (
    <div className="relative inline-block" style={{ perspective: "1000px", perspectiveOrigin: "50% 50%" }}>
      <div
        style={{
          position: "relative",
          width: dimensions.width,
          height: dimensions.height,
          transformStyle: "preserve-3d",
          transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            transform: "translateZ(20px)",
            zIndex: 30,
            pointerEvents: "none",
          }}
        >
          {viewMode === "icon" ? (
            <Sparkles
              size={16}
              style={{ color: "#FFFFFF", filter: "drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.5))" }}
            />
          ) : (
            <span
              style={{
                fontSize: 14,
                color: "#FFFFFF",
                fontWeight: 500,
                textShadow: "0px 1px 2px rgba(0, 0, 0, 0.5)",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </span>
          )}
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            transformStyle: "preserve-3d",
            transform: `translateZ(10px) ${isPressed ? "translateY(1px) scale(0.98)" : "translateY(0) scale(1)"}`,
            zIndex: 20,
          }}
        >
          <div
            style={{
              width: dimensions.innerWidth,
              height: dimensions.innerHeight,
              margin: 2,
              borderRadius: 100,
              background: "linear-gradient(180deg, #202020 0%, #000000 100%)",
              boxShadow: isPressed
                ? "inset 0px 2px 4px rgba(0, 0, 0, 0.4), inset 0px 1px 2px rgba(0, 0, 0, 0.3)"
                : "none",
              transition: "box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `translateZ(0px) ${isPressed ? "translateY(1px) scale(0.98)" : "translateY(0) scale(1)"}`,
            zIndex: 10,
          }}
        >
          <div
            style={{
              height: dimensions.height,
              width: dimensions.width,
              borderRadius: 100,
              boxShadow: isPressed
                ? "0px 0px 0px 1px rgba(0, 0, 0, 0.5), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)"
                : isHovered
                  ? "0px 0px 0px 1px rgba(0, 0, 0, 0.4), 0px 12px 6px 0px rgba(0, 0, 0, 0.05), 0px 8px 5px 0px rgba(0, 0, 0, 0.1), 0px 4px 4px 0px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.2)"
                  : "0px 0px 0px 1px rgba(0, 0, 0, 0.3), 0px 36px 14px 0px rgba(0, 0, 0, 0.02), 0px 20px 12px 0px rgba(0, 0, 0, 0.08), 0px 9px 9px 0px rgba(0, 0, 0, 0.12), 0px 2px 5px 0px rgba(0, 0, 0, 0.15)",
              transition: "box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
              background: "rgb(0 0 0 / 0)",
            }}
          >
            <div
              ref={shaderRef}
              className="liquid-metal-button-shader"
              style={{
                borderRadius: 100,
                overflow: "hidden",
                position: "relative",
                width: dimensions.shaderWidth,
                maxWidth: dimensions.shaderWidth,
                height: dimensions.shaderHeight,
              }}
            />
          </div>
        </div>

        <button
          ref={buttonRef}
          type="button"
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          style={{
            position: "absolute",
            inset: 0,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            outline: "none",
            zIndex: 40,
            transformStyle: "preserve-3d",
            transform: "translateZ(25px)",
            overflow: "hidden",
            borderRadius: 100,
          }}
          aria-label={label}
        >
          {ripples.map((ripple) => (
            <span
              key={ripple.id}
              style={{
                position: "absolute",
                left: ripple.x,
                top: ripple.y,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 70%)",
                pointerEvents: "none",
                animation: "liquid-metal-ripple 0.6s ease-out",
              }}
            />
          ))}
        </button>
      </div>
    </div>
  );
}
