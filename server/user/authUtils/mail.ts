import { getEnv } from '@larskarbo/get-env'
import nodemailer from 'nodemailer'
import { slackNotify } from '../../charts/utils/slackNotify'

const transporter = nodemailer.createTransport({
  host: getEnv('SMTP_HOST'),
  port: getEnv('SMTP_PORT'),
  secure: false,
  auth: {
    user: getEnv('SMTP_USER'),
    pass: getEnv('SMTP_PASSWORD'),
  },
})

export const sendMail = async ({ toAddress, subject, body_html, body_text }) => {
  // Specify the fields in the email.
  let mailOptions = {
    from: getEnv('SMTP_FROM'),
    to: toAddress,
    subject: subject,
    text: body_text,
    html: body_html,
  }

  // Send the email.
  let info = await transporter.sendMail(mailOptions).catch(() => {
    slackNotify(`Error when sending email!`, mailOptions)
  })

  console.log('Message sent! Message ID: ', info.messageId)
}

// verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log(error)
  } else {
    console.log('Server is ready to take our messages')
  }
})
