// Ficheiro: backend/src/services/email.js (Versão SendGrid)
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (options) => {
  console.log(`--- A tentar enviar email para: ${options.email} via SendGrid ---`);
  console.log(`--- Assunto: ${options.subject} ---`);

  const msg = {
    to: options.email,
    from: process.env.SENDGRID_FROM_EMAIL || 'Finance Flow <onboarding@resend.dev>',
    subject: options.subject || 'Mensagem da Finance Flow',
    html: options.html || `<p>Olá!</p><p>Para entrar na sua conta, por favor clique neste link. Ele é válido por 10 minutos.</p><a href="${options.url}">${options.url || 'Abrir App'}</a>`,
  };

  try {
    const response = await sgMail.send(msg);
    console.log('✅ Email enviado com sucesso pelo SendGrid.', response?.[0]?.statusCode || '');
    return response;
  } catch (error) {
    console.error('❌ ERRO ao enviar email pelo SendGrid:', error);
    if (error.response && error.response.body) {
      console.error('SendGrid response body:', error.response.body);
    }
    throw error;
  }
};