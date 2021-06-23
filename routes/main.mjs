import { Router }       from 'express';
import { flashMessage } from '../utils/flashmsg.mjs';
import { Feedback } from '../models/Feedback.mjs';

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

import RouterAdmin from './admin.mjs'
router.use("/admin", RouterAdmin);

router.get("/", async function (req, res) {
	return res.redirect("/home");
});

// ---------------- 
//	Common URL paths
router.get("/home",      async function(req, res) {
	return res.render('index');
});

router.get("/error", async function(req, res) {
	return res.render('404')
});

router.get("/about", async function(req, res) {
	return res.render('about');
});

router.get("/categories", async function(req, res) {
	return res.render('categories');
});

router.get("/contact", async function(req, res) {
	console.log("Contact Us page accessed");
	return res.render('contact');
});

router.post("/successContact", async function(req,res) {
	console.log("Feedback successfully submitted");
	let errors = [];
	let { Name, Email, Phone, Message, Read } = req.body;

	//CREATE
	const feedbacks = await Feedback.create({
		"name" : Name,
		"email" : Email,
		"phone" : Phone,
		"message" : Message,
		"read" : Read
	});
	console.log('Feedback submitted');
	res.render('index');
});

router.get("/payment", async function(req, res) {
	return res.render('payment');
});

router.get("/restaurant", async function(req, res) {
	return res.render('restaurant');
});

router.get("/success", async function(req, res) {
	return res.render('success');
});

// ---------------- 
// Error page routing
router.use(function (req, res, next) {
	res.status(404).render('404')
});