(function () {
  const settings = window.gtranslateSettings?.["43217984"];
  if (!settings) return;

  const languages = {
    it: "Italiano",
    en: "English",
    fr: "Français",
    de: "Deutsch",
    es: "Español"
  };

  const wrapper = document.querySelector(settings.wrapper_selector);
  if (!wrapper) return;

  const createFlag = (code) => {
    const img = document.createElement("img");
    img.src = `${settings.flags_location}${code}.svg`;
    img.alt = code;
    img.width = settings.flag_size || 24;
    img.height = settings.flag_size || 24;
    img.style.verticalAlign = "middle";
    img.style.marginRight = "6px";
    return img;
  };

  const createButton = (code, label) => {
    const btn = document.createElement("button");
    btn.setAttribute("data-lang", code);
    btn.style.border = "none";
    btn.style.background = "none";
    btn.style.cursor = "pointer";
    btn.style.fontSize = "14px";
    btn.style.margin = "0 6px";
    btn.style.padding = "4px 8px";
    btn.style.display = "inline-flex";
    btn.style.alignItems = "center";

    btn.appendChild(createFlag(code));
    btn.appendChild(document.createTextNode(label));

    btn.addEventListener("click", () => {
      const url = `https://translate.google.com/translate?sl=${settings.default_language}&tl=${code}&u=${encodeURIComponent(window.location.href)}`;
      window.location.href = url;
    });

    return btn;
  };

  Object.entries(languages).forEach(([code, label]) => {
    wrapper.appendChild(createButton(code, label));
  });
})();