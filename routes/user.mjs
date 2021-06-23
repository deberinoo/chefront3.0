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
router.get("/:business_name",                         user_business_page);
router.get("/edit/:business_name",                    edit_user_business_page);
router.put("/saveUser/:business_name",                save_edit_user_business);
router.get("/:business_name/create-discount-slot",    create_discount_slot_page);
router.post("/:business_name/create-discount-slot",   create_discount_slot_process);
router.get("/:business_name/view-discount-slots",     view_discount_slots_page);
router.get("/:business_name/create-outlet",           create_outlet_page);
router.post("/:business_name/create-outlet",          create_outlet_process);
router.get("/:business_name/view-outlets",            view_outlets_page);
router.get("/:business_name/edit/:postal_code",       edit_outlets_page);
router.put("/:business_name/saveOutlet/:postal_code", save_edit_outlet);
router.get("/reservation-status",                     view_reservation_status_page);

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
    res.redirect(`/u/${BusinessName}/view-outlets`);
};

async function view_outlets_page(req, res) {
    	const outlet = await Outlets.findAll({
        where: {
            "outlet_name": {
                [Op.eq]: req.params.business_name
            }
        }
    });
    
    var location = outlet.location;
    outlet.forEach (o => console.log(`Outlets location ${o.location}`));
	console.log("Retrieve Outlets accessed");
	return res.render('user/business/retrieve_outlets',{outlet: outlet});
};

async function edit_outlets_page(req, res){
   Outlets.findOne({
        where: {
            "outlet_name" : req.params.business_name,
            "postal_code": req.params.postal_code
        }
    }).then((outlet) => {
        res.render(`user/business/update_outlet`, {
            outlet // passes user object to handlebar
        });
    }).catch(err => console.log(err)); // To catch no user ID
};

async function save_edit_outlet(req, res){
    let { BusinessName, Location, Address, Postalcode, Price, Contact, Description } = req.body;

    Outlets.update({
        outlet_name:  BusinessName,
        location:  Location,
        address:  Address,
        postal_code:  Postalcode,
        price:  Price,
        contact:  Contact,
        description: Description
    }, {
        where: {
            postal_code : req.params.postal_code
        }
        }).then(() => {
            res.redirect(`/u/${BusinessName}/view-outlets`);
    }).catch(err => console.log(err)); 
};

async function view_reservation_status_page(req, res) {
	return res.render('user/business/retrieve_reservationBusiness');
};

// ---------------- 	
// Customer user routing

router.get("/customer/:user_email",             user_customer_page);
router.get("/customer/edit/:user_email",        edit_user_customer_page);
router.put("/customer/saveUser/:user_email",    save_edit_user_customer);
router.get("/my-reservations",                  view_reservations_page);

async function user_customer_page(req, res) {
    CustomerUser.findOne({
        where: {
            "email": req.params.user_email
        }
    })
	return res.render('user/customer/userCustomer');
};

async function edit_user_customer_page(req, res) {
    CustomerUser.findOne({
        where: {
            "email": req.params.user_email
        }
    }).then((user) => {
        res.render('user/customer/update_userCustomer', {
            user // passes user object to handlebar
        });
    }).catch(err => console.log(err)); // To catch no user ID
};
 
async function save_edit_user_customer(req, res) {
    let { FirstName, LastName, Contact, Email } = req.body;

    CustomerUser.update({
        first_name : FirstName,
        last_name : LastName,
        email: Email,
        contact: Contact
    }, {
        where: {
            email : req.params.user_email
        }
        }).then(() => {
            res.redirect(`/u/${Email}`);
    }).catch(err => console.log(err));  
};

async function view_reservations_page(req, res) {
	return res.render('user/customer/reservationCustomer');
};
