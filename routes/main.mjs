import { Router }       	from 'express';
import { flashMessage } 	from '../utils/flashmsg.mjs';
import { Feedback } 		from '../data/models/Feedback.mjs';
import { Outlets } 			from '../data/models/Outlets.mjs';
import { Reservations } 	from '../data/models/Reservations.mjs';
import { DiscountSlot }     from '../data/models/DiscountSlot.mjs';
import { Favourites }       from '../data/models/Favourites.mjs';

import moment               from 'moment';

import ORM             		from 'sequelize';
const { Op } = ORM;

const router = Router();
export default router;

// ---------------- 
//	Serves dynamic files from the dynamic folder
router.get("/dynamic/:path/:file*", async function (req,res){
    process.cwd() // current working directory
    return res.sendFile(`${process.cwd()}/dynamic/${req.params.path}/${req.params.file}`)
});

// Main routes
router.get("/home",     							   view_home_page);
router.get("/about",     							   view_about_page);
router.get("/categories",     						   view_categories_page);
router.get("/category/:category",     				   view_category_page);
router.get("/error",     							   view_error_page);
router.get("/success",                                 view_success_page);
router.get("/termsofservice",                          view_tos_page);

// Contact routes
router.get("/contact",     						       view_contact_page);
router.post("/home",     							   create_feedback_process);

// Restaurant routes
router.get("/restaurants",                             view_restaurants_page); 
router.get("/restaurant/:name/:location",     		   view_individual_restaurant_page);
router.post("/restaurant/:name/:location",    		   create_reservation_process);
router.get("/favourite_restaurant/:name/:location/:email",	   favourite_restaurant )

// Payment routes
router.get("/payment",                                 view_payment_page);

// ---------------- 
//	Additional routers
import RouterAuth from './auth.mjs'
router.use("/auth", RouterAuth);

import RouterProfile from './user.mjs'
router.use("/u", RouterProfile);

import RouterPayment from './payment/payment.mjs'
router.use("/payment", RouterPayment)

import RouterAdmin from './admin.mjs'
import { Categories } from '../data/models/Categories.mjs';
import { sendMailMakeReservation } from '../data/mail.mjs';
router.use("/admin", RouterAdmin);

router.get("/", async function (req, res) {
	return res.redirect("/home");
});

// ----------------
// Check user role
function getRole(role) {
	if (role == 'admin') {
		var admin = true;
		var business = false;
		var customer = false;
	}
	else if (role == 'business') {
		var admin = false;
		var business = true;
		var customer = false;
	}
	else if (role == 'customer') {
		var admin = false;
		var business = false;
		var customer = true;
	}
	return [admin, business, customer];
}

// ---------------- 
//	Common URL paths
function view_home_page(req, res) {
	if (req.user == undefined) {
		return res.render('index')
	} else {
		var role = getRole(req.user.role);
		var admin = role[0];
		var business = role[1];
		var customer = role[2];
	}

	return res.render('index', {
		admin: admin,
		business: business,
		customer: customer
	});
};

function view_error_page(req, res) {
	if (req.user == undefined) {
		return res.render('404')
	} else {
		var role = getRole(req.user.role);
		var admin = role[0];
		var business = role[1];
		var customer = role[2];
	}

	return res.render('404', {
		admin: admin,
		business: business,
		customer: customer
	});
};

function view_about_page(req, res) {
	if (req.user == undefined) {
		return res.render('about')
	} else {
		var role = getRole(req.user.role);
		var admin = role[0];
		var business = role[1];
		var customer = role[2];
	}

	return res.render('about', {
		admin: admin,
		business: business,
		customer: customer
	});
};


function view_tos_page(req, res) {
	return res.render('termsofservice');
};

async function view_categories_page(req, res) {
	const category = await Categories.findAll({
        where: {
            "name": {
                [Op.ne]:'null'
            }
        }
	});
	if (req.user == undefined) {
		return res.render('categories', {category:category})
	} else {
		var role = getRole(req.user.role);
		var admin = role[0];
		var business = role[1];
		var customer = role[2];
		return res.render('categories', {
			admin: admin,
			business: business,
			customer: customer,
			category: category
		});
	}
};

async function view_category_page(req, res) {
	const restaurants = await Outlets.findAll({
        where: {
            "category": {
                [Op.eq]: req.params.category
            }
        }
	});
	const category = await Categories.findOne({
		where: {
			"name":req.params.category
		}
	});
	if (req.user == undefined) {
		return res.render('category', {restaurants:restaurants, category:category})
	} else {
		var role = getRole(req.user.role);
		var admin = role[0];
		var business = role[1];
		var customer = role[2];
		return res.render('category', {
			admin: admin,
			business: business,
			customer: customer,
			restaurants: restaurants,
			category:category
		});
	}
};

function view_contact_page(req, res) {
	if (req.user == undefined) {
		return res.render('contact')
	} else {
		var role = getRole(req.user.role);
		var admin = role[0];
		var business = role[1];
		var customer = role[2];
		return res.render('contact', {
			admin: admin,
			business: business,
			customer: customer
		});
	};
}



async function create_feedback_process(req,res) {
	let { Name, Email, Phone, Message } = req.body;

	const feedbacks = await Feedback.create({
		"name" : Name,
		"email" : Email,
		"phone" : Phone,
		"message" : Message
	});

	flashMessage(res, 'success', 'Feedback successfully sent!', 'fa fa-comments', false);
	return res.redirect("/home");
};

async function view_restaurants_page(req, res) {
	const restaurants = await Outlets.findAll({
		where: {
            "name": {
                [Op.ne]:'null'
            }
        },
		raw: true,
	});

	if (req.user == undefined) {
		return res.render('restaurants', {
			restaurants:restaurants
		})
	} else {
		var role = getRole(req.user.role);
		var admin = role[0];
		var business = role[1];
		var customer = role[2];
		return res.render('restaurants', {
			admin:admin,
			business:business,
			customer:customer,
			restaurants:restaurants,
		});
	}
};

async function view_individual_restaurant_page(req, res) {
	const restaurant = await Outlets.findOne({
		where: {
            "name": req.params.name,
			"location": req.params.location
        }
	});
	const discountslot = await DiscountSlot.findAll({
		where: {
            "name": req.params.name,
			"location": req.params.location
        }
	});
	if (req.user == undefined) {
		return res.render('restaurant', {restaurant:restaurant, discountslot:discountslot})
	} else {
		const favourites = await Favourites.findOne({
			where: {
				"name": req.params.name,
				"location": req.params.location,
				"email": req.user.email
			}
		});

		var role = getRole(req.user.role);
		var admin = role[0];
		var business = role[1];
		var customer = role[2];
		return res.render('restaurant', {
			admin:admin,
			business:business,
			customer:customer,
			restaurant:restaurant,
			discountslot:discountslot,
			favourites : favourites,
		});
	}
};

async function create_reservation_process(req, res) {
	let errors = [];
	var now = moment().format('YYYY-MM-DD');
	var current_time = moment().format("HH:mm")

	if (req.user == undefined) {
		return res.render('auth/login');
	} 
	else {
		var role = getRole(req.user.role);
		var admin = role[0];
		var business = role[1];
		var customer = role[2];
		if (req.user.role == "admin" || req.user.role == "business") {
			return res.render('403'), {
				admin: admin,
				business: business,
				customer: customer	
			};
		}
	}

	const restaurant = await Outlets.findOne({
		where: {
            "name": req.params.name,
			"location": req.params.location
        }
	});
	const discountslot = await DiscountSlot.findAll({
		where: {
            "name": req.params.name,
			"location": req.params.location,
        }
	});

	let { BusinessName, Location, ResDate, Pax, Slot, Name, Email, Contact } = req.body;
	try {
		if (Slot == null) {
			errors = errors.concat({ text: "Please select a discount slot!" });
		}
		if (current_time >= Slot.split(",")[0] && now == ResDate) {
			errors = errors.concat({ text: "Please select a valid time slot!" });
		}
		if (errors.length > 0) {
			throw new Error("There are validation errors");
		}
	}
	catch (error) {
		console.error("There is errors with the login form body.");
		console.error(error);
		return res.render('restaurant', {
			admin:admin,
			business:business,
			customer:customer,
			restaurant:restaurant,
			discountslot:discountslot,
			errors:errors
		});
	}
	const timediscount = Slot.split(",");

	if (req.user.deposited == "Yes") {
		const reservation = await Reservations.create({
			"reservation_id":  String(getId()),
			"name":  BusinessName,
			"location":  Location,
			"date": ResDate,
			"pax": Pax,
			"time": timediscount[0],
			"discount": timediscount[1],
			"user_name": Name,
			"user_email": Email,
			"user_contact": Contact,
		});
		sendMailMakeReservation(Email, reservation.reservation_id, BusinessName, Location, Name, ResDate, Pax, timediscount[0], timediscount[1])
		.then((result) => console.log('Email sent...', result))
		.catch((error) => console.log(error.message));
		res.render("success", {
			admin:admin,
			business:business,
			customer:customer,
			reservation:reservation
		});
	} else if (req.user.deposited == "No") {
		const reservation = {
			"reservation_id":  String(getId()),
			"name":  BusinessName,
			"location":  Location,
			"date": ResDate,
			"pax": Pax,
			"time": timediscount[0],
			"discount": timediscount[1],
			"user_name": Name,
			"user_email": Email,
			"user_contact": Contact,
		};
		res.render("payment", {
			admin:admin,
			business:business,
			customer:customer,
			reservation:reservation
		});
	}
};

function view_success_page(req, res) {
	if (req.user == undefined) {
		return res.render('403')
	} else {
		var role = getRole(req.user.role);
		var admin = role[0];
		var business = role[1];
		var customer = role[2];
		return res.render('success', {
			admin: admin,
			business: business,
			customer: customer
		});
	}
};

function favourite_restaurant(req,res){
	let name = req.params.name
	let location = req.params.location
	let email = req.params.email
	Favourites.create({
		"email": email,
		"name": name,
		"location" : location,
	})
	flashMessage(res, 'success', 'Restaurant added to Favourites', 'fas fa-heart', false);
	return res.redirect(`/restaurant/${name}/${location}`)
}

function getId() {
    const rand = Math.random().toString(16).substr(2, 5); 
	return rand.toUpperCase();
};

function view_payment_page(req, res) {
	if (req.user == undefined) {
		return res.render('payment')
	} else {
		var role = getRole(req.user.role);
		var admin = role[0];
		var business = role[1];
		var customer = role[2];
	}

	return res.render('payment', {
		admin: admin,
		business: business,
		customer: customer
	});
};

// ---------------- 
// Error page routing

router.use(function (req, res, next) {
	res.status(404).render('404')
});