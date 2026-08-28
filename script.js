/* =========================================================================
   Personas Sintéticas Vivas na Prática — Onda Lab
   JavaScript mínimo. A página funciona por inteiro sem ele:
   o FAQ e os módulos usam <details>/<summary> nativos, todo o conteúdo
   fica acessível e os CTAs são links comuns.
   ========================================================================= */
(function () {
  'use strict';

  var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* --- ano corrente no rodapé ------------------------------------------ */
  var ano = document.getElementById('ano');
  if (ano) { ano.textContent = String(new Date().getFullYear()); }

  /* --- barra fixa de CTA: aparece depois da primeira dobra -------------- */
  var barra = document.getElementById('barra');
  var hero = document.querySelector('.hero');

  if (barra && hero && 'IntersectionObserver' in window) {
    barra.hidden = false;
    var obsHero = new IntersectionObserver(function (entradas) {
      barra.classList.toggle('esta-visivel', !entradas[0].isIntersecting);
    }, { rootMargin: '-70px 0px 0px 0px' });
    obsHero.observe(hero);
  }

  /* --- entrada discreta das seções -------------------------------------- *
   * Regra de ouro numa página de vendas: conteúdo nunca pode ficar preso
   * invisível. Por isso o efeito só se aplica ao que já está abaixo da
   * dobra, e um temporizador de segurança revela tudo de qualquer forma.  */
  if (!semMovimento.matches && 'IntersectionObserver' in window) {
    var candidatos = document.querySelectorAll(
      '.card, .etapa, .dep, .publico, .modulo, .preco, .compara__lado'
    );
    var alvos = Array.prototype.filter.call(candidatos, function (el) {
      return el.getBoundingClientRect().top > window.innerHeight;   // nunca esconde o que já está visível
    });

    function revelar(el) { el.classList.add('dentro'); }

    if (alvos.length) {
      alvos.forEach(function (el) { el.classList.add('revela'); });
      var obs = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (ent) {
          if (!ent.isIntersecting) { return; }
          revelar(ent.target);
          obs.unobserve(ent.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      alvos.forEach(function (el) { obs.observe(el); });

      /* rede de segurança: se algo falhar, o conteúdo aparece assim mesmo */
      window.setTimeout(function () {
        alvos.forEach(revelar);
        obs.disconnect();
      }, 2500);
    }
  }
})();
