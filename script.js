// ----------------------------
// Datos de ejemplo (fallback).
// Reemplaza/añade los presidentes que quieras.
// Para una DB grande: crea `presidents.json` y dejé el fetch más abajo.
// ----------------------------

let presidents = [
  { name: "Nicolás Maduro", country: "Venezuela", vigente: "Sí", tipo: "corrupto", cantidad: 2000000000, valorCaptura: "$15,000,000", acusado: "Corrupción, narcotráfico" },
  { name: "Nelson Mandela", country: "Sudáfrica", vigente: "No", tipo: "honesto", cantidad: 500000000, valorCaptura: "N/A", acusado: "Ninguno" },
  { name: "Vladimir Putin", country: "Rusia", vigente: "Sí", tipo: "corrupto", cantidad: 200000000000, valorCaptura: "N/A", acusado: "Violaciones a DDHH, corrupción" },
  { name: "Emmanuel Macron", country: "Francia", vigente: "Sí", tipo: "honesto", cantidad: 12000000, valorCaptura: "N/A", acusado: "Ninguno" }
];

// elementos DOM
const searchInput = document.getElementById("searchInput");
const results = document.getElementById("results");
const infoArea = document.getElementById("infoArea");
const typingArea = document.getElementById("typingArea");
const bootOverlay = document.getElementById("bootOverlay");
const bootText = document.getElementById("bootText");

// Intento de cargar un archivo JSON grande si existe (presidents.json)
fetch("presidents.json")
  .then(r => {
    if (!r.ok) throw new Error("no json");
    return r.json();
  })
  .then(json => {
    if (Array.isArray(json) && json.length > 0) {
      presidents = json;
      console.log("Cargado presidents.json con", presidents.length, "entradas");
    }
  })
  .catch(_ => {
    // si no existe, seguimos con fallback
    console.log("No se cargó presidents.json — usando dataset interno.");
  });

// busqueda en input
searchInput.addEventListener("input", e => {
  const q = e.target.value.trim().toLowerCase();
  results.innerHTML = "";
  if (q.length > 1) {
    const matches = presidents.filter(p => p.name.toLowerCase().includes(q) || (p.country && p.country.toLowerCase().includes(q)));
    if (matches.length) {
      results.classList.remove("hidden");
      matches.slice(0, 30).forEach(p => {
        const li = document.createElement("li");
        li.textContent = `${p.name} — ${p.country || "—"}`;
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

// selección: mostrar overlay boot -> typing -> info
function selectPresident(president) {
  // cerrar dropdown y fijar input
  results.classList.add("hidden");
  searchInput.value = president.name;

  // mostrar boot overlay
  showBootScreen(president);
}

// Simula pantalla de carga / boot y luego escribe la info en modo "typing"
function showBootScreen(president) {
  bootOverlay.classList.remove("hidden");
  bootText.textContent = "Initializing...\nLocating record...\nVerifying credentials...\nDecrypting entry...";
  // simular paso de mensajes (puedes personalizar)
  let seq = [
    "Initializing kernel modules...",
    `Query: ${president.name}`,
    "Verifying identity...",
    "Access granted. Preparing report..."
  ];
  bootText.textContent = "";
  let i = 0;
  const t = setInterval(() => {
    bootText.textContent += seq[i] + "\n";
    i++;
    if (i >= seq.length) {
      clearInterval(t);
      // mantener overlay por un pequeño tiempo, luego mostrar typing
      setTimeout(() => {
        bootOverlay.classList.add("hidden");
        renderTypingInfo(president);
      }, 700);
    }
  }, 450);
}

// RENDER: escribe línea por línea con pausas (typing effect)
async function renderTypingInfo(president) {
  infoArea.classList.remove("hidden");
  typingArea.textContent = "";
  // construir líneas
  const cantidadLabel = president.tipo === "corrupto" ? "Cantidad robada" : "Cantidad aportada";
  const formattedAmount = "$" + Number(president.cantidad || 0).toLocaleString();
  const amountClass = president.tipo === "corrupto" ? "amount-red" : "amount-green";

  const lines = [
    `Nombre: ${president.name} — ${president.country || ""}`,
    `Vigente: ${president.vigente || "Desconocido"}`,
    `${cantidadLabel}: ${formattedAmount}`, // colorearemos parte con span después
    `Valor por captura: ${president.valorCaptura || "N/A"}`,
    `Acusaciones: ${president.acusado || "Ninguna"}`,
    `---- FIN DEL REPORTE ----`
  ];

  // typing cada línea con pausas aleatorias
  for (let line of lines) {
    await typeLine(line);
    await wait(260 + Math.random()*300); // pausa entre líneas
  }

  // reemplazar la cantidad por una versión coloreada (post-proc)
  // Encontramos la línea del label y coloreamos solo el monto
  setTimeout(() => {
    highlightAmount(cantidadLabel, formattedAmount, amountClass);
  }, 120);
}

// helper: escribe una línea simulando tecleo
function typeLine(text) {
  return new Promise(resolve => {
    let idx = 0;
    const cursor = "_";
    const baseSpeed = 18 + Math.random()*30; // velocidad variable
    const interval = setInterval(() => {
      typingArea.textContent = typingArea.textContent + text[idx];
      idx++;
      // ocasional pequeña pausa para simular pensamiento
      if (idx % 6 === 0 && Math.random() > 0.7) {
        clearInterval(interval);
        setTimeout(() => {
          if (idx < text.length) {
            // reanudar
            const interval2 = setInterval(() => {
              typingArea.textContent = typingArea.textContent + text[idx];
              idx++;
              if (idx >= text.length) {
                clearInterval(interval2);
                typingArea.textContent += "\n";
                resolve();
              }
            }, baseSpeed + Math.random()*20);
          } else {
            typingArea.textContent += "\n";
            resolve();
          }
        }, 120 + Math.random()*200);
      } else if (idx >= text.length) {
        clearInterval(interval);
        typingArea.textContent += "\n";
        resolve();
      }
    }, baseSpeed);
  });
}

// pinta el monto de la línea con span con color (post-proceso)
function highlightAmount(label, amountText, amountClass) {
  // convertir el contenido en HTML y reemplazar la parte del amount
  const html = typingArea.innerHTML;
  const search = `${label}: ${amountText}`;
  if (html.includes(search)) {
    const replaced = html.replace(search, `${label}: <span class="${amountClass}">${amountText}</span>`);
    typingArea.innerHTML = replaced;
  }
}

// util
function wait(ms){ return new Promise(res => setTimeout(res, ms)); }
