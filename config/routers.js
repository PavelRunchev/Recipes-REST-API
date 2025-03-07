
// import sub module router!!!
const router = require('../routers');

module.exports = app => {
    app.use('/', router.home);
    app.use('/home', router.home);
    app.use('/user', router.user);
};