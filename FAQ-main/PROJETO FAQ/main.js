// Saudação dinâmica no hero
window.addEventListener('DOMContentLoaded', function() {
  const saudacao = document.getElementById('saudacao-dinamica');
  if (saudacao) {
    const hora = new Date().getHours();
    let texto = '';
    if (hora >= 5 && hora < 12) texto = 'Bom dia!';
    else if (hora >= 12 && hora < 18) texto = 'Boa tarde!';
    else texto = 'Boa noite!';
    saudacao.textContent = texto + ' ';
  }
});
// =============================================
// MAIN.JS — Animações e interações da Home
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  setupScrollAnimations();
  setupTopicCards();
});

// Animação de entrada ao rolar (fade-up)
function setupScrollAnimations() {
  // Adiciona classe fade-up nos elementos desejados
  const elements = document.querySelectorAll('.topic-card, .section-header, .contact-card');
  elements.forEach(el => el.classList.add('fade-up'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

// Efeito extra nos cards de tópico (trilha de mouse)
function setupTopicCards() {
  const cards = document.querySelectorAll('.topic-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });
}
