import { useEffect, useRef } from "react";
import "./styles/Cursor.css";
import gsap from "gsap";

const Cursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRef = useRef<HTMLSpanElement>(null);

  const ringsData: { size: number; className: string }[] = [
    { size: 36, className: "cursor-ring-0" },
    { size: 30, className: "cursor-ring-1" },
    { size: 24, className: "cursor-ring-2" },
    { size: 19, className: "cursor-ring-3" },
    { size: 14, className: "cursor-ring-4" },
    { size: 10, className: "cursor-ring-5" },
  ];

  useEffect(() => {
    // Query elements directly from the DOM to ensure we animate the active mounted nodes
    const dot = document.querySelector(".cursor-dot") as HTMLDivElement;
    const rings = Array.from(document.querySelectorAll(".cursor-ring")) as HTMLDivElement[];
    const label = document.querySelector(".cursor-label") as HTMLSpanElement;

    if (!dot || rings.length === 0) return;

    // Center all elements using GSAP's xPercent/yPercent and hide initially
    gsap.set([dot, ...rings], { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 });

    let mouseX = 0;
    let mouseY = 0;
    let isHoveringSnap = false;
    let isInteractiveHover = false;
    let hasMouseMoved = false;
    let currentHoveredElement: HTMLElement | null = null;
    let stationaryTimeout: any;
    let rippleTimeline: gsap.core.Timeline | null = null;

    // Track historical mouse coordinates for the snake trail
    // 60 coordinates in history for smooth lag distribution
    const history: { x: number; y: number }[] = Array(60).fill({ x: 0, y: 0 });

    // Function to trigger water ripple waves when stationary
    const startRippleEffect = (clientX: number, clientY: number) => {
      if (rippleTimeline) return;

      rippleTimeline = gsap.timeline({ repeat: -1 });

      rings.forEach((ring, index: number) => {
        // Position rings exactly at the current mouse position
        gsap.set(ring, {
          x: clientX,
          y: clientY,
          width: ringsData[index].size,
          height: ringsData[index].size,
          borderRadius: "50%",
          xPercent: -50,
          yPercent: -50,
          overwrite: "auto",
        });

        // Ripples expand and fade out
        rippleTimeline!.fromTo(
          ring,
          { scale: 0.1, opacity: 0.8 },
          {
            scale: 2.2 + index * 0.2,
            opacity: 0,
            duration: 1.5,
            ease: "power1.out",
          },
          index * 0.28 // Smooth concentric ripples
        );
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!hasMouseMoved) {
        gsap.to([dot, ...rings], { scale: 1, opacity: 0.6, duration: 0.3, overwrite: "auto" });
        hasMouseMoved = true;
      }

      mouseX = e.clientX;
      mouseY = e.clientY;

      // 1. Check if hovering an interactive element
      const target = e.target as HTMLElement;
      const interactive = target?.closest("a, button, [data-cursor], .clickable, input, textarea") as HTMLElement;

      // 2. Handle hover state entry/exit dynamically on mousemove
      if (interactive !== currentHoveredElement) {
        currentHoveredElement = interactive;

        if (interactive) {
          isInteractiveHover = true;

          // Kill active ripples
          if (rippleTimeline) {
            rippleTimeline.kill();
            rippleTimeline = null;
          }

          const cursorType = interactive.getAttribute("data-cursor");

          if (cursorType === "disable") {
            gsap.to([dot, ...rings], { scale: 0, duration: 0.2, overwrite: "auto" });
          } else if (cursorType === "view") {
            // Expand primary ring, hide the rest, and show label
            gsap.to(dot, { scale: 0, duration: 0.2, overwrite: "auto" });
            rings.slice(1).forEach((ring) => {
              gsap.to(ring, { scale: 0, opacity: 0, duration: 0.2, overwrite: "auto" });
            });

            gsap.to(rings[0], {
              scale: 2.2,
              backgroundColor: "rgba(194, 164, 255, 0.95)",
              borderColor: "#c2a4ff",
              boxShadow: "0 0 25px rgba(194, 164, 255, 0.45)",
              duration: 0.3,
              overwrite: "auto",
            });

            if (label) {
              label.textContent = "VIEW";
              gsap.to(label, { opacity: 1, scale: 1, duration: 0.2, delay: 0.05 });
            }
          } else if (cursorType === "icons" || interactive.closest("#social")) {
            // Snapping to social icons/nav
            const elementToSnap = interactive.tagName === "A" ? interactive : interactive.querySelector("a") || interactive;
            const rect = elementToSnap.getBoundingClientRect();
            
            isHoveringSnap = true;

            gsap.to(dot, { scale: 0, duration: 0.2, overwrite: "auto" });
            rings.slice(1).forEach((ring) => {
              gsap.to(ring, { scale: 0, opacity: 0, duration: 0.2, overwrite: "auto" });
            });

            gsap.to(rings[0], {
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2,
              width: rect.width + 12,
              height: rect.height + 12,
              scale: 1,
              borderRadius: "12px",
              borderColor: "#c2a4ff",
              backgroundColor: "rgba(194, 164, 255, 0.12)",
              boxShadow: "0 0 15px rgba(194, 164, 255, 0.2)",
              duration: 0.3,
              ease: "power2.out",
              overwrite: "auto",
            });
          } else {
            // Standard hover
            gsap.to(dot, { scale: 0.3, duration: 0.2, overwrite: "auto" });
            rings.slice(1).forEach((ring) => {
              gsap.to(ring, { scale: 0, opacity: 0, duration: 0.2, overwrite: "auto" });
            });

            gsap.to(rings[0], {
              scale: 1.5,
              backgroundColor: "rgba(194, 164, 255, 0.15)",
              borderColor: "#c2a4ff",
              boxShadow: "0 0 15px rgba(194, 164, 255, 0.25)",
              duration: 0.3,
              overwrite: "auto",
            });
          }
        } else {
          // Left interactive hover target: Reset to default trail mode
          isHoveringSnap = false;
          isInteractiveHover = false;

          gsap.to(dot, { scale: 1, duration: 0.25, overwrite: "auto" });

          rings.forEach((ring, idx) => {
            gsap.to(ring, {
              scale: 1,
              width: ringsData[idx].size,
              height: ringsData[idx].size,
              borderRadius: "50%",
              backgroundColor: "rgba(194, 164, 255, 0)",
              borderColor: "rgba(194, 164, 255, 0.45)",
              boxShadow: "0 0 20px rgba(194, 164, 255, 0)",
              opacity: 0.6 - idx * 0.08,
              duration: 0.3,
              overwrite: "auto",
            });
          });

          if (label) {
            gsap.to(label, { opacity: 0, scale: 0.6, duration: 0.2 });
          }
        }
      }

      // Kill the ripple timeline if mouse starts moving
      if (rippleTimeline) {
        rippleTimeline.kill();
        rippleTimeline = null;

        rings.forEach((ring, idx) => {
          gsap.set(ring, {
            scale: 1,
            opacity: 0.6 - idx * 0.08,
            borderRadius: "50%",
            width: ringsData[idx].size,
            height: ringsData[idx].size,
            xPercent: -50,
            yPercent: -50,
            overwrite: "auto",
          });
        });

        // Initialize history array with the current position so the snake tail moves smoothly from here
        history.fill({ x: e.clientX, y: e.clientY });
      }

      // 3. Stationary check to trigger ripples
      clearTimeout(stationaryTimeout);

      if (!isHoveringSnap && !isInteractiveHover) {
        stationaryTimeout = setTimeout(() => {
          startRippleEffect(e.clientX, e.clientY);
        }, 150);
      }
    };

    // The ticker function runs at 60fps / 120fps to track coordinates path history
    const tick = () => {
      // Add current mouse coordinates to the beginning of the history
      history.unshift({ x: mouseX, y: mouseY });
      history.pop();

      // Only follow history-based coordinates if the mouse has moved and we are not in stationary ripple mode
      if (hasMouseMoved && !rippleTimeline) {
        // Dot follows the mouse coordinates with a tiny, responsive delay (head of the snake)
        gsap.to(dot, {
          x: mouseX,
          y: mouseY,
          duration: 0.06,
          overwrite: "auto",
        });

        // Trailing rings follow historical coordinates (body segments of the snake)
        if (!isHoveringSnap && !isInteractiveHover) {
          rings.forEach((ring, index) => {
            // Space the delay of each body segment:
            // Ring 0: history[6]
            // Ring 1: history[13]
            // Ring 2: history[20]
            // Ring 3: history[27]
            // Ring 4: history[34]
            // Ring 5: history[41]
            const lagIndex = 6 + index * 7;
            const target = history[lagIndex] || history[history.length - 1];

            gsap.to(ring, {
              x: target.x,
              y: target.y,
              duration: 0.08, // Small smoothing duration so segments follow curves organically
              overwrite: "auto",
            });
          });
        }
      }
    };

    gsap.ticker.add(tick);

    // Fade cursor out on viewport exit
    const handleMouseLeaveViewport = () => {
      gsap.to([dot, ...rings], { scale: 0, opacity: 0, duration: 0.25, overwrite: "auto" });
    };

    const handleMouseEnterViewport = () => {
      gsap.to(dot, { scale: 1, opacity: 1, duration: 0.25, overwrite: "auto" });
      rings.forEach((ring, idx) => {
        gsap.to(ring, { scale: 1, opacity: 0.6 - idx * 0.08, duration: 0.25, overwrite: "auto" });
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeaveViewport);
    document.addEventListener("mouseenter", handleMouseEnterViewport);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeaveViewport);
      document.removeEventListener("mouseenter", handleMouseEnterViewport);
      gsap.ticker.remove(tick);
      clearTimeout(stationaryTimeout);
      if (rippleTimeline) rippleTimeline.kill();
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dotRef}></div>
      {ringsData.map((ring, index) => (
        <div
          key={index}
          className={`cursor-ring ${ring.className}`}
          style={{ width: `${ring.size}px`, height: `${ring.size}px` }}
          ref={(el) => {
            ringRefs.current[index] = el;
          }}
        >
          {index === 0 && <span className="cursor-label" ref={labelRef}></span>}
        </div>
      ))}
    </>
  );
};

export default Cursor;
