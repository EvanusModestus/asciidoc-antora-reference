/*
 * code-toolbar.js — a custom, always-visible toolbar on every code block:
 * a language pill (left) + a copy button with icon and Copy/Copied states.
 *
 * Replaces the stock UI's hover-only `.source-toolbox` (hidden via theme.css),
 * so the label and copy control read as designed elements, not defaults. Copy
 * is self-contained (Clipboard API + execCommand fallback) — no dependency on
 * the bundle's site.js. Language is read from the `language-*` class Antora
 * puts on the <code> element before highlight.js runs.
 */
;(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn()
    else document.addEventListener('DOMContentLoaded', fn)
  }

  var ICON_COPY =
    '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">' +
    '<path fill="currentColor" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"/>' +
    '<path fill="currentColor" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"/></svg>'
  var ICON_CHECK =
    '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">' +
    '<path fill="currentColor" d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/></svg>'

  function button(label, icon) {
    return icon + '<span class="cb-copy-label">' + label + '</span>'
  }

  ready(function () {
    var blocks = document.querySelectorAll('.doc .listingblock')
    Array.prototype.forEach.call(blocks, function (block) {
      var pre = block.querySelector('pre')
      if (!pre || block.querySelector('.cb-toolbar')) return
      var content = block.querySelector('.content') || block
      content.classList.add('cb-has-toolbar')

      var code = pre.querySelector('code')
      var lang = ''
      if (code) {
        var m = /(?:^|\s)language-([\w-]+)/.exec(code.className)
        if (m) lang = m[1]
      }

      var bar = document.createElement('div')
      bar.className = 'cb-toolbar'

      if (lang) {
        var pill = document.createElement('span')
        pill.className = 'cb-lang'
        pill.textContent = lang
        bar.appendChild(pill)
      }

      var btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'cb-copy'
      btn.setAttribute('aria-label', 'Copy code to clipboard')
      btn.innerHTML = button('Copy', ICON_COPY)
      bar.appendChild(btn)

      btn.addEventListener('click', function () {
        var text = (code ? code.innerText : pre.innerText).replace(/\n$/, '')
        copy(text, function (ok) {
          btn.classList.toggle('is-copied', ok)
          btn.innerHTML = ok ? button('Copied', ICON_CHECK) : button('Error', ICON_COPY)
          window.setTimeout(function () {
            btn.classList.remove('is-copied')
            btn.innerHTML = button('Copy', ICON_COPY)
          }, 1600)
        })
      })

      content.appendChild(bar)
    })

    function copy(text, done) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          function () { done(true) },
          function () { fallback(text, done) }
        )
      } else {
        fallback(text, done)
      }
    }

    function fallback(text, done) {
      try {
        var ta = document.createElement('textarea')
        ta.value = text
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.focus()
        ta.select()
        var ok = document.execCommand('copy')
        document.body.removeChild(ta)
        done(ok)
      } catch (e) {
        done(false)
      }
    }
  })
})()
