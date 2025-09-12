(function(){
    var gt = window.gtranslateSettings || {};
    gt = gt[document.currentScript.getAttribute('data-gt-widget-id')] || gt;

    var lang_array_english = {"en":"English","fr":"French","de":"German","it":"Italian","es":"Spanish",};
    var lang_array_native = {"en":"English","fr":"Français","de":"Deutsch","it":"Italiano","es":"Español",};

    var default_language = gt.default_language||'auto';
    var languages = gt.languages||Object.keys(lang_array_english).sort(function(x,y){return x==default_language?-1:y==default_language?1:0;});
    var alt_flags = gt.alt_flags||{};
    var flag_size = gt.flag_size||32;
    var flag_style = gt.flag_style||'2d';
    var flags_location = gt.flags_location||'https://cdn.gtranslate.net/flags/';
    var url_structure = gt.url_structure||'none';
    var custom_domains = gt.custom_domains||{};

    var horizontal_position = gt.horizontal_position||'inline';
    var vertical_position = gt.vertical_position||null;

    var native_language_names = gt.native_language_names||false;
    var detect_browser_language = gt.detect_browser_language||false;
    var wrapper_selector = gt.wrapper_selector||'.gtranslate_wrapper';

    var custom_css = gt.custom_css||'';
    var lang_array = native_language_names?lang_array_native:lang_array_english;

    var u_class = '.gt_container-'+Array.from('popup'+wrapper_selector).reduce(function(h,c){return 0|(31*h+c.charCodeAt(0))},0).toString(36);

    var widget_code = '<!-- GTranslate: https://gtranslate.com -->';
    var widget_css = custom_css;

    flags_location += (flag_style=='3d'?flag_size:'svg')+'/';
    var flag_ext = flag_style=='3d'?'.png':'.svg';

    function get_lang_href(lang) {
        var href = '#';

        if(url_structure == 'sub_directory') {
            var gt_request_uri = (document.currentScript.getAttribute('data-gt-orig-url') || (location.pathname.startsWith('/'+current_lang+'/') && '/'+location.pathname.split('/').slice(2).join('/') || location.pathname)) + location.search + location.hash;
            href = (lang == default_language) && location.protocol+'//'+location.hostname+gt_request_uri || location.protocol+'//'+location.hostname+'/'+lang+gt_request_uri;
        } else if(url_structure == 'sub_domain') {
            var gt_request_uri = (document.currentScript.getAttribute('data-gt-orig-url') || location.pathname) + location.search + location.hash;
            var domain = document.currentScript.getAttribute('data-gt-orig-domain') || location.hostname;
            if(typeof custom_domains == 'object' && custom_domains[lang])
                href = (lang == default_language) && location.protocol+'//'+domain+gt_request_uri || location.protocol+'//'+custom_domains[lang]+gt_request_uri;
            else
                href = (lang == default_language) && location.protocol+'//'+domain+gt_request_uri || location.protocol+'//'+lang+'.'+domain.replace(/^www\./, '')+gt_request_uri;
        }

        return href;
    }

    widget_css += "a.glink{text-decoration:none}a.glink.gt-current-lang{font-weight:bold}";
    var font_size = 10, margin_right = 3;
    if(flag_size == 24)
        font_size = 15, margin_right = 5;
    else if(flag_size == 32)
        font_size = 20, margin_right = 7;
    else if(flag_size == 48)
        font_size = 24, margin_right = 10;
    widget_css += u_class + " a.glink span{margin-right:"+margin_right+"px;font-size:"+font_size+"px;vertical-align:middle}";
    widget_css += "a.glink img{vertical-align:middle;display:inline;border:0;padding:0;margin:0;opacity:0.8;height:auto}";
    widget_css += "a.glink:hover img{opacity:1}";

    var current_lang = document.querySelector('html').getAttribute('lang')||default_language;
    if(url_structure == 'none') {
        var googtrans_matches = document.cookie.match('(^|;) ?googtrans=([^;]*)(;|$)');
        current_lang = googtrans_matches && googtrans_matches[2].split('/')[2] || current_lang;
    }

    if(!lang_array[current_lang])
        current_lang = default_language;

    widget_code += '<a href="#" class="gt_switcher-popup glink nturl notranslate">';

    var arrow_down = '<span style="color:#666;font-size:8px;font-weight:bold;">&#9660;</span>';
    widget_code += '<img src="'+get_flag_src(current_lang)+'" height="'+flag_size+'" width="'+flag_size+'" alt="'+current_lang+'" /> <span>'+lang_array[current_lang]+'</span>'+arrow_down+'</a>';

    widget_code += '<div class="gt_black_overlay"></div>';
    widget_code += '<div class="gt_white_content notranslate">';
    widget_code += '<div class="gt_languages">';

    languages.forEach(function(lang) {
        var el_a = document.createElement('a');
        el_a.href = get_lang_href(lang);
        el_a.classList.add('glink', 'nturl');
        current_lang == lang && el_a.classList.add('gt-current-lang');
        el_a.setAttribute('data-gt-lang', lang);

        var el_img = document.createElement('img');
        el_img.height = el_img.width = flag_size;
        el_img.alt = lang;
        el_img.setAttribute('data-gt-lazy-src', get_flag_src(lang));

        el_a.appendChild(el_img);
        el_a.innerHTML += ' <span>' + lang_array[lang] + '</span>';

        widget_code += el_a.outerHTML;
    });

    widget_code += '</div></div>';

    var a_height = flag_style=='2d' ? 0.75 * flag_size + 21 : flag_size + 13;
    var a_width = flag_size + margin_right + font_size * 8;
    var popup_height = Math.min(375, languages.length * a_height + 12);
    var popup_width = Math.min(980, 0.8 * window.innerWidth);
    var popup_columns = Math.floor(popup_width / a_width);
    var langs_per_col = Math.floor(popup_height / a_height);

    while(popup_columns > 1 && Math.floor(langs_per_col * popup_columns / languages.length) > 1) {
        popup_columns--;
        popup_width = popup_columns * a_width + 32;
    }

    widget_css += '.gt_black_overlay{display:none;position:fixed;top:0%;left:0%;width:100%;height:100%;background-color:black;z-index:10000;-moz-opacity:0.8;opacity:.80;filter:alpha(opacity=80)}';
    widget_css += '.gt_white_content{display:none;position:fixed;top:50%;left:50%;width:'+popup_width+'px;height:'+popup_height+'px;margin:-'+(popup_height/2)+'px 0 0 -'+(popup_width/2)+'px;padding:6px 16px;background-color:white;color:black;z-index:19881205;overflow:auto;text-align:left}';
    widget_css += '.gt_white_content a{display:block;padding:'+(flag_style=='2d'?10:6)+'px 0;border-bottom:1px solid #e7e7e7;white-space:nowrap;line-height:0;flex-basis:'+a_height+'px;box-sizing:border-box;}';
    widget_css += '.gt_white_content .gt_languages{display:flex;flex-flow:column wrap;max-height:'+Math.max(popup_height, a_height * Math.ceil(languages.length / popup_columns))+'px;overflow-x:hidden;}';
    widget_css += '.gt_white_content::-webkit-scrollbar-track{background-color:#F5F5F5}';
    widget_css += '.gt_white_content::-webkit-scrollbar{width:5px}';
    widget_css += '.gt_white_content::-webkit-scrollbar-thumb{background-color:#888}';

    if(url_structure == 'none') {
        widget_code += '<div id="google_translate_element2"></div>';

        widget_css += "div.skiptranslate,#google_translate_element2{display:none!important}";
        widget_css += "body{top:0!important}";
        widget_css += "font font{background-color:transparent!important;box-shadow:none!important;position:initial!important}";
    }

    if(horizontal_position != 'inline')
        widget_code = '<div class="gt_switcher_wrapper" style="position:fixed;'+vertical_position+':15px;'+horizontal_position+':15px;z-index:999999;">' + widget_code + '</div>';

    var add_css = document.createElement('style');
    add_css.classList.add('gtranslate_css');
    add_css.textContent = widget_css;
    document.head.appendChild(add_css);

    document.querySelectorAll(wrapper_selector).forEach(function(e){e.classList.add(u_class.substring(1));e.innerHTML+=widget_code});

    var gt_popup_open = false;
    function gt_show_popup(el) {
        gt_popup_open = true;
        el.parentNode.querySelectorAll('.gt_white_content a img:not([src])').forEach(function(img) {img.setAttribute('src', img.getAttribute('data-gt-lazy-src'));});
        el.parentNode.querySelectorAll('.gt_white_content,.gt_black_overlay').forEach(function(e){e.style.display='block';});
    }
    function gt_hide_popup() {gt_popup_open=false;document.querySelectorAll('.gt_white_content,.gt_black_overlay').forEach(function(e){e.style.display='none'});}

    document.querySelectorAll(u_class+' a.gt_switcher-popup').forEach(function(e){
        e.addEventListener('click', function(evt) {evt.preventDefault();evt.stopPropagation();if(gt_popup_open)gt_hide_popup();else gt_show_popup(e);});
        e.addEventListener('pointerenter', function(evt) {evt.target.parentNode.querySelectorAll('.gt_languages img:not([src])').forEach(function(img){img.setAttribute('src', img.getAttribute('data-gt-lazy-src'))})});
    });
    document.querySelectorAll(u_class+' .gt_black_overlay').forEach(function(e){e.addEventListener('click', function(evt) {if(gt_popup_open)gt_hide_popup()})});

    if(url_structure == 'none') {
        function get_current_lang() {var keyValue = document.cookie.match('(^|;) ?googtrans=([^;]*)(;|$)');return keyValue ? keyValue[2].split('/')[2] : null;}
        function fire_event(element,event){try{if(document.createEventObject){var evt=document.createEventObject();element.fireEvent('on'+event,evt)}else{var evt=document.createEvent('HTMLEvents');evt.initEvent(event,true,true);element.dispatchEvent(evt)}}catch(e){}}
        function load_tlib(){if(!window.gt_translate_script){window.gt_translate_script=document.createElement('script');gt_translate_script.src='https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit2';document.body.appendChild(gt_translate_script);}}
        window.doGTranslate = function(lang_pair){if(lang_pair.value)lang_pair=lang_pair.value;if(lang_pair=='')return;var lang=lang_pair.split('|')[1];if(get_current_lang() == null && lang == lang_pair.split('|')[0])return;var teCombo;var sel=document.getElementsByTagName('select');for(var i=0;i<sel.length;i++)if(sel[i].className.indexOf('goog-te-combo')!=-1){teCombo=sel[i];break;}if(document.getElementById('google_translate_element2')==null||document.getElementById('google_translate_element2').innerHTML.length==0||teCombo.length==0||teCombo.innerHTML.length==0){setTimeout(function(){doGTranslate(lang_pair)},500)}else{teCombo.value=lang;fire_event(teCombo,'change');fire_event(teCombo,'change')}}
        window.googleTranslateElementInit2=function(){new google.translate.TranslateElement({pageLanguage:default_language,autoDisplay:false},'google_translate_element2')};

        if(current_lang != default_language)
            load_tlib();
        else
            document.querySelectorAll(u_class).forEach(function(e){e.addEventListener('pointerenter',load_tlib)});

        document.querySelectorAll(u_class + ' a[data-gt-lang]').forEach(function(e){e.addEventListener('click', function(evt) {
            evt.preventDefault();
            document.querySelectorAll(u_class + ' a.gt-current-lang').forEach(function(e){e.classList.remove('gt-current-lang')});
            e.classList.add('gt-current-lang');
            doGTranslate(default_language+'|'+e.getAttribute('data-gt-lang'));
            e.parentNode.parentNode.parentNode.querySelector('a.gt_switcher-popup').innerHTML=e.innerHTML+arrow_down;
            gt_hide_popup();
        })});
    }

    if(detect_browser_language && window.sessionStorage && window.navigator && sessionStorage.getItem('gt_autoswitch') == null && !/bot|spider|slurp|facebook/i.test(navigator.userAgent)) {
        var accept_language = (navigator.language||navigator.userLanguage).toLowerCase();
        switch(accept_language) {
            case 'zh':
            case 'zh-cn':var preferred_language = 'zh-CN';break;
            case 'zh-tw':
            case 'zh-hk':var preferred_language = 'zh-TW';break;
            case 'he':var preferred_language = 'iw';break;
            default:var preferred_language = accept_language.substr(0,2);break;
        }

        if(current_lang == default_language && preferred_language != default_language && languages.includes(preferred_language)) {
            if(url_structure == 'none') {
                load_tlib();
                window.gt_translate_script.onload=function(){
                    doGTranslate(default_language+'|'+preferred_language);
                    var el = document.querySelector(u_class+' a[data-gt-lang="'+preferred_language+'"]');
                    el.querySelectorAll('img:not([src])').forEach(function(e){e.setAttribute('src', e.getAttribute('data-gt-lazy-src'))});
                    el.parentNode.parentNode.parentNode.querySelector('a.gt_switcher-popup').innerHTML=el.innerHTML+arrow_down;
                };
            } else
                document.querySelectorAll(u_class+' a[data-gt-lang="'+preferred_language+'"]').forEach(function(e){location.href=e.href});
        }

        sessionStorage.setItem('gt_autoswitch', 1);
    }
})();