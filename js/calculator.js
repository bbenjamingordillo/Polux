/* ============================================
   AI CALCULATOR — IMC (BMI) estimator
   Pure client-side math (standard BMI formula).
   No API key needed.
   ============================================ */

(function () {
  "use strict";

  const form = document.getElementById("calcForm");
  if (!form) return;

  const CATEGORY = [
    { max: 18.5, label: "Bajo peso", note: "Te conviene sumar masa muscular de forma progresiva. Podés sumar seguimiento con Fiorella, nuestra nutricionista, y armar un plan de entrenamiento con nosotros." },
    { max: 25, label: "Peso normal", note: "¡Estás en el rango saludable! Mantenerlo con entrenamiento regular es el objetivo — nuestras clases grupales te pueden servir." },
    { max: 30, label: "Sobrepeso", note: "Un plan de entrenamiento constante y asesoramiento nutricional pueden ayudarte a bajar hacia el rango saludable de forma sostenible." },
    { max: Infinity, label: "Obesidad", note: "Te recomendamos combinar entrenamiento guiado con seguimiento nutricional profesional — hablá con Fiorella o con uno de nuestros entrenadores." }
  ];

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const weight = parseFloat(document.getElementById("calcWeight").value);
    const heightCm = parseFloat(document.getElementById("calcHeight").value);
    const heightM = heightCm / 100;

    const bmi = weight / (heightM * heightM);
    const category = CATEGORY.find(function (c) { return bmi < c.max; });

    const minWeight = Math.round(18.5 * heightM * heightM);
    const maxWeight = Math.round(24.9 * heightM * heightM);

    document.getElementById("resTdee").textContent = bmi.toFixed(1);
    document.getElementById("resProtein").textContent = category.label;
    document.getElementById("resCarbs").textContent = minWeight + " - " + maxWeight + " kg";
    document.getElementById("resNote").textContent = category.note;

    // Ubica el marcador en la barra del gráfico (escala fija 15–40 de IMC)
    const GAUGE_MIN = 15;
    const GAUGE_MAX = 40;
    const pct = Math.max(0, Math.min(100, ((bmi - GAUGE_MIN) / (GAUGE_MAX - GAUGE_MIN)) * 100));
    document.getElementById("bmiMarker").style.left = pct + "%";

    document.getElementById("calcPlaceholder").style.display = "none";
    document.getElementById("calcResultCard").classList.add("show");
  });
})();
