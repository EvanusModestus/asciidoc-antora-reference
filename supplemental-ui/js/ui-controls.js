/*
 * ui-controls.js — the fixed bottom-right control dock.
 *
 * Holds the two page-level controls moved out of the top navbar:
 *   • Focus toggle — hides both sidebars for distraction-free reading
 *     (adds `is-focus` to <html>; the head-meta script applies it before paint
 *     so there is no layout flash on reload).
 *   • Theme picker — the five-theme <select> (persists to localStorage;
 *     the head-meta script applies the stored theme before paint).
 */
;(function () {
  var THEME_KEY = 'adoc-ref-theme'
  var FOCUS_KEY = 'adoc-ref-focus'
  var THEMES = [
    ['rose-dawn', 'Rosé Pine Dawn'],
    ['tokyo-night', 'Tokyo Night'],
    ['dracula', 'Dracula'],
    ['nord', 'Nord'],
    ['gruvbox', 'Gruvbox']
  ]
  var FOCUS_ICON =
    '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path fill="currentColor" ' +
    'd="M1.75 1h3.5a.75.75 0 0 1 0 1.5H3.56l2.72 2.72a.75.75 0 1 1-1.06 1.06L2.5 3.56v1.69a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 1.75 1Zm12.5 0a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0V3.56l-2.72 2.72a.75.75 0 1 1-1.06-1.06L12.44 2.5h-1.69a.75.75 0 0 1 0-1.5ZM1.75 15A.75.75 0 0 1 1 14.25v-3.5a.75.75 0 0 1 1.5 0v1.69l2.72-2.72a.75.75 0 1 1 1.06 1.06L3.56 13.5h1.69a.75.75 0 0 1 0 1.5Zm12.5 0h-3.5a.75.75 0 0 1 0-1.5h1.69l-2.72-2.72a.75.75 0 1 1 1.06-1.06l2.72 2.72v-1.69a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-.75.75Z"/></svg>'

  function ready(fn) {
    if (document.readyState !== 'loading') fn()
    else document.addEventListener('DOMContentLoaded', fn)
  }

  ready(function () {
    var root = document.documentElement
    var dock = document.createElement('div')
    dock.className = 'ui-dock'

    /* Focus toggle */
    var focusBtn = document.createElement('button')
    focusBtn.type = 'button'
    focusBtn.className = 'ui-dock-btn focus-toggle'
    focusBtn.title = 'Focus mode — hide the sidebars'
    var focusOn = root.classList.contains('is-focus')
    focusBtn.setAttribute('aria-pressed', focusOn ? 'true' : 'false')
    focusBtn.classList.toggle('is-active', focusOn)
    focusBtn.innerHTML = FOCUS_ICON + '<span class="ui-dock-label">Focus</span>'
    focusBtn.addEventListener('click', function () {
      var on = root.classList.toggle('is-focus')
      focusBtn.setAttribute('aria-pressed', on ? 'true' : 'false')
      focusBtn.classList.toggle('is-active', on)
      try { localStorage.setItem(FOCUS_KEY, on ? '1' : '0') } catch (e) {}
    })

    /* Theme picker */
    var themeWrap = document.createElement('div')
    themeWrap.className = 'ui-dock-theme'
    var sel = document.createElement('select')
    sel.id = 'theme-select'
    sel.setAttribute('aria-label', 'Color theme')
    sel.title = 'Color theme'
    THEMES.forEach(function (t) {
      var opt = document.createElement('option')
      opt.value = t[0]
      opt.textContent = t[1]
      sel.appendChild(opt)
    })
    sel.value = root.getAttribute('data-theme') || 'rose-dawn'
    sel.addEventListener('change', function () {
      root.setAttribute('data-theme', sel.value)
      try { localStorage.setItem(THEME_KEY, sel.value) } catch (e) {}
    })
    themeWrap.appendChild(sel)

    dock.appendChild(focusBtn)
    dock.appendChild(themeWrap)
    document.body.appendChild(dock)
  })
})()
