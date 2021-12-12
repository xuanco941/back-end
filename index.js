const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());
const connectDataBase = require('./model/ConnectDB');
connectDataBase();

const Route = require('./routes/index');

Route(app);


app.get('/', (req, res) => {
    res.sendFile('./index.html', { root: __dirname });
})



app.listen(process.env.PORT, () => {
    console.log('listen port 5000 : http://localhost:5000')
})