import { Router }       from 'express';
import { CustomerUser, UserRole } from '../models/Customer.mjs';
import { DiscountSlot } from '../models/DiscountSlot.mjs';
import { Outlets, OutletsRole } from '../models/Outlets.mjs';


import Passport         from 'passport';
import ORM             from 'sequelize';
import { BusinessUser } from '../models/Business.mjs';
const { Sequelize, DataTypes, Model, Op } = ORM;

const router = Router();
export default router;

// ---------------- 
// Business User routing
router.get("/:business_name",                       user_business_page);
router.get("/edit/:business_name",                  edit_user_business_page);
router.put("/saveUser/:business_name",              save_edit_user_business);
router.get("/:business_name/create-discount-slot",  create_discount_slot_page);
router.post("/:business_name/create-discount-slot", create_discount_slot_process);
router.get("/:business_name/view-discount-slots",   view_discount_slots_page);
router.get("/:business_name/create-outlet",         create_outlet_page);
router.post("/:business_name/create-outlet",        create_outlet_process);
router.get("/view-outlets",                         view_outlets_page);
router.get("/reservation-status",                   view_reservation_status_page);


async function user_business_page(req, res) {
    BusinessUser.findOne({
        where: {
            "business_name": req.params.business_name
        }
    })
	return res.render('user/business/userBusiness');
};

async function edit_user_business_page(req, res) {
    BusinessUser.findOne({
        where: {
            "business_name": req.params.business_name
        }
    }).then((user) => {
        res.render('user/business/update_userBusiness', {
            user // passes user object to handlebar
        });
    }).catch(err => console.log(err)); // To catch no user ID
};

async function save_edit_user_business(req, res) {
    let { BusinessName, Email, Address, Contact } = req.body;

    BusinessUser.update({
        business_name: BusinessName,
        email: Email,
        address: Address,
        contact: Contact
    }, {
        where: {
            business_name: req.params.business_name
        }
        }).then(() => {
            res.redirect(`/u/${BusinessName}`);
    }).catch(err => console.log(err));  
};

async function create_discount_slot_page(req, res) {
    return res.render('user/business/create_discountslot');
};

async function create_discount_slot_process(req, res) {
    let errors = [];
    
    let { BusinessName, Location, Time, Discount } = req.body;

    const discountslot = await DiscountSlot.create({
        "outlet_name":  BusinessName,
        "location":  Location,
        "time": Time,
        "discount": Discount
    });
    res.redirect(`/u/${BusinessName}/view-discount-slots`);
};

async function view_discount_slots_page(req, res) {
    const discountslot = await DiscountSlot.findAll({
        where: {
            "outlet_name": {
                [Op.eq]: req.params.business_name
            }
        }
    });
    return res.render('user/business/retrieve_discountslots', {discountslot: discountslot});
};

async function create_outlet_page(req, res) {
	return res.render('user/business/create_outlet');
};

async function create_outlet_process(req, res) {
    let errors = [];
    
    let { BusinessName, Location, Address, Postalcode, Price, Contact, Description } = req.body;

    const outlet = await Outlets.create({
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
    /*	const outlet = await Outlets.findAll({
        where: {
            "location": {
                [Op.ne]:"null"
            }
        }
    });
    
    var location = outlet.location;
    outlets_created_today.forEach (o => console.log(`Outlets location ${o.location}`));
	console.log("Retrieve Outlets accessed");
*/
	return res.render('user/business/retrieve_outletsBusiness',{outlet: outlet});
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
