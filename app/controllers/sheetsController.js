'use strict'
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { sheetDataGet } = require('../models/spreadSheet');
const config = require('../config/config');
const { google } = require('googleapis');
const sheets = google.sheets('v4');
sheetDataGet.auth = config.API_TOKEN;

async function getData(request, response) {
    var ranges = request.params.value;
    var spreadSheetId = request.params.key;
    sheetDataGet.spreadsheetId = spreadSheetId;
    sheetDataGet.ranges = [ranges];
    await getDataSheet(sheetDataGet)
        .then(result => {
            if (result['statusText'] === 'OK') return response
                .status(200)
                .send({ data: result.data.valueRanges[0].values, Message: 'Success' });
            return response.status(204).send({ Message: 'Empty' })
        }).catch(error => {
            return response.status(500).send({ error });
        });
}

async function insertData(request, response) {
    var spreadSheetId = request.params.key;
    const document = new GoogleSpreadsheet(spreadSheetId);
    await document.useServiceAccountAuth({
        client_email: config.CLIENT_EMAIL,
        private_key: config.PRIVATE_KEY
    });
    await document.loadInfo();
    const sheet = document.sheetsByTitle[request.body.sheetName];
    const prevRows = sheet.rowCount;
    await sheet.addRow(request.body)
        .then(result => {
            if (result.rowIndex > prevRows) return response.status(200).send({ Message: 'Row Added!' });
            return response.status(204).send({ Message: 'Empty' })
        }).catch(error => {
            return response.status(500).send({ error });
        });
}

async function getDataSheet(Sheet) {
    const dataSheet = (await sheets.spreadsheets.values.batchGet(Sheet));
    return dataSheet;
}

module.exports = { getData, insertData }