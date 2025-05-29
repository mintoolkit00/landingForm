const { google } = require('googleapis')

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    }
  }

  try {
    const { name, email, message } = JSON.parse(event.body)

    if (!name || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required fields' }),
      }
    }

    const auth = new google.auth.JWT(
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets']
    )

    const sheets = google.sheets({ version: 'v4', auth })

    const sheetId = process.env.GOOGLE_SHEET_ID

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'A:C',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [[name, email, message]],
      },
    })

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Feedback saved to Google Sheets!' }),
    }
  } catch (error) {
    console.error('❌ Google Sheets error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to save feedback to Google Sheets.' }),
    }
  }
}
