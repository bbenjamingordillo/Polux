/* ============================================
   MAIN — nav, scroll reveal, mobile menu, lead form
   ============================================ */

(function () {
  "use strict";

  // Mobile nav toggle
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      navLinks.classList.toggle("open");
    });
  }

  // Close mobile nav when a link is clicked
  document.querySelectorAll(".nav-links a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
    });
  });

  // Scroll reveal animation
  const revealEls = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach(function (el) { observer.observe(el); });

  // Pill group selectors (calculator)
  document.querySelectorAll(".pill-group").forEach(function (group) {
    group.addEventListener("click", function (e) {
      const target = e.target.closest(".pill-option");
      if (!target) return;
      group.querySelectorAll(".pill-option").forEach(function (p) { p.classList.remove("active"); });
      target.classList.add("active");
    });
  });

  // ============ "SOLICITAR PLAN" FROM A TRAINER CARD ============
  // Pre-selects that trainer in the contact form and scrolls to it.
  document.querySelectorAll("[data-request-trainer]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const name = btn.dataset.requestTrainer;
      const trainerSelect = document.getElementById("leadTrainer");
      const contactSection = document.getElementById("contacto-gym");
      if (trainerSelect) trainerSelect.value = name;
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
        const nameInput = document.getElementById("leadName");
        if (nameInput) setTimeout(function () { nameInput.focus(); }, 500);
      }
    });
  });

  // ============ LEAD CAPTURE FORMS ============
  // Both the Polux Gym and Polux Kine sections have their own contact
  // form (marked with data-lead-form) — handle every one of them the
  // same way. Sends to /api/lead (Vercel serverless function) when
  // available; falls back to local storage so the demo works even
  // before deploying.
  document.querySelectorAll("[data-lead-form]").forEach(function (leadForm) {
    const originalBtnText = leadForm.querySelector("button[type=submit]").textContent;

    leadForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const submitBtn = leadForm.querySelector("button[type=submit]");
      const successEl = leadForm.querySelector(".form-success");

      const lead = {
        name: leadForm.querySelector('[name="name"]').value,
        phone: leadForm.querySelector('[name="phone"]').value,
        goal: leadForm.querySelector('[name="goal"]').value,
        trainer: leadForm.querySelector('[name="trainer"]') ? leadForm.querySelector('[name="trainer"]').value : "",
        message: leadForm.querySelector('[name="message"]').value,
        source: document.body.dataset.mode === "kine" ? "landing-polux-kine" : "landing-polux-gym"
      };

      submitBtn.disabled = true;
      submitBtn.textContent = "Enviando...";

      try {
        if (typeof SUPABASE_CONFIGURED === "undefined" || !SUPABASE_CONFIGURED) {
          throw new Error("Supabase no configurado");
        }
        const { error } = await supabaseClient.from("leads").insert(lead);
        if (error) throw error;
      } catch (err) {
        // Todavía no está conectada la base de datos: guardamos la consulta
        // en este navegador para no perderla.
        const stored = JSON.parse(localStorage.getItem("polux_leads") || "[]");
        stored.push(Object.assign({ createdAt: new Date().toISOString() }, lead));
        localStorage.setItem("polux_leads", JSON.stringify(stored));
      }

      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
      successEl.classList.add("show");
      leadForm.reset();
      setTimeout(function () { successEl.classList.remove("show"); }, 6000);
    });
  });
})();
