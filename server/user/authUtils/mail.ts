import { getEnv } from '@larskarbo/get-env'
import { slackNotify } from '../../charts/utils/slackNotify'
import * as postmark from 'postmark'

export const sendMail = async ({ toAddress, subject, body_html, body_text }) => {
  // Specify the fields in the email.

  // Send an email:
  var client = new postmark.ServerClient(getEnv('POSTMARK_SERVER_API_TOKEN'))

  const opts = {
    From: getEnv('EMAIL_NOTIFICATIONS_FROM'),
    To: toAddress,
    Subject: subject,
    HtmlBody: body_html,
    TextBody: body_text,
    MessageStream: 'account',
  }

  const hey = await client.sendEmail(opts).catch((err) => {
    slackNotify(`Error when sending email!`, opts)
    throw err
  })

  console.log('sent email: ', hey)
}
