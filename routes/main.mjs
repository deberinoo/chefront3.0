import { Router }       	from 'express';
import { flashMessage } 	from '../utils/flashmsg.mjs';
import { Feedback } 		from '../models/Feedback.mjs';
import { Outlets } 			from '../models/Outlets.mjs';
import { Reservations } 	from '../models/Reservations.mjs';

import ORM             from 'sequelize';
const { Sequelize, DataTypes, Model, Op } = ORM;
import axios from 'axios';

const router = Router();
export default router;

// ---------------- 
//	Serves dynamic files from the dynamic folder
router.get("/dynamic/:path", async function (req, res) {	
	return res.sendFile(`./dynamic/${req.params.path}`)
});

// Main routes
router.get("/home",     							   view_home_page);
router.get("/about",     							   view_about_page);
router.get("/categories",     						   view_categories_page);
router.get("/error",     							   view_error_page);
router.get("/success",                                 view_success_page);

// Contact routes
router.get("/contact",     						       view_contact_page);
router.post("/home",     							   create_feedback_process);

// Restaurant routes
router.get("/restaurants",                             view_restaurants_page); 
router.get("/restaurant/:business_name/:location",     view_individual_restaurant_page);
router.post("/restaurant/:business_name/:location",    create_reservation_process);

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
async function view_home_page(req, res) {
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

async function view_error_page(req, res) {
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

async function view_about_page(req, res) {
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

async function view_categories_page(req, res) {
	if (req.user == undefined) {
		return res.render('categories')
	} else {
		var role = getRole(req.user.role);
		var admin = role[0];
		var business = role[1];
		var customer = role[2];
	}

	return res.render('categories', {
		admin: admin,
		business: business,
		customer: customer
	});
};

async function view_contact_page(req, res) {
	if (req.user == undefined) {
		return res.render('contact')
	} else {
		var role = getRole(req.user.role);
		var admin = role[0];
		var business = role[1];
		var customer = role[2];
	}
	
	return res.render('contact', {
		admin: admin,
		business: business,
		customer: customer
	});
};

async function create_feedback_process(req,res) {
	let { Name, Email, Phone, Message, Read } = req.body;

	//CREATE
	const feedbacks = await Feedback.create({
		"name" : Name,
		"email" : Email,
		"phone" : Phone,
		"message" : Message,
		"read" : Read
	});
	return res.redirect("/home");
};

async function view_payment_page(req, res) {
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

async function view_restaurants_page(req, res) {

	const restaurants = await Outlets.findAll({
        where: {
            "business_name": {
                [Op.ne]:"null"
            }
        }
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
			restaurants:restaurants
		});
	}
};

async function view_individual_restaurant_page(req, res) {
    const restaurants = await Outlets.findOne({
		where: {
            "business_name": req.params.business_name,
			"location": req.params.location

        }})

	if (req.user == undefined) {
		return res.render('restaurant', {restaurants:restaurants})
	} else {
		var role = getRole(req.user.role);
		var admin = role[0];
		var business = role[1];
		var customer = role[2];
		return res.render('restaurant', {
			admin:admin,
			business:business,
			customer:customer,
			restaurants:restaurants
		});
	}
};

function getId() {
    const rand = Math.random().toString(16).substr(2, 6); 
	return rand.toUpperCase();
}

async function create_reservation_process(req, res) {
	if (req.user == undefined) {
		return res.render('auth/loginCustomer')
	} else {
		var role = getRole(req.user.role);
		var admin = role[0];
		var business = role[1];
		var customer = role[2];
	}

    let errors = [];
    
    let { BusinessName, Location, ResDate, Pax, Time, Discount, Name, Email, Contact } = req.body;

    const reservation = await Reservations.create({
		"reservation_id":  String(getId()),
		"business_name":  BusinessName,
        "location":  Location,
		"res_date": ResDate,
		"pax": Pax,
		"time": Time,
		"discount": Discount,
		"user_name": Name,
		"user_email": Email,
		"user_contact": Contact,
		
    });
    res.render("success", {
		admin:admin,
		business:business,
		customer:customer,
		reservation:reservation
	});
};

async function view_success_page(req, res) {
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

// ---------------- 
// Error page routing
router.use(function (req, res, next) {
	res.status(403).render('403')
});

router.use(function (req, res, next) {
	res.status(404).render('404')
});