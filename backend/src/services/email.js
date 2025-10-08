// Ficheiro: backend/src/services/email.js

import nodemailer from 'nodemailer';

export const sendLoginEmail = async (options) => {
  console.log('--- A tentar enviar email para:', options.email, '---');

  const transporter = nodemailer.createTransport({
    host: 'smtp.resend.com',
    secure: true,
    port: 465,
    auth: {
      user: 'resend',
      pass: process.env.RESEND_API_KEY,
    },
  });

  const mailOptions = {
    from: 'Finance App <onboarding@resend.dev>',
    to: options.email,
    subject: 'O seu link para entrar na Finance App',
    html: `<p>Olá!</p><p>Para entrar na sua conta, por favor clique neste link. Ele é válido por 10 minutos.</p><a href="${options.url}">Entrar na Aplicação</a>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email entregue ao Resend com sucesso. Resposta do serviço:', info.response);
    return info; // Devolve a informação de sucesso
  } catch (error) {
    console.error('❌ ERRO DENTRO DO sendLoginEmail:', error);
    throw error; // Lança o erro para ser apanhado pelo controller
  }
};