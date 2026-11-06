(() => {
  const root = document.getElementById('waBot');
  const toggle = document.getElementById('waBotToggle');
  if (!root || !toggle) return;

  const number = '34679176667';
  const message = 'Hola FENUALV, vengo de vuestra web y tengo una consulta.';

  toggle.setAttribute('aria-label', 'Abrir WhatsApp de FENUALV');
  toggle.setAttribute('title', 'Hablar con FENUALV por WhatsApp');
  toggle.removeAttribute('aria-expanded');

  toggle.addEventListener('click', () => {
    const url = 'https://wa.me/' + number + '?text=' + encodeURIComponent(message);
    window.open(url, '_blank', 'noopener,noreferrer');
  });
})();