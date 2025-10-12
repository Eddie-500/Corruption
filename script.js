// ----------------------
// Buscador de Presidentes (terminal hacker) - versión sin fuentes
// ----------------------

let presidents = [];

// Intento cargar presidents.json
fetch("presidents.json")
  .then(r => r.json())
  .then(json => { presidents = json; })
  .catch(err => { console.error("Error cargando presidents.json", err); });

// DOM
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

// Boot overlay
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
      }, 700);
    }
  }, 450);
}

// Typing + render
async function renderTypingInfo(president) {
  infoArea.classList.remove("hidden");
  typingArea.textContent = "";

  // Etiqueta y formato cantidad según tipo
  const cantidadLabel = getCantidadLabel(president.tipo);
  const { displayValue: formattedAmount, shouldHighlight } = formatAmount(president.cantidad);
  const amountClass = shouldHighlight
    ? getAmountClass(president.tipo)
    : "amount-muted";

  const tipoDescripcion = describeTipo(president.tipo);

  const lines = [
    `Nombre: ${president.name} — ${president.country}`,
    `Tipo de registro: ${tipoDescripcion}`,
    `Partido: ${president.party || "N/A"}`,
    `Vigente: ${president.vigente}`,
    `Inicio de mandato: ${president.tenure_start} (${president.tenure_years || "N/D"} años)`,
    `${cantidadLabel}: ${formattedAmount}`,
    `Valor por captura: ${president.valorCaptura || "N/A"}`,
    `Contribuciones notables: ${president.notable_contributions || "N/A"}`,
    `Acusaciones: ${president.acusaciones || "Ninguna"}`,
    `---- FIN DEL REPORTE ----`
  ];

  // escribimos cada línea
  for (let line of lines) {
    await typeLine(line);
    await wait(200 + Math.random() * 300);
  }

  // colorear la parte del monto (post-proc) si hay monto real
  if (shouldHighlight) {
    colorAmountInTyping(cantidadLabel, formattedAmount, amountClass);
  }
}

// typing line
function typeLine(text) {
  return new Promise(resolve => {
    let idx = 0;
    const speed = 16 + Math.random() * 26;
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

// colorea el monto en la salida typing (reemplazo simple)
function colorAmountInTyping(label, amountText, amountClass) {
  const html = typingArea.innerHTML;
  const target = `${label}: ${amountText}`;
  if (html.includes(target)) {
    const replaced = html.replace(target, `${label}: <span class="${amountClass}">${amountText}</span>`);
    typingArea.innerHTML = replaced;
  }
}

function wait(ms) { return new Promise(res => setTimeout(res, ms)); }

function getCantidadLabel(tipo) {
  switch (tipo) {
    case "accused":
      return "Cantidad robada";
    case "no_major_accusations_reported":
      return "Cantidad aportada";
    default:
      return "Cantidad (estimada)";
  }
}

function formatAmount(value) {
  const hasValue = value !== null && value !== undefined && String(value).trim() !== "";
  if (!hasValue) {
    return { displayValue: "N/D", shouldHighlight: false };
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    const formattedNumber = new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(value);
    return { displayValue: formattedNumber, shouldHighlight: true };
  }

  return { displayValue: String(value), shouldHighlight: true };
}

function getAmountClass(tipo) {
  if (tipo === "accused") return "amount-red";
  if (tipo === "no_major_accusations_reported") return "amount-green";
  return "amount-orange";
}

function describeTipo(tipo) {
  switch (tipo) {
    case "accused":
      return "Buscado / acusado";
    case "no_major_accusations_reported":
      return "Sin acusaciones graves reportadas";
    case "controversial":
      return "Controversial / en investigación";
    default:
      return tipo || "N/A";
  }
}
