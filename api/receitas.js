export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { ingredientes } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `Crie receitas utilizando: ${ingredientes}.
        Retorne SOMENTE um JSON no formato:
        {
          "receitas": [
            {
              "titulo": "",
              "ingredientes": [],
              "modo_preparo": []
            }
          ]
        }`
      })
    });

    const data = await response.json();

    const texto = data.output_text;

    const json = JSON.parse(texto);

    return res.status(200).json(json);

  } catch (error) {
    return res.status(500).json({ error: "Erro ao gerar receita" });
  }
}
