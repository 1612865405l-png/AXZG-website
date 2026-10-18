(() => {
  const header = document.querySelector("[data-header]");
  const progress = document.querySelector(".page-progress i");
  const nav = document.querySelector("[data-nav]");
  const navToggle = document.querySelector("[data-nav-toggle]");

  const updateScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle("is-scrolled", y > 18);
    if (progress) {
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      progress.style.transform = `scaleX(${Math.min(1, y / max)})`;
    }
  };
  updateScroll();
  addEventListener("scroll", updateScroll, { passive: true });

  const closeNav = () => {
    nav?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("is-menu-open");
  };
  navToggle?.addEventListener("click", () => {
    const open = !nav?.classList.contains("is-open");
    nav?.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("is-menu-open", open);
  });
  nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNav));

  const revealNodes = [...document.querySelectorAll("[data-reveal]")];
  revealNodes.forEach((node) => {
    const delay = Number(node.dataset.delay || 0);
    if (delay) node.style.transitionDelay = `${delay}ms`;
  });
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: .1, rootMargin: "0px 0px -5%" });
    revealNodes.filter((node) => !node.closest(".hero")).forEach((node) => revealObserver.observe(node));
  } else {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
  }

  const runCounter = (node) => {
    const target = Number(node.dataset.counter || 0);
    const start = performance.now();
    const duration = 1300;
    const step = (time) => {
      const t = Math.min(1, (time - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      node.textContent = Math.round(target * eased).toLocaleString("zh-CN");
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const counters = [...document.querySelectorAll("[data-counter]")];
  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    }, { threshold: .65 });
    counters.forEach((node) => counterObserver.observe(node));
  } else {
    counters.forEach(runCounter);
  }

  const demoButtons = [...document.querySelectorAll("[data-product-demo-button]")];
  const demoVisuals = [...document.querySelectorAll("[data-product-demo-visual]")];
  demoButtons.forEach((button) => button.addEventListener("click", () => {
    const target = button.dataset.productDemoButton;
    demoButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    demoVisuals.forEach((visual) => {
      visual.classList.toggle("is-active", visual.dataset.productDemoVisual === target);
    });
  }));

  const dataButtons = [...document.querySelectorAll("[data-data-button]")];
  const dataVisuals = [...document.querySelectorAll("[data-data-visual]")];
  const dataStatus = document.querySelector("[data-data-status]");
  dataButtons.forEach((button) => button.addEventListener("click", () => {
    const name = button.dataset.dataButton;
    dataButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    dataVisuals.forEach((visual) => visual.classList.toggle("is-active", visual.dataset.dataVisual === name));
    if (dataStatus) dataStatus.textContent = button.dataset.status || "数据采集";
  }));

  const scenarioPresets = {
    truck: {
      name: "重载车辆下坡",
      image: "assets/04-risk-simulation/heavy-truck-scene.webp",
      values: [68, 76, 54],
      cause: "重载 · 长下坡",
      action: "限速 · 分流",
      bias: 5,
    },
    car: {
      name: "小客车连续急弯",
      image: "assets/04-risk-simulation/mountain-truck-scene.webp",
      values: [42, 71, 78],
      cause: "急弯 · 速度差",
      action: "预警 · 诱导",
      bias: 2,
    },
    weather: {
      name: "低能见度降雨",
      image: "assets/02-industry-pain/rainy-mountain-highway.webp",
      values: [88, 62, 57],
      cause: "降雨 · 低能见度",
      action: "降速 · 控流",
      bias: 7,
    },
    disaster: {
      name: "滑坡冲毁通道",
      image: "assets/02-industry-pain/landslide-road-collapse.webp",
      values: [75, 44, 94],
      cause: "滑坡 · 路基损毁",
      action: "封控 · 抢通",
      bias: 9,
    },
  };
  const riskButtons = [...document.querySelectorAll("[data-risk-scenario]")];
  const riskInputs = [...document.querySelectorAll("[data-risk-input]")];
  const riskImage = document.querySelector("[data-risk-image]");
  const riskName = document.querySelector("[data-risk-name]");
  const riskScore = document.querySelector("[data-risk-score]");
  const riskLevel = document.querySelector("[data-risk-level]");
  const riskCause = document.querySelector("[data-risk-cause]");
  const riskAction = document.querySelector("[data-risk-action]");
  const riskRing = document.querySelector("[data-risk-ring]");
  let activeRisk = "truck";

  const updateRisk = () => {
    const values = Object.fromEntries(riskInputs.map((input) => [input.dataset.riskInput, Number(input.value)]));
    riskInputs.forEach((input) => {
      input.style.setProperty("--range", `${input.value}%`);
      const output = document.querySelector(`[data-risk-output="${input.dataset.riskInput}"]`);
      if (output) output.value = input.value;
    });
    const preset = scenarioPresets[activeRisk];
    const score = Math.max(12, Math.min(98, Math.round(values.environment * .39 + values.traffic * .29 + values.road * .32 + preset.bias)));
    const level = score >= 85 ? "Ⅰ级" : score >= 70 ? "Ⅱ级" : score >= 52 ? "Ⅲ级" : "Ⅳ级";
    if (riskScore) riskScore.textContent = String(score);
    if (riskLevel) riskLevel.textContent = level;
    if (riskCause) riskCause.textContent = preset.cause;
    if (riskAction) riskAction.textContent = preset.action;
    riskRing?.style.setProperty("--score", String(score));
  };
  const setRiskScenario = (name) => {
    activeRisk = name;
    const preset = scenarioPresets[name];
    riskButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.riskScenario === name));
    riskInputs.forEach((input, index) => { input.value = preset.values[index]; });
    if (riskName) riskName.textContent = preset.name;
    if (riskCause) riskCause.textContent = preset.cause;
    if (riskAction) riskAction.textContent = preset.action;
    if (riskImage) {
      riskImage.style.opacity = "0";
      setTimeout(() => {
        riskImage.src = preset.image;
        riskImage.alt = preset.name;
        riskImage.style.opacity = "1";
      }, 180);
    }
    updateRisk();
  };
  riskButtons.forEach((button) => button.addEventListener("click", () => setRiskScenario(button.dataset.riskScenario)));
  riskInputs.forEach((input) => input.addEventListener("input", updateRisk));
  updateRisk();

  const productButtons = [...document.querySelectorAll("[data-product-button]")];
  const productPanels = [...document.querySelectorAll("[data-product-panel]")];
  productButtons.forEach((button) => button.addEventListener("click", () => {
    const target = button.dataset.productButton;
    productButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    productPanels.forEach((panel) => {
      const active = panel.dataset.productPanel === target;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
  }));

  const appTrack = document.querySelector("[data-application-track]");
  const appCards = [...document.querySelectorAll("[data-application-card]")];
  const appIndexLabel = document.querySelector("[data-app-index]");
  let appIndex = 0;
  const updateApplications = () => {
    if (!appTrack || !appCards.length) return;
    appCards.forEach((card, index) => card.classList.toggle("is-active", index === appIndex));
    const gap = 14;
    const cardWidth = appCards[0].getBoundingClientRect().width;
    const viewport = appTrack.parentElement.getBoundingClientRect().width;
    const maxShift = Math.max(0, appTrack.scrollWidth - viewport);
    const shift = Math.min(maxShift, appIndex * (cardWidth + gap));
    appTrack.style.transform = `translateX(${-shift}px)`;
    if (appIndexLabel) appIndexLabel.textContent = String(appIndex + 1).padStart(2, "0");
  };
  document.querySelector("[data-app-prev]")?.addEventListener("click", () => { appIndex = (appIndex - 1 + appCards.length) % appCards.length; updateApplications(); });
  document.querySelector("[data-app-next]")?.addEventListener("click", () => { appIndex = (appIndex + 1) % appCards.length; updateApplications(); });
  addEventListener("resize", updateApplications, { passive: true });
  updateApplications();

  const dialog = document.querySelector("[data-lightbox-dialog]");
  const dialogImage = dialog?.querySelector("img");
  const dialogCaption = dialog?.querySelector("figcaption");
  const closeDialog = () => dialog?.close();
  document.querySelectorAll("[data-lightbox]").forEach((button) => button.addEventListener("click", () => {
    if (!dialog || !dialogImage || !dialogCaption) return;
    dialogImage.src = button.dataset.lightbox;
    dialogImage.alt = button.dataset.caption || "项目图片";
    dialogCaption.textContent = button.dataset.caption || "";
    dialog.showModal();
  }));
  dialog?.querySelector("[data-lightbox-close]")?.addEventListener("click", closeDialog);
  dialog?.addEventListener("click", (event) => { if (event.target === dialog) closeDialog(); });
  dialog?.addEventListener("cancel", (event) => { event.preventDefault(); closeDialog(); });

  if (!matchMedia("(prefers-reduced-motion: reduce)").matches && matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll(".equipment-card, .incident-card, .validation-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.transform = `perspective(1000px) rotateX(${(-y * 2.2).toFixed(2)}deg) rotateY(${(x * 2.5).toFixed(2)}deg)`;
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });
  }
})();
