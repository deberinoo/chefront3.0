import { Router } from 'express';
const router = Router();
export default router;

router.get("/login",      async function(req, res) {
	console.log("Login page accessed");
	return res.render('auth/login');
});

router.get("/register", async function(req, res) {
	console.log("Register page accessed");
	return res.render('auth/register');
})

