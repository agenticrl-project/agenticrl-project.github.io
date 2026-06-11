const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
themeToggle?.addEventListener('click', () => {
  const isDark = root.getAttribute('data-theme') === 'dark';
  root.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeToggle.textContent = isDark ? '☾' : '☀';
});

document.querySelectorAll('.timeline-step').forEach((step) => {
  step.addEventListener('click', () => {
    document.querySelectorAll('.timeline-step').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.info-panel').forEach(p => p.classList.remove('active'));
    step.classList.add('active');
    document.getElementById(step.dataset.panel)?.classList.add('active');
  });
});

const scenarioData = {
  trajectory: {
    title: 'Trajectory Following', ssr: '93%', rsr: '90%', s2r: '97%',
    text: 'Follow a target trajectory while minimizing deviation and maintaining stable UAV motion.',
    bullets: ['Primary objective: path progress and low deviation.', 'Failure condition: large path deviation or collision.', 'Best for showing reward shaping over trajectories.']
  },
  gate: {
    title: 'Gate Traversal', ssr: '100%', rsr: '100%', s2r: '100%',
    text: 'Traverse a gate while maintaining centered, collision-free motion.',
    bullets: ['Primary objective: pass through the gate center.', 'Reward emphasizes progress and alignment.', 'Useful for showing scene-conditioned reward design.']
  },
  obstacle: {
    title: 'Obstacle Avoidance & Landing', ssr: '96%', rsr: '82%', s2r: '85%',
    text: 'Avoid cylindrical obstacles and land on the target pad.',
    bullets: ['Primary objective: safe navigation and landing.', 'Failure condition: obstacle collision or failed landing.', 'Tests whether the reward balances safety and goal completion.']
  },
  barrier: {
    title: 'Wall Barrier Crossing & Landing', ssr: '95%', rsr: '85%', s2r: '89%',
    text: 'Cross a wall-like barrier and perform controlled landing on the target pad.',
    bullets: ['Primary objective: barrier crossing and landing.', 'Requires altitude-aware reward shaping.', 'Tests complex 3D navigation behavior.']
  },
  circular: {
    title: 'Circular Motion Generation', ssr: '98%', rsr: '98%', s2r: '100%',
    text: 'Generate smooth circular motion with stable UAV control.',
    bullets: ['Primary objective: stable orbit-like motion.', 'Failure condition: unstable or incomplete motion.', 'Highlights behavior generation rather than point-to-point navigation.']
  }
};

document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const data = scenarioData[tab.dataset.scenario];
    document.getElementById('scenarioTitle').textContent = data.title;
    document.getElementById('scenarioText').textContent = data.text;
    document.getElementById('ssrBox').textContent = data.ssr;
    document.getElementById('rsrBox').textContent = data.rsr;
    document.getElementById('s2rBox').textContent = data.s2r;
    document.getElementById('scenarioBullets').innerHTML = data.bullets.map(item => `<li>${item}</li>`).join('');
  });
});

document.querySelectorAll('.table-search').forEach(input => {
  input.addEventListener('input', () => {
    const table = document.getElementById(input.dataset.table);
    const query = input.value.toLowerCase();
    table.querySelectorAll('tbody tr').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(query) ? '' : 'none';
    });
  });
});
