import React, { useEffect, useRef } from "react";
import { Application } from "pixi.js";
import { useAssetsLoader } from "../hooks/useAssetsLoader";
import SpinningGame from "./SpinningGame";

const CanvasWrapper: React.FC = () => {
  const pixiContainer = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const gameRef = useRef<SpinningGame | null>(null);

  useEffect(() => {
    const setup = async () => {
      if (!pixiContainer.current) return;

      const app = new Application({
        resizeTo: window,
        backgroundAlpha: 0,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        width:window.innerWidth,
        height:window.innerHeight,
      });

      appRef.current = app;
      pixiContainer.current.appendChild(app.view as HTMLCanvasElement);

      await useAssetsLoader();

      gameRef.current = new SpinningGame(app);
      gameRef.current.init();
    // };

   setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 50);
  };

  setup();

    return () => {
      gameRef.current?.destroy();
      appRef.current?.destroy(true, { children: true });
    };
  }, []);

  return (
    <div
      ref={pixiContainer}
      style={{ overflow:"hidden"}}
    />
  );
};

export default CanvasWrapper;
