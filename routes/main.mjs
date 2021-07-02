import { Router }       from 'express';
import { flashMessage } from '../utils/flashmsg.mjs';
import { Feedback } from '../models/Feedback.mjs';
import axios from 'axios';

const router = Router();
export default router;

// ---------------- 
//	Serves dynamic files from the dynamic folder
router.get("/dynamic/:path", async function (req, res) {	
	return res.sendFile(`./dynamic/${req.params.path}`)
});

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
router.get("/home",      async function(req, res) {
	if (role != undefined) {
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
});

router.get("/error", async function(req, res) {
	if (role != undefined) {
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
});

router.get("/about", async function(req, res) {
	if (role != undefined) {
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
});

router.get("/categories", async function(req, res) {
	if (role != undefined) {
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
});

router.get("/contact", async function(req, res) {
	if (role != undefined) {
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
});

router.post("/home", async function(req,res) {
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
});

router.get("/payment", async function(req, res) {
	if (role != undefined) {
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
});

router.get("/restaurants", async function(req, res) {
	if (role != undefined) {
		var role = getRole(req.user.role);
		var admin = role[0];
		var business = role[1];
		var customer = role[2];
	}
	return res.render('restaurants', {
		admin: admin,
		business: business,
		customer: customer
	});
});

router.get("/restaurant", async function(req, res) {
	if (role != undefined) {
		var role = getRole(req.user.role);
		var admin = role[0];
		var business = role[1];
		var customer = role[2];
	}
	return res.render('restaurant', {
		admin: admin,
		business: business,
		customer: customer
	});
});

router.get("/success", async function(req, res) {
	if (role != undefined) {
		var role = getRole(req.user.role);
		var admin = role[0];
		var business = role[1];
		var customer = role[2];
	}
	return res.render('success', {
		admin: admin,
		business: business,
		customer: customer
	});
});

// ---------------- 
// Error page routing
router.use(function (req, res, next) {
	res.status(404).render('404')
});