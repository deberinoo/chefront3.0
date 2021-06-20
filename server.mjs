import Express from 'express';
import ExpHandlebars from 'express-handlebars';
import ExpSession from 'express-session';
import ExpSessionStore from 'express-mysql-session'
import BodyParser from 'body-parser';
import CookieParser from 'cookie-parser';

import MethodOverrides from 'method-override';
import Path from 'path';

import Flash from 'connect-flash';
import FlashMessenger from 'flash-messenger';

import Handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';

import ORM from 'sequelize'
import MySQLStore from 'express-mysql-session';
import passport from 'passport';

import LocalStrategy from 'passport-local';
import bcrypt from 'bcryptjs';

//	Import models
import { BusinessUser, BusinessRole } from './models/Business.mjs';
import { Outlets, OutletsRole } from './models/Outlets.mjs';
import { CustomerUser, UserRole } from './models/Customer.mjs';
import { Feedback } from './models/Feedback.mjs'


const Server = Express();
const Port = process.env.PORT || 3000;
const { Sequelize, DataTypes, Model, Op } = ORM


// Initialise database
const Config = {
	host: 'chefront.chm47uk9tay8.ap-southeast-1.rds.amazonaws.com',
	database: 'chefront',
	username: 'headchef',
	password: 'chefront2.0',
	port: 3306
}

export const SessionStore = new ExpSessionStore({
	host: Config.host,
	port: Config.port,
	user: Config.username,
	password: Config.password,
	database: Config.database,
	clearExpired: true,
	checkExpirationInterval: 900000,
	expiration: 900000
})

export const Database = new Sequelize(
	Config.database, Config.username, Config.password, {
	port: Config.port,
	host: Config.host,      // Name or IP address of MySQL server
	dialect: 'mysql',           // Tells sequelize that MySQL is used
	operatorsAliases: false,
	define: {
		timestamps: false       // Don't create timestamp fields in database
	},
	pool: {                     // Database system params, don't need to know
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	}
});

 

try {
	await Database.authenticate();
}
catch (error) {
	console.error(`Error connecting to database`);
}

//	Initialise models
CustomerUser.initialize(Database);
BusinessUser.initialize(Database);
Outlets.initialize(Database);
Feedback.initialize(Database);

//	Sync your database
Database.sync({ drop: false });	//	drop is true => clear tables, recreate

//------------ Init completed
console.log(`Database connection successful`);

Server.set('views', 'templates');		//	Let express know where to find HTML templates
Server.set('view engine', 'handlebars');	//	Let express know what template engine to use
Server.engine('handlebars', ExpHandlebars({
	handlebars: allowInsecurePrototypeAccess(Handlebars),
	defaultLayout: 'main'
}));
//	Let express know where to access static files
//	Host them at locahost/public
Server.use("/public", Express.static('public'));

/**
 * Form body parsers etc
 */
Server.use(BodyParser.urlencoded({ extended: false }));
Server.use(BodyParser.json());
Server.use(CookieParser());
Server.use(MethodOverrides('_method'));



/**
 * Express Session
 */
Server.use(ExpSession({
	name: 'example-app',
	secret: 'random-secret',
	resave: false,
	saveUninitialized: false
}));


/**
 * Initialize passport
 **/
import { initialize_passport } from './utils/passport.mjs';
initialize_passport(Server);


/**
 * Flash Messenger (OPTIONAL)
 */
Server.use(Flash());
Server.use(FlashMessenger.middleware);

//-----------------------------------------

/**
 * TODO: Setup global contexts here. Basically stuff your variables in locals
 */
Server.use(function (req, res, next) {
	res.locals.user = req.user || null;
	next();
});


import Routes from './routes/main.mjs'
Server.use("/", Routes);

/**
 * DEBUG USAGE
 * Use this to check your routes
 * Prints all the routes registered into the application
**/
import { ListRoutes } from './utils/routes.mjs'
console.log(`=====Registered Routes=====`);
ListRoutes(Server._router).forEach(route => {
	console.log(`${route.method.padStart(8)} | /${route.path}`);
});
console.log(`===========================`);

/**
 * Start the server in infinite loop
 */
Server.listen(Port, function () {
	console.log(`Server listening at port ${Port}`);
});