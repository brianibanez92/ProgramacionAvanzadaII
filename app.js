const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const userRoute = require('./routes/users');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use('/', userRoute);

app.listen(3100, () => 
{
    console.log("Init server!!!");
});

app.get('/', (req, res) => {

    res.send('Indexxx');

});
