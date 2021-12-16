const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AdminSchema = require('../model/AdminSchema');

function generateAccessToken(data) {
    return jwt.sign(data, process.env.SECRET_KEY_ADMIN, { expiresIn: process.env.SECRET_KEY_EXP_ADMIN })
}

class Admin {
    async SignIn(req, res) {
        const username = req.body.username.trim();
        const password = req.body.password.trim();

        await AdminSchema.findOne({ username: username }).then((user) => {
            if (user) {
                if (bcrypt.compareSync(password, user.password) === true) {
                    const accessTokenAdmin = generateAccessToken({ username });
                    const refreshTokenAdmin = jwt.sign({ username }, process.env.SECRET_KEY_REFRESH_ADMIN);
                    user.refreshTokenAdmin = refreshTokenAdmin;
                    user.save();
                    res.status(200).json({ status: 'success', data: { accessTokenAdmin, refreshTokenAdmin } });
                }
                else
                    res.status(401).json({ status: 'error', message: 'Sai tài khoản hoặc mật khẩu' })

            }
            else res.status(403).json({ status: 'error', message: 'Sai tài khoản hoặc mật khẩu' })
        })
    }

    async SignUp(req, res) {
        const username = req.body.username.trim();
        const password = req.body.password.trim();
        const saltRounds = 10;
        const hash = bcrypt.hashSync(password, saltRounds);

        await AdminSchema.findOne({ username: username })
            .then(user => {
                if (user) res.status(401).json({ status: 'error', message: 'Tài khoản này đã tồn tại' })
                else AdminSchema.create({ username: username, password: hash }).then(() => {
                    res.status(201).json({ status: 'success' , message: 'Tạo tài khoản thành công' });
                })
            })
    }



    async RefreshToken(req, res) {
        if (!req.body.refreshTokenAdmin) res.status(403).json({ status: 'error', message: 'Không tìm thấy Refresh Token Admin' });
        const refreshTokenAdmin = req.body.refreshTokenAdmin;
        await AdminSchema.findOne({ refreshTokenAdmin }).then(user => {
            if (!user) res.status(403).json({ status: 'error', message: 'Refresh Token Admin không hợp lệ' });
            else {
                jwt.verify(refreshTokenAdmin, process.env.SECRET_KEY_REFRESH_ADMIN, (err, user) => {
                    if (err) res.status(401).json({ status: 'error', message: 'Xác thực Refresh Token Admin gặp lỗi' });
                    else {
                        const accessTokenAdmin = generateAccessToken({ username: user.username });
                        res.status(201).json({ status: 'success', data: { accessTokenAdmin } });
                    }
                });
            }
        })
    }

}


module.exports = new Admin