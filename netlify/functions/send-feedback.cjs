const { Client } = require('@notionhq/client')

const notion = new Client({ auth: process.env.NOTION_SECRET })
const databaseId = process.env.NOTION_DATABASE_ID

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        }
    }

    try {
        const data = JSON.parse(event.body)
        const { name, email, message } = data

        if (!name || !email || !message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing required fields' }),
            }
        }

        // Enviar a Notion
        await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                Name: {
                    title: [{ text: { content: name } }],
                },
                Email: {
                    email: email,
                },
                Message: {
                    rich_text: [{ text: { content: message } }],
                },
            },
        })

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Feedback saved to Notion!' }),
        }
    } catch (error) {
        console.error('❌ Notion error:', error)

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to save feedback.' }),
        }
    }
}
