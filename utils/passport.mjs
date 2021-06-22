import Passport 	from 'passport';
import { Strategy } from 'passport-local';
import Hash 		from 'hash.js';
import { BusinessUser, BusinessRole } from '../models/Business.mjs';
import { CustomerUser, UserRole } from '../models/Customer.mjs'; 

/**
 * Initialize the passport and configure local strategy
 * @param {import('express').Express} server 
 */



export function initialize_business_passport(server) {
	Passport.use(LocalStrategy);
	Passport.serializeUser(async function (user, done) {
		return done(null, user.uuid);
	});
	Passport.deserializeUser(async function (uid, done) {
		try {
			const user = await BusinessUser.findByPk(uid);
			if (user == null) {
				throw new Error ("Invalid user id");
			}
			else {
				return done(null, user);
			}
			
		}
		catch (error) {
			console.error(`Failed to deserialize user ${uid}`);
			console.error(error);
			return done (error, false);
		}
	})

	server.use(Passport.initialize());
	server.use(Passport.session());
}

export function initialize_customer_passport(server) {
	Passport.use(LocalStrategy);
	Passport.serializeUser(async function (user, done) {
		return done(null, user.uuid);
	});
	Passport.deserializeUser(async function (uid, done) {
		try {
			const user = await CustomerUser.findByPk(uid);
			if (user == null) {
				throw new Error ("Invalid user id");
			}
			else {
				return done(null, user);
			}
			
		}
		catch (error) {
			console.error(`Failed to deserialize user ${uid}`);
			console.error(error);
			return done (error, false);
		}
	})

	server.use(Passport.initialize());
	server.use(Passport.session());
}

const LocalStrategy = new Strategy ({
	usernameField: "Email",
	passwordField: "Password"
}, async function (email, password, done) {

	try {
		const user = await BusinessUser.findOne({
			where: {
				Email:    email,
				Password: Hash.sha256().update(password).digest('hex')
			}
		});

		if (user == null) {
			throw new Error ("Invalid Credentials");
		}
		else {
			return done(null, user);
		}
	}
	catch (error) {
		console.error(`Failed to auth user ${email}`);
		console.error(error);
		return done(error, false, {message: "Invalid user credentials"});
	}
});
