import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({ to, subject, html }) {
    const { error } = await resend.emails.send({
        from: process.env.FROM_EMAIL,
        to,
        subject,
        html,
    })

    if (error) {
        throw error
    }

    return true
}
