import { Router }       from 'express';
import { CustomerUser, UserRole } from '../models/Customer.mjs';
import { Outlets, OutletsRole } from '../models/Outlets.mjs';

import ORM             from 'sequelize';
const { Sequelize, DataTypes, Model, Op } = ORM;

const router = Router();
export default router;

// ---------------- 
// Business User routing
router.get("/userBusiness",          user_business_page);
router.get("/edit/userBusiness",     edit_user_business_page);
router.get("/create-outlet",         create_outlet_page);
router.post("/create-outlets",       create_outlet_process);
router.get("/view-outlets",          view_outlets_page);
router.get("/reservation-status",    view_reservation_status_page);


async function user_business_page(req, res) {
	return res.render('user/business/userBusiness');
};

async function edit_user_business_page(req, res) {
	return res.render('user/business/update_userBusiness');
};

async function create_outlet_page(req, res) {
	return res.render('user/business/create_outlet');
};

async function create_outlet_process(req, res) {
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
        res.render('user/business/retrieve_outletsBusiness');
};

async function view_outlets_page(req, res) {
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
};

async function view_reservation_status_page(req, res) {
	return res.render('user/business/retrieve_reservationBusiness');
};

// ---------------- 	
// Customer user routing

router.get("/userCustomer",             user_customer_page);
router.get("/edit/userCustomer",        edit_user_customer_page);
router.get("/my-reservations",          view_reservations_page);

async function user_customer_page(req, res) {
    /*	const current_user = await ModelUser.findOne({
        where: {
            "email": {
                [Op.eq]: "email"
            }
        }
    });
*/
	return res.render('user/customer/userCustomer.html');
};

async function edit_user_customer_page(req, res) {
	return res.render('user/customer/update_userCustomer.html');
};

async function view_reservations_page(req, res) {
	return res.render('user/customer/reservationCustomer.html');
};