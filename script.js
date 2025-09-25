const presidents = [
  {
    name: "Nicolás Maduro",
    country: "Venezuela",
    vigente: "Sí",
    cantidadRobada: "$2,000,000,000",
    valorCaptura: "$15,000,000",
    acusado: "Corrupción, narcotráfico"
  },
  {
    name: "Vladimir Putin",
    country: "Rusia",
    vigente: "Sí",
    cantidadRobada: "$200,000,000,000",
    valorCaptura: "N/A",
    acusado: "Violaciones a DDHH, corrupción"
  }
];

const searchInput = document.getElementById("searchInput");
const results = document.getElementById("results");
const infoSection = document.getElementById("infoSection");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  results.innerHTML = "";
  if (query.length > 1) {
    const filtered = presidents.filter(p => p.name.toLowerCase().includes(query));
    if (filtered.length > 0) {
      results.classList.remove("hidden");
      filtered.forEach(p => {
        const li = document.createElement("li");
        li.textContent = `${p.name} - ${p.country}`;
        li.className = "cursor-pointer px-3 py-2 hover:bg-green-700 rounded-md";
        li.addEventListener("click", () => showInfo(p));
        results.appendChild(li);
      });
    } else {
      results.classList.add("hidden");
    }
  } else {
    results.classList.add("hidden");
  }
});

function showInfo(president) {
  results.classList.add("hidden");
  searchInput.value = president.name;

  infoSection.classList.remove("hidden");
  infoSection.innerHTML = `
    <div class="card card-green">
      <h2 class="text-xl font-bold mb-2">${president.name} - ${president.country}</h2>
      <p><strong>Vigente:</strong> ${president.vigente}</p>
      <p><strong>Cantidad robada:</strong> ${president.cantidadRobada}</p>
      <p><strong>Valor por captura:</strong> ${president.valorCaptura}</p>
      <p><strong>Acusado de:</strong> ${president.acusado}</p>
    </div>
  `;
}
