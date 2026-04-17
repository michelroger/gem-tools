/* Funcoes centrais de interface (DOM) com baixo acoplamento. */
(function () {
  'use strict';

  function setMessage(text) {
    var el = document.getElementById('instructionText');
    if (el) el.textContent = text;
  }

  function updateFullscreenButton() {
    var btn = document.getElementById('btnFullscreen');
    if (!btn) return;
    var isFullscreen = !!document.fullscreenElement;
    btn.textContent = isFullscreen ? '🗗 Sair da tela cheia' : '⛶ Tela cheia';
  }

  function toggleFullscreen() {
    var el = document.documentElement;
    if (!document.fullscreenElement) {
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(function () {});
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(function () {});
    }
  }

  function updateBottomNavVisibility(forceVisible) {
    var nav = document.getElementById('modeTabs');
    if (!nav) return;

    if (typeof forceVisible === 'boolean') {
      nav.classList.toggle('nav-hidden', !forceVisible);
      document.body.classList.toggle('show-bottom-nav', !!forceVisible);
      return;
    }

    var docEl = document.documentElement;
    var body = document.body;
    var scrollRoot = document.scrollingElement || docEl;
    /* innerHeight alinha com window.scrollY (viewport de layout). */
    var viewportHeight = window.innerHeight || docEl.clientHeight || 0;
    if (viewportHeight <= 0) return;

    var scrollTop = window.pageYOffset;
    if (typeof scrollTop !== 'number' || isNaN(scrollTop)) {
      scrollTop =
        'scrollY' in window ? window.scrollY : scrollRoot.scrollTop || docEl.scrollTop || body.scrollTop || 0;
    }

    var docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      scrollRoot.scrollHeight,
      docEl.scrollHeight,
      docEl.offsetHeight
    );
    var threshold = Math.max(80, Math.round(viewportHeight * 0.08));
    var fudge = 2;
    var distanceFromBottom = Math.max(0, docHeight - scrollTop - viewportHeight);
    var maxScroll = Math.max(0, docHeight - viewportHeight);

    var atBottomScroll = distanceFromBottom <= threshold + fudge;
    var atBottomMax = scrollTop >= maxScroll - threshold;
    var shortPage = docHeight <= viewportHeight + threshold;

    /* Sentinel no fim do body: posição na viewport não depende de scrollHeight vs innerHeight (casos raros no Chrome desktop). */
    var sentinel = document.getElementById('bottomNavSentinel');
    var atBottomSentinel = false;
    if (sentinel && typeof sentinel.getBoundingClientRect === 'function') {
      var sr = sentinel.getBoundingClientRect();
      atBottomSentinel = sr.top < viewportHeight + threshold;
    }

    var atBottom =
      shortPage || atBottomScroll || atBottomMax || atBottomSentinel;
    nav.classList.toggle('nav-hidden', !atBottom);
    document.body.classList.toggle('show-bottom-nav', atBottom);
  }

  function hideSplashScreen() {
    var splash = document.getElementById('appSplash');
    if (!splash) return;
    splash.classList.add('hide');
    setTimeout(function () {
      if (splash && splash.parentNode) splash.parentNode.removeChild(splash);
    }, 500);
  }

  function openAboutModal() {
    var modal = document.getElementById('aboutModal');
    if (!modal) return;
    modal.classList.remove('hidden');
  }

  function closeAboutModal() {
    var modal = document.getElementById('aboutModal');
    if (!modal) return;
    modal.classList.add('hidden');
  }

  function resizeCanvasToDisplay(canvas) {
    if (!canvas) return false;
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.getBoundingClientRect();
    var w = Math.max(1, Math.round(rect.width * dpr));
    var h = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      return true;
    }
    return false;
  }

  function setAriaPressed(element, isPressed) {
    if (!element) return;
    element.setAttribute('aria-pressed', isPressed ? 'true' : 'false');
  }

  function setAriaExpanded(element, isExpanded) {
    if (!element) return;
    element.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
  }

  function setSelectValue(selectEl, value) {
    if (!selectEl) return false;
    var target = String(value == null ? '' : value);
    var options = selectEl.options || [];
    for (var i = 0; i < options.length; i++) {
      if (String(options[i].value) === target) {
        selectEl.value = target;
        return true;
      }
    }
    if (options.length > 0) {
      selectEl.selectedIndex = 0;
      return false;
    }
    selectEl.value = target;
    return false;
  }

  function setInputValue(inputEl, value) {
    if (!inputEl) return;
    inputEl.value = String(value == null ? '' : value);
  }

  function setPlaceholder(inputEl, text) {
    if (!inputEl) return;
    inputEl.placeholder = String(text == null ? '' : text);
  }

  function setDisabled(element, disabled) {
    if (!element) return;
    element.disabled = !!disabled;
  }

  function setAriaLabelAndTitle(element, text) {
    if (!element) return;
    var t = String(text || '');
    element.setAttribute('aria-label', t);
    element.setAttribute('title', t);
  }

  function setCheckboxState(checkboxEl, enabled, checked) {
    if (!checkboxEl) return;
    checkboxEl.disabled = !enabled;
    checkboxEl.checked = !!checked;
  }

  function setText(element, text) {
    if (!element) return;
    element.textContent = String(text == null ? '' : text);
  }

  function setHtml(element, html) {
    if (!element) return;
    element.innerHTML = String(html == null ? '' : html);
  }

  function toggleClass(element, className, enabled) {
    if (!element) return;
    element.classList.toggle(String(className || ''), !!enabled);
  }

  function replaceStatusClasses(element, classesToRemove, classToAdd) {
    if (!element) return;
    var removeList = Array.isArray(classesToRemove) ? classesToRemove : [];
    removeList.forEach(function (cls) {
      if (cls) element.classList.remove(String(cls));
    });
    if (classToAdd) element.classList.add(String(classToAdd));
  }

  function setHiddenClass(element, hidden) {
    if (!element) return;
    element.classList.toggle('hidden', !!hidden);
  }

  window.UiCoreModule = window.UiCoreModule || {};
  window.UiCoreModule.setMessage = setMessage;
  window.UiCoreModule.updateFullscreenButton = updateFullscreenButton;
  window.UiCoreModule.toggleFullscreen = toggleFullscreen;
  window.UiCoreModule.updateBottomNavVisibility = updateBottomNavVisibility;
  window.UiCoreModule.hideSplashScreen = hideSplashScreen;
  window.UiCoreModule.openAboutModal = openAboutModal;
  window.UiCoreModule.closeAboutModal = closeAboutModal;
  window.UiCoreModule.resizeCanvasToDisplay = resizeCanvasToDisplay;
  window.UiCoreModule.setAriaPressed = setAriaPressed;
  window.UiCoreModule.setAriaExpanded = setAriaExpanded;
  window.UiCoreModule.setSelectValue = setSelectValue;
  window.UiCoreModule.setInputValue = setInputValue;
  window.UiCoreModule.setPlaceholder = setPlaceholder;
  window.UiCoreModule.setDisabled = setDisabled;
  window.UiCoreModule.setAriaLabelAndTitle = setAriaLabelAndTitle;
  window.UiCoreModule.setCheckboxState = setCheckboxState;
  window.UiCoreModule.setText = setText;
  window.UiCoreModule.setHtml = setHtml;
  window.UiCoreModule.toggleClass = toggleClass;
  window.UiCoreModule.replaceStatusClasses = replaceStatusClasses;
  window.UiCoreModule.setHiddenClass = setHiddenClass;
})();
