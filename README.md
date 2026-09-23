# Polux — Gym &amp; Kine

Sitio estático (HTML/CSS/JS puro, sin build) de nivel agencia. Un solo
sitio con **dos marcas**: Polux Gym (entrenamiento) y Polux Kine
(rehabilitación/fisioterapia), con una pantalla de bienvenida donde el
visitante elige cuál quiere ver. Incluye calculadora de IMC, botón de
WhatsApp y captura de leads — 100% estático, sin necesitar ninguna
clave de API para funcionar. Desplegable en **Vercel** en un paso.

---

## 0. Ver el sitio ahora mismo (sin instalar nada)

El sitio funciona standalone. Si tenés Node instalado:

```bash
npx serve .
```

Si no tenés Node ni Python (como en esta máquina), usá el script de
PowerShell incluido — no necesita instalar nada:

```powershell
powershell -ExecutionPolicy Bypass -File preview.ps1
```

Y abrí http://localhost:5500 en tu navegador. Todo funciona de
entrada: la calculadora de IMC es matemática pura (sin IA ni API), y
no hay nada más que configurar para mostrárselo a un cliente.

---

## 1. Estructura del proyecto

```
pulse-fitness/
├── index.html              # TODO el sitio: chooser + Polux Gym + Polux Kine
├── css/styles.css          # estilos — Kine sobreescribe el naranja de Gym
│                              por azul con body[data-mode="kine"]
├── js/
│   ├── brand-switch.js       # muestra/oculta Gym vs Kine, arma el nav
│   ├── main.js                # menú móvil, animaciones, formularios de contacto
│   └── calculator.js          # calculadora de IMC (cálculo local, sin IA)
├── api/
│   └── lead.js                 # POST /api/lead — reenvía los leads del formulario
├── assets/images/          # fotos reales del local + logo + créditos Openverse
└── scripts/
    └── generate-ai-images.js  # opcional: generar fotos con IA (OpenAI) si hiciera falta
```

Vercel detecta automáticamente esta estructura: todo lo que está en la
raíz (`index.html`, `css/`, `js/`, `assets/`) se sirve como sitio
estático, y `api/lead.js` se convierte solo en el endpoint
`https://tudominio.vercel.app/api/lead`. No hace falta configurar nada
extra ni tener un `vercel.json`.

**Por qué es un solo `index.html` y no dos páginas:** Gym y Kine
comparten nav, footer, formulario de contacto y estilos — separarlos en
dos archivos hubiera duplicado casi todo. En cambio, hay dos bloques
(`#siteGym` y `#siteKine`) que `js/brand-switch.js` muestra u oculta
según lo que el visitante elija en la pantalla de bienvenida.

---

## 2. Personalizar el sitio para tu cliente

1. **Nombre y logo:** buscá `assets/images/logo.png` (Polux Gym) y
   reemplazalo por el del cliente. Polux Kine usa el mismo logo por
   ahora — reemplazalo si el cliente tiene uno propio para esa sección.
2. **Colores:** viven como variables CSS en `css/styles.css` (bloque
   `:root` al inicio, para Gym) y en `body[data-mode="kine"]` (para
   Kine). Cambiá `--accent` en cada bloque y el resto del sitio se
   actualiza solo — botones, bordes, íconos, todo usa esa variable.
3. **Tipografía:** el título grande usa `--font-display` (Poppins). Se
   cambia en un solo lugar en `css/styles.css` y en el `<link>` de
   Google Fonts en el `<head>`.
4. **Textos:** todo está en `index.html`, dentro de los bloques
   `#siteGym` y `#siteKine`.
5. **WhatsApp:** el botón flotante apunta a un número real del cliente.
   Buscá `wa.me/` en `js/brand-switch.js` si hace falta cambiarlo.
6. Para otro rubro, la estructura de tarjetas (`.card`, `.grid-3`,
   `.grid-4`, `.grid-5`, `.trainer-card`) es reutilizable para lo que
   necesites (Servicios, Equipo, Menú, etc.).

---

## 3. Imágenes

**Ya incluidas:** fotos reales del local (provistas por el cliente) más
algunas fotos de referencia con licencia libre de
[Openverse](https://openverse.org) para completar el equipo. Los
créditos completos están en `assets/images/ATTRIBUTION.json`. Cuando el
cliente tenga fotos propias del equipo, reemplazá los archivos
`trainer*.jpg` y actualizá el `alt` correspondiente.

**Para generar imágenes con IA (opcional, si hiciera falta más adelante):**

```bash
$env:OPENAI_API_KEY = "tu-clave-aqui"
node scripts/generate-ai-images.js
```

Requiere Node instalado (no disponible en esta máquina — corré esto
desde tu PC o cualquier entorno con Node). Nunca pegues la clave
directamente en el código, siempre como variable de entorno.

---

## 4. Captura de leads

Los dos formularios de contacto (Gym y Kine) envían a `/api/lead` — una
función serverless de Vercel. Como las funciones serverless no tienen
disco persistente, `/api/lead` reenvía cada lead a un webhook si
configurás `LEADS_WEBHOOK_URL` en Vercel (por ejemplo, un webhook de
Zapier/Make, o un Google Sheet con Apps Script). Sin esto, los leads
solo quedan en los logs de Vercel. Mientras no despliegues el sitio,
cada envío se guarda automáticamente en el `localStorage` del
navegador para no perder nada.

---

## 5. Publicar en Vercel

**Opción A — arrastrar y soltar (la más simple, sin instalar nada):**

1. Entrá a https://vercel.com/new con tu cuenta (podés crear una gratis
   con GitHub, GitLab o email).
2. En esa misma página hay una opción para **arrastrar la carpeta del
   proyecto** directamente, o elegirla desde el explorador de archivos.
3. Soltá la carpeta → Vercel la sube y la publica automáticamente. En
   menos de un minuto te da una URL tipo `https://polux-xxxx.vercel.app`.
4. Si configurás `LEADS_WEBHOOK_URL`, andá a **Settings → Environment
   Variables** → agregala → **Redeploy** para que tome efecto.

**Opción B — conectado a GitHub (recomendado si vas a seguir iterando):**

1. Subí esta carpeta a un repositorio de GitHub.
2. En https://vercel.com/new, elegí **Import Git Repository** y
   seleccioná ese repo.
3. Dejá la configuración por defecto (Vercel detecta que es un sitio
   estático + la función `api/lead.js`) y hacé clic en **Deploy**.
4. Cada vez que hagas `git push`, Vercel vuelve a publicar el sitio solo.

**Nota:** esta máquina no tiene Node ni Git instalados, así que estos
pasos (crear cuenta, arrastrar la carpeta o conectar GitHub) los tenés
que hacer vos desde tu navegador — es rápido y no requiere instalar nada
si usás la Opción A.

---

## 6. Conectar un dominio propio

1. En el proyecto de Vercel: **Settings → Domains** → escribí el dominio
   del cliente → **Add**.
2. Vercel te muestra qué registros DNS agregar (normalmente un `CNAME`
   o los nameservers de Vercel).
3. Si el dominio está en otro proveedor, entrás al panel DNS de ese
   proveedor y agregás el registro que Vercel te indicó.
4. La propagación puede tardar minutos u horas. Vercel activa HTTPS
   automáticamente apenas detecta el dominio conectado.

---

## Checklist para vender esto a un cliente

- [ ] Reemplazar el logo de Polux Kine (por ahora usa el de Polux Gym)
- [ ] Reemplazar las fotos de referencia de los profes por las reales
      cuando el cliente las tenga
- [ ] Confirmar los números de WhatsApp en `js/brand-switch.js`
- [ ] Deployar a Vercel (arrastrar y soltar o vía GitHub)
- [ ] Configurar `LEADS_WEBHOOK_URL` para no perder ningún lead
- [ ] Conectar el dominio del cliente y confirmar que HTTPS esté activo
- [ ] Probar los formularios de contacto (Gym y Kine) en el sitio publicado
