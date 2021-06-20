const router = Router();
export default router;

import { Router }       from 'express';
import { flashMessage } from '../utils/flashmsg.mjs'
import { BusinessUser, BusinessRole } from '../models/Business.mjs';
import { CustomerUser } from '../models/Customer.mjs';
import passport from 'passport';
import bcrypt from 'bcryptjs';



router.get("/login",      async function(req, res) {
	return res.render('auth/login');
});

router.post("/login", async function (req, res,next ) {

    passport.authenticate('local', {
		successRedirect: '/user/customer/userCustomer',           // Route to /video/listVideos URL
		failureRedirect: '/auth/login',					// Route to /login URL
		failureFlash: true
		/*
		* Setting the failureFlash option to true instructs Passport to flash an  error message
		* using the message given by the strategy's verify callback, if any. When a failure occurs
		* passport passes the message object as error
		* */
	})(req, res, next);
   
	return res.render('user/customer/userCustomer.html');
});

router.get("/register", async function(req, res) {
	return res.render('auth/register');
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
        console.log("Here")
        res.render('auth/registerCustomer');
    } 
    
    else {
        // If all is well, checks if user is already registered
		CustomerUser.findOne({
			where: {Email}
		})
		.then(user => {
			if(user) {
				// If user is found, that means email given has already been registered
				//req.flash('error_msg', user.name + ' already registered');
                console.log("here")
				res.render('auth/registerCustomer')
			} else {
				// Generate salt hashed password
				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(InputPassword, salt, (err, hash) => {
						if(err) throw err;
						InputPassword = hash;
						// Create new user record
						CustomerUser.create({
                            "first_name":  FirstName,
                            "last_name":  LastName,
                            "contact":  Contact,
                            "email":    Email,
                            "password":  InputPassword
						})
						.then(user => {
							res.render('auth/login');
						})
						.catch(err => console.log(err));
					})
				});
				
			}
		});
	}
});
