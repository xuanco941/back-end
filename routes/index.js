const AuthenticationRoute = require('./AuthenticationRoute');
const AdminRoute = require('./AdminRoute');


function Route (app){
    app.use('/',AuthenticationRoute);
    app.use('/admin', AdminRoute);
}


module.exports = Route