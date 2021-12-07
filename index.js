const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const connectDataBase = require('./modal/ConnectDB');
connectDataBase();
const UserSchema = require('./modal/UserSchema');



app.get('/product', (req, res) => {
    res.json(1)
})

app.post('/signup', (req, res) => {
    username = req.body.username;
    password = req.body.password;
    const saltRounds = 9;
    const hash = bcrypt.hashSync(password, saltRounds);

    UserSchema.findOne({ username: username })
        .then(user => {
            if (user) res.status(401).json({status: 'error', message: 'Tài khoản này đã tồn tại'})
            else UserSchema.create({ username: username, password: hash }).then(() => {
                res.status(201).json({status: 'success'});
            })
        })

})


const generateAccessToken = (data) => {
    return jwt.sign(data, process.env.SECRET_KEY , {expiresIn: process.env.SECRET_KEY_EXP})
}

app.post('/signin', (req, res) => {
    username = req.body.username;
    password = req.body.password;

    UserSchema.findOne({ username: username }).then((user) => {
        if (user) {
            if (bcrypt.compareSync(password, user.password) === true){
                const accessToken = generateAccessToken({username});
                const refreshToken = jwt.sign({username}, process.env.SECRET_KEY_REFRESH);   
                user.refreshToken = refreshToken;
                user.save();
                res.status(200).json({status : 'success',data:{accessToken , refreshToken}});
            }
            else
                res.status(401).json({status : 'error', message: 'Sai tài khoản hoặc mật khẩu'})

        }
        else res.status(403).json({status : 'error', message: 'Sai tài khoản hoặc mật khẩu'})
    })
})

app.listen(process.env.PORT, () => {
    console.log('listen port 5000 : http://localhost:5000')
})