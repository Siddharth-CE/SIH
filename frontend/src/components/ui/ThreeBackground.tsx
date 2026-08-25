import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const BG_IMAGE_URL =
  'https://images.unsplash.com/photo-1667832273606-c4a9e46c7d1a?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8M2QlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww';

export const ThreeBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Preload background image
  useEffect(() => {
    const img = new Image();
    img.src = BG_IMAGE_URL;
    img.onload = () => setImageLoaded(true);
  }, []);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Setup Three.js WebGL Overlay for Floating Synaptic Depth
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      1,
      800
    );
    camera.position.set(0, 0, 110);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Pure transparent so moving 3D image shines through
    currentMount.appendChild(renderer.domElement);

    // =========================================================================
    // 1. NEURAL COGNITIVE SYNAPSE NODES & FILAMENTS OVERLAY
    // =========================================================================
    const nodeCount = 55;
    const maxConnectionDistance = 34;
    const nodePositions: THREE.Vector3[] = [];
    const nodeVelocities: THREE.Vector3[] = [];

    const nodeGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(nodeCount * 3);
    const colorArray = new Float32Array(nodeCount * 3);

    const cAmber = new THREE.Color(0xf59e0b); // Amber memory synapse
    const cEmerald = new THREE.Color(0x34d399); // Mint healing node
    const cCyan = new THREE.Color(0x38bdf8); // Focus azure node

    for (let i = 0; i < nodeCount; i++) {
      const x = (Math.random() - 0.5) * 160;
      const y = (Math.random() - 0.5) * 110;
      const z = (Math.random() - 0.5) * 70;

      nodePositions.push(new THREE.Vector3(x, y, z));
      nodeVelocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.035,
          (Math.random() - 0.5) * 0.025,
          (Math.random() - 0.5) * 0.02
        )
      );

      posArray[i * 3] = x;
      posArray[i * 3 + 1] = y;
      posArray[i * 3 + 2] = z;

      const col = i % 4 === 0 ? cAmber : i % 2 === 0 ? cEmerald : cCyan;
      colorArray[i * 3] = col.r;
      colorArray[i * 3 + 1] = col.g;
      colorArray[i * 3 + 2] = col.b;
    }

    nodeGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    nodeGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    // Smooth circular glowing sprite for neural nodes
    const nodeCanvas = document.createElement('canvas');
    nodeCanvas.width = 64;
    nodeCanvas.height = 64;
    const nCtx = nodeCanvas.getContext('2d');
    if (nCtx) {
      const grad = nCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.25, 'rgba(52, 211, 153, 0.9)');
      grad.addColorStop(0.6, 'rgba(16, 185, 129, 0.3)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      nCtx.fillStyle = grad;
      nCtx.fillRect(0, 0, 64, 64);
    }
    const nodeTexture = new THREE.CanvasTexture(nodeCanvas);

    const nodeMaterial = new THREE.PointsMaterial({
      size: 4.2,
      map: nodeTexture,
      transparent: true,
      opacity: 0.65,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const nodes = new THREE.Points(nodeGeometry, nodeMaterial);
    scene.add(nodes);

    // Dynamic connecting synaptic filaments (LineSegments)
    const maxLineSegments = (nodeCount * (nodeCount - 1)) / 2;
    const linePositions = new Float32Array(maxLineSegments * 6);
    const lineColors = new Float32Array(maxLineSegments * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // =========================================================================
    // 2. GENTLE FLOATING BOTANICAL / GLOWING MEMORY SPORES
    // =========================================================================
    const petalCount = 28;
    const petalGeometry = new THREE.BufferGeometry();
    const petalPositions = new Float32Array(petalCount * 3);
    const petalColors = new Float32Array(petalCount * 3);
    const petalVelocities: THREE.Vector3[] = [];

    const teaLeafColor = new THREE.Color(0x34d399); // Mint teal
    const orchidColor = new THREE.Color(0xf472b6); // Blossom orchid

    for (let i = 0; i < petalCount; i++) {
      petalPositions[i * 3] = (Math.random() - 0.5) * 170;
      petalPositions[i * 3 + 1] = Math.random() * 120 - 60;
      petalPositions[i * 3 + 2] = (Math.random() - 0.5) * 80;

      const pCol = i % 5 === 0 ? orchidColor : teaLeafColor;
      petalColors[i * 3] = pCol.r;
      petalColors[i * 3 + 1] = pCol.g;
      petalColors[i * 3 + 2] = pCol.b;

      petalVelocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.025,
          -0.02 - Math.random() * 0.03, // Gentle downward drift
          (Math.random() - 0.5) * 0.015
        )
      );
    }

    petalGeometry.setAttribute('position', new THREE.BufferAttribute(petalPositions, 3));
    petalGeometry.setAttribute('color', new THREE.BufferAttribute(petalColors, 3));

    const petalMaterial = new THREE.PointsMaterial({
      size: 3.5,
      map: nodeTexture,
      transparent: true,
      opacity: 0.4,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const petals = new THREE.Points(petalGeometry, petalMaterial);
    scene.add(petals);

    // =========================================================================
    // 3. MOUSE PARALLAX & ANIMATION LOOP
    // =========================================================================
    let mouseX = 0;
    let mouseY = 0;
    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      targetParallaxX = mouseX * 18; // Parallax shift amplitude
      targetParallaxY = mouseY * 14;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const onWindowResize = () => {
      if (!currentMount) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      // Smooth DOM parallax interpolation for the 3D moving background image
      currentParallaxX += (targetParallaxX - currentParallaxX) * 0.05;
      currentParallaxY += (targetParallaxY - currentParallaxY) * 0.05;

      if (parallaxRef.current && !prefersReducedMotion) {
        parallaxRef.current.style.transform = `translate3d(${currentParallaxX}px, ${currentParallaxY}px, 0) rotateX(${-currentParallaxY * 0.25}deg) rotateY(${currentParallaxX * 0.25}deg)`;
      }

      // Three.js camera parallax
      camera.position.x = currentParallaxX * 0.4;
      camera.position.y = -currentParallaxY * 0.3;
      camera.lookAt(0, 0, 0);

      if (!prefersReducedMotion) {
        // Update Neural Synapse Nodes
        const posAttr = nodeGeometry.attributes.position as THREE.BufferAttribute;
        let lineVertexCount = 0;

        for (let i = 0; i < nodeCount; i++) {
          const pos = nodePositions[i];
          const vel = nodeVelocities[i];

          pos.add(vel);

          // Boundary bounce
          if (pos.x < -80 || pos.x > 80) vel.x = -vel.x;
          if (pos.y < -55 || pos.y > 55) vel.y = -vel.y;
          if (pos.z < -35 || pos.z > 35) vel.z = -vel.z;

          const floatY = pos.y + Math.sin(time * 0.8 + i * 0.5) * 0.035;
          posAttr.setXYZ(i, pos.x, floatY, pos.z);

          // Connect filaments
          for (let j = i + 1; j < nodeCount; j++) {
            const pos2 = nodePositions[j];
            const dist = pos.distanceTo(pos2);

            if (dist < maxConnectionDistance) {
              const alpha = (1 - dist / maxConnectionDistance) * 0.48;

              const idx = lineVertexCount * 3;
              linePositions[idx] = pos.x;
              linePositions[idx + 1] = floatY;
              linePositions[idx + 2] = pos.z;

              linePositions[idx + 3] = pos2.x;
              linePositions[idx + 4] = pos2.y;
              linePositions[idx + 5] = pos2.z;

              lineColors[idx] = 0.2;
              lineColors[idx + 1] = 0.8 * alpha;
              lineColors[idx + 2] = 0.6 * alpha;

              lineColors[idx + 3] = 0.9 * alpha;
              lineColors[idx + 4] = 0.6 * alpha;
              lineColors[idx + 5] = 0.1;

              lineVertexCount += 2;
            }
          }
        }

        posAttr.needsUpdate = true;

        lineGeometry.setDrawRange(0, lineVertexCount);
        const lPosAttr = lineGeometry.attributes.position as THREE.BufferAttribute;
        const lColAttr = lineGeometry.attributes.color as THREE.BufferAttribute;
        lPosAttr.needsUpdate = true;
        lColAttr.needsUpdate = true;

        // Update Drifting Botanical Spores
        const petalPosAttr = petalGeometry.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < petalCount; i++) {
          let px = petalPositions[i * 3];
          let py = petalPositions[i * 3 + 1];
          let pz = petalPositions[i * 3 + 2];

          const vel = petalVelocities[i];
          py += vel.y;
          px += vel.x + Math.sin(time * 0.6 + i) * 0.025;

          if (py < -60) {
            py = 60;
            px = (Math.random() - 0.5) * 170;
          }

          petalPositions[i * 3] = px;
          petalPositions[i * 3 + 1] = py;
          petalPositions[i * 3 + 2] = pz;

          petalPosAttr.setXYZ(i, px, py, pz);
        }
        petalPosAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onWindowResize);
      cancelAnimationFrame(animationFrameId);

      nodeGeometry.dispose();
      nodeMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      petalGeometry.dispose();
      petalMaterial.dispose();
      nodeTexture.dispose();
      renderer.dispose();

      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none -z-20 overflow-hidden bg-[#071d18]"
      aria-hidden="true"
    >
      {/* 3D Moving Image Stage with Perspective */}
      <div
        ref={parallaxRef}
        className="absolute -inset-16 w-[calc(100%+8rem)] h-[calc(100%+8rem)] transition-transform duration-75 ease-out will-change-transform"
        style={{ perspective: 1200 }}
      >
        {/* Layer 1: Primary Moving 3D Image */}
        <div
          className="absolute inset-0 bg-cover bg-center animate-bg-fluid"
          style={{
            backgroundImage: `url(${BG_IMAGE_URL})`,
            filter: 'saturate(1.25) contrast(1.15) brightness(0.82)',
            transformOrigin: 'center center',
          }}
        />

        {/* Layer 2: Counter-flowing 3D Organic Wave Shimmer */}
        <div
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay animate-bg-wave-counterflow"
          style={{
            backgroundImage: `url(${BG_IMAGE_URL})`,
            filter: 'hue-rotate(25deg) saturate(1.4) brightness(0.9)',
            transformOrigin: 'center center',
          }}
        />

        {/* Layer 3: Dynamic Caustic Light Sweep across 3D Ridges */}
        <div
          className="absolute -inset-1/2 w-[200%] h-[200%] pointer-events-none mix-blend-color-dodge animate-bg-shimmer"
          style={{
            background:
              'radial-gradient(ellipse 65% 45% at 50% 50%, rgba(52, 211, 153, 0.45) 0%, rgba(245, 158, 11, 0.25) 35%, rgba(6, 78, 59, 0) 70%)',
          }}
        />
      </div>

      {/* Layer 4: Ambient Atmosphere & Vignette for Contrast & Readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, rgba(12, 53, 44, 0.45) 0%, rgba(8, 36, 30, 0.78) 60%, rgba(4, 18, 15, 0.94) 100%)',
        }}
      />

      {/* Layer 5: Three.js Interactive Floating Synapses & Memory Spores */}
      <div
        ref={mountRef}
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: imageLoaded ? 1 : 0.6, transition: 'opacity 1s ease-in' }}
      />
    </div>
  );
};
