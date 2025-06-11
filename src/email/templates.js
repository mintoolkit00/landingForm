export function thankYouTemplate(name = 'there') {
    return {
        subject: 'Thanks for your message!',
        html: `
      <p>Hi ${name},</p>
      <p>Thank you for reaching out. We really appreciate your feedback!</p>
      <p>We'll get back to you as soon as possible if needed.</p>
      <br />
      <p>— The LandingForm team</p>
    `,
    }
}