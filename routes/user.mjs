const router = Router();
export default router;

import { Router }       from 'express';
import { CustomerUser, UserRole } from '../models/Customer.mjs';
import { Outlets, OutletsRole } from '../models/Outlets.mjs';

import ORM             from 'sequelize';
const { Sequelize, DataTypes, Model, Op } = ORM;

// ---------------- 
// Business User routing
router.get("/userBusiness",      async function(req, res) {
	return res.render('user/business/userBusiness');
});

router.get("/edit/userBusiness",      async function(req, res) {
	return res.render('user/business/update_userBusiness');
});

router.get("/create-outlet",      async function(req, res) {
	return res.render('user/business/create_outletBusiness');
});

router.post("/successOutlets", async function(req,res) {
    let errors = [];
    
    let { BusinessName, Location, Address, Postalcode, Price, Contact, Description } = req.body;

        ///	CREATE
        const outlets = await Outlets.create({
            "outlet_name":  BusinessName,
			"location":  Location,
            "address":  Address,
			"postal_code":  Postalcode,
			"price":  Price,
            "contact":  Contact,
            "description": Description
        });
        console.log(`Outlet created: ${outlets.location}`);
        res.render('user/business/retrieve_outletsBusiness');
        console.log("New outlet created");

});

router.get("/view-outlets",      async function(req, res) {
/*	const outlets_created_today = await Outlets.findAll({
        where: {
            "location": {
                [Op.ne]:"null"
            }
        }
    });
    
    console.log("Outlets created today");
    var location = outlets_created_today.location;
    outlets_created_today.forEach (o => console.log(`Outlets location ${o.location}`));
	console.log("Retrieve Outlets accessed");
*/
	return res.render('user/business/retrieve_outletsBusiness',{outlets_created_today: outlets_created_today});
});

router.get("/reservation-status",      async function(req, res) {
	return res.render('user/business/retrieve_reservationBusiness');
});

// ---------------- 	
// Customer user routing
router.get("/userCustomer",      async function(req, res) {
/*	const current_user = await ModelUser.findOne({
        where: {
            "email": {
                [Op.eq]: "email"
            }
        }
    });
*/

Video.findAll({
    where: {
        userId: req.user.id
    },
    order: [
        ['title', 'ASC']
    ],
    raw: true
})
.then((videos) => {
    // pass object to listVideos.handlebar
    res.render('video/listVideos', { 
        videos: videos
    });
})
.catch(err => console.log(err));
});
	return res.render('user/customer/userCustomer');
});

router.get("/edit/userCustomer",      async function(req, res) {
	return res.render('user/customer/update_userCustomer');
});

router.get("/my-reservations",      async function(req, res) {
	return res.render('user/customer/reservationCustomer');
});