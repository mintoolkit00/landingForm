const { google } = require('googleapis');

exports.handler = async function (event) {

    // Check if the request method is POST
    if (event.httpMethod !== 'POST') {
        console.log("❌ Method not allowed:", event.httpMethod);
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }

    try {
        const { name, comment, date, hour } = JSON.parse(event.body);
        const day = date;
        const time = hour;

        //Validation of the required fields on server side
        if (!name || !comment || !day || !time) {
            console.log("❌ Missing fields:", { name, comment, day, time });
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing required fields' }),
            };
        }

        // Initialize Google Sheets API client
        const auth = new google.auth.JWT(
            process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            null,
            process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            ['https://www.googleapis.com/auth/spreadsheets']
        );

        const sheets = google.sheets({ version: 'v4', auth });

        // The ID of the Google Sheet where bookings will be saved
        const sheetId = process.env.GOOGLE_SHEET_ID;

        // Append the booking data to the Google Sheet
        await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: 'Bookings!A:D',
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            requestBody: {
                values: [[day.split("T")[0], time, name, comment]],
            },
        });

        console.log("✅ Booking saved successfully.");
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Booking saved!' }),
        };
    } catch (error) {
        console.error('❌ Google Sheets error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to save booking.' }),
        };
    }
};
