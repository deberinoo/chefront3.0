import ORM from 'sequelize';
const { Sequelize, OP } = ORM;

//  Import models
import { BusinessUser }     from '../data/Business.mjs';
import { CustomerUser }     from '../data/Customer.mjs';
import { Outlets }          from '../data/Outlets.mjs';
import { Reservations }     from '../data/Reservations.mjs';
import { DiscountSlot }     from '../data/DiscountSlot.mjs';
import { Feedback }         from '../data/Feedback.mjs'
import { User }             from '../data/Users.mjs';

/**
 * Initialize all the models within the system
 * @param {ORM.Sequelize} database
 */
 export function initialize_models(database) {
	try {
		console.log("Initializing ORM models");
		//	Initialize models
        BusinessUser.initialize(database);
		CustomerUser.initialize(database);
        DiscountSlot.initialize(database);
        Outlets.initialize(database);
        Feedback.initialize(database);
        User.initialize(database);
        Reservations.initialize(database);

		console.log("Building ORM model relations and indices");
		//	Create relations between models or tables
		//	Setup foreign keys, indexes etc

		//	Check foregin key in your database after writing all these stuff
		//BusinessUser   .belongsToMany(ModelProduct, { through: ModelCart, foreignKey: "uuid_user" });
		//ModelProduct.belongsToMany(ModelUser,    { through: ModelCart, foreignKey: "uuid_product" });
	
		console.log("Adding initialization hooks");
		//	Run once hooks during initialization
	}
	catch (error) {
		console.error ("Failed to configure ORM models");
		console.error (error);
	}
}