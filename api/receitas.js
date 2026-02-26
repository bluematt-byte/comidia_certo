export default async function handler(req, res) {
  console.log("CHAVE OPENAI:", process.env.OPENAI_API_KEY);
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { ingredientes, objetivo } = req.body;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `
        Gere 2 receitas usando:
        Ingredientes: ${ingredientes}
        Objetivo: ${objetivo || "não especificado"}

        Retorne SOMENTE um JSON válido neste formato:
        {
          "receitas": [
            {
              "titulo": "",
              "ingredientes": [],
              "modo_preparo": []
            }
          ]
        }
        `
      })
    });

    const data = await response.json();

    const texto = data.output?.[0]?.content?.[0]?.text;

    if (!texto) {
      return res.status(500).json({ error: "Resposta inválida da OpenAI", raw: data });
    }

    const json = JSON.parse(texto);

    return res.status(200).json(json);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
