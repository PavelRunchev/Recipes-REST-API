const express = require('express');
const path = require('path');


const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

//масив от разрешени домейни!!!
const allowedOrigins = ['http://localhost:8080', 'http://localhost:3000'];
const corsOptions = {
	// Разрешаване само на заявки от този домейн
	origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
	methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE'],
  	credentials: true,
	allowedHeaders: ['Content-Type', 'Authorization'], 
}

module.exports = app => {
	app.disable('x-powered-by');

    app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	app.use(cors(corsOptions));
	app.use(helmet({
		referrerPolicy: { policy: "no-referrer" },
		contentSecurityPolicy: {
			getDefaultDirectives: true,
			dangerouslyDisableDefaultSrc: true,
			reportOnly: true,

		},
		hsts: {
			maxAge: 349821234595432123,
			includeSubDomains: true,
			preload: true
		},
		permittedCrossDomainPolicies: {
			permittedPolicies : "by-content-type"
		}
	}));
	app.use(helmet.originAgentCluster());
	app.use(helmet.noSniff());
	app.use(helmet.ieNoOpen());
	app.use(helmet.xssFilter());

	app.use(function(req, res, next) {
		//only express validator
		if(req.body.body !== undefined)
			req.body = JSON.parse(req.body.body);

		//res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		//res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin, X-Requested-With");
		//res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
		next();
	});
}