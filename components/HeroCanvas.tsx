"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 130;
const SPREAD = 4.2;
const CONNECT_THRESHOLD = 2.3;

export function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.z = 9;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const vecs: THREE.Vector3[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = SPREAD * (0.55 + Math.random() * 0.45);
      vecs.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      ));
    }

    const ptArr = new Float32Array(vecs.flatMap(v => [v.x, v.y, v.z]));
    const ptGeo = new THREE.BufferGeometry();
    ptGeo.setAttribute("position", new THREE.BufferAttribute(ptArr, 3));
    const ptMat = new THREE.PointsMaterial({ size: 0.055, color: 0x0A0A0A, transparent: true, opacity: 0.55, sizeAttenuation: true });
    const ptsMesh = new THREE.Points(ptGeo, ptMat);

    const lineArr: number[] = [];
    for (let i = 0; i < vecs.length; i++) {
      for (let j = i + 1; j < vecs.length; j++) {
        if (vecs[i].distanceTo(vecs[j]) < CONNECT_THRESHOLD) {
          lineArr.push(vecs[i].x, vecs[i].y, vecs[i].z, vecs[j].x, vecs[j].y, vecs[j].z);
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(lineArr), 3));
    const lineMat = new THREE.LineBasicMaterial({ color: 0x0A0A0A, transparent: true, opacity: 0.07 });
    const linesMesh = new THREE.LineSegments(lineGeo, lineMat);

    const group = new THREE.Group();
    group.add(ptsMesh, linesMesh);
    scene.add(group);

    let targetX = 0, targetY = 0;
    const onMove = (e: MouseEvent) => {
      targetX = (e.clientY / window.innerHeight - 0.5) * 0.45;
      targetY = (e.clientX / window.innerWidth  - 0.5) * 0.75;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener("resize", onResize);

    let rafId: number;
    let last = performance.now();
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      const now = performance.now();
      const dt  = Math.min((now - last) / 1000, 0.05);
      last = now;
      group.rotation.y += dt * 0.07;
      group.rotation.x += (targetX - group.rotation.x) * 0.028;
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      ptGeo.dispose(); ptMat.dispose();
      lineGeo.dispose(); lineMat.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" />;
}
