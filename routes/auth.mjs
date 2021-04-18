import { Router } from 'express';
const router = Router();
export default router;

router.get("/login",      async function(req, res) {
	console.log("About page accessed");
	return res.render('auth/login');
});

router.get("/register", async function(req, res) {
	console.log("About page accessed");
	return res.render('auth/register');
})

