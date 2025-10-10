import axios from 'axios';

export const sendLoginEmail = async (options) => {
  console.log('--- A tentar enviar email para:', options.email, 'via API HTTP ---');

  const emailPayload = {
    // IMPORTANTE: Use o endereço de onboarding para os testes iniciais
    from: 'Finance App <onboarding@resend.dev>', 
    to: options.email,
    subject: 'O seu link para entrar na Finance App',
    html: `<p>Olá!</p><p>Para entrar na sua conta, por favor clique neste link. Ele é válido por 10 minutos.</p><a href="${options.url}">Entrar na Aplicação</a>`,
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
    console.error('❌ ERRO ao enviar email pela API do Resend:', error.response ? error.response.data : error.message);
    throw error;
  }
};