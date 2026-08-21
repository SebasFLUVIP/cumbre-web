import "server-only";
import nodemailer from "nodemailer";
import type { Lead } from "./types";

/**
 * Aviso por correo cuando entra un lead nuevo. Usa Gmail vía SMTP con una
 * contraseña de aplicación (no la contraseña normal de la cuenta) -- es la
 * vía más rápida para arrancar sin depender de un proveedor transaccional
 * nuevo mientras Cumbre termina de configurar su correo propio.
 *
 * Variables de entorno (ver .env.example):
 *   GMAIL_USER          la cuenta de Gmail que envía el aviso
 *   GMAIL_APP_PASSWORD  contraseña de aplicación de 16 caracteres, se genera
 *                       en myaccount.google.com/apppasswords (pide 2FA activo)
 *   LEADS_NOTIFY_TO     a quién avisar. Por defecto, la misma cuenta de Gmail.
 *
 * Sin estas variables, sendLeadNotification() no hace nada: el lead ya quedó
 * guardado en la base antes de llamar a esta función, así que un aviso que
 * falla o que no está configurado nunca debe tumbar la respuesta al cliente.
 */

function notifyConfigured(): boolean {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }
  return transporter;
}

const FIELD_LABELS: Record<string, string> = {
  service: "Servicio",
  city: "Ciudad",
  spaces: "Espacios",
  budget: "Inversión",
  timeline: "Cuándo",
  message: "Mensaje",
  source: "Origen",
};

export async function sendLeadNotification(lead: Lead): Promise<void> {
  if (!notifyConfigured()) return;

  const to = process.env.LEADS_NOTIFY_TO || process.env.GMAIL_USER!;
  const rows = (["service", "city", "spaces", "budget", "timeline", "source"] as const)
    .filter((k) => lead[k])
    .map((k) => `${FIELD_LABELS[k]}: ${lead[k]}`)
    .join("\n");

  const text = [
    `Nuevo contacto desde cumbredeco.com`,
    ``,
    `Nombre: ${lead.name}`,
    `Correo: ${lead.email}`,
    `Teléfono: ${lead.phone}`,
    rows,
    lead.message ? `\nMensaje:\n${lead.message}` : "",
    ``,
    `Ver todos los leads: https://cumbredeco.com/admin/leads`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await getTransporter().sendMail({
      from: `"Cumbre — sitio web" <${process.env.GMAIL_USER}>`,
      to,
      replyTo: lead.email,
      subject: `Nuevo contacto: ${lead.name} (${lead.service})`,
      text,
    });
  } catch (err) {
    // El lead ya está guardado en la base; un aviso que falla no debe romper
    // la respuesta al usuario que llenó el formulario.
    console.error("No se pudo enviar el aviso de lead por correo:", err);
  }
}
