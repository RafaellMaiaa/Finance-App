import axios from 'axios';

// Agora a função chama-se 'sendEmail' para ser mais genérica
export const sendEmail = async (options) => {
  console.log(`--- A tentar enviar email para: ${options.email} via API HTTP ---`);
  console.log(`--- Assunto: ${options.subject} ---`); // Adicionamos um log para o assunto

  const emailPayload = {
    from: 'Finance Flow <onboarding@resend.dev>', // Podemos manter este remetente por agora
    to: options.email,
    
    // ✅ USA O ASSUNTO E HTML RECEBIDOS ✅
    // Se não forem passados, usa os valores padrão do email de login (fallback)
    subject: options.subject || 'O seu link para entrar na Finance App',
    html: options.html || `<p>Olá!</p><p>Para entrar na sua conta, por favor clique neste link. Ele é válido por 10 minutos.</p><a href="${options.url}">Entrar na Aplicação</a>`,
  };

  try {
    const response = await axios.post('https://api.resend.com/emails', emailPayload, {
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('✅ Email enviado com sucesso pela API do Resend. ID:', response.data.id);
    return response.data;

  } catch (error) {
    // Mostra mais detalhes do erro, se disponíveis
    const errorDetails = error.response ? error.response.data : error.message;
    console.error('❌ ERRO ao enviar email pela API do Resend:', errorDetails);
    
    // Re-lança o erro para que o controller saiba que falhou
    throw new Error(`Falha ao enviar email: ${errorDetails.message || error.message}`); 
  }
};