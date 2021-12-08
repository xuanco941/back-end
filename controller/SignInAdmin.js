const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AdminSchema = require('../model/AdminSchema');

function generateAccessToken(data) {
    return jwt.sign(data, process.env.SECRET_KEY_ADMIN, { expiresIn: process.env.SECRET_KEY_EXP_ADMIN })
}

class Admin {
    SignIn(req, res) {
        const username = req.body.username.trim();
        const password = req.body.password.trim();

        AdminSchema.findOne({ username: username }).then((user) => {
            if (user) {
                if (bcrypt.compareSync(password, user.password) === true) {
                    const accessToken = generateAccessToken({ username });
                    const refreshToken = jwt.sign({ username }, process.env.SECRET_KEY_REFRESH_ADMIN);
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

    SignUp(req, res) {
        const username = req.body.username.trim();
        const password = req.body.password.trim();
        const saltRounds = 10;
        const hash = bcrypt.hashSync(password, saltRounds);

        AdminSchema.findOne({ username: username })
            .then(user => {
                if (user) res.status(401).json({ status: 'error', message: 'Tài khoản này đã tồn tại' })
                else AdminSchema.create({ username: username, password: hash }).then(() => {
                    res.status(201).json({ status: 'success' });
                })
            })
    }



    RefreshToken(req, res) {
        if (!req.body.refreshToken) res.status(403).json({ status: 'error', message: 'Không tìm thấy Refresh Token' });
        const refreshToken = req.body.refreshToken;
        AdminSchema.findOne({ refreshToken }).then(user => {
            if (!user) res.status(403).json({ status: 'error', message: 'Refresh Token không hợp lệ' });
            else {
                jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_ADMIN, (err, user) => {
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


module.exports = new Admin