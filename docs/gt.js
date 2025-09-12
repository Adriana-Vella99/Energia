(function(){
  'use strict';

  // 1. Recupera impostazioni
  var scriptEl = document.currentScript ||
                 document.getElementsByTagName('script')[document.getElementsByTagName('script').length - 1];
  var widgetId = scriptEl.getAttribute('data-gt-widget-id');
  var gt = (window.gtranslateSettings || {})[widgetId];
  if (!gt) return;

  // 2. Setup lingue e flag
  var langNames = {
    it: "Italiano",
    en: "English",
    fr: "Français",
    de: "Deutsch",
    es: "Español"
  };
  var defaultLang = gt.default_language || 'it';
  var languages   = gt.languages && gt.languages.length
                  ? gt.languages
                  : Object.keys(langNames);

  var flagsLocation = (gt.flags_location || './images/flags/svg/').replace(/\/?$/, '/');
  var flagSize      = gt.flag_size || 24;
  var flagExt       = '.svg';

  // 3. Trova wrapper e applica stile fixed in alto a destra
  var wrapper = document.querySelector(gt.wrapper_selector || '#google-translate');
  if (!wrapper) return;
  Object.assign(wrapper.style, {
    position : 'fixed',
    top      : '20px',
    right    : '20px',
    zIndex   : '10000',
    cursor   : 'pointer'
  });

  // 4. Determina lingua attuale
  var currentLang = document.documentElement.getAttribute('lang') || defaultLang;
  var cookieMatch = document.cookie.match(/(?:^|;)\s*googtrans=\/[^/]+\/([^;]+)/);
  if (cookieMatch && langNames[cookieMatch[1]]) {
    currentLang = cookieMatch[1];
  }
  if (!langNames[currentLang]) {
    currentLang = defaultLang;
  }

  // 5. Crea pulsante principale
  function makeSwitcher(code) {
    var a = document.createElement('a');
    a.className = 'gtranslate-switcher';
    a.innerHTML = ''
      + '<img src="'+ flagsLocation + code + flagExt + '" '
      +   'width="'+ flagSize +'" height="'+ flagSize +'" '
      +   'alt="'+ code +'" style="vertical-align:middle;margin-right:6px">'
      + '<span style="vertical-align:middle;font-size:14px;color:inherit">'
      +   langNames[code]
      + '</span>'
      + '<span style="vertical-align:middle;font-size:10px;color:#666;margin-left:4px">▼</span>';
    return a;
  }

  // 6. Crea lista a comparsa
  function makeList() {
    var div = document.createElement('div');
    div.className = 'gtranslate-list';
    Object.keys(langNames).filter(function(l){ return languages.indexOf(l)>-1 })
      .forEach(function(code) {
        var a = document.createElement('a');
        a.href = '#';
        a.className = 'gtranslate-item';
        a.setAttribute('data-lang', code);

        a.innerHTML = ''
          + '<img src="'+ flagsLocation + code + flagExt + '" '
          +   'width="'+ flagSize +'" height="'+ flagSize +'" '
          +   'alt="'+ code +'" style="vertical-align:middle;margin-right:6px">'
          + '<span style="vertical-align:middle;font-size:14px;color:inherit">'
          +   langNames[code]
          + '</span>';

        a.addEventListener('click', function(e){
          e.preventDefault();
          var target = code;
          var url = 'https://translate.google.com/translate'
                  + '?sl=' + defaultLang
                  + '&tl=' + target
                  + '&u='  + encodeURIComponent(window.location.href);
          window.location.href = url;
        });

        div.appendChild(a);
      });
    return div;
  }

  // 7. Inietta HTML
  wrapper.innerHTML = '';
  var switcher = makeSwitcher(currentLang);
  var list     = makeList();
  wrapper.appendChild(switcher);
  wrapper.appendChild(list);

  // 8. Inietta CSS
  var css = ''
    + gt.wrapper_selector + ' { font-family: sans-serif; }\n'
    + gt.wrapper_selector + ' .gtranslate-switcher { text-decoration:none; display:inline-flex; align-items:center; }\n'
    + gt.wrapper_selector + ' .gtranslate-list {\n'
    + '  display:none;\n'
    + '  position:absolute;\n'
    + '  top: calc(100% + 8px);\n'
    + '  right: 0;\n'
    + '  background:#fff;\n'
    + '  border:1px solid #ddd;\n'
    + '  border-radius:6px;\n'
    + '  box-shadow:0 4px 8px rgba(0,0,0,0.1);\n'
    + '  padding:8px 0;\n'
    + '  z-index:10001;\n'
    + '}\n'
    + gt.wrapper_selector + ' .gtranslate-item {\n'
    + '  display:flex;\n'
    + '  align-items:center;\n'
    + '  padding:6px 12px;\n'
    + '  text-decoration:none;\n'
    + '  color:inherit;\n'
    + '}\n'
    + gt.wrapper_selector + ' .gtranslate-item:hover { background:#f5f5f5; }\n';
  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // 9. Gestione apertura/chiusura
  switcher.addEventListener('click', function(e){
    e.preventDefault();
    list.style.display = list.style.display === 'block' ? 'none' : 'block';
  });

  document.addEventListener('click', function(e){
    if (!wrapper.contains(e.target)) {
      list.style.display = 'none';
    }
  });

})();