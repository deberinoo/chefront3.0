import Passport 	from 'passport';
import { Strategy } from 'passport-local';
import Hash 		from 'hash.js';
import { User } 	from '../data/models/Users.mjs';


/**
 * Initialize the passport and configure local strategy
 * @param {import('express').Express} server 
 */

export function initialize_passport(server) {
	Passport.use('local',LocalStrategy);
	Passport.serializeUser(async function (user, done) {
		return done(null, user.uuid);
	});
	Passport.deserializeUser(async function (uid, done) {
		try {
			const user = await User.findByPk(uid);
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
		var user = await User.findOne({
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
