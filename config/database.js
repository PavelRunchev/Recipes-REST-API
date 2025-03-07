/* eslint-disable no-console */
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const User = require('../models/user');

module.exports = config => {
    mongoose.connect(config.dbPath);
    
    const db = mongoose.connection;
    db.once('open', err => {
        if (err) throw err;
        User.seedAdminUser().then(() => {
            console.log('Database ready');
        }).catch((reason) => {
            console.log('Something went wrong that connect to DATABASE!');
            console.log(reason);
        });
    });

    db.on('error', reason => {
        const data = {
            data: new Date().toLocaleString(),
            error: reason,
        };

        console.log(reason);
    });
};