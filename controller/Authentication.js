const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserSchema = require('../model/UserSchema');

function generateAccessToken(data) {
    return jwt.sign(data, process.env.SECRET_KEY, { expiresIn: process.env.SECRET_KEY_EXP })
}

class Authentication {
    async SignUp(req, res) {
        const username = req.body.username.trim();
        const password = req.body.password.trim();
        const saltRounds = 9;
        const hash = bcrypt.hashSync(password, saltRounds);

        await UserSchema.findOne({ username: username })
            .then(user => {
                if (user) res.status(401).json({ status: 'error', message: 'Tài khoản này đã tồn tại' })
                else UserSchema.create({ username: username, password: hash }).then(() => {
                    res.status(201).json({ status: 'success',message: 'Tạo tài khoản thành công' });
                })
            })

    }

    async SignIn(req, res) {
        const username = req.body.username.trim();
        const password = req.body.password.trim();

        await UserSchema.findOne({ username: username }).then((user) => {
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

    async RefreshToken(req, res) {
        if (!req.body.refreshToken) res.status(403).json({ status: 'error', message: 'Không tìm thấy Refresh Token' });
        const refreshToken = req.body.refreshToken;
        await UserSchema.findOne({ refreshToken }).then(user => {
            if (!user) res.status(403).json({ status: 'error', message: 'Refresh Token không hợp lệ' });
            else {
                jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH, (err, user) => {
                    if (err) res.status(401).json({ status: 'error', message: 'Xác thực Refresh Token gặp lỗi' });
                    else {
                        const accessToken = generateAccessToken({ username: user.username });
                        res.status(201).json({ status: 'success', data: { accessToken } });
                    }
                });
            }
        })
    }
}


module.exports = new Authentication