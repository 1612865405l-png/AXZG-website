const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const navLinks = [...document.querySelectorAll('.site-nav a')];
const backToTop = document.querySelector('.back-to-top');
const modal = document.querySelector('.detail-modal');
const modalTitle = document.querySelector('#modal-title');
const modalDescription = document.querySelector('#modal-description');
const modalPoints = document.querySelector('#modal-points');

const details = {
  data: {
    title: '基础数据采集与设计资料积累',
    description: '将分散的勘察、设计、施工与运营资料汇集到统一的数据底座，为风险分析和场景重建提供可信依据。',
    points: ['卫星遥感、无人机与地面监测数据接入', 'BIM、设计图纸和历史资料数字化', '时空关联、质量检查与持续更新']
  },
  risk: {
    title: '风险推演预测',
    description: '结合山区灾害机理、实时监测和极端天气情景，模拟风险的发生、演化与影响范围。',
    points: ['滑坡、崩塌、泥石流和洪水等多灾种模拟', '极端天气情景构建与风险概率评估', '风险链识别、影响分析与预警辅助']
  },
  control: {
    title: '安全防控与场景重建',
    description: '通过国产化三维引擎重建交通走廊场景，把监测、预警、处置和恢复方案放到同一空间中展示与推演。',
    points: ['高精度三维场景重建', '监测预警信息融合展示', '应急方案模拟与协同决策支持']
  },
  operation: {
    title: '日常运营保障',
    description: '面向交通走廊日常运营，把巡检、监测和隐患信息集中展示，帮助管理单位更早发现问题。',
    points: ['日常巡检任务辅助', '重点边坡与桥隧状态监测', '隐患闭环管理与趋势分析']
  },
  weather: {
    title: '极端天气风险识别',
    description: '针对暴雨、暴雪、低温冻融等山区极端天气，识别受影响路段并辅助制定交通管控方案。',
    points: ['气象预报与走廊空间关联', '高风险路段动态识别', '影响范围与通行能力评估']
  },
  recovery: {
    title: '灾后通道恢复支撑',
    description: '在灾害发生后快速汇集现场信息，辅助评估损毁范围、抢通次序和恢复方案。',
    points: ['灾后快速测绘与损毁评估', '抢险资源和作业路线规划', '恢复方案对比与过程记录']
  },
  strategy: {
    title: '战略通道安全保障',
    description: '服务国家和区域重大交通通道，构建面向复杂环境的综合安全保障能力。',
    points: ['关键节点与薄弱环节识别', '跨区域风险态势感知', '重大任务期间的决策辅助']
  }
};

function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
  nav.classList.toggle('open', open);
}

menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
navLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
  });
}, { rootMargin: '-30% 0px -62%', threshold: 0 });

document.querySelectorAll('main section[id], footer[id]').forEach(section => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .12 });

document.querySelectorAll('.reveal:not(.visible)').forEach(element => revealObserver.observe(element));

let counted = false;
const resultSection = document.querySelector('#results');
const countObserver = new IntersectionObserver(entries => {
  if (!entries[0].isIntersecting || counted) return;
  counted = true;
  document.querySelectorAll('[data-count]').forEach(node => {
    const target = Number(node.dataset.count);
    const start = performance.now();
    const duration = 850;
    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      node.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}, { threshold: .35 });
countObserver.observe(resultSection);

document.querySelectorAll('[data-modal]').forEach(card => {
  card.addEventListener('click', () => {
    const content = details[card.dataset.modal];
    modalTitle.textContent = content.title;
    modalDescription.textContent = content.description;
    modalPoints.replaceChildren(...content.points.map(point => {
      const li = document.createElement('li');
      li.textContent = point;
      return li;
    }));
    modal.showModal();
    document.body.classList.add('modal-open');
  });
});

function closeModal() {
  modal.close();
  document.body.classList.remove('modal-open');
}

document.querySelector('.modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', event => {
  const box = modal.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeModal();
});
modal.querySelector('a').addEventListener('click', closeModal);
modal.addEventListener('close', () => document.body.classList.remove('modal-open'));

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 30;
  header.classList.toggle('scrolled', scrolled);
  backToTop.classList.toggle('show', window.scrollY > 620);
}, { passive: true });

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

window.addEventListener('resize', () => {
  if (window.innerWidth > 980) setMenu(false);
});
