import { Router }       from 'express';
import { flashMessage } from '../utils/flashmsg.mjs'
const router = Router();
export default router;

router.get("/login",      async function(req, res) {
	return res.render('auth/login');
});

router.post("/login", async function (req, res) {
	console.log("login contents received");
	console.log(req.body);

	let errors = [];
	if (errors.length > 0) {
		flashMessage(res, 'error', 'Invalid Credentials!', 'fas fa-sign-in-alt', true);
		return res.redirect(req.originalUrl);
	}
	else {
		flashMessage(res, 'success', 'Successfully login!', 'fas fa-sign-in-alt', true);
		return res.redirect("/home");
	}
});

router.get("/register", async function(req, res) {
	return res.render('auth/register');
});

router.post("/register", async function (req, res) {
	console.log("Register contents received");
	console.log(req.body);
	let errors = [];

	const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (req.body.password != req.body.password2) {
		errors = errors.concat({ text: "Password do not match !"});
	}

	if (!regexEmail.test(req.body.email)) {
		errors = errors.concat({text: "Invalid Email address!"});
	}

	if (req.body.name == undefined || req.body.name.length < 4) {
		errors = errors.concat({text: "Invalid Name"});
	}

	if (errors.length > 0) {
		console.error(`There are ${errors.length} errors in the form`);
		return res.render('auth/register', {
			errors: errors
		});
	}
	else {
		flashMessage(res, 'success', 'Successfully created an account. Please login', 'fas fa-sign-in-alt', true);
		return res.redirect("/auth/login");
	}
});

router.get("/registerBusiness", async function(req, res) {
	return res.render('auth/registerBusiness');
})

router.post("/successBusiness", async function(req,res) {
    console.log("Validating Business registration");
    let errors = [];
    
    let { BusinessName, Address, Contact, Email, InputPassword, ConfirmPassword } = req.body;

    if (InputPassword !== ConfirmPassword) {
        errors.push({ text: 'password do not match!' });
    }
    if (InputPassword.length < 4) {
        errors.push({ text: 'password must be at least 4 characters!' });
    }

    if (errors.length > 0) {
        res.render('auth/registerBusiness', {
        });
    } 
    
    else {
        const user = await BusinessUser.create({
            "business_name":  BusinessName,
            "address":  Address,
            "contact":  Contact,
            "email":    Email,
            "password":  InputPassword
        });
        res.render('user/business/userBusiness');
        console.log("New user created")
    }
});

router.get("/registerCustomer", async function(req, res) {
	return res.render('auth/registerCustomer');
})

router.post("/successCustomer", async function(req,res) {
    console.log("Validating Customer registration");
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
        console.log("New user created")
	}
});
