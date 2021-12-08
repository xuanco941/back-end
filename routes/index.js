const AuthenticationRoute = require('./AuthenticationRoute');
const AdminRoute = require('./AdminRoute');
const ProductRoute = require('./ProductRoute');


function Route (app){
    app.use('/user',AuthenticationRoute);
    app.use('/admin', AdminRoute);
    app.use('/product', ProductRoute);
}


module.exports = Route