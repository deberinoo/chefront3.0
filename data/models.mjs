import ORM from 'sequelize';
const { Sequelize, OP } = ORM;

//  Import models
import { User, UserRole }   from '../data/models/Users.mjs';
import { Outlets }          from '../data/models/Outlets.mjs';
import { Reservations }     from '../data/models/Reservations.mjs';
import { DiscountSlot }     from '../data/models/DiscountSlot.mjs';
import { Feedback }         from '../data/models/Feedback.mjs';
import { Categories }   	from '../data/models/Categories.mjs';
import { Favourites } 	from '../data/models/Favourites.mjs';
//import { Review } 		from '../data/models/Review.mjs';
import Hash             	from 'hash.js';


/**
 * Initialize all the models within the system
 * @param {ORM.Sequelize} database
 */
 export function initialize_models(database) {
	try {
		console.log("Initializing ORM models");
		//	Initialize models
        DiscountSlot.initialize(database);
        Outlets.initialize(database);
        Feedback.initialize(database);
        User.initialize(database);
        Reservations.initialize(database);
		Categories.initialize(database);
		Favourites.initialize(database);
		console.log("Building ORM model relations and indices");
		//	Create relations between models or tables
		//	Setup foreign keys, indexes etc

		//	Check foreign key in your database after writing all these stuff
		//User.hasMany(Outlets, {
		//	as:		    "outlets",
		//	foreignKey: "ownerID",
		//	onUpdate:   "CASCADE",
		//	onDelete:   "CASCADE",
		//});

		//Outlets.belongsTo(User, {
		//	as:			"owner",
		//	foreignKey: "ownerID",
		//	onUpdate:   "CASCADE",
		//	onDelete:   "CASCADE",
		//});
		console.log("Adding initialization hooks");
		database.addHook("afterBulkSync", generate_root_account.name, generate_root_account.bind(User, database))
		//	Run once hooks during initialization
	}
	catch (error) {
		console.error ("Failed to configure ORM models");
		console.error (error);
	}
}

// async function generate_root_account(database, options) {
// 	//	Remove this callback to ensure it runs only once
// 	database.removeHook("afterBulkSync", generate_root_account.name);
// 	//	Create a root user if not exists otherwise update it
// 	try {
// 		console.log("Generating root administrator account");
// 		const root_parameters = {	
// 			uuid    : "00000000-0000-0000-0000-000000000000",
// 			name    : "root",
// 			email   : "root@chefront.com",
// 			contact : "97504802",
//          verified : "Yes",
// 			role    : "admin",
// 			verified: "Yes",
// 			password: Hash.sha256().update("CEOtings123").digest("hex")
// 		};
// 		//	Find for existing account with the same id, create or update
// 		var account = await User.findOne({where: { "uuid": root_parameters.uuid }});
		
// 		account = await ((account) ? account.update(root_parameters): User.create(root_parameters));
		
// 		console.log("== Generated root account ==");
// 		console.log(account.toJSON());
// 		console.log("============================");
// 		return Promise.resolve();
// 	}
// 	catch (error) {
// 		console.error ("Failed to generate root administrator user account");
// 		console.error (error);
// 		return Promise.reject(error);
// 	}
// }