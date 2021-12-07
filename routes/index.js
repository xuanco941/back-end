const AuthenticationRoute = require('./AuthenticationRoute');


function Route (app){
    app.use('/',AuthenticationRoute);
}


module.exports = Route