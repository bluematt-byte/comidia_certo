const apiKey = "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";

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
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "receitas_schema",
            schema: {
              type: "object",
              properties: {
                receitas: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      nome: { type: "string" },
                      tempo_preparo: { type: "string" },
                      nivel: { type: "string" },
                      ingredientes: {
                        type: "array",
                        items: { type: "string" }
                      },
                      modo_preparo: {
                        type: "array",
                        items: { type: "string" }
                      },
                      dicas: { type: "string" }
                    },
                    required: ["nome", "tempo_preparo", "nivel", "ingredientes", "modo_preparo", "dicas"]
                  }
                }
              },
              required: ["receitas"]
            }
          }
        },
        input: `
          Você é um chef profissional.
          Ingredientes: ${ingredientes}
          Objetivo: ${objetivo || "não especificado"}
          Gere de 2 a 3 receitas práticas.
        `
      })
    });

    const data = await response.json();
    const receitas = JSON.parse(data.output_text);

    receitas.receitas.forEach(receita => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <h3>${receita.nome}</h3>
        <p><strong>Tempo:</strong> ${receita.tempo_preparo}</p>
        <p><strong>Nível:</strong> ${receita.nivel}</p>
        <h4>Ingredientes:</h4>
        <ul>${receita.ingredientes.map(i => `<li>${i}</li>`).join("")}</ul>
        <h4>Modo de preparo:</h4>
        <ol>${receita.modo_preparo.map(p => `<li>${p}</li>`).join("")}</ol>
        <p><strong>Dicas:</strong> ${receita.dicas}</p>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    container.innerHTML = "Erro ao gerar receitas.";
    console.error(error);
  }

  loading.classList.add("hidden");
}