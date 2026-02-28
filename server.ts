import express from "express";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));

  // ZapSign API Integration - Usando Modelos (Templates)
  app.post("/api/zapsign/create", async (req, res) => {
    const { name, email, cpf, rua, numero, bairro, cidade, estado } = req.body;
    const token = "ecd83a7a-ec4a-4ca0-8b03-bf71cf100b14d06a857c-96dd-4bad-821e-6af421c5bcdf";
    const templateId = "f784a672-245c-4339-a86b-69ee2f04bf24";

    try {
      const response = await axios.post(
        `https://sandbox.api.zapsign.com.br/api/v1/models/create-doc/?api_token=${token}`,
        {
          template_id: templateId,
          signer_name: name,
          signer_email: email,
          data: [
            { de: "{{NOME COMPLETO}}", para: name },
            { de: "{{CPF}}", para: cpf },
            { de: "{{RUA/AV}}", para: rua },
            { de: "{{NUMERO}}", para: numero },
            { de: "{{BAIRRO}}", para: bairro },
            { de: "{{CIDADE}}", para: cidade },
            { de: "{{ESTADO}}", para: estado }
          ]
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      // Na API de modelos, a estrutura de retorno é um pouco diferente
      const signUrl = response.data.signers[0].sign_url;
      res.json({ sign_url: signUrl });
    } catch (error: any) {
      console.error("Erro na ZapSign API (Modelos):", error.response?.data || error.message);
      res.status(500).json({ 
        error: "Erro ao criar documento a partir do modelo", 
        details: error.response?.data || error.message 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
