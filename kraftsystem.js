/* KRAFTSYSTEM.JS — comportamento mínimo: menu, estação atual, barra de progresso, aparição serial. */
(() => {
  const rota = document.querySelector('.rota');
  const menu = rota && rota.querySelector('.menu');
  if (menu) {
    menu.addEventListener('click', () => {
      const aberta = rota.classList.toggle('aberta');
      menu.setAttribute('aria-expanded', aberta);
    });
    rota.querySelectorAll('.estacoes a').forEach(a => a.addEventListener('click', () => {
      rota.classList.remove('aberta');
      menu.setAttribute('aria-expanded', false);
    }));
  }

  // barra de progresso da leitura
  const barra = document.querySelector('.progresso');
  if (barra) {
    const atualiza = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      barra.style.width = (max > 0 ? scrollY / max * 100 : 0) + '%';
    };
    addEventListener('scroll', atualiza, { passive: true });
    atualiza();
  }

  // marca a estação (link do menu) da seção visível
  const links = [...document.querySelectorAll('.estacoes a[href^="#"]')];
  const alvos = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && alvos.length) {
    const io = new IntersectionObserver(entradas => {
      entradas.forEach(e => {
        if (!e.isIntersecting) return;
        links.forEach(a => a.setAttribute('aria-current', a.getAttribute('href') === '#' + e.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    alvos.forEach(s => io.observe(s));
  }

  // aparição serial (.revela) — só se o usuário não pediu menos movimento
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revelar = document.querySelectorAll('.revela');
  if (reduz || !('IntersectionObserver' in window)) {
    revelar.forEach(el => el.classList.add('visivel'));
  } else {
    const io2 = new IntersectionObserver(entradas => entradas.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visivel'); io2.unobserve(e.target); }
    }), { threshold: .15 });
    revelar.forEach(el => io2.observe(el));
  }

  // ticker: duplica o conteúdo para a rolagem contínua
  document.querySelectorAll('.ticker .trilho').forEach(t => { t.innerHTML += t.innerHTML; });
})();
