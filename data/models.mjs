import ORM from 'sequelize';
const { Sequelize, OP } = ORM;

//  Import models
import { User }             from '../data/models/Users.mjs';
import { Outlets }          from '../data/models/Outlets.mjs';
import { Reservations }     from '../data/models/Reservations.mjs';
import { DiscountSlot }     from '../data/models/DiscountSlot.mjs';
import { Feedback }         from '../data/models/Feedback.mjs';
import { Favourites } 		from '../data/models/Favourites.mjs';
import { Review } 			from '../data/models/Review.mjs';

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

		console.log("Building ORM model relations and indices");
		//	Create relations between models or tables
		//	Setup foreign keys, indexes etc

		//	Check foreign key in your database after writing all these stuff
		User.hasMany(Outlets, {
			scope: {
				role: UserRole.Business
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		});

		Outlets.belongsTo(User, {
			scope: {
				role: UserRole.Business
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
			foreignKey: "uuid_user"
		});
		
		BusinessUser.belongsToMany(ModelProduct, { through: ModelCart, foreignKey: "uuid_user" });
		ModelProduct.belongsToMany(ModelUser,    { through: ModelCart, foreignKey: "uuid_product" });
	
		console.log("Adding initialization hooks");
		//	Run once hooks during initialization
	}
	catch (error) {
		console.error ("Failed to configure ORM models");
		console.error (error);
	}
}