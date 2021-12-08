const mongoose = require('mongoose');

// const urlConnect = `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWD_DB}@cluster0.ds7ba.mongodb.net/Clone_Ananas?retryWrites=true&w=majority`;

const urlConnect = 'mongodb://localhost:27017/Clone_Ananas';

const connectDataBase = async () => {
        try {
                await mongoose.connect(urlConnect, { useNewUrlParser: true, useUnifiedTopology: true });
                console.log('Connected');
        }
        catch{
                console.log('connect failure')
        }
}

module.exports = connectDataBase;