"use client";

import { useEffect, useRef } from "react";
import imageData from "./map.png";
import Image from "next/image";

export const Map = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const draw = (
    canvas: HTMLCanvasElement,
    scale: number,
    translatePos: { x: number; y: number }
  ) => {
    const context = canvas.getContext("2d");
    if (!context) return;

    const img = imageRef.current;

    if (!img) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.save();

    context.translate(translatePos.x, translatePos.y);
    context.scale(scale, scale);
    context.drawImage(img, 0, 0);

    context.restore();
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    const translatePos = {
      x: 0, //canvas.width / 2,
      y: 0, // canvas.height / 2,
    };

    let scale = 1.0;
    const scaleMultiplier = 0.8;
    const startDragOffset = { x: 0, y: 0 };
    let mouseDown = false;

    canvas.addEventListener("wheel", (e) => {
      if (e.deltaY > 0) scale *= scaleMultiplier;
      else scale /= scaleMultiplier;

      draw(canvas, scale, translatePos);
    });

    canvas.addEventListener("mousedown", (e) => {
      mouseDown = true;
      startDragOffset.x = e.clientX - translatePos.x;
      startDragOffset.y = e.clientY - translatePos.y;
    });

    canvas.addEventListener("mouseup", () => {
      mouseDown = false;
    });

    canvas.addEventListener("mouseover", () => {
      mouseDown = false;
    });

    canvas.addEventListener("mouseout", () => {
      mouseDown = false;
    });

    canvas.addEventListener("mousemove", (e) => {
      if (!mouseDown) return;

      translatePos.x = e.clientX - startDragOffset.x;
      translatePos.y = e.clientY - startDragOffset.y;
      draw(canvas, scale, translatePos);
    });

    draw(canvas, scale, translatePos);
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <Image
        ref={imageRef}
        className="hidden"
        src={imageData}
        alt=""
        priority
        loading="eager"
      />
    </>
  );
};
