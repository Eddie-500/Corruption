// ----------------------
// Buscador de Presidentes (versión terminal hacker)
// ----------------------

let presidents = [];

// Intento cargar presidents.json
fetch("presidents.json")
  .then(r => r.json())
  .then(json => { presidents = json; })
  .catch(err => console.error("Error cargando presidents.json", err));

// Elementos
const searchInput = document.getElementById("searchInput");
const results = document.getElementById("results");
const infoArea = document.getElementById("infoArea");
const typingArea = document.getElementById("typingArea");
const bootOverlay = document.getElementById("bootOverlay");
const bootText = document.getElementById("bootText");

// Buscar
searchInput.addEventListener("input", e => {
  const q = e.target.value.trim().toLowerCase();
  results.innerHTML = "";
  if (q.length > 1) {
    const matches = presidents.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.country && p.country.toLowerCase().includes(q))
    );
    if (matches.length) {
      results.classList.remove("hidden");
      matches.slice(0, 30).forEach(p => {
        const li = document.createElement("li");
        li.textContent = `${p.name} — ${p.country}`;
        li.onclick = () => selectPresident(p);
        results.appendChild(li);
      });
    } else {
      results.classList.add("hidden");
    }
  } else {
    results.classList.add("hidden");
  }
});

// Selección
function selectPresident(president) {
  results.classList.add("hidden");
  searchInput.value = president.name;
  showBootScreen(president);
}

// Pantalla de carga
function showBootScreen(president) {
  bootOverlay.classList.remove("hidden");
  bootText.textContent = "";
  const seq = [
    "Inicializando módulos...",
    `Consultando registro: ${president.name}`,
    "Verificando identidad...",
    "Acceso concedido. Preparando reporte..."
  ];
  let i = 0;
  const t = setInterval(() => {
    bootText.textContent += seq[i] + "\n";
    i++;
    if (i >= seq.length) {
      clearInterval(t);
      setTimeout(() => {
        bootOverlay.classList.add("hidden");
        renderTypingInfo(president);
      }, 800);
    }
  }, 500);
}

// Typing effect
async function renderTypingInfo(president) {
  infoArea.classList.remove("hidden");
  typingArea.textContent = "";

  const cantidadLabel =
    president.tipo === "accused" ? "Cantidad robada" :
    president.tipo === "controversial" ? "Cantidad estimada" :
    "Cantidad aportada";

  const formattedAmount =
    president.cantidad ? "$" + Number(president.cantidad).toLocaleString() : "N/A";

  const lines = [
    `Nombre: ${president.name} — ${president.country}`,
    `Partido: ${president.party || "N/A"}`,
    `Vigente: ${president.vigente}`,
    `Inicio de mandato: ${president.tenure_start} (${president.tenure_years} años)`,
    `${cantidadLabel}: ${formattedAmount}`,
    `Valor por captura: ${president.valorCaptura || "N/A"}`,
    `Contribuciones notables: ${president.notable_contributions || "N/A"}`,
    `Acusaciones: ${president.acusaciones || "Ninguna"}`
  ];

  for (let line of lines) {
    await typeLine(line);
    await wait(250 + Math.random() * 300);
  }

  // Agrega link a fuentes
  appendSourcesLink(president);
}

// Escribir línea con pausas
function typeLine(text) {
  return new Promise(resolve => {
    let idx = 0;
    const speed = 20 + Math.random() * 30;
    const interval = setInterval(() => {
      typingArea.textContent += text[idx];
      idx++;
      if (idx >= text.length) {
        clearInterval(interval);
        typingArea.textContent += "\n";
        resolve();
      }
    }, speed);
  });
}

function wait(ms) { return new Promise(res => setTimeout(res, ms)); }

// ----------------------
// 🔹 Helpers para fuentes
// ----------------------
function slugify(text){
  return text.toLowerCase()
    .normalize('NFKD').replace(/[^\w\s-]/g,'').replace(/[\u0300-\u036f]/g,'')
    .replace(/\s+/g,'-').replace(/-+/g,'-');
}

function appendSourcesLink(president){
  const id = slugify(president.country + '-' + president.name);
  typingArea.innerHTML +=
    `\n<a href="sources.html#${id}" target="_blank" rel="noopener">Aquí están las fuentes</a>\n`;
}
