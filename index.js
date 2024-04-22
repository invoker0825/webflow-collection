const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

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
    JourneyTypeID: 1,
    pickUpLocationType: "AirPort",
    pickUpLocation: "Heathrow Terminal 1 TW6 1JS",
    DropoffLocationType: "Address",
    DropoffLocation: "South Hill Avenue HA2 0DU",
    PickupDate: "26/04/2016",
    PickupTimeHr: "16",
    PickupTimeMinute: "19",
    companyaccountcode: "$tAr_pr!vAte_h!re_$toke"
}

app.get('/aaa', (req, res) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData)
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

app.listen(3000, () => {
    console.log('Proxy server is running on port 3000.');
});

module.exports = app;