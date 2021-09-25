'use strict'
const Sheet = require('../models/spreadSheet');
const config = require('../config/config');
const { google } = require('googleapis');

async function getData(request, response) {
    const sheets = google.sheets('v4');
    Sheet.spreadsheetId = request.body.spreadSheetId;
    Sheet.ranges = [request.body.ranges];
    Sheet.auth = config.API_TOKEN;
    await getDataSheet(sheets, Sheet).then(data => {
        if (data.length) return response.status(200).send({ data });
        return response.status(204).send({ Message: 'Empty' })
    }).catch(error => {
        return response.status(500).send({ error });
    });
}

async function getDataSheet(sheets, Sheet) {
    const dataSheet = (await sheets.spreadsheets.values.batchGet(Sheet)).data.valueRanges[0].values;
    return dataSheet;
}

module.exports = { getData }