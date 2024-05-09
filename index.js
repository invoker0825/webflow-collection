const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const spreadsheetId = '1XZwd9LAAMsuEJ0HIVkal0EviHL0giet3peWthWu_OV4';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/price', (req, res) => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            authorization: 'Bearer fd4227da24b4d41edf4218a9cc8d54a8d32ee44ff716483dee0ee162b08201cf'
        }
    };

    fetch(
        'https://api.webflow.com/v2/collections/661bc9769457b5f44fe2825a/items',
        options
    )
        .then(response => response.json())
        .then(response => {
            let result = [];
            response
                .items
                .forEach(item => {
                    result.push(item.fieldData);
                });
            res.send(result);
        })
        .catch(err => console.error(err));
});

app.get('/block-countries', (req, res) => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            authorization: 'Bearer fd4227da24b4d41edf4218a9cc8d54a8d32ee44ff716483dee0ee162b08201cf'
        }
    };

    fetch(
        'https://api.webflow.com/v2/collections/661cac6befc1a1ed7fdf1771/items',
        options
    )
        .then(response => response.json())
        .then(response => {
            let result = [];
            response
                .items
                .forEach(item => {
                    result.push(item.fieldData);
                });
            res.send(result);
        })
        .catch(err => console.error(err));
});

let bodyData = {
    pickUpLocation: "Heathrow Terminal 1  TW6 1JS",
    DropoffLocation: "Porlock Avenue HARROW HA2 0AD",
    pickUpLocationType: "Airport",
    DropoffLocationType: "Address",
    PickupDate: "29-Apr-2024",
    PickupTimeHr: 23,
    PickupTimeMinute: 59,
    pickUpLocationCoordinates: "51.4724350,-0.4504564",
    DropoffLocationCoordinates: "51.5735969543457,-0.352869987487793",
    Distance: "10.9",
    CompanyAccountCode: "@!RP0RT_EXECUT!VE_L!M!TED",
    IsLive: true,
    JourneyTypeID: 1
}

app.post('/get-fare', (req, res) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
    };

    fetch(
        'http://eurosofttechbookingapi.co.uk/api/jobs/GetFaresFromDispatch',
        options
    )
        .then(response => response.json())
        .then(response => {
            res.send(response);
        })
        .catch(err => console.log('err-------------------', err));
});

app.post('/get-uk-fare', async (req, res) => {
    const auth = new google.auth.GoogleAuth({
        keyFile: './key.json',
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const sheets = google.sheets({ version: 'v4', auth });
    
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: 'Sheet1',
        });
    
        const values = response.data.values;
        console.log('Data:', values);
        res.send(values);
    } catch (error) {
        console.error('Error:', error.message);
        res.send('errororororor')
    }
});

app.listen(3000, () => {
    console.log('Proxy server is running on port 3000.');
});

module.exports = app;