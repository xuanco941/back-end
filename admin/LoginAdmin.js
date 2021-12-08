
const bcrypt = require('bcrypt');
const AdminSchema = require('./AdminSchema');

class Admin {
    LogIn(req, res) {
        const username = req.body.username.trim();
        const password = req.body.password.trim();

        AdminSchema.findOne({ username: username }).then((user) => {
            if (user) {
                if (bcrypt.compareSync(password, user.password) === true) {
                    res.status(200).json({ status: 'success', data: { username: username } });
                }
                else
                    res.status(401).json({ status: 'error', message: 'Sai tài khoản hoặc mật khẩu' })

            }
            else res.status(401).json({ status: 'error', message: 'Sai tài khoản hoặc mật khẩu' })
        })
    }

    LogUp(req, res) {
        const username = req.body.username.trim();
        const password = req.body.password.trim();
        const saltRounds = 10;
        const hash = bcrypt.hashSync(password, saltRounds);

        AdminSchema.findOne({ username: username })
            .then(user => {
                if (user) res.status(401).json({ status: 'error', message: 'Tài khoản này đã tồn tại' })
                else AdminSchema.create({ username: username, password: hash }).then(() => {
                    res.status(201).json({ status: 'success', data: { username: username } });
                })
            })
    }

}


module.exports = new Admin