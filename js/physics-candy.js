/* ==========================================================================
   9. INTERACTIVE DRAGGABLE PHYSICS CANDY PLAYGROUND
   Authentic Ring Pop Candies Drop Animation & Collision Simulation
   Inspired by Manufactur / ringpopcandy.com
   ========================================================================== */

function createCandyPhysicsSimulator(containerElement, itemSelector) {
  if (!containerElement) return null;
  const candyElements = Array.from(containerElement.querySelectorAll(itemSelector));
  if (!candyElements.length) return null;

  const G = 0.58;            // Gravity
  const AIR = 0.985;         // Air resistance
  const BOUNCE_E = 0.40;     // Floor restitution
  const WALL_E = 0.50;       // Wall restitution
  const FLOOR_F = 0.86;      // Floor slide friction

  let candies = [];
  let animId = null;
  let hasDropped = false;

  // Normalized cluster offsets from center to reproduce exact pile from reference comp
  const CLUSTER_CONFIG = [
    { relX: -0.17, rot: -32, yOffset: 0 },    // 1: Yellow
    { relX: -0.11, rot: -18, yOffset: 8 },   // 2: Pink
    { relX: -0.03, rot: -8,  yOffset: 0 },    // 3: Orange
    { relX: -0.01, rot: 6,   yOffset: -44 },  // 4: Green (stacked tall in center)
    { relX: 0.06,  rot: 16,  yOffset: -34 },  // 5: Blue (stacked tall right of green)
    { relX: 0.12,  rot: 28,  yOffset: 4 },    // 6: Lime
    { relX: 0.19,  rot: 42,  yOffset: 0 }     // 7: Berry
  ];

  function getBoxDims() {
    const boxW = containerElement.clientWidth || containerElement.offsetWidth || 1100;
    const boxH = containerElement.clientHeight || containerElement.offsetHeight || 240;
    return { boxW, boxH };
  }

  // Initialize candy objects
  function initCandies(dropFromTop) {
    const { boxW, boxH } = getBoxDims();
    const centerX = boxW / 2;

    candies = candyElements.map((el, i) => {
      const w = el.offsetWidth || 110;
      const h = el.offsetHeight || 150;
      const cfg = CLUSTER_CONFIG[i % CLUSTER_CONFIG.length];
      
      const restX = Math.max(10, Math.min(boxW - w - 10, centerX + (cfg.relX * boxW) - (w / 2)));
      const restY = Math.max(0, boxH - h + cfg.yOffset);

      let startX = restX;
      let startY = restY;
      let vx = 0;
      let vy = 0;

      if (dropFromTop) {
        startX = restX + (Math.random() * 24 - 12);
        startY = -(h + 60 + Math.random() * 220 + i * 30);
        vx = (restX - startX) * 0.04 + (Math.random() - 0.5) * 1.5;
        vy = Math.random() * 2.5 + 1;
      }

      el.style.transform = `translate3d(${startX.toFixed(1)}px, ${startY.toFixed(1)}px, 0) rotate(${cfg.rot}deg)`;
      el.style.opacity = '1';

      return {
        el,
        x: startX,
        y: startY,
        vx,
        vy,
        rot: cfg.rot,
        vrot: (Math.random() - 0.5) * 2,
        restX,
        targetYOffset: cfg.yOffset,
        w,
        h,
        radius: Math.min(w, h) * 0.44,
        isHeld: false,
        dragOffsetX: 0,
        dragOffsetY: 0,
        lastX: 0,
        lastY: 0,
        velX: 0,
        velY: 0
      };
    });

    if (dropFromTop) {
      hasDropped = true;
    }

    if (!animId) {
      animId = requestAnimationFrame(loop);
    }
  }

  function loop() {
    const { boxW, boxH } = getBoxDims();

    candies.forEach(c => {
      if (c.isHeld) {
        // Direct tracking while dragging
        c.x = c.lastX - c.dragOffsetX;
        c.y = c.lastY - c.dragOffsetY;
        c.vx = c.velX;
        c.vy = c.velY;
        c.vrot = c.velX * 0.25;
      } else {
        // Gravity & air resistance
        c.vy += G;
        c.vx *= AIR;
        c.vy *= AIR;
        c.vrot *= 0.96;

        c.x += c.vx;
        c.y += c.vy;
        c.rot += c.vrot;

        // Floor bounce
        const floorY = boxH - c.h + c.targetYOffset;
        if (c.y >= floorY) {
          c.y = floorY;
          c.vy = -c.vy * BOUNCE_E;
          c.vx *= FLOOR_F;
          c.vrot *= FLOOR_F;
          if (Math.abs(c.vy) < 0.35) c.vy = 0;
        }

        // Left / Right Walls
        if (c.x < 5) {
          c.x = 5;
          c.vx = Math.abs(c.vx) * WALL_E;
        } else if (c.x > boxW - c.w - 5) {
          c.x = boxW - c.w - 5;
          c.vx = -Math.abs(c.vx) * WALL_E;
        }
      }

      // Apply transform to DOM element
      c.el.style.transform = `translate3d(${c.x.toFixed(1)}px, ${c.y.toFixed(1)}px, 0) rotate(${c.rot.toFixed(1)}deg)`;
    });

    // Soft candy-to-candy collision
    for (let i = 0; i < candies.length; i++) {
      for (let j = i + 1; j < candies.length; j++) {
        const c1 = candies[i];
        const c2 = candies[j];
        const dx = (c2.x + c2.w / 2) - (c1.x + c1.w / 2);
        const dy = (c2.y + c2.h / 2) - (c1.y + c1.h / 2);
        const dist = Math.hypot(dx, dy);
        const minDist = (c1.radius + c2.radius) * 0.85;

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
              c1.vx -= p * nx * 0.38;
              c1.vy -= p * ny * 0.38;
              c2.vx += p * nx * 0.38;
              c2.vy += p * ny * 0.38;
            }
          } else if (c1.isHeld) {
            c2.x += nx * overlap * 1.4;
            c2.y += ny * overlap * 1.4;
            c2.vx += nx * 3;
            c2.vy += ny * 3;
          } else if (c2.isHeld) {
            c1.x -= nx * overlap * 1.4;
            c1.y -= ny * overlap * 1.4;
            c1.vx -= nx * 3;
            c1.vy -= ny * 3;
          }
        }
      }
    }

    animId = requestAnimationFrame(loop);
  }

  // Attach pointer dragging directly to DOM elements
  candyElements.forEach(el => {
    let pointerId = null;

    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      const candy = candies.find(c => c.el === el);
      if (!candy) return;

      const rect = containerElement.getBoundingClientRect();
      const currentPointerX = e.clientX - rect.left;
      const currentPointerY = e.clientY - rect.top;

      candy.isHeld = true;
      candy.dragOffsetX = currentPointerX - candy.x;
      candy.dragOffsetY = currentPointerY - candy.y;
      candy.lastX = currentPointerX;
      candy.lastY = currentPointerY;
      candy.velX = 0;
      candy.velY = 0;
      pointerId = e.pointerId;

      try {
        el.setPointerCapture(pointerId);
      } catch (err) {}
    });

    el.addEventListener('pointermove', (e) => {
      if (pointerId === null || e.pointerId !== pointerId) return;
      const candy = candies.find(c => c.el === el);
      if (!candy || !candy.isHeld) return;

      const rect = containerElement.getBoundingClientRect();
      const currentPointerX = e.clientX - rect.left;
      const currentPointerY = e.clientY - rect.top;

      candy.velX = currentPointerX - candy.lastX;
      candy.velY = currentPointerY - candy.lastY;
      candy.lastX = currentPointerX;
      candy.lastY = currentPointerY;
    });

    const releaseDrag = (e) => {
      if (pointerId !== null && e.pointerId === pointerId) {
        const candy = candies.find(c => c.el === el);
        if (candy && candy.isHeld) {
          candy.isHeld = false;
          // Apply release velocity for throwing
          candy.vx = Math.max(-26, Math.min(26, candy.velX * 0.9));
          candy.vy = Math.max(-26, Math.min(26, candy.velY * 0.9));
        }
        try {
          el.releasePointerCapture(pointerId);
        } catch (err) {}
        pointerId = null;
      }
    };

    el.addEventListener('pointerup', releaseDrag);
    el.addEventListener('pointercancel', releaseDrag);
  });

  // Pre-position on initialization
  initCandies(false);

  return {
    drop: () => {
      initCandies(true);
    },
    hasDropped: () => hasDropped,
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
      // Trigger drop when footer comes into view
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (!footerSimulator.hasDropped()) {
            footerSimulator.drop();
          }
        }
      }, { threshold: 0.1 });
      observer.observe(footerZone);

      // Fallback: Also trigger on scroll if near bottom
      window.addEventListener("scroll", () => {
        if (!footerSimulator.hasDropped()) {
          const rect = footerZone.getBoundingClientRect();
          if (rect.top < window.innerHeight + 100) {
            footerSimulator.drop();
          }
        }
      }, { passive: true });
    }
  }

  const megaZone = document.getElementById("megaCandiesZone");
  if (megaZone) {
    megaMenuSimulator = createCandyPhysicsSimulator(megaZone, ".mega-candy-item");
  }
}

// Global function to trigger drop animation whenever navbar menu opens
window.triggerMegaMenuDrop = function() {
  if (megaMenuSimulator) {
    megaMenuSimulator.drop();
  }
};
