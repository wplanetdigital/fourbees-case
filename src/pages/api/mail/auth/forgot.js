import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_SECURE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
})

export const sendMail = (email, rememberToken) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: `Redefinição da senha para ${process.env.APP_NAME}`,
    attachments: [
      {
        filename: 'logo-light.png',
        path: `${process.env.APP_URL}/images/logo-light.png`,
        cid: 'logo'
      }
    ],
    html: `
    <!doctype html>
    <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
            <title>Welcome!</title>
            <style> img { border: 0; -ms-interpolation-mode: bicubic; max-width: 100% } body { background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100% } table { border-collapse: separate; mso-table-lspace: 0; mso-table-rspace: 0; width: 100% } table td { font-family: sans-serif; font-size: 14px; vertical-align: top } .body { background-color: #f6f6f6; width: 100% } .container { display: block; margin: 0 auto !important; max-width: 580px; padding: 10px; width: 580px } .content { box-sizing: border-box; display: block; margin: 0 auto; max-width: 580px; padding: 10px } .logo { width: 190px; height: auto; margin: 1em 0 } .main { background: #fff; border-radius: 13px; width: 100%; border-bottom: 4px solid #dadada; } .wrapper { box-sizing: border-box; padding: 20px } .content-block { padding-bottom: 10px; padding-top: 10px } .footer { clear: both; margin-top: 10px; text-align: center; width: 100% } .footer td,.footer p,.footer span,.footer a { color: #999; font-size: 12px; text-align: center } h1,h2,h3,h4 { color: #000; font-family: sans-serif; font-weight: 400; line-height: 1.4; margin: 0; margin-bottom: 30px } h1 { font-size: 35px; font-weight: 300; text-align: center; text-transform: capitalize } p,ul,ol { font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px } p li,ul li,ol li { list-style-position: inside; margin-left: 5px } a { color: #3498db; text-decoration: underline } .btn { box-sizing: border-box; width: 100% } .btn>tbody>tr>td { padding-bottom: 15px } .btn table { width: auto } .btn table td { background-color: #fff; border-radius: 5px; text-align: center } .btn a { background-color: #fff; border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; color: #3498db; cursor: pointer; display: inline-block; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-decoration: none; } .btn-primary table td { background-color: #3498db } .btn-primary a { background-color: #3498db; border-color: #3498db; color: #fff } .last { margin-bottom: 0 } .first { margin-top: 0 } .align-center { text-align: center } .align-right { text-align: right } .align-left { text-align: left } .clear { clear: both } .mt0 { margin-top: 0 } .mb0 { margin-bottom: 0 } .preheader { color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0 } .powered-by a { text-decoration: none } hr { border: 0; border-bottom: 1px solid #f6f6f6; margin: 20px 0 } @media only screen and (max-width: 620px) { table.body h1 { font-size:28px !important; margin-bottom: 10px !important } table.body p,table.body ul,table.body ol,table.body td,table.body span,table.body a { font-size: 16px !important } table.body .wrapper,table.body .article { padding: 10px !important } table.body .content { padding: 0 !important } table.body .container { padding: 0 !important; padding-top: 5px !important; width: 100% !important } table.body .main { border-left-width: 0 !important; border-radius: 0 !important; border-right-width: 0 !important } table.body .btn table { width: 100% !important } table.body .btn a { width: 100% !important } table.body .img-responsive { height: auto !important; max-width: 100% !important; width: auto !important } } @media all { .ExternalClass { width: 100% } .ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div { line-height: 100% } .apple-link a { color: inherit !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; text-decoration: none !important } #MessageViewBody a { color: inherit; text-decoration: none; font-size: inherit; font-family: inherit; font-weight: inherit; line-height: inherit } .btn-primary table td:hover { background-color: #34495e !important } .btn-primary a:hover { background-color: #34495e !important; border-color: #34495e !important } } </style>
        </head>
        <body>
          <span class="preheader">Siga essas etapas para redefinir sua senha.</span>
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
              <tr>
                  <td>&nbsp;</td>
                  <td class="container">
                      <div class="content">
                        <img class="logo" src="cid:logo" alt="${process.env.APP_NAME}">
                        <table role="presentation" class="main">
                            <tr>
                                <td class="wrapper">
                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td>
                                                <p><b>Esqueceu sua senha?</b></p>
                                                <p>Redefinir sua senha é fácil. Basta pressionar o botão abaixo e seguir as instruções. Em breve, você estará pronto para usar novamente.</p>
                                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                                                    <tbody>
                                                        <tr>
                                                            <td align="left">
                                                                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td>
                                                                                <a href="${process.env.APP_URL}/auth/password/reset/${rememberToken}" target="_blank">Redefinir senha</a>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <p>Houve uma solicitação para alterar sua senha! <br />
                                                Se você não fez essa solicitação, simplesmente ignore este e-mail. </p>
                                                <p>Atenciosamente,<br/>
                                                - Equipe ${process.env.APP_NAME}</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <div class="footer">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td class="content-block">
                                        Precisa de mais ajuda? <br>
                                        <a href="mailto:${process.env.MAIL_USER}">Estamos aqui, prontos para conversar</a>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </td>
                <td>&nbsp;</td>
            </tr>
        </table>
    </body>
  </html>
  `
  }

  return new Promise(async (resolve, reject) => {
    try {
      const info = await transporter.sendMail(mailOptions)
      resolve({ message: 'OK', info })
    } catch (error) {
      reject({ message: 'Erro', error })
    }
  })
}
