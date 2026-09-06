/* Change `online` to false to manually show the offline state. */
const SERVER_CONFIG = { ip: 'play.nexora.pl', online: true, maxPlayers: 20 };

const statusLabels = document.querySelectorAll('.server-status');
const statusDots = document.querySelectorAll('.status-dot');
const playerCount = document.querySelector('[data-player-count]');
const setServerStatus = (online) => {
  statusLabels.forEach((label) => label.textContent = online ? 'SERVER ONLINE' : '🟥 SERVER OFFLINE');
  statusDots.forEach((dot) => dot.classList.toggle('offline', !online));
};
setServerStatus(SERVER_CONFIG.online);

async function fetchPlayerCount() {
  if (!SERVER_CONFIG.online) return;
  try {
    const response = await fetch(`https://api.mcstatus.io/v2/status/java/${SERVER_CONFIG.ip}`);
    if (!response.ok) throw new Error('Server status unavailable');
    const data = await response.json();
    setServerStatus(data.online);
    if (data.online && data.players) playerCount.textContent = `${data.players.online}/${data.players.max || SERVER_CONFIG.maxPlayers}`;
  } catch (_) {
    playerCount.textContent = `0/${SERVER_CONFIG.maxPlayers}`;
  }
}
fetchPlayerCount();

let toastTimer;
function copyIP() {
  navigator.clipboard.writeText(SERVER_CONFIG.ip).catch(() => {
    const input = document.createElement('textarea'); input.value = SERVER_CONFIG.ip; document.body.append(input); input.select(); document.execCommand('copy'); input.remove();
  });
  const toast = document.querySelector('.toast'); toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}
document.querySelectorAll('.copy-trigger').forEach((element) => element.addEventListener('click', copyIP));

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach((element, index) => { element.style.transitionDelay = `${Math.min((index % 6) * 65, 240)}ms`; observer.observe(element); });

const glow = document.querySelector('.cursor-glow');
window.addEventListener('pointermove', (event) => { glow.style.left = `${event.clientX}px`; glow.style.top = `${event.clientY}px`; }, { passive: true });
document.querySelectorAll('.magnetic').forEach((button) => { button.addEventListener('pointermove', (event) => { const box = button.getBoundingClientRect(); button.style.transform = `translate(${(event.clientX - box.left - box.width / 2) * .08}px, ${(event.clientY - box.top - box.height / 2) * .12}px)`; }); button.addEventListener('pointerleave', () => button.style.transform = ''); });
const toggle = document.querySelector('.menu-toggle'); const links = document.querySelector('.nav-links');
toggle.addEventListener('click', () => { const open = links.classList.toggle('open'); toggle.setAttribute('aria-expanded', open); });
links.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { links.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }));
