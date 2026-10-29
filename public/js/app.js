// Interações leves do front-end (sem dependências).
(function () {
  // Toasts: fecha automaticamente e ao clicar no X
  document.querySelectorAll('[data-toast]').forEach(function (toast) {
    var close = function () {
      toast.classList.add('hide');
      setTimeout(function () { toast.remove(); }, 400);
    };
    var btn = toast.querySelector('[data-toast-close]');
    if (btn) btn.addEventListener('click', close);
    setTimeout(close, 4500);
  });

  // Remove ?msg / ?erro da URL para não repetir o aviso ao recarregar
  var url = new URL(window.location.href);
  if (url.searchParams.has('msg') || url.searchParams.has('erro')) {
    url.searchParams.delete('msg');
    url.searchParams.delete('erro');
    window.history.replaceState({}, '', url.pathname + url.search + url.hash);
  }

  // Confirmação antes de ações destrutivas
  document.querySelectorAll('form[data-confirm]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      if (!window.confirm(form.dataset.confirm)) e.preventDefault();
    });
  });

  // Linhas de tabela clicáveis
  document.querySelectorAll('tr[data-href]').forEach(function (row) {
    row.addEventListener('click', function (e) {
      if (e.target.closest('a, button, form')) return;
      window.location.href = row.dataset.href;
    });
  });

  // Paleta rápida de cores (categorias)
  var colorInput = document.getElementById('cor');
  document.querySelectorAll('[data-color]').forEach(function (sw) {
    sw.addEventListener('click', function () {
      if (colorInput) colorInput.value = sw.dataset.color;
    });
  });

  // Animação de contagem nos indicadores
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var target = parseInt(el.dataset.count, 10) || 0;
    if (target === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var start = performance.now();
    var dur = 700;
    var step = function (now) {
      var p = Math.min(1, (now - start) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    el.textContent = '0';
    requestAnimationFrame(step);
  });
})();
