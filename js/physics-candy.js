/* ==========================================================================
   9. INTERACTIVE DRAGGABLE PHYSICS CANDY PLAYGROUND
   Authentic Ring Pop Candies Drop Animation & Collision Simulation
   Inspired by Manufactur / ringpopcandy.com (MFRFooterCandiesV3)
   ========================================================================== */

function createCandyPhysicsSimulator(containerElement, itemSelector) {
  if (!containerElement) return null;
  const candyElements = containerElement.querySelectorAll(itemSelector);
  if (!candyElements.length) return null;

  const G = 0.55;
  const AIR = 0.985;
  const BOUNCE_E = 0.38;
  const FLOOR_F = 0.85;

  let candies = [];
  let isDragging = false;
  let activeCandy = null;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let lastX = 0;
  let lastY = 0;
  let velX = 0;
  let velY = 0;
  let animId = null;
  let hasSpawned = false;

  // Normalized cluster offsets from center to reproduce exact pile from comp
  // Negative = left of center, Positive = right of center
  const CLUSTER_CONFIG = [
    { relX: -0.17, rot: -32, yOffset: 0 },    // 1: Yellow
    { relX: -0.11, rot: -18, yOffset: 8 },   // 2: Pink
    { relX: -0.03, rot: -8,  yOffset: 0 },    // 3: Orange
    { relX: -0.01, rot: 6,   yOffset: -44 },  // 4: Green (stacked tall in center)
    { relX: 0.06,  rot: 16,  yOffset: -34 },  // 5: Blue (stacked tall right of green)
    { relX: 0.12,  rot: 28,  yOffset: 4 },    // 6: Lime
    { relX: 0.19,  rot: 42,  yOffset: 0 }     // 7: Berry
  ];

  function spawn() {
    const boxW = containerElement.clientWidth || 1200;
    const boxH = containerElement.clientHeight || 300;
    const centerX = boxW / 2;

    candies = Array.from(candyElements).map((el, i) => {
      const w = el.offsetWidth || 150;
      const h = el.offsetHeight || 200;
      const cfg = CLUSTER_CONFIG[i % CLUSTER_CONFIG.length];
      
      const targetRestX = Math.max(10, Math.min(boxW - w - 10, centerX + (cfg.relX * boxW) - (w / 2)));
      const startX = targetRestX + (Math.random() * 30 - 15);
      const startY = -(h + 80 + Math.random() * 260 + i * 35);
      const startRot = cfg.rot + (Math.random() * 12 - 6);

      // Initial visual placement above the screen
      el.style.transform = `translate3d(${startX}px, ${startY}px, 0) rotate(${startRot}deg)`;
      el.style.opacity = '1';

      return {
        el,
        x: startX,
        y: startY,
        vx: (targetRestX - startX) * 0.05 + (Math.random() - 0.5) * 1.5,
        vy: Math.random() * 2 + 1,
        rot: startRot,
        vrot: (Math.random() - 0.5) * 2,
        targetRestX,
        targetYOffset: cfg.yOffset,
        w,
        h,
        radius: Math.min(w, h) * 0.42,
        isHeld: false,
        settled: false
      };
    });

    hasSpawned = true;
    if (!animId) loop();
  }

  function loop() {
    const boxW = containerElement.clientWidth || 1200;
    const boxH = containerElement.clientHeight || 300;

    candies.forEach((c) => {
      if (c.isHeld) {
        c.x = lastX - dragOffsetX;
        c.y = lastY - dragOffsetY;
        c.vx = velX;
        c.vy = velY;
        c.vrot = velX * 0.25;
      } else {
        // Gravity & air drag
        c.vy += G;
        c.vx *= AIR;
        c.vy *= AIR;
        c.vrot *= 0.96;

        c.x += c.vx;
        c.y += c.vy;
        c.rot += c.vrot;

        // Floor collision
        const floorY = boxH - c.h + c.targetYOffset;
        if (c.y >= floorY) {
          c.y = floorY;
          c.vy = -c.vy * BOUNCE_E;
          c.vx *= FLOOR_F;
          c.vrot *= FLOOR_F;
          if (Math.abs(c.vy) < 0.4) c.vy = 0;
        }

        // Walls
        if (c.x < 5) {
          c.x = 5;
          c.vx = Math.abs(c.vx) * 0.5;
        } else if (c.x > boxW - c.w - 5) {
          c.x = boxW - c.w - 5;
          c.vx = -Math.abs(c.vx) * 0.5;
        }
      }

      // Update DOM transform
      c.el.style.transform = `translate3d(${c.x.toFixed(1)}px, ${c.y.toFixed(1)}px, 0) rotate(${c.rot.toFixed(1)}deg)`;
    });

    // Candy-to-candy soft repulsive collision
    for (let i = 0; i < candies.length; i++) {
      for (let j = i + 1; j < candies.length; j++) {
        const c1 = candies[i];
        const c2 = candies[j];
        const dx = (c2.x + c2.w / 2) - (c1.x + c1.w / 2);
        const dy = (c2.y + c2.h / 2) - (c1.y + c1.h / 2);
        const dist = Math.hypot(dx, dy);
        const minDist = (c1.radius + c2.radius) * 0.82;

        if (dist > 0 && dist < minDist) {
          const overlap = (minDist - dist) * 0.45;
          const nx = dx / dist;
          const ny = dy / dist;

          if (!c1.isHeld && !c2.isHeld) {
            c1.x -= nx * overlap;
            c1.y -= ny * overlap;
            c2.x += nx * overlap;
            c2.y += ny * overlap;

            const dvx = c1.vx - c2.vx;
            const dvy = c1.vy - c2.vy;
            const p = dvx * nx + dvy * ny;
            if (p > 0) {
              c1.vx -= p * nx * 0.4;
              c1.vy -= p * ny * 0.4;
              c2.vx += p * nx * 0.4;
              c2.vy += p * ny * 0.4;
            }
          } else if (c1.isHeld) {
            c2.x += nx * overlap * 1.5;
            c2.y += ny * overlap * 1.5;
            c2.vx += nx * 4;
            c2.vy += ny * 4;
          } else if (c2.isHeld) {
            c1.x -= nx * overlap * 1.5;
            c1.y -= ny * overlap * 1.5;
            c1.vx -= nx * 4;
            c1.vy -= ny * 4;
          }
        }
      }
    }

    animId = requestAnimationFrame(loop);
  }

  // Pointer drag events for interactive candy throwing
  candies.forEach(c => {
    c.el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      isDragging = true;
      activeCandy = c;
      c.isHeld = true;
      const rect = containerElement.getBoundingClientRect();
      lastX = e.clientX - rect.left;
      lastY = e.clientY - rect.top;
      dragOffsetX = lastX - c.x;
      dragOffsetY = lastY - c.y;
      velX = 0;
      velY = 0;
      c.el.setPointerCapture(e.pointerId);
    });

    c.el.addEventListener('pointermove', (e) => {
      if (!isDragging || activeCandy !== c) return;
      const rect = containerElement.getBoundingClientRect();
      const curX = e.clientX - rect.left;
      const curY = e.clientY - rect.top;
      velX = curX - lastX;
      velY = curY - lastY;
      lastX = curX;
      lastY = curY;
    });

    const endDrag = (e) => {
      if (activeCandy === c) {
        c.isHeld = false;
        c.vx = Math.max(-25, Math.min(25, velX * 0.8));
        c.vy = Math.max(-25, Math.min(25, velY * 0.8));
        activeCandy = null;
        isDragging = false;
      }
    };

    c.el.addEventListener('pointerup', endDrag);
    c.el.addEventListener('pointercancel', endDrag);
  });

  return {
    spawn,
    hasSpawned: () => hasSpawned,
    destroy: () => {
      if (animId) cancelAnimationFrame(animId);
    }
  };
}

let footerSimulator = null;
let megaMenuSimulator = null;

function initPhysicsCandies() {
  const footerZone = document.getElementById("candySandbox");
  if (footerZone) {
    footerSimulator = createCandyPhysicsSimulator(footerZone, ".physics-candy-item");
    if (footerSimulator) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (!footerSimulator.hasSpawned()) {
            footerSimulator.spawn();
          }
        }
      }, { threshold: 0.15 });
      observer.observe(footerZone);
    }
  }

  const megaZone = document.getElementById("megaCandiesZone");
  if (megaZone) {
    megaMenuSimulator = createCandyPhysicsSimulator(megaZone, ".mega-candy-item");
  }
}

// Global trigger function to drop candies whenever navbar mega menu opens
window.triggerMegaMenuDrop = function() {
  if (megaMenuSimulator) {
    megaMenuSimulator.spawn();
  }
};
