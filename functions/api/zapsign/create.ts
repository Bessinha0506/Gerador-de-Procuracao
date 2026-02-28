export const onRequestPost: PagesFunction<{ 
  ZAPSIGN_API_TOKEN: string;
  ZAP_SIGN_TEMPLATE_ID: string;
}> = async (context) => {
  try {
    const body: any = await context.request.json();
    const { name, email, cpf, rua, numero, bairro, cidade, estado } = body;
    
    // Prioriza variáveis de ambiente do Cloudflare, mas mantém fallback para teste
    const token = context.env.ZAPSIGN_API_TOKEN || "ecd83a7a-ec4a-4ca0-8b03-bf71cf100b14d06a857c-96dd-4bad-821e-6af421c5bcdf";
    const templateId = context.env.ZAP_SIGN_TEMPLATE_ID || "f784a672-245c-4339-a86b-69ee2f04bf24";

    const response = await fetch(
      `https://sandbox.api.zapsign.com.br/api/v1/models/create-doc/?api_token=${token}`,
      {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
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
        })
      }
    );

    const data: any = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ 
        error: "Erro na ZapSign API", 
        details: data 
      }), {
        status: response.status,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Na API de modelos, a estrutura de retorno tem o sign_url dentro do array signers
    const signUrl = data.signers[0].sign_url;
    
    return new Response(JSON.stringify({ sign_url: signUrl }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ 
      error: "Erro interno no servidor", 
      message: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
