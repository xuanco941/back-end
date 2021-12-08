const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const multer = require('multer');
const cors = require('cors');
app.use(cors());
const connectDataBase = require('./model/ConnectDB');
connectDataBase();

const CheckToken = require('./middleware/CheckToken');
const Route = require('./routes/index');

Route(app);

app.get('/home', CheckToken, (req, res) => {
    res.json(req.user)
})

// app.get('/', (req, res) => {
//     res.sendFile('./index.html', { root: __dirname });
// })


// const storageimg = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads')
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname)
//     }
// });

// const upload = multer({ storage: storageimg }).any();
// app.post('/post-product', upload , (req, res) => {
//     res.json({ data: req.body , data2: req.files})
// })


app.listen(process.env.PORT, () => {
    console.log('listen port 5000 : http://localhost:5000')
})