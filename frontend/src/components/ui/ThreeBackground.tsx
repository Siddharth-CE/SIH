import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scene & Camera setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0c3027, 0.003);

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
    renderer.setClearColor(0x0b2d24, 1);
    currentMount.appendChild(renderer.domElement);

    // =========================================================================
    // 1. NEURAL COGNITIVE SYNAPSE NETWORK (Subtle memory nodes & connection lines)
    // =========================================================================
    const nodeCount = 75;
    const maxConnectionDistance = 38;
    const nodePositions: THREE.Vector3[] = [];
    const nodeVelocities: THREE.Vector3[] = [];

    // Node geometry & colors (Warm Amber, Emerald Mint & Azure memory nodes)
    const nodeGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(nodeCount * 3);
    const colorArray = new Float32Array(nodeCount * 3);

    const cAmber = new THREE.Color(0xf59e0b); // Amber memory synapse
    const cEmerald = new THREE.Color(0x34d399); // Mint healing node
    const cCyan = new THREE.Color(0x38bdf8); // Focus azure node

    for (let i = 0; i < nodeCount; i++) {
      const x = (Math.random() - 0.5) * 160;
      const y = (Math.random() - 0.5) * 110;
      const z = (Math.random() - 0.5) * 80;

      nodePositions.push(new THREE.Vector3(x, y, z));
      nodeVelocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.04,
          (Math.random() - 0.5) * 0.03,
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
      size: 4.5,
      map: nodeTexture,
      transparent: true,
      opacity: 0.75,
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
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // =========================================================================
    // 2. GENTLE FLOATING NORTHEAST TEA PETALS / BOTANICAL LEAVES
    // =========================================================================
    const petalCount = 35;
    const petalGeometry = new THREE.BufferGeometry();
    const petalPositions = new Float32Array(petalCount * 3);
    const petalColors = new Float32Array(petalCount * 3);
    const petalVelocities: THREE.Vector3[] = [];

    const teaLeafColor = new THREE.Color(0x34d399); // Assam tea garden green
    const orchidColor = new THREE.Color(0xf472b6); // Kopou orchid blossom pink

    for (let i = 0; i < petalCount; i++) {
      petalPositions[i * 3] = (Math.random() - 0.5) * 170;
      petalPositions[i * 3 + 1] = Math.random() * 120 - 60;
      petalPositions[i * 3 + 2] = (Math.random() - 0.5) * 90;

      const pCol = i % 5 === 0 ? orchidColor : teaLeafColor;
      petalColors[i * 3] = pCol.r;
      petalColors[i * 3 + 1] = pCol.g;
      petalColors[i * 3 + 2] = pCol.b;

      petalVelocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.03,
          -0.03 - Math.random() * 0.04, // Gentle downward drift
          (Math.random() - 0.5) * 0.02
        )
      );
    }

    petalGeometry.setAttribute('position', new THREE.BufferAttribute(petalPositions, 3));
    petalGeometry.setAttribute('color', new THREE.BufferAttribute(petalColors, 3));

    const petalMaterial = new THREE.PointsMaterial({
      size: 3.8,
      map: nodeTexture,
      transparent: true,
      opacity: 0.45,
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
    let targetCameraX = 0;
    let targetCameraY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
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

      // Gentle camera parallax
      targetCameraX += (mouseX * 8 - targetCameraX) * 0.03;
      targetCameraY += (-mouseY * 6 - targetCameraY) * 0.03;
      camera.position.x = targetCameraX;
      camera.position.y = targetCameraY;
      camera.lookAt(0, 0, 0);

      if (!prefersReducedMotion) {
        // Update Neural Synapse Nodes
        const posAttr = nodeGeometry.attributes.position as THREE.BufferAttribute;
        let lineVertexCount = 0;

        for (let i = 0; i < nodeCount; i++) {
          const pos = nodePositions[i];
          const vel = nodeVelocities[i];

          pos.add(vel);

          // Boundary bounds bounce
          if (pos.x < -80 || pos.x > 80) vel.x = -vel.x;
          if (pos.y < -55 || pos.y > 55) vel.y = -vel.y;
          if (pos.z < -40 || pos.z > 40) vel.z = -vel.z;

          // Subtle organic wave float
          const floatY = pos.y + Math.sin(time * 0.8 + i * 0.5) * 0.04;

          posAttr.setXYZ(i, pos.x, floatY, pos.z);

          // Connect Synapse lines to neighboring nodes
          for (let j = i + 1; j < nodeCount; j++) {
            const pos2 = nodePositions[j];
            const dist = pos.distanceTo(pos2);

            if (dist < maxConnectionDistance) {
              const alpha = (1 - dist / maxConnectionDistance) * 0.55;

              const idx = lineVertexCount * 3;
              linePositions[idx] = pos.x;
              linePositions[idx + 1] = floatY;
              linePositions[idx + 2] = pos.z;

              linePositions[idx + 3] = pos2.x;
              linePositions[idx + 4] = pos2.y;
              linePositions[idx + 5] = pos2.z;

              // Amber-emerald blend
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

        // Update Botanical Floating Petals
        const petalPosAttr = petalGeometry.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < petalCount; i++) {
          let px = petalPositions[i * 3];
          let py = petalPositions[i * 3 + 1];
          let pz = petalPositions[i * 3 + 2];

          const vel = petalVelocities[i];
          py += vel.y;
          px += vel.x + Math.sin(time * 0.6 + i) * 0.03;

          // Reset if below view
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
      ref={mountRef}
      className="fixed inset-0 pointer-events-none -z-20 overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 50% 30%, #114237 0%, #0c332a 50%, #08241e 100%)',
      }}
      aria-hidden="true"
    />
  );
};
