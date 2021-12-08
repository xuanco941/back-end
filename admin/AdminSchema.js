const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Admin = new Schema(
    {
        username: String,
        password: String
    },{
        collection: 'Admin'
    }
)
module.exports = mongoose.model('Admin', Admin);