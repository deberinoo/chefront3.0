import { Router }       from 'express';
import { flashMessage } from '../utils/flashmsg.mjs'
const router = Router();
export default router;

router.get("/login",      async function(req, res) {
	console.log("Login page accessed");
	return res.render('auth/login');
});

router.get("/register", async function(req, res) {
	console.log("Register page accessed");
	return res.render('auth/register');
});

router.post("/login", async function (req, res) {
	console.log("login contents received");
	console.log(req.body);

	let errors = [];
	//	Check your Form contents
	//	Basic IF ELSE STUFF no excuse not to be able to do this alone
	//	Common Sense
	if (errors.length > 0) {
		flashMessage(res, 'error', 'Invalid Credentials!', 'fas fa-sign-in-alt', true);
		return res.redirect(req.originalUrl);
	}
	else {
		flashMessage(res, 'success', 'Successfully login!', 'fas fa-sign-in-alt', true);
		return res.redirect("/home");
	}
});

router.post("/register", async function (req, res) {
	console.log("Register contents received");
	console.log(req.body);
	let errors = [];

	//	Check your Form contents
	//	Basic IF ELSE STUFF no excuse not to be able to do this alone
	//	Common Sense

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