(function(){
  'use strict';

  // 1. Recupera impostazioni e attributi dal <script>
  var scriptEl = document.currentScript;
  var widgetId = scriptEl.getAttribute('data-gt-widget-id');
  var cfg      = (window.gtranslateSettings||{})[widgetId];
  if (!cfg) return;

  // 2. Lingue e default
  var names = {
    it: "Italiano",
    en: "English",
    fr: "Français",
    de: "Deutsch",
    es: "Español",
    nl: "Dutch"
  };
  var langs       = Array.isArray(cfg.languages) && cfg.languages.length
                    ? cfg.languages
                    : Object.keys(names);
  var defaultLang = cfg.default_language || 'it';

  // 3. Configurazione bandiere
  var flagsLoc = (cfg.flags_location||'./images/flags/svg/').replace(/\/?$/,'/') ;
  var flagSize = cfg.flag_size || 24;
  var flagExt  = '.svg';

  // 4. Wrapper e stile (fisso in alto a destra)
  var wrapper = document.querySelector(cfg.wrapper_selector||'#google-translate');
  if (!wrapper) return;
  Object.assign(wrapper.style, {
    position: 'fixed',
    top:      '20px',
    right:    '20px',
    zIndex:   '10000',
    fontFamily:'sans-serif'
  });

  // 5. URL originale per sempre
  var origUrl = scriptEl.getAttribute('data-gt-orig-url')
              || (function(){
                   var m = window.location.search.match(/[?&]u=([^&]+)/);
                   return m ? decodeURIComponent(m[1]) : window.location.href;
                 })();

  // 6. Crea switcher e dropdown
  function makeSwitcher(code){
    var d = document.createElement('div');
    d.className = 'gt-switcher';
    d.style.cssText = 'display:inline-flex;align-items:center;cursor:pointer';
    d.innerHTML =
      '<img src="'+flagsLoc+code+flagExt+'" '+
           'width="'+flagSize+'" height="'+flagSize+'" '+
           'style="margin-right:6px;vertical-align:middle" alt="'+code+'">'+
      '<span style="font-size:14px;color:inherit">'+names[code]+'</span>'+
      '<span style="font-size:10px;color:#666;margin-left:4px">▼</span>';
    return d;
  }

  function makeList(){
    var div = document.createElement('div');
    div.className = 'gt-list';
    div.style.cssText =
      'display:none;position:absolute;top:100%;right:0;'
    + 'background:#fff;border:1px solid #ddd;border-radius:6px;'
    + 'box-shadow:0 4px 8px rgba(0,0,0,0.1);padding:8px 0;z-index:10001;';
    langs.forEach(function(code){
      var a = document.createElement('a');
      a.href = '#';
      a.setAttribute('data-lang', code);
      a.style.cssText =
        'display:flex;align-items:center;padding:6px 12px;'
      + 'font-size:14px;text-decoration:none;color:inherit';
      a.innerHTML =
        '<img src="'+flagsLoc+code+flagExt+'" '+
             'width="'+flagSize+'" height="'+flagSize+'" '+
             'style="margin-right:6px;vertical-align:middle" alt="'+code+'">'+
        '<span>'+names[code]+'</span>';
      a.addEventListener('click', function(e){
        e.preventDefault();
        var code = this.getAttribute('data-lang');

        if (code === defaultLang) {
          // 1) cancella il cookie GTranslate
          var domain = document.location.hostname;
          document.cookie = 'googtrans=/'+defaultLang+'/'+defaultLang+';domain='+domain+';path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'googtrans=/'+defaultLang+'/'+defaultLang+';domain=.'+domain+';path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT';

          // 2) ricarica l’URL originale
          window.location.href = origUrl;
          return;
        }

        // altrimenti usa Google Translate come prima
        var url = 'https://translate.google.com/translate'
                + '?sl=' + defaultLang
                + '&tl=' + code
                + '&u='  + encodeURIComponent(origUrl);
        window.location.href = url;
      });
      div.appendChild(a);
    });
    return div;
  }

  var switcher = makeSwitcher(defaultLang);
  var list     = makeList();
  wrapper.appendChild(switcher);
  wrapper.appendChild(list);

  // 7. Toggle dropdown
  switcher.addEventListener('click', function(evt){
    evt.stopPropagation();
    list.style.display = list.style.display==='block' ? 'none' : 'block';
  });
  document.addEventListener('click', function(){
    list.style.display = 'none';
  });

  // 8. Hover effect via CSS-injection
  var styleEl = document.createElement('style');
  styleEl.textContent =
    cfg.wrapper_selector + ' .gt-list a:hover { background: #f5f5f5; }';
  document.head.appendChild(styleEl);

})();
