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

app.listen(3000, () => {
    console.log('Proxy server is running on port 3000.');
});

module.exports = app;