const { google } = require("googleapis");

exports.handler = async function () {
    try {
        // Initialize Google Sheets API client
        const auth = new google.auth.JWT(
            process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            null,
            process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
            ["https://www.googleapis.com/auth/spreadsheets.readonly"]
        );

        const sheets = google.sheets({ version: "v4", auth });

        // The ID of the Google Sheet where bookings are stored
        const sheetId = process.env.GOOGLE_SHEET_ID;

        const res = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: "Bookings!A2:D", // A = Date, B = Time Slot, C = Name, D = Comment
        });

        const rows = res.data.values || [];

        // Map the rows to a more usable format
        const reservations = rows.map(([date, time]) => ({
            date,
            time,
        }));

        return {
            statusCode: 200,
            body: JSON.stringify({ reservations }),
        };
    } catch (error) {
        console.error("❌ Failed to fetch reservations:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error fetching reservations." }),
        };
    }
};
