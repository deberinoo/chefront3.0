import { Router }       					from 'express';
import { flashMessage } 					from '../utils/flashmsg.mjs'
import { User, UserRole } 					from '../data/models/Users.mjs'
import { sendMail, sendMailPasswordChange } from '../data/mail.mjs';

import Passport         from 'passport';
import Hash             from 'hash.js';
import { UploadFile, DeleteFilePath }       from '../utils/multer.mjs';
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
router.get("/login",     					login_page);
router.post("/login", 						login_process);
router.get("/register",    					register_page);
router.get("/logout",     					logout_process);

router.get("/forgetPassword", 				forget_password_page)
router.post("/forgetPassword", 				forget_password_process)
router.get("/resetPassword/:email", 		reset_password_page)
router.put("/resetPassword/:email", 		reset_password_process)

// Business routes
router.get("/registerBusiness",     												register_business_page);
router.post("/registerBusiness",    												UploadFile.single("Document"),register_business_process);
router.get("/accountConfirmationBusiness", 											account_confirmation_business_page)
router.post("/accountConfirmationBusiness/:code/:email", 	account_confirmation_business_process)

// Customer routes
router.get("/registerCustomer",     												register_customer_page);
router.post("/registerCustomer",    												register_customer_process);
router.get("/accountConfirmationCustomer", 											account_confirmation_customer_page)
router.post("/accountConfirmationCustomer/:code/:email",  	account_confirmation_customer_process)

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

// General - Login, Register, Logout
function login_page(req, res) {
	if (req.user == undefined) {
		return res.render('auth/login')
	} else {
		var role = getRole(req.user.role);
		var admin = role[0];
		var business = role[1];
		var customer = role[2];
	}
	return res.render('auth/login', {
		admin: admin,
		business: business,
		customer: customer
	});
}

async function login_process(req, res, next) {
    let { Email, Password } = req.body;

	let errors = [];
	try {
		const user = await User.findOne({
			where: {
				"email": Email,
				"password": Hash.sha256().update(Password).digest('hex'),
			}
		});
		if (user == null) {
			errors = errors.concat({ text: "Invalid user credentials!"});
		}
		if (user.banned == "Yes") {
			errors = errors.concat({ text: "This user has been banned!"});
		}
		if (user.verified == "No") {
			errors = errors.concat({ text: "This user has not been verified!"});
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

	const user = await User.findOne({
        where: {
            "email": Email,
			"password": Hash.sha256().update(Password).digest('hex'),
        }
	});

	let id = '';
	if (user.role == 'business') {
		id = 'b';
	} else if (user.role == 'customer') {
		id = 'c';
	}

	if (user.role == 'business' || user.role == 'customer') {
		return Passport.authenticate('local', {
			successRedirect: "/u/" + id + "/" + user.name,
			failureRedirect: "/auth/login",
			failureFlash:    true
		})(req, res, next);	
	} else if (user.role == 'admin') {
		return Passport.authenticate('local', {
			successRedirect: "/admin/adminDashboard",
			failureRedirect: "/auth/login",
			failureFlash:    true
		})(req, res, next);
	}
}

function register_page(req, res) {
	if (req.user == undefined) {
		return res.render('auth/register')
	} else {
		var role = getRole(req.user.role);
		var admin = role[0];
		var business = role[1];
		var customer = role[2];
	}
	return res.render('auth/register', {
		admin: admin,
		business: business,
		customer: customer
	});
}

function logout_process(req, res) {
	req.logout();
	return res.redirect("/home");
}

// Forgot Password
function forget_password_page(req, res) {
	if (req.user == undefined) {
		return res.render('auth/forgetPassword')
	} else {
		var role = getRole(req.user.role);
		var admin = role[0];
		var business = role[1];
		var customer = role[2];
	}
	return res.render('auth/forgetPassword', {
		admin: admin,
		business: business,
		customer: customer
	});
}

async function forget_password_process(req, res, next) {
    let { Email } = req.body;
	
	let errors = [];
	try {
		if (! regexEmail.test(Email)) {
			errors = errors.concat({ text: "Invalid email address!" });
		}
		else {
			const user = await User.findOne({where: {email: Email}});
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
		return res.render('auth/forgetPassword', { errors: errors });
	}

	try {
		const user = await User.findOne({where: {email: Email}});
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
async function reset_password_page(req, res) {
	if (req.user == undefined) {
		const user = await User.findOne({
			where: {
				email: req.params.email
			}
		})
		return res.render('auth/resetPassword', {
			user: user,
			admin: admin,
			business: business,
			customer: customer	
		})
	} else {
		var role = getRole(req.user.role);
		var admin = role[0];
		var business = role[1];
		var customer = role[2];
	}
	return res.render('auth/resetPassword', { 
		admin: admin,
		business: business,
		customer: customer
	});
}

function reset_password_process(req, res, next) {
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
		return res.render('auth/resetPassword', { errors: errors });
	}

	try {
		User.update({
			"password" : Hash.sha256().update(InputPassword).digest('hex'),
		}, {
			where: {
				email : req.params.email,
			}
		});
		console.log("Pass changed")
		flashMessage(res, 'success', 'Password successfully changed. Please login.', 'fas fa-sign-in-alt', false);
		res.redirect("/auth/login");
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
function register_business_page(req, res) {
	if (req.user == undefined) {
		return res.render('auth/registerBusiness')
	} else {
		var role = getRole(req.user.role);
		var admin = role[0];
		var business = role[1];
		var customer = role[2];
	}
	return res.render('auth/registerBusiness', {
		admin: admin,
		business: business,
		customer: customer
	});
}

async function register_business_process(req, res) {
    let errors = [];
    
    let { Name, Contact, Email, InputPassword, ConfirmPassword } = req.body;
	console.log(`${req.file.path}`)
	
	try {
		if (! regexName.test(Name)) {
			errors = errors.concat({ text: "Invalid name provided! It must be minimum 3 characters and starts with a alphabet." });
		}
		else {
			const user = await User.findOne({where: {name: Name}});
			if (user != null) {
				errors = errors.concat({ text: "This business name is taken!"})
			}
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
		const Password =  Hash.sha256().update(InputPassword).digest('hex')
		const email = Email
		const code = makeid(5)
		User.create({
			"name": Name,
			"email": Email,
			"contact": Contact,
			"password": Password,
			"role": UserRole.Business,
			"document": req.file.path
		})
		sendMail(email,code)
			.then((result) => console.log('Email sent...', result))
			.catch((error) => console.log(error.message));
		flashMessage(res, 'success', 'Please check your email for your verification code', 'fas fa-sign-in-alt', false);
        return res.render('auth/accountConfirmationBusiness', { code:code, email:Email });
	}
	catch (error) {
		//	Else internal server error
		console.error(`Failed to create a new user: ${Email} `);
		console.error(error);
		return res.status(500).end();
	}
};

function register_customer_page(req, res) {
	if (req.user == undefined) {
		return res.render('auth/registerCustomer')
	} else {
		var role = getRole(req.user.role);
		var admin = role[0];
		var business = role[1];
		var customer = role[2];
	}
	return res.render('auth/registerCustomer', {
		admin: admin,
		business: business,
		customer: customer
	});
}

async function register_customer_process(req, res) {
	let errors = [];
    
    let { Name, Contact, Email, InputPassword, ConfirmPassword } = req.body;

	try {
		if (! regexName.test(Name)) {
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

		User.create({
			"name":  Name,
			"contact":  Contact,
			"email":    Email,
			"password":  Password,
			"role": UserRole.Customer
		})

		sendMail(email,code)
			.then((result) => console.log('Email sent...', result))
			.catch((error) => console.log(error.message));
		flashMessage(res, 'success', 'Please check your email for your verification code', 'fas fa-sign-in-alt', false);
        return res.render('auth/accountConfirmationCustomer', { code : code, email : Email });
	}
	catch (error) {
		//	Else internal server error
		console.error(`Failed to create a new user: ${Email} `);
		console.error(error);
		return res.status(500).end();
	}
};

// Account Confirmation
function account_confirmation_business_page(req, res) {
	if (req.user == undefined) {
		return res.render('auth/registerCustomer')
	} else {
		var role = getRole(req.user.role);
		var admin = role[0];
		var business = role[1];
		var customer = role[2];
	}
	return res.render('auth/accountConfirmationBusiness', {
		admin: admin,
		business: business,
		customer: customer
	});
}

async function account_confirmation_business_process(req, res) {
    let errors = [];
    let generatedCode = req.params.code;
    let { confirmationCode } = req.body;

	let Email = req.params.email

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
		return res.render('auth/accountConfirmationBusiness', { errors: errors, code:generatedCode, name:Name, contact:Contact, email:Email, password:Password });
	}

	//	Create new user, now that all the test above passed
	try {
		flashMessage(res, 'success', 'Successfully verified email. Please wait for document to be assessed', 'fas fa-sign-in-alt', false);
		res.redirect("/auth/login");
	}
	catch (error) {
		//	Else internal server error
		console.error(`Failed to create a new user: ${Email} `);
		console.error(error);
		return res.status(500).end();
	}
};

function account_confirmation_customer_page(req, res) {
	if (req.user == undefined) {
		return res.render('auth/registerCustomer')
	} else {
		var role = getRole(req.user.role);
		var admin = role[0];
		var business = role[1];
		var customer = role[2];
	}
	return res.render('auth/accountConfirmationCustomer', {
		admin: admin,
		business: business,
		customer: customer
	});
}

function account_confirmation_customer_process(req, res) {
    let errors = [];
    let generatedCode = req.params.code
	let Email = req.params.email
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
		return res.render('auth/accountConfirmationCustomer', { errors: errors, code:generatedCode, name:Name, contact:Contact, email:Email, password:Password });
	}

	//	Create new user, now that all the test above passed
	try {
		User.update({
			verified: "Yes"
		}, {
			where: {
				email : Email
			}
			})
		flashMessage(res, 'success', 'Successfully created an account. Please login', 'fas fa-sign-in-alt', false);
		res.redirect("/auth/login");
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
   return result.toUpperCase();
}