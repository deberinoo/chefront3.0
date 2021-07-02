import { Router }       from 'express';
import { flashMessage } from '../utils/flashmsg.mjs'
import { BusinessUser } from '../models/Business.mjs';
import { CustomerUser } from '../models/Customer.mjs';
import { User } from '../models/Users.mjs'

import Passport         from 'passport';
import Hash             from 'hash.js';

const router = Router();
export default router;

/**
 * Regular expressions for form testing
 **/ 
 const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
 const regexName  = /^[a-z ,.'-]+$/i;
 //	Min 8 character, 1 upper, 1 lower, 1 number, 1 symbol
 //const regexPwd   = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
 
 // Min 8 character, 1 letter, 1 number 
 const regexPwd = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/


router.get("/login",     			login_page);

router.get("/loginBusiness", 		business_login_page);
router.post("/loginBusiness", 		business_login_process);
router.get("/loginCustomer",    	customer_login_page);
router.post("/loginCustomer",    	customer_login_process);

router.get("/register",    			register_page);

router.get("/registerBusiness",     register_business_page);
router.post("/registerBusiness",    register_business_process);
router.get("/registerCustomer",     register_customer_page);
router.post("/registerCustomer",    register_customer_process);

router.get("/logout",     			logout_process);

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

// Login

async function login_page(req, res) {
	return res.render('auth/login');
}

async function business_login_page(req, res) {
	return res.render('auth/loginBusiness');
}

async function business_login_process(req, res, next) {
    let { Email, Password } = req.body;

	let errors = [];
	try {
		if (! regexEmail.test(Email)) {
			errors = errors.concat({ text: "Invalid email address!" });
		}
		if (errors.length > 0) {
			throw new Error("There are validation errors");
		}
	}
	catch (error) {
		console.error("There is errors with the login form body.");
		console.error(error);
		return res.render('auth/login', { errors: errors });
	}

	const user = await BusinessUser.findOne({
        where: {
            "email": Email,
			"password": Hash.sha256().update(Password).digest('hex')
        }
	});

	return Passport.authenticate('local', {
		successRedirect: "/u/b/" + user.business_name,
		failureRedirect: "/auth/loginBusiness",
		failureFlash:    true
	})(req, res, next);
}

async function customer_login_page(req, res) {
	return res.render('auth/loginCustomer');
}

async function customer_login_process(req, res, next) {
    let { Email, Password } = req.body;
	
	let errors = [];
	try {
		if (! regexEmail.test(Email)) {
			errors = errors.concat({ text: "Invalid email address!" });
		}
		if (errors.length > 0) {
			throw new Error("There are validation errors");
		}
	}
	catch (error) {
		console.error("There is errors with the login form body.");
		console.error(error);
		return res.render('auth/login', { errors: errors });
	}

	const user = await CustomerUser.findOne({
        where: {
            "email": Email,
			"password": Hash.sha256().update(Password).digest('hex')
        }
	});

	return Passport.authenticate('local', {
		successRedirect: "/u/c/"+ user.email,
		failureRedirect: "/auth/loginCustomer",
		failureFlash:    true
	})(req, res, next);
}

// Register

async function register_page(req, res) {
	return res.render('auth/register');
}

async function register_business_page(req, res) {
	return res.render('auth/registerBusiness');
}

async function register_business_process(req, res) {
    let errors = [];
    
    let { BusinessName, Address, Contact, Email, InputPassword, ConfirmPassword } = req.body;

	try {
		if (! regexName.test(BusinessName)) {
			errors = errors.concat({ text: "Invalid name provided! It must be minimum 3 characters and starts with a alphabet." });
		}

		if (! regexEmail.test(Email)) {
			errors = errors.concat({ text: "Invalid email address!" });
		}
		else {
			const user = await User.findOne({where: {email: Email}});
			if (user != null) {
				errors = errors.concat({ text: "This email cannot be used!" });
			}
		}

		if (! regexPwd.test(InputPassword)) {
			errors = errors.concat({ text: "Password requires minimum eight characters, at least one uppercase letter, one lowercase letter and one number!" });
		}
		else if (InputPassword !== ConfirmPassword) {
			errors = errors.concat({ text: "Password do not match!" });
		}

		if (errors.length > 0) {
			throw new Error("There are validation errors");
		}
	}
	catch (error) {
		console.error("There is errors with the registration form body.");
		console.error(error);
		return res.render('auth/registerBusiness', { errors: errors });
	}

	//	Create new user, now that all the test above passed
	try {
		User.create({
			"email" : Email,
			"role" : "business"
		})
        const user = await BusinessUser.create({
            "business_name":  BusinessName,
            "address":  Address,
            "contact":  Contact,
            "email":    Email,
            "password": Hash.sha256().update(InputPassword).digest('hex'),
			"role": "business"
        });
        res.render('user/business/userBusiness');

		flashMessage(res, 'success', 'Successfully created an account. Please login', 'fas fa-sign-in-alt', false);
		res.redirect("/auth/loginBusiness");
	}
	catch (error) {
		//	Else internal server error
		console.error(`Failed to create a new user: ${Email} `);
		console.error(error);
		return res.status(500).end();
	}
};

async function register_customer_page(req, res) {
	return res.render('auth/registerCustomer');
}

async function register_customer_process(req, res) {
	let errors = [];
    
    let { FirstName, LastName, Contact, Email, InputPassword, ConfirmPassword } = req.body;

	try {
		if (! regexName.test(FirstName)) {
			errors = errors.concat({ text: "Invalid name provided! It must be minimum 3 characters and starts with a alphabet." });
		}

		if (! regexName.test(LastName)) {
			errors = errors.concat({ text: "Invalid name provided! It must be minimum 3 characters and starts with a alphabet." });
		}

		if (! regexEmail.test(Email)) {
			errors = errors.concat({ text: "Invalid email address!" });
		}

		else {
			const user = await User.findOne({where: {email: Email}});
			if (user != null) {
				errors = errors.concat({ text: "This email cannot be used!" });
			}
		}

		if (! regexPwd.test(InputPassword)) {
			errors = errors.concat({ text: "Password requires minimum eight characters, at least one uppercase letter, one lowercase letter and one number!" });
		}
		else if (InputPassword !== ConfirmPassword) {
			errors = errors.concat({ text: "Password do not match!" });
		}

		if (errors.length > 0) {
			throw new Error("There are validation errors");
		}
	}
	catch (error) {
		console.error("There is errors with the registration form body.");
		console.error(error);
		return res.render('auth/registerCustomer', { errors: errors });
	}

	//	Create new user, now that all the test above passed
	try {
		User.create({
			"email" : Email,
			"role" : "customer"
		})
		CustomerUser.create({
			"first_name":  FirstName,
			"last_name":  LastName,
			"contact":  Contact,
			"email":    Email,
			"password":  Hash.sha256().update(InputPassword).digest('hex'),
			"role": "customer"
		})
        res.render('user/customer/userCustomer');
		
		flashMessage(res, 'success', 'Successfully created an account. Please login', 'fas fa-sign-in-alt', true);
		return res.redirect("/auth/loginCustomer");
	}
	catch (error) {
		//	Else internal server error
		console.error(`Failed to create a new user: ${Email} `);
		console.error(error);
		return res.status(500).end();
	}
};

// Logout

async function logout_process(req, res) {
	req.logout();
	return res.redirect("/home");
}
