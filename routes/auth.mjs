import { Router }       from 'express';
import { flashMessage } from '../utils/flashmsg.mjs'
import { BusinessUser } from '../models/Business.mjs';
import { CustomerUser } from '../models/Customer.mjs';
import { User } 		from '../models/Users.mjs'
import { sendMail,sendMailPasswordChange, sendMailPasswordChangeBusiness } from '../server.mjs';

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

// General routes
router.get("/login",     								login_page);
router.get("/register",    								register_page);
router.get("/logout",     								logout_process);

// Business routes
router.get("/loginBusiness", 							business_login_page);
router.post("/loginBusiness", 							business_login_process);
router.get("/registerBusiness",     					register_business_page);
router.post("/registerBusiness",    					register_business_process);

router.get("/forgetPasswordBusiness", 					forget_password_business_page)
router.post("/forgetPasswordBusiness", 					forget_password_business_process)
router.get("/resetPasswordBusiness/:email", 			reset_password_business_page)
router.put("/resetPasswordBusinessProcess/:email", 		reset_password_business_process)

// Customer routes
router.get("/loginCustomer",    	customer_login_page);
router.post("/loginCustomer",    	customer_login_process);
router.get("/registerCustomer",     register_customer_page);
router.post("/registerCustomer",    register_customer_process);

router.get("/forgetPasswordCustomer", forget_password_customer_page)
router.post("/forgetPasswordCustomer", forget_password_customer_process)
router.get("/resetPasswordCustomer/:email", reset_password_customer_page)
router.put("/resetPasswordCustomerProcess/:email", reset_password_customer_process)

router.get("/forgetPasswordBusiness", forget_password_business_page)
router.post("/forgetPasswordBusiness", forget_password_business_process)
router.get("/resetPasswordBusiness/:email", reset_password_business_page)
router.put("/resetPasswordBusinessProcess/:email", reset_password_business_process)

router.get("/register",    			register_page);

router.get("/registerBusiness",     register_business_page);
router.post("/registerBusiness",    register_business_process);
router.get("/registerCustomer",     register_customer_page);
router.post("/registerCustomer",    register_customer_process);

router.get("/accountConfirmationCustomer", account_confirmation_customer_page)
router.post("/accountConfirmationCustomer/:code/:first_name/:last_name/:contact/:email/:password", account_confirmation_customer_process)

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
// ----------------

// General - Login, Register, Logout

async function login_page(req, res) {
	return res.render('auth/login');
}

async function register_page(req, res) {
	return res.render('auth/register');
}

async function logout_process(req, res) {
	req.logout();
	return res.redirect("/home");
}

// Login

async function business_login_page(req, res) {
	return res.render('auth/loginBusiness');
}

async function business_login_process(req, res, next) {
    let { Email, Password } = req.body;

	let errors = [];
	try {
		const user = await BusinessUser.findOne({
			where: {
				"email": Email,
				"password": Hash.sha256().update(Password).digest('hex')
			}
		});
		if (user == null) {
			errors = errors.concat({ text: "Invalid user credentials!" });
			return res.render('auth/loginBusiness', { errors: errors });
		}
		if (errors.length > 0) {
			throw new Error("There are validation errors");
		}
	}
	catch (error) {
		console.error("There is errors with the login form body.");
		console.error(error);
		return res.render('auth/loginBusiness', { errors: errors });
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
		const user = await CustomerUser.findOne({
			where: {
				"email": Email,
				"password": Hash.sha256().update(Password).digest('hex')
			}
		});
		if (user == null) {
			errors = errors.concat({ text: "Invalid user credentials!" });
			return res.render('auth/loginCustomer', { errors: errors });
		}
	}
	catch (error) {
		console.error("There is errors with the login form body.");
		console.error(error);
		return res.render('auth/loginCustomer', { errors: errors });
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

// Forgot Password

async function forget_password_business_page(req, res) {
	return res.render('auth/forgetPasswordBusiness');
}

async function forget_password_business_process(req, res, next) {
    let { Email } = req.body;
	
	let errors = [];
	try {
		if (! regexEmail.test(Email)) {
			errors = errors.concat({ text: "Invalid email address!" });
		}
		else {
			const user = await BusinessUser.findOne({where: {email: Email}});
			if (user == null) {
				errors = errors.concat({ text: "This email does not exist!" });
			}
		}
		if (errors.length > 0) {
			throw new Error("There are validation errors");
		}
	}
	catch (error) {
		console.error("There is errors with the login form body.");
		console.error(error);
		return res.render('auth/forgetPasswordBusiness', { errors: errors });
	}

	try {
		const user = await BusinessUser.findOne({where: {email: Email}});
		const email = Email
		sendMailPasswordChangeBusiness(email)
			.then((result) => console.log('Email sent...', result))
			.catch((error) => console.log(error.message));

		flashMessage(res, 'success', 'Email successfully sent. Please check your email to change your password.', 'fa fa-envelope', false);
		res.redirect("/auth/login");
	}
	catch (error) {
		//	Else internal server error
		console.error(`Failed to send email to  ${Email} `);
		console.error(error);
		return res.status(500).end();
	}
}

async function forget_password_customer_page(req, res) {
	return res.render('auth/forgetPasswordCustomer');
}

async function forget_password_customer_process(req, res, next) {
    let { Email } = req.body;
	
	let errors = [];
	try {
		if (! regexEmail.test(Email)) {
			errors = errors.concat({ text: "Invalid email address!" });
		}
		else {
			const user = await CustomerUser.findOne({where: {email: Email}});
			if (user == null) {
				errors = errors.concat({ text: "This email does not exist!" });
			}
		}
		if (errors.length > 0) {
			throw new Error("There are validation errors");
		}
	}
	catch (error) {
		console.error("There is errors with the login form body.");
		console.error(error);
		return res.render('auth/forgetPasswordCustomer', { errors: errors });
	}

	try {
		const user = await CustomerUser.findOne({where: {email: Email}});
		const email = Email
		sendMailPasswordChange(email)
			.then((result) => console.log('Email sent...', result))
			.catch((error) => console.log(error.message));

		flashMessage(res, 'success', 'Email successfully sent. Please check your email to change your password.', 'fa fa-envelope', false);
		res.redirect("/auth/login");
	}
	catch (error) {
		//	Else internal server error
		console.error(`Failed to send email to  ${Email} `);
		console.error(error);
		return res.status(500).end();
	}
}

// Reset Password
async function reset_password_business_page(req, res) {
	console.log("reset page shown")
	return res.render('auth/resetPasswordBusiness', { email : req.params.email});
}

async function reset_password_business_process(req, res, next) {
	console.log("resetting process started")
    let { InputPassword } = req.body;
	
	let errors = [];
	try {
		if (! regexPwd.test(InputPassword)) {
			errors = errors.concat({ text: "Password requires minimum eight characters, at least one uppercase letter, one lowercase letter and one number!" });
		}
		
		if (errors.length > 0) {
			throw new Error("There are validation errors");
		}
	}
	catch (error) {
		console.log("form error")
		console.error("There is errors with the login form body.");
		console.error(error);
		return res.render('auth/resetPasswordBusiness', { errors: errors });
	}

	try {
		BusinessUser.update({
			"password" : Hash.sha256().update(InputPassword).digest('hex'),
		}, {
			where: {
				email : req.params.email
			}
		});
		console.log("Pass changed")
		flashMessage(res, 'success', 'Password successfully changed. Please login.', 'fas fa-sign-in-alt', false);
		res.redirect("/auth/loginBusiness");
	}
	catch (error) {
		//	Else internal server error
		console.log("Pass changing error")
		console.error(`Failed to update email for ${Email} `);
		console.error(error);
		return res.status(500).end();
	}
}

async function reset_password_customer_page(req, res) {
	console.log("reset page shown")
	return res.render('auth/resetPasswordCustomer', { email : req.params.email});
}

async function reset_password_customer_process(req, res, next) {
	console.log("resetting process started")
    let { InputPassword } = req.body;
	
	let errors = [];
	try {
		if (! regexPwd.test(InputPassword)) {
			errors = errors.concat({ text: "Password requires minimum eight characters, at least one uppercase letter, one lowercase letter and one number!" });
		}
		
		if (errors.length > 0) {
			throw new Error("There are validation errors");
		}
	}
	catch (error) {
		console.log("form error")
		console.error("There is errors with the login form body.");
		console.error(error);
		return res.render('auth/resetPasswordCustomer', { errors: errors });
	}

	try {
		CustomerUser.update({
			"password" : Hash.sha256().update(InputPassword).digest('hex'),
		}, {
			where: {
				email : req.params.email
			}
		});
		console.log("Pass changed")
		flashMessage(res, 'success', 'Password successfully changed. Please login.', 'fas fa-sign-in-alt', false);
		res.redirect("/auth/loginCustomer");
	}
	catch (error) {
		//	Else internal server error
		console.log("Pass changing error")
		console.error(`Failed to update email for ${Email} `);
		console.error(error);
		return res.status(500).end();
	}
}

// Register
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
		// User.create({
		// 	"email" : Email,
		// 	"role" : "business"
		// })
        // const user = await BusinessUser.create({
        //     "business_name":  BusinessName,
        //     "address":  Address,
        //     "contact":  Contact,
        //     "email":    Email,
        //     "password": Hash.sha256().update(InputPassword).digest('hex'),
		// 	"role": "business"
        // });
		const email = Email
		const code = makeid(5)

		sendMail(email,code)
			.then((result) => console.log('Email sent...', result))
			.catch((error) => console.log(error.message));
		flashMessage(res, 'success', 'Please check your email for the code', 'fas fa-sign-in-alt', false);
        return res.render('auth/accountConfirmationCustomer', { code : code});
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
		const Password =  Hash.sha256().update(InputPassword).digest('hex')
		const email = Email
		const code = makeid(5)


		sendMail(email,code)
			.then((result) => console.log('Email sent...', result))
			.catch((error) => console.log(error.message));
		flashMessage(res, 'success', 'Please check your email for the code', 'fas fa-sign-in-alt', false);
        return res.render('auth/accountConfirmationCustomer', { code : code, first_name : FirstName, last_name : LastName, contact : Contact, email : Email, password : Password });
	}
	catch (error) {
		//	Else internal server error
		console.error(`Failed to create a new user: ${Email} `);
		console.error(error);
		return res.status(500).end();
	}
};

// Account Confirmation

async function account_confirmation_customer_page(req, res) {
	return res.render('auth/accountConfirmationCustomer');
}

async function account_confirmation_customer_process(req, res) {
    let errors = [];
    let generatedCode = req.params.code
	let Email = req.params.email
	let FirstName = req.params.first_name
	let LastName = req.params.last_name
	let Contact = req.params.contact
	let Password = req.params.password
    let { confirmationCode } = req.body;

	try {
		if (confirmationCode !== generatedCode) {
			errors = errors.concat({ text: "Codes do not match!" });
		}
		if (errors.length > 0) {
			throw new Error("There are validation errors");
		}
	}
	catch (error) {
		console.error("There is errors with the registration form body.");
		console.error(error);
		return res.render('auth/accountConfirmationCustomer', { errors: errors });
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
			"password":  Password,
			"role": "customer"
		})
		res.redirect("/auth/loginCustomer");

		flashMessage(res, 'success', 'Successfully created an account. Please login', 'fas fa-sign-in-alt', false);

	}
	catch (error) {
		//	Else internal server error
		console.error(`Failed to create a new user: ${Email} `);
		console.error(error);
		return res.status(500).end();
	}
};

// Code Generator

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}


