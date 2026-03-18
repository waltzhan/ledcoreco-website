/**
 * SMTP 邮件发送模块
 * 使用 Dynadot 企业邮箱发送询盘邮件
 */

import nodemailer from 'nodemailer';

// 创建 SMTP 传输器
function createTransporter() {
  const smtpHost = process.env.SMTP_HOST || 'smtp.dynadot.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587');
  const smtpUser = process.env.SMTP_USER || 'jeffzhan';
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpPass) {
    throw new Error('SMTP_PASS is not configured');
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465, // 465 使用 SSL，其他端口使用 STARTTLS
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    // 添加超时设置
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });
}

interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

/**
 * 发送邮件
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  console.log('SMTP: Starting email send to', options.to);
  const transporter = createTransporter();
  
  try {
    console.log('SMTP: Sending mail via nodemailer...');
    await transporter.sendMail({
      from: options.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    
    console.log('✓ Email sent successfully');
  } catch (error) {
    console.error('✗ Failed to send email:', error);
    throw error;
  } finally {
    transporter.close();
  }
}

/**
 * 验证 SMTP 配置
 */
export async function verifySMTPConfig(): Promise<boolean> {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    transporter.close();
    return true;
  } catch (error) {
    console.error('SMTP verification failed:', error);
    return false;
  }
}
