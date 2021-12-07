const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserSchema = require('../modal/UserSchema');

function generateAccessToken(data) {
    return jwt.sign(data, process.env.SECRET_KEY, { expiresIn: process.env.SECRET_KEY_EXP })
}

class Authentication {
    SignUp(req, res) {
        const username = req.body.username.trim();
        const password = req.body.password.trim();
        const saltRounds = 9;
        const hash = bcrypt.hashSync(password, saltRounds);

        UserSchema.findOne({ username: username })
            .then(user => {
                if (user) res.status(401).json({ status: 'error', message: 'Tài khoản này đã tồn tại' })
                else UserSchema.create({ username: username, password: hash }).then(() => {
                    res.status(201).json({ status: 'success' });
                })
            })

    }

    SignIn(req, res) {
        const username = req.body.username.trim();
        const password = req.body.password.trim();

        UserSchema.findOne({ username: username }).then((user) => {
            if (user) {
                if (bcrypt.compareSync(password, user.password) === true) {
                    const accessToken = generateAccessToken({ username });
                    const refreshToken = jwt.sign({ username }, process.env.SECRET_KEY_REFRESH);
                    user.refreshToken = refreshToken;
                    user.save();
                    res.status(200).json({ status: 'success', data: { accessToken, refreshToken } });
                }
                else
                    res.status(401).json({ status: 'error', message: 'Sai tài khoản hoặc mật khẩu' })

            }
            else res.status(403).json({ status: 'error', message: 'Sai tài khoản hoặc mật khẩu' })
        })
    }
}


module.exports = new Authentication