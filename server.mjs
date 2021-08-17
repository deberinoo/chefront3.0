import Express 							from 'express';
import ExpHandlebars 					from 'express-handlebars';
import ExpSession 						from 'express-session';
import BodyParser 						from 'body-parser';
import CookieParser 					from 'cookie-parser';

import MethodOverrides 					from 'method-override';

import Flash 							from 'connect-flash';
import FlashMessenger 					from 'flash-messenger';
import Passport 						from 'passport';

import Handlebars 						from 'handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';


const Server = Express();
const Port = process.env.PORT || 3000;

/**
 * Template Engine
*/
Server.set('views', 'templates');    //  Let express know where to find HTML templates
Server.set('view engine', 'handlebars');  //  Let express know what template engine to use
Server.engine('handlebars', ExpHandlebars({
	handlebars: allowInsecurePrototypeAccess(Handlebars),
	defaultLayout: 'main',
	helpers: {
		ifEquals(a, b, options) {
			if (a === b) {
				return options.fn(this)
			} else {
				return options.inverse(this)
			}
		},
		ifNotEquals(a,b,options){
			if (a != b){
				return options.fn(this)
			} else{
				return options.inverse(this)
			}
		}
	}
}));
//  Let express know where to access static files
//  Host them at locahost/public
Server.use("/public", Express.static('public'));


/**
 * Form body parsers etc
 */
Server.use(BodyParser.urlencoded({ extended: false }));
Server.use(BodyParser.json());
Server.use(CookieParser());
Server.use(MethodOverrides('_method'));

import { SessionStore, initialize_database } from './data/database.mjs'
/**
 * Express Session
 */
Server.use(ExpSession({
	name: 'example-app',
	secret: 'random-secret',
	resave: false,
	store: SessionStore,
	saveUninitialized: false
}));

/**
 * Passport Initialize
*/
import { initialize_passport } from './utils/passport.mjs';
initialize_passport(Server);
Server.use(Passport.initialize());
Server.use(Passport.session());

/**
 * Initialize database
*/
initialize_database(false);

/**
 * Flash Messenger 
*/
Server.use(Flash());
Server.use(FlashMessenger.middleware);

//-----------------------------------------

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
 * Debug Usage
**/
import { ListRoutes } from './utils/routes.mjs'
console.log("===== Registered Routes =====");
ListRoutes(Server._router).forEach(route => {
	console.log(`${route.method.padStart(8)} | /${route.path}`);
});
console.log(`===========================`);

/**
 * Start the server in infinite loop
 */
Server.listen(Port, function() {
	console.log(`Server listening at port ${Port}`);
});



