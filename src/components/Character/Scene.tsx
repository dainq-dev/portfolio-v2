import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingContext";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";
import { setCharTimeline, setAllTimeline } from "../utils/GsapScroll";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const { setLoading } = useLoading();

  const [character, setChar] = useState<THREE.Object3D | null>(null);
  const isCanvasVisible = useRef(true);

  useEffect(() => {
    let isMounted = true;
    let observer: IntersectionObserver | null = null;
    let animationFrameId: number;
    let cleanupHover: (() => void) | null = null;
    const ctx = gsap.context(() => {});

    if (canvasDiv.current) {
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          isCanvasVisible.current = entry.isIntersecting;
        }
      }, { threshold: 0 });
      observer.observe(canvasDiv.current);
    }

    if (canvasDiv.current) {
      const containerElement = canvasDiv.current;
      let rect = containerElement.getBoundingClientRect();
      let container = { width: rect.width, height: rect.height };
      const aspect = container.width / container.height;
      const scene = new THREE.Scene();

      const pixelRatio = Math.min(window.devicePixelRatio, 2);
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: pixelRatio < 1.5, // ⚡ Save ~40% GPU fragment overhead on Retina/High-DPI screens
      });
      renderer.setSize(container.width, container.height);
      renderer.setPixelRatio(pixelRatio);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;

      const canvasElement = renderer.domElement;
      containerElement.appendChild(canvasElement);

      const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
      camera.position.z = 10;
      camera.position.set(0, 13.1, 24.7);
      camera.zoom = aspect < 1 ? Math.max(0.4, 0.75 * aspect) : 0.75;
      camera.updateProjectionMatrix();

      let headBone: THREE.Object3D | null = null;
      let screenLight: any | null = null;
      let mixer: THREE.AnimationMixer;

      const clock = new THREE.Clock();

      const light = setLighting(scene);
      let progress = setProgress((value) => setLoading(value));
      const { loadCharacter } = setCharacter(renderer, scene, camera);

      const onResize = () => handleResize(renderer, camera, canvasDiv);

      loadCharacter().then((gltf) => {
        if (!isMounted) return;
        if (gltf) {
          const animations = setAnimations(gltf);
          if (hoverDivRef.current) {
            cleanupHover = animations.hover(gltf, hoverDivRef.current);
          }
          mixer = animations.mixer;
          let character = gltf.scene;
          setChar(character);
          scene.add(character);
          headBone = character.getObjectByName("spine006") || null;
          screenLight = character.getObjectByName("screenlight") || null;

          progress.loaded().then(() => {
            if (!isMounted) return;
            setTimeout(() => {
              if (!isMounted) return;
              ctx.add(() => {
                light.turnOnLights();
                animations.startIntro();
              });
            }, 2500);
          });

          ctx.add(() => {
            setCharTimeline(character, camera);
            setAllTimeline();
          });

          window.addEventListener("resize", onResize);
        }
      });

      let mouse = { x: 0, y: 0 },
        interpolation = { x: 0.1, y: 0.2 };

      const onMouseMove = (event: MouseEvent) => {
        handleMouseMove(event, (x, y) => {
          mouse = { x, y };
        });
      };

      let debounce: any;
      let touchDebounce: any;

      const onTouchStart = (event: TouchEvent) => {
        const element = event.target as HTMLElement;
        touchDebounce = setTimeout(() => {
          element?.addEventListener("touchmove", (e: TouchEvent) =>
            handleTouchMove(e, (x, y) => {
              mouse = { x, y };
            })
          );
        }, 200);
      };

      const onTouchEnd = () => {
        handleTouchEnd((x, y, interpolationX, interpolationY) => {
          mouse = { x, y };
          interpolation = { x: interpolationX, y: interpolationY };
        });
      };

      document.addEventListener("mousemove", onMouseMove);

      const landingDiv = document.querySelector(".landing-section");
      if (landingDiv) {
        landingDiv.addEventListener("touchstart", onTouchStart);
        landingDiv.addEventListener("touchend", onTouchEnd);
      }

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        // ⚡ Performance Optimization: Zero-layout-thrashing off-screen pause check
        if (!isCanvasVisible.current) {
          return;
        }

        if (headBone) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp
          );
          light.setPointLight(screenLight);
        }
        const delta = clock.getDelta();
        if (mixer) {
          mixer.update(delta);
        }
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        isMounted = false;
        ctx.revert();
        if (cleanupHover) {
          cleanupHover();
        }
        cancelAnimationFrame(animationFrameId);
        clearTimeout(debounce);
        clearTimeout(touchDebounce);
        scene.clear();
        renderer.dispose();
        window.removeEventListener("resize", onResize);
        if (containerElement && containerElement.contains(canvasElement)) {
          containerElement.removeChild(canvasElement);
        }
        document.removeEventListener("mousemove", onMouseMove);
        if (landingDiv) {
          landingDiv.removeEventListener("touchstart", onTouchStart);
          landingDiv.removeEventListener("touchend", onTouchEnd);
        }
        if (observer) {
          observer.disconnect();
        }
      };
    }
  }, []);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;
