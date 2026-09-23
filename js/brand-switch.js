/* ============================================
   BRAND SWITCH — Polux Gym / Polux Kine
   Both experiences live in this same page/site. The visitor
   picks one on the chooser screen; everything below just
   shows/hides the right block and updates the shared nav.
   ============================================ */

(function () {
  "use strict";

  var NAV_LINKS = {
    gym: [
      { href: "#clases", label: "Clases" },
      { href: "#profesores", label: "Profesores" },
      { href: "#nutricion", label: "Nutrición" },
      { href: "#planes", label: "Planes" },
      { href: "#galeria", label: "Galería" },
      { href: "#contacto-gym", label: "Contacto" }
    ],
    kine: [
      { href: "#servicios", label: "Servicios" },
      { href: "#equipo", label: "Equipo" },
      { href: "#testimonios-kine", label: "Testimonios" },
      { href: "#contacto-kine", label: "Contacto" }
    ]
  };

  var NAV_CTA = {
    gym: { ghostText: "Ver planes", ghostHref: "#planes", primaryText: "Consultar", primaryHref: "#contacto-gym" },
    kine: { ghostText: "Ver servicios", ghostHref: "#servicios", primaryText: "Reservar turno", primaryHref: "#contacto-kine" }
  };

  // Real WhatsApp numbers — each brand has its own. Same opening message
  // for both, with a blank the visitor fills in with their name.
  var WHATSAPP_MSG = "Hola%2C%20mi%20nombre%20es%20----!%20Estoy%20interesado%2Fa%20en%20empezar%20mi%20cambio%20f%C3%ADsico!";
  var WHATSAPP = {
    gym: "https://wa.me/5493518751118?text=" + WHATSAPP_MSG,
    kine: "https://wa.me/5493513442856?text=" + WHATSAPP_MSG
  };

  var LOGO = {
    gym: { src: "assets/images/logo.png", alt: "Polux Gym" },
    kine: { src: "assets/images/logo-kine.jpg", alt: "Polux Kine" }
  };

  var chooser = document.getElementById("chooser");
  var siteGym = document.getElementById("siteGym");
  var siteKine = document.getElementById("siteKine");
  var navLinksEl = document.getElementById("navLinks");
  var navGhost = document.getElementById("navGhostBtn");
  var navPrimary = document.getElementById("navPrimaryBtn");
  var navCta = document.querySelector(".nav-cta");
  var whatsapp = document.getElementById("whatsappLauncher");
  var navLogoImg = document.querySelector("#navLogo img");

  function revealNow(container) {
    container.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  function renderNav(mode) {
    navLinksEl.innerHTML = "";
    NAV_LINKS[mode].forEach(function (item) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = item.href;
      a.textContent = item.label;
      li.appendChild(a);
      navLinksEl.appendChild(li);
    });
    navLinksEl.classList.remove("open");
    navCta.style.display = "flex";

    var cta = NAV_CTA[mode];
    navGhost.textContent = cta.ghostText;
    navGhost.href = cta.ghostHref;
    navPrimary.textContent = cta.primaryText;
    navPrimary.href = cta.primaryHref;

    whatsapp.href = WHATSAPP[mode];
    whatsapp.style.display = "flex";
    if (navLogoImg) {
      navLogoImg.src = LOGO[mode].src;
      navLogoImg.alt = LOGO[mode].alt;
    }
  }

  function selectMode(mode) {
    chooser.hidden = true;
    if (mode === "gym") {
      siteGym.hidden = false;
      siteKine.hidden = true;
      revealNow(siteGym);
    } else {
      siteKine.hidden = false;
      siteGym.hidden = true;
      revealNow(siteKine);
    }
    document.body.dataset.mode = mode;
    renderNav(mode);
    window.scrollTo(0, 0);
  }

  function resetToChooser() {
    siteGym.hidden = true;
    siteKine.hidden = true;
    chooser.hidden = false;
    navLinksEl.innerHTML = "";
    navGhost.textContent = "";
    navGhost.href = "#";
    navPrimary.textContent = "";
    navPrimary.href = "#";
    navCta.style.display = "none";
    whatsapp.style.display = "none";
    if (navLogoImg) {
      navLogoImg.src = LOGO.gym.src;
      navLogoImg.alt = "Polux";
    }
    document.body.dataset.mode = "chooser";
    window.scrollTo(0, 0);
  }

  document.querySelectorAll("[data-select-mode]").forEach(function (el) {
    el.addEventListener("click", function () { selectMode(el.dataset.selectMode); });
  });

  document.querySelectorAll("[data-switch-mode]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      selectMode(el.dataset.switchMode);
    });
  });

  var logo = document.getElementById("navLogo");
  if (logo) {
    logo.addEventListener("click", function (e) {
      e.preventDefault();
      resetToChooser();
    });
  }

  resetToChooser();
})();
