function scrollToApp() {
  document.getElementById("app").scrollIntoView({ behavior: "smooth" });
}

async function buscarReceitas() {
  const ingredientes = document.getElementById("ingredientes").value;
  const objetivo = document.getElementById("objetivo").value;
  const container = document.getElementById("receitas");
  const loading = document.getElementById("loading");

  if (!ingredientes) {
    alert("Digite ingredientes!");
    return;
  }

  container.innerHTML = "";
  loading.classList.remove("hidden");

  try {
    const response = await fetch("/api/receitas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ingredientes, objetivo })
    });

    if (!response.ok) {
      throw new Error("Erro na resposta da API");
    }

    const data = await response.json();

    data.receitas.forEach(receita => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <h3>${receita.titulo}</h3>
        <h4>Ingredientes:</h4>
        <ul>${receita.ingredientes.map(i => `<li>${i}</li>`).join("")}</ul>
        <h4>Modo de preparo:</h4>
        <ol>${receita.modo_preparo.map(p => `<li>${p}</li>`).join("")}</ol>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    container.innerHTML = "Erro ao gerar receitas.";
    console.error(error);
  }

  loading.classList.add("hidden");
}
