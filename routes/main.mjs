const router = Router();
export default router;

import { Router }       from 'express';
import { flashMessage } from '../utils/flashmsg.mjs';
// import { Feedback } from '../models/Feedback.mjs';

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
	return res.render('404.html')
});

router.get("/about", async function(req, res) {
	return res.render('about');
});

router.get("/categories", async function(req, res) {
	return res.render('categories');
});

router.get("/contact", async function(req, res) {
	return res.render('contact');
});

router.get("/payment", async function(req, res) {
	return res.render('payment');
});

// ---------------- 
// Error page routing
router.use(function (req, res, next) {
	res.status(404).render('404.handlebars')
});