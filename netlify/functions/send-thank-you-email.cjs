const { sendEmail } = require('../../utils/sendEmail.js')
const { thankYouTemplate } = require('../../utils/templates.js')

exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' }),
        }
    }

    try {
        const { name, email } = JSON.parse(event.body)
        const { subject, html } = thankYouTemplate(name)

        await sendEmail({ to: email, subject, html })

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true }),
        }
    } catch (err) {
        console.error('❌ Error al enviar el email:', err)
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to send email' }),
        }
    }
}
