const express = require('express');
const cors = require('cors');
const path = require('path');
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
    console.log('--------------------', req.body)

    const apiKey = 'AIzaSyCwtQ_zCdXd_7xmjaAToQ9NeurpHbVYJC8';
    const auth = new google.auth.GoogleAuth({
        keyFile: path.join(__dirname, 'key.json'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const sheets = google.sheets({ version: 'v4', auth });
    
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: 'Sheet1',
        });
    
        const priceValues = response.data.values.filter(v => v.length > 0);
        let pickupPostcode = null;
        let dropOffPostcode = null;
        
        await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${req.body.pickUpLocationCoordinates}&key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'OK') {
                const results = data.results;

                for (const result of results) {
                    for (const component of result.address_components) {
                        if (component.types.includes('postal_code')) {
                            pickupPostcode = component.long_name;
                            break;
                        }
                    }
                    if (pickupPostcode) {
                        console.log('11111111111111111111111111111111111', pickupPostcode)
                        break;
                    }
                }
            } else {
                console.log('Geocoding API request failed.');
                res.send('error')
            }
        })
        .catch(error => {
            console.log('Error:', error);
        });
        let result = [];
        priceValues[0].slice(2, 10).forEach((pValue, index) => {
            let temp = {
                id: pValue.toLowerCase().replaceAll(' ', '-'),
                price: parseFloat(priceValues.filter(p => p[0] === pickupPostcode.split(' ')[0] && req.body.DropoffLocation.toLowerCase().includes(p[1].toLowerCase()))[0].slice(2, 15)[index])
            }
            if (req.body.DropoffLocationType === "Airport" && priceValues.filter(p => p[0] === pickupPostcode.split(' ')[0] && req.body.DropoffLocation.toLowerCase().includes(p[1].toLowerCase()))[0].slice(2, 15)[9]) {
                temp.price += parseFloat(priceValues.filter(p => p[0] === pickupPostcode.split(' ')[0] && req.body.DropoffLocation.toLowerCase().includes(p[1].toLowerCase()))[0].slice(2, 15)[9])
            }
            if (req.body.pickUpLocationType === "Airport" && priceValues.filter(p => p[0] === pickupPostcode.split(' ')[0] && req.body.DropoffLocation.toLowerCase().includes(p[1].toLowerCase()))[0].slice(2, 15)[10]) {
                temp.price += parseFloat(priceValues.filter(p => p[0] === pickupPostcode.split(' ')[0] && req.body.DropoffLocation.toLowerCase().includes(p[1].toLowerCase()))[0].slice(2, 15)[10])
            }
            result.push(temp);
        })
        console.log('===============================', result)
        res.status(200).send({ data: result });
    } catch (error) {
        console.error('Error:', error.message);
        res.send('errororororor');
    }
});

app.listen(3000, () => {
    console.log('Proxy server is running on port 3000.');
});

module.exports = app;