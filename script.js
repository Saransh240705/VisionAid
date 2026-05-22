// ===== Saathi Website JavaScript — Dynamic Edition =====

document.addEventListener("DOMContentLoaded", () => {
  // ===================================================================
  // 1. NAVBAR SCROLL EFFECT
  // ===================================================================
  const navbar = document.getElementById("navbar");
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", handleScroll);

  // ===================================================================
  // 2. HAMBURGER MENU
  // ===================================================================
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });

  // ===================================================================
  // 3. SMOOTH SCROLL FOR NAV LINKS
  // ===================================================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });

  // ===================================================================
  // 4. SCROLL FADE-IN ANIMATION (with stagger)
  // ===================================================================
  const fadeElements = document.querySelectorAll(".fade-in");

  // Add stagger classes to grouped cards
  document.querySelectorAll(".challenge-cards, .solution-cards, .steps-grid").forEach((grid) => {
    grid.querySelectorAll(".fade-in").forEach((el, i) => {
      el.classList.add(`stagger-${Math.min(i + 1, 4)}`);
    });
  });

  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -60px 0px",
    threshold: 0.15,
  };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach((el) => fadeObserver.observe(el));

  // ===================================================================
  // 5. ACTIVE NAV LINK HIGHLIGHT
  // ===================================================================
  const sections = document.querySelectorAll("section[id]");
  const navLinkElements = document.querySelectorAll(".nav-link");

  const highlightNav = () => {
    const scrollPos = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinkElements.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  };

  window.addEventListener("scroll", highlightNav);

  // ===================================================================
  // 6. COUNTER ANIMATION FOR STATS
  // ===================================================================
  const statNumbers = document.querySelectorAll(".stat-number");

  const animateCounter = (el) => {
    const text = el.textContent;
    const hasPlus = text.includes("+");
    const hasPercent = text.includes("%");
    const hasComma = text.includes(",");
    const numStr = text.replace(/[^0-9]/g, "");
    const target = parseInt(numStr, 10);
    const duration = 2000;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      let current = Math.floor(eased * target);

      let formatted = current.toString();
      if (hasComma && formatted.length > 3) {
        formatted = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      if (hasPercent) formatted += "%";
      if (hasPlus) formatted += "+";

      el.textContent = formatted;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  };

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  statNumbers.forEach((el) => statsObserver.observe(el));

  // ===================================================================
  // 7. SCROLL PROGRESS BAR
  // ===================================================================
  const scrollProgress = document.getElementById("scrollProgress");

  const updateScrollProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = `${progress}%`;
  };

  window.addEventListener("scroll", updateScrollProgress);

  // ===================================================================
  // 8. PARTICLE BACKGROUND
  // ===================================================================
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d");
  const heroSection = document.getElementById("hero");
  let particles = [];
  let animationId;

  const resizeCanvas = () => {
    canvas.width = heroSection.offsetWidth;
    canvas.height = heroSection.offsetHeight;
  };

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(42, 171, 224, ${this.opacity})`;
      ctx.fill();
    }
  }

  const initParticles = () => {
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 80);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  };

  const drawConnections = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          const opacity = (1 - distance / 120) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(42, 171, 224, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  };

  const animateParticles = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    drawConnections();
    animationId = requestAnimationFrame(animateParticles);
  };

  initParticles();
  animateParticles();

  // Reinitialize on resize
  window.addEventListener("resize", () => {
    resizeCanvas();
    initParticles();
  });

  // ===================================================================
  // 9. HERO TYPING ANIMATION
  // ===================================================================
  const heroTitle = document.querySelector(".hero-title");
  if (heroTitle) {
    const accentSpan = heroTitle.querySelector(".hero-accent");
    if (accentSpan) {
      const fullText = accentSpan.textContent;
      accentSpan.textContent = "";

      // Add cursor
      const cursor = document.createElement("span");
      cursor.className = "typing-cursor";
      accentSpan.appendChild(cursor);

      let charIndex = 0;
      const typeInterval = setInterval(() => {
        if (charIndex < fullText.length) {
          const textNode = document.createTextNode(fullText[charIndex]);
          accentSpan.insertBefore(textNode, cursor);
          charIndex++;
        } else {
          clearInterval(typeInterval);
          // Remove cursor after 3 seconds
          setTimeout(() => {
            cursor.remove();
          }, 3000);
        }
      }, 80);
    }
  }

  // ===================================================================
  // 10. LIVE DEVICE DASHBOARD
  // ===================================================================
  const deviceInfoEl = document.querySelector(".device-info");
  const deviceNameEl = document.querySelector(".device-name");

  if (deviceInfoEl) {
    let battery = 94;
    let gpsActive = true;

    const sensorReadings = [
      "Obstacle: 3.2m ahead",
      "Clear path detected",
      "Surface: Paved sidewalk",
      "Elevation: +2m incline",
      "Obstacle: 1.8m right",
      "Clear path detected",
      "Surface: Crosswalk detected",
      "Intersection approaching",
    ];
    let sensorIndex = 0;

    // Update device data every 3 seconds
    setInterval(() => {
      // Drain battery slowly
      battery = Math.max(battery - Math.random() * 0.3, 10);
      gpsActive = Math.random() > 0.05; // 95% uptime

      const batteryStr = Math.round(battery);
      const gpsStr = gpsActive ? "GPS Active" : "GPS Searching...";

      deviceInfoEl.innerHTML = `<span class="live-dot"></span> Battery: ${batteryStr}% • ${gpsStr}`;
      deviceInfoEl.classList.add("updating");
      setTimeout(() => deviceInfoEl.classList.remove("updating"), 300);
    }, 3000);

    // Update sensor reading every 4 seconds
    const statusLabel = document.querySelector(".status-label");
    if (statusLabel) {
      setInterval(() => {
        statusLabel.textContent = sensorReadings[sensorIndex];
        statusLabel.style.transition = "opacity 0.3s ease";
        statusLabel.style.opacity = "0";
        setTimeout(() => {
          statusLabel.style.opacity = "1";
        }, 150);
        sensorIndex = (sensorIndex + 1) % sensorReadings.length;
      }, 4000);
    }
  }

  // ===================================================================
  // 11. MOUSE-FOLLOW GLOW ON HERO
  // ===================================================================
  const heroGlow = document.getElementById("heroGlow");

  if (heroGlow && heroSection) {
    heroSection.addEventListener("mousemove", (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left - 200;
      const y = e.clientY - rect.top - 200;
      heroGlow.style.transform = `translate(${x}px, ${y}px)`;
    });

    heroSection.addEventListener("mouseleave", () => {
      heroGlow.style.opacity = "0";
    });

    heroSection.addEventListener("mouseenter", () => {
      heroGlow.style.opacity = "1";
    });
  }

  // ===================================================================
  // 12. SOS ALARM SYSTEM
  // ===================================================================
  const sosBtn = document.getElementById("sosAlarmBtn");
  const alarmOverlay = document.getElementById("alarmOverlay");
  const alarmActive = document.getElementById("alarmActive");
  const alarmSent = document.getElementById("alarmSent");
  const countdownNumber = document.getElementById("countdownNumber");
  const alarmCoords = document.getElementById("alarmCoords");
  const alarmCancel = document.getElementById("alarmCancel");
  const alarmSendBtn = document.getElementById("alarmSend");
  const alarmDismiss = document.getElementById("alarmDismiss");

  let alarmAudioCtx = null;
  let alarmOscillator = null;
  let alarmGain = null;
  let countdownInterval = null;
  let countdownValue = 30;
  let vibrationInterval = null;

  // --- Web Audio API Alarm Sound ---
  const startAlarmSound = () => {
    try {
      alarmAudioCtx = new (window.AudioContext || window.webkitAudioContext)();

      // Create a pulsing alarm pattern
      alarmOscillator = alarmAudioCtx.createOscillator();
      alarmGain = alarmAudioCtx.createGain();

      alarmOscillator.type = "square";
      alarmOscillator.frequency.setValueAtTime(880, alarmAudioCtx.currentTime);
      alarmGain.gain.setValueAtTime(0.15, alarmAudioCtx.currentTime);

      alarmOscillator.connect(alarmGain);
      alarmGain.connect(alarmAudioCtx.destination);
      alarmOscillator.start();

      // Create pulsing effect (high-low-high-low)
      const pulseAlarm = () => {
        if (!alarmOscillator) return;
        const now = alarmAudioCtx.currentTime;
        alarmOscillator.frequency.setValueAtTime(880, now);
        alarmOscillator.frequency.setValueAtTime(660, now + 0.3);
        alarmOscillator.frequency.setValueAtTime(880, now + 0.6);
        alarmOscillator.frequency.setValueAtTime(660, now + 0.9);
      };

      pulseAlarm();
      const pulseInterval = setInterval(() => {
        if (!alarmOscillator) {
          clearInterval(pulseInterval);
          return;
        }
        pulseAlarm();
      }, 1200);
    } catch (e) {
      console.warn("Web Audio API not available:", e);
    }
  };

  const stopAlarmSound = () => {
    if (alarmOscillator) {
      try {
        alarmOscillator.stop();
        alarmOscillator.disconnect();
      } catch (e) { /* already stopped */ }
      alarmOscillator = null;
    }
    if (alarmGain) {
      try { alarmGain.disconnect(); } catch (e) { /* already disconnected */ }
      alarmGain = null;
    }
    if (alarmAudioCtx) {
      try { alarmAudioCtx.close(); } catch (e) { /* already closed */ }
      alarmAudioCtx = null;
    }
  };

  // --- Vibration API ---
  const startVibration = () => {
    if ("vibrate" in navigator) {
      // Pulsing vibration pattern: vibrate 400ms, pause 200ms
      vibrationInterval = setInterval(() => {
        navigator.vibrate([400, 200, 400, 200, 400]);
      }, 2000);
      navigator.vibrate([400, 200, 400, 200, 400]);
    }
  };

  const stopVibration = () => {
    if (vibrationInterval) {
      clearInterval(vibrationInterval);
      vibrationInterval = null;
    }
    if ("vibrate" in navigator) {
      navigator.vibrate(0);
    }
  };

  // --- Geolocation ---
  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(6);
          const lng = pos.coords.longitude.toFixed(6);
          alarmCoords.textContent = `${lat}°N, ${lng}°E`;
        },
        () => {
          alarmCoords.textContent = "Location unavailable — check permissions";
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      alarmCoords.textContent = "Geolocation not supported";
    }
  };

  // --- Countdown ---
  const startCountdown = () => {
    countdownValue = 30;
    countdownNumber.textContent = countdownValue;

    countdownInterval = setInterval(() => {
      countdownValue--;
      countdownNumber.textContent = countdownValue;

      if (countdownValue <= 0) {
        clearInterval(countdownInterval);
        sendSOS();
      }
    }, 1000);
  };

  const stopCountdown = () => {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
  };

  // --- Open Alarm ---
  const openAlarm = () => {
    // Reset views
    alarmActive.style.display = "block";
    alarmSent.classList.remove("show");

    // Show overlay
    alarmOverlay.classList.add("active");

    // Start systems
    startAlarmSound();
    startVibration();
    getLocation();
    startCountdown();
  };

  // --- Cancel Alarm ---
  const cancelAlarm = () => {
    stopAlarmSound();
    stopVibration();
    stopCountdown();
    alarmOverlay.classList.remove("active");
    countdownNumber.textContent = "30";
    alarmCoords.textContent = "Detecting location...";
  };

  // --- Send SOS ---
  const sendSOS = () => {
    stopAlarmSound();
    stopVibration();
    stopCountdown();

    // Switch to confirmation view
    alarmActive.style.display = "none";
    alarmSent.classList.add("show");

    // Success vibration
    if ("vibrate" in navigator) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }
  };

  // --- Dismiss ---
  const dismissAlarm = () => {
    alarmOverlay.classList.remove("active");
    setTimeout(() => {
      alarmActive.style.display = "block";
      alarmSent.classList.remove("show");
      countdownNumber.textContent = "30";
      alarmCoords.textContent = "Detecting location...";
    }, 400);
  };

  // Wire up events
  sosBtn.addEventListener("click", openAlarm);
  alarmCancel.addEventListener("click", cancelAlarm);
  alarmSendBtn.addEventListener("click", sendSOS);
  alarmDismiss.addEventListener("click", dismissAlarm);

  // Close on background click
  document.getElementById("alarmOverlayBg").addEventListener("click", cancelAlarm);

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && alarmOverlay.classList.contains("active")) {
      cancelAlarm();
    }
  });

  // ===================================================================
  // 13. CARD TILT ON HOVER (Micro-interaction)
  // ===================================================================
  const tiltCards = document.querySelectorAll(".challenge-card, .solution-card, .step-card");

  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(800px) rotateX(0) rotateY(0) translateY(0)";
    });
  });
});
