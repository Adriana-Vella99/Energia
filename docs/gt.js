(function(){
  'use strict';

  // 1. recupera impostazioni
  var scriptEl = document.currentScript;
  var widgetId = scriptEl.getAttribute('data-gt-widget-id');
  var gt = (window.gtranslateSettings||{})[widgetId];
  if (!gt) return;

  var langs   = gt.languages;
  var defLang = gt.default_language || 'it';
  var flags   = (gt.flags_location||'./images/flags/svg/').replace(/\/?$/,'/') ;
  var size    = gt.flag_size || 24;
  var wrapper = document.querySelector(gt.wrapper_selector);
  if (!wrapper) return;

  // 2. style del wrapper (fisso in alto a destra)
  Object.assign(wrapper.style,{
    position:'fixed', top:'20px', right:'20px',
    zIndex:'9999', fontFamily:'sans-serif'
  });

  // 3. carica Google Translate inline (API)
  window.googleTranslateElementInit2 = function(){
    new google.translate.TranslateElement({
      pageLanguage: defLang,
      includedLanguages: langs.join(','),
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
      autoDisplay: false
    }, 'google_translate_element2');
  };
  var s = document.createElement('script');
  s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit2';
  document.head.appendChild(s);

  // 4. helper per creare flag+label
  function makeItem(code){
    var a = document.createElement('a');
    a.href = '#';
    a.setAttribute('data-lang', code);
    a.style.cssText = 'display:flex;align-items:center;padding:6px 12px;font-size:14px;text-decoration:none;color:inherit';
    a.innerHTML =
      '<img src="'+flags+code+'.svg" width="'+size+'" height="'+size+'" '+
      'style="margin-right:6px;vertical-align:middle" alt="'+code+'">'+
      '<span>'+code.toUpperCase()+'</span>';
    a.addEventListener('click', function(evt){
      evt.preventDefault();
      // chiama l’API inline, non redirect
      if(window.doGTranslate){
        window.doGTranslate(defLang+'|'+code);
      }
    });
    return a;
  }

  // 5. costruisci dropdown
  var btn = document.createElement('div');
  btn.className = 'gt-switcher';
  btn.style.cssText = 'cursor:pointer;display:inline-flex;align-items:center';
  btn.innerHTML =
    '<img src="'+flags+defLang+'.svg" width="'+size+'" height="'+size+'" '+
    'style="margin-right:6px;vertical-align:middle" alt="'+defLang+'">'+
    '<span style="font-size:14px">'+defLang.toUpperCase()+'</span>'+
    '<span style="font-size:10px;color:#666;margin-left:4px">▼</span>';

  var list = document.createElement('div');
  list.className = 'gt-list';
  list.style.cssText = 'display:none;position:absolute;top:100%;right:0;'
    +'background:#fff;border:1px solid #ddd;border-radius:6px;box-shadow:0 4px 8px rgba(0,0,0,0.1);'
    +'z-index:10000;';

  langs.forEach(function(l){
    list.appendChild(makeItem(l));
  });

  wrapper.appendChild(btn);
  wrapper.appendChild(list);

  // 6. toggle apertura/chiusura
  btn.addEventListener('click', function(e){
    e.stopPropagation();
    list.style.display = list.style.display==='block'?'none':'block';
  });
  document.addEventListener('click', function(){
    list.style.display = 'none';
  });

})();