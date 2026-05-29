import { useEffect, useRef } from "react";
import "./styles/Cursor.css";
import gsap from "gsap";

const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let hover = false;

    // ⚡ Performance Optimization: Use quickTo for hardware-accelerated transforms
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.3, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.3, ease: "power3.out" });

    const handleMouseMove = (e: MouseEvent) => {
      if (!hover) {
        xTo(e.clientX);
        yTo(e.clientY);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    const elements = document.querySelectorAll("[data-cursor]");
    elements.forEach((item) => {
      const element = item as HTMLElement;

      const handleMouseOver = (e: MouseEvent) => {
        const target = e.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();

        if (element.dataset.cursor === "icons") {
          cursor.classList.add("cursor-icons");
          hover = true;
          gsap.to(cursor, {
            x: rect.left,
            y: rect.top,
            duration: 0.2,
            ease: "power2.out",
          });
          cursor.style.setProperty("--cursorH", `${rect.height}px`);
        }
        if (element.dataset.cursor === "disable") {
          cursor.classList.add("cursor-disable");
        }
      };

      const handleMouseOut = () => {
        cursor.classList.remove("cursor-disable", "cursor-icons");
        hover = false;
      };

      element.addEventListener("mouseover", handleMouseOver);
      element.addEventListener("mouseout", handleMouseOut);
    });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      elements.forEach((item) => {
        item.removeEventListener("mouseover", () => {});
        item.removeEventListener("mouseout", () => {});
      });
    };
  }, []);

  return <div className="cursor-main" ref={cursorRef}></div>;
};

export default Cursor;
