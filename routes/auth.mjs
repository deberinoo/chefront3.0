import { Router }       from 'express';
import { flashMessage } from '../utils/flashmsg.mjs'
import { BusinessUser, BusinessRole } from '../models/Business.mjs';
import { CustomerUser } from '../models/Customer.mjs';

import Passport         from 'passport';
import Hash             from 'hash.js';

const router = Router();
export default router;

/**
 * Regular expressions for form testing
 **/ 
 const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
 //	Min 3 character, must start with alphabet
 const regexName  = /^[a-zA-Z][a-zA-Z]{2,}$/;
 //	Min 8 character, 1 upper, 1 lower, 1 number, 1 symbol
 const regexPwd   = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
 

router.get("/login",     login_page);
router.post("/login",    login_process);
router.get("/logout",     logout_process);
router.get("/register",    register_page);
router.get("/registerBusiness",    register_business_page);
router.post("/registerBusiness",    register_business_process);
router.get("/registerCustomer",     register_customer_page);
router.post("/registerCustomer",     register_customer_process);


async function login_page(req, res) {
	return res.render('auth/login');
}

async function login_process(req, res, next) {
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
	
	return Passport.authenticate('local', {
		successRedirect: "/u/userBusiness",
		failureRedirect: "/auth/login",
		failureFlash:    true
	})(req, res, next);
}

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
			const user = await ModelUser.findOne({where: {email: Email}});
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
        const user = await BusinessUser.create({
            "business_name":  BusinessName,
            "address":  Address,
            "contact":  Contact,
            "email":    Email,
            "password": Hash.sha256().update(InputPassword).digest('hex')
        });
        res.render('user/business/userBusiness');
        console.log("New user created")

		flashMessage(res, 'success', 'Successfully created an account. Please login', 'fas fa-sign-in-alt', true);
		return res.redirect("/auth/login");
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

    if (InputPassword !== ConfirmPassword) {
        errors.push({ text: 'password do not match!' });
    }
    if (InputPassword.length < 4) {
        errors.push({ text: 'password must be at least 4 characters!' });
    }

    if (errors.length > 0) {
        res.render('auth/registerCustomer', {
        });
    } 
    
    else {
        const user = await CustomerUser.create({
            "first_name":  FirstName,
            "last_name":  LastName,
            "contact":  Contact,
            "email":    Email,
            "password":  InputPassword
        });
        res.render('user/customer/userCustomer');
	}
};

async function logout_process(req, res) {
	req.logout();
	return res.redirect("/home");
}
