import ExpSessionStore 					from 'express-mysql-session';
import ORM from 'sequelize';

const { Sequelize } = ORM;

export const { DataTypes, Model, Op } = ORM;

import { initialize_models }    from '../data/models.mjs';
import { BusinessUser }         from '../data/Business.mjs';
import { CustomerUser }         from '../data/Customer.mjs';
import { Outlets }              from '../data/Outlets.mjs';
import { Reservations }         from '../data/Reservations.mjs';
import { DiscountSlot }         from '../data/DiscountSlot.mjs';
import { Feedback }             from '../data/Feedback.mjs'
import { User }                 from '../data/Users.mjs';

/**
 * Database configuration
 */

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


/**
 * Initialize the database connection
 * @param {boolean} drop True to drop all tables and re-create
 * @return {Promise} Initialization async handle
 */
export function initialize_database(drop = false) {
return Database	.authenticate()
                .then(database_initialized.bind(this, drop))
                .catch(onDatabaseConnectFail);
}

/**
 * Synchronize database with models
 * @param {boolean} drop True to drop all tables and re-create
 * @private
**/
async function database_initialized(drop) {
	try {
		console.log(`Database authenticated, initializing...`);
		initialize_models(Database);
		await Database.sync({ force: drop });

		console.log(`Database initialized`);
		return Promise.resolve();
	}
	catch (error) {
		console.error(`Database failed to initialize completely`);
		console.error(error);
		return Promise.reject(error);
	}
}

/**
 * Triggered when database connection failed
 * @param {Error} error 
 * @private
 */
function onDatabaseConnectFail(error) {
	console.error("Database connection Failed");
	console.error(error);
}
