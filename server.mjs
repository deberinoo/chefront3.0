import Express from 'express';
import ExpHandlebars from 'express-handlebars';
import ExpSession from 'express-session';
import ExpSessionStore from 'express-mysql-session';
import BodyParser from 'body-parser';
import CookieParser from 'cookie-parser';
import MethodOverrides from 'method-override';
import Path from 'path';

import Flash from 'connect-flash';
import FlashMessenger from 'flash-messenger';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

import Handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';

import ORM from 'sequelize';
import passport from 'passport';

import LocalStrategy from 'passport-local';

//  Import models
import { BusinessUser } from './models/Business.mjs';
import { Outlets } from './models/Outlets.mjs';
import { CustomerUser } from './models/Customer.mjs';
import { Feedback } from './models/Feedback.mjs'
import { Reservations } from './models/Reservations.mjs';
import { User } from './models/Users.mjs';

const CLIENT_ID = '393014126046-dt545klaqnl5gielf5p7ojur8eteb12v.apps.googleusercontent.com'
const CLEINT_SECRET = '0CJfoRhPlPFsdoVcpl-nUHHL'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04yKJ7OHbm8HnCgYIARAAGAQSNwF-L9IrhF2am19XPUV15m77Gg70X6jvBxNWyKKy1kBKP_s8AS7XxZP8MZzeev5_p0A1NClOjlc'

const oAuth2Client = new google.auth.OAuth2(
	CLIENT_ID,
	CLEINT_SECRET,
	REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export async function sendMail(email) {
	try {
		const accessToken = await oAuth2Client.getAccessToken();

		const transport = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				type: 'OAuth2',
				user: 'chefrontceo@gmail.com',
				clientId: CLIENT_ID,
				clientSecret: CLEINT_SECRET,
				refreshToken: REFRESH_TOKEN,
				accessToken: accessToken,
			},
		});

		const mailOptions = {
			from: 'chefrontceo@gmail.com',
			to: email,
			subject: 'Email confirmation',
			text: 'Hello from the CEO',
			html: "<p>Email confirmed, thank you for using Chefront </p>",
		};

		const result = await transport.sendMail(mailOptions);
		return result;
	} catch (error) {
		return error;
	}
}

export async function sendMailPasswordChange(email) {
	try {
		const accessToken = await oAuth2Client.getAccessToken();

		const transport = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				type: 'OAuth2',
				user: 'chefrontceo@gmail.com',
				clientId: CLIENT_ID,
				clientSecret: CLEINT_SECRET,
				refreshToken: REFRESH_TOKEN,
				accessToken: accessToken,
			},
		});

		const mailOptions = {
			from: 'chefrontceo@gmail.com',
			to: email,
			subject: 'Forget Password Email',
			text: 'Hello from the CEO',
			html: `<p>You requested for a password reset, kindly use this <a href='http://localhost:3000/auth/resetPasswordCustomer/${email}'>Link</a>to reset your password</p>`,
		};

		const result = await transport.sendMail(mailOptions);
		return result;
	} catch (error) {
		return error;
	}
}


const Server = Express();
const Port = process.env.PORT || 3000;
const { Sequelize, DataTypes, Model, Op } = ORM

import methodOverride from 'method-override';
// Method override middleware to use other HTTP methods such as PUT and DELETE
Server.use(methodOverride('_method'));

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
	console.error("Error connecting to database");
}
//  Initialise models
CustomerUser.initialize(Database);
BusinessUser.initialize(Database);
DiscountSlot.initialize(Database);
Outlets.initialize(Database);
Feedback.initialize(Database);
User.initialize(Database);
Reservations.initialize(Database)

//  Sync your database
Database.sync({ drop: false });  //  drop is true => clear tables, recreate

//------------ Init completed
console.log("Database connection successful");

Server.set('views', 'templates');    //  Let express know where to find HTML templates
Server.set('view engine', 'handlebars');  //  Let express know what template engine to use
Server.engine('handlebars', ExpHandlebars({
	handlebars: allowInsecurePrototypeAccess(Handlebars),
	defaultLayout: 'main'
}));
//  Let express know where to access static files
//  Host them at locahost/public
Server.use("/public", Express.static('public'));


Server.use(BodyParser.urlencoded({ extended: false }));
Server.use(BodyParser.json());
Server.use(CookieParser());
Server.use(MethodOverrides('_method'));



Server.use(ExpSession({
	name: 'example-app',
	secret: 'random-secret',
	resave: false,
	saveUninitialized: false
}));


import { initialize_passport } from './utils/passport.mjs';

initialize_passport(Server);



Server.use(Flash());
Server.use(FlashMessenger.middleware);

//-----------------------------------------


Server.use(function (req, res, next) {
	res.locals.user = req.user || null;
	next();
});


import Routes from './routes/main.mjs'
Server.use("/", Routes);


import { ListRoutes } from './utils/routes.mjs'
import { DiscountSlot } from './models/DiscountSlot.mjs';
console.log("===== Registered Routes =====");
ListRoutes(Server._router).forEach(route => {
	console.log(`${ route.method.padStart(8) } | /${route.path}`);
});
console.log("===========================");

/**
 * Start the server in infinite loop
 */
Server.listen(Port, function () {
	console.log(`Server listening at port ${ Port }`);
});