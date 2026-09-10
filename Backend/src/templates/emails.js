// Plantillas de correo del sistema. Se mantienen fuera de los controladores
// para reutilizarlas y para replicar el diseño oscuro de VitaCore
// (tokens en Frontend/src/theme.ts).

const BRAND = "VitaCore Monitor"

const COLORS = {
    backdrop: "#060E10",
    base: "#0A1618",
    surface: "#101F22",
    surface2: "#17282C",
    border: "#283E42",
    borderSubtle: "#1A2E32",
    text: "#EAF2F1",
    muted: "#7FA09C",
    teal: "#2DD4BF",
    amber: "#FFB454",
}

const FONT_STACK = "Arial, Helvetica, sans-serif"
const MONO_STACK = "'Courier New', Courier, monospace"

// Correo de confirmación de cuenta. Recibe el token que el usuario debe
// pegar en la pantalla de validación del frontend.
export const confirmationEmail = ({ name = "", token }) => {
    const greeting = name ? `Hola ${name},` : "Hola,"

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Confirma tu correo electrónico</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.backdrop};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.backdrop};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:${COLORS.surface};border:1px solid ${COLORS.border};border-radius:14px;overflow:hidden;font-family:${FONT_STACK};">
          <tr>
            <td style="padding:22px 28px;border-bottom:1px solid ${COLORS.borderSubtle};">
              <span style="font-size:18px;font-weight:700;color:${COLORS.text};letter-spacing:-0.02em;">Vita<span style="color:${COLORS.teal};">Core</span></span>
              <span style="font-size:11px;color:${COLORS.muted};letter-spacing:0.16em;text-transform:uppercase;"> Monitor</span>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              <p style="margin:0 0 6px;font-size:13px;color:${COLORS.muted};">${greeting}</p>
              <h1 style="margin:0 0 12px;font-size:20px;line-height:1.3;color:${COLORS.text};font-weight:700;letter-spacing:-0.02em;">Tu cuenta ha sido creada</h1>
              <p style="margin:0 0 22px;font-size:14px;line-height:1.6;color:${COLORS.muted};">
                Usa el siguiente token para confirmar tu correo electrónico y activar tu acceso a ${BRAND}.
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background:${COLORS.surface2};border:1px solid ${COLORS.border};border-radius:12px;padding:18px 16px;">
                    <span style="font-family:${MONO_STACK};font-size:22px;font-weight:700;letter-spacing:0.18em;color:${COLORS.teal};word-break:break-all;">${token}</span>
                  </td>
                </tr>
              </table>
              <p style="margin:18px 0 0;font-size:12px;line-height:1.6;color:${COLORS.muted};">
                Este token expirará en <strong style="color:${COLORS.amber};">15 minutos</strong>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px;border-top:1px solid ${COLORS.borderSubtle};">
              <p style="margin:0;font-size:11px;line-height:1.6;color:${COLORS.muted};">
                Si no solicitaste este correo, puedes ignorarlo.
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:18px 0 0;font-size:11px;color:#3E5652;font-family:${FONT_STACK};">
          ${BRAND} · Sistema de monitoreo de signos vitales
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`

    return { subject: "Confirma tu correo electrónico", html }
}

export default { confirmationEmail }
