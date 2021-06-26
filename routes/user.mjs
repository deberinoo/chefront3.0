import { Router }       from 'express';
import { flashMessage } from '../utils/flashmsg.mjs';
import { CustomerUser, UserRole } from '../models/Customer.mjs';
import { DiscountSlot } from '../models/DiscountSlot.mjs';
import { Outlets, OutletsRole } from '../models/Outlets.mjs';
import { User } from '../models/Users.mjs'

import Passport         from 'passport';
import ORM             from 'sequelize';
import { BusinessUser } from '../models/Business.mjs';
const { Sequelize, DataTypes, Model, Op } = ORM;

const router = Router();
export default router;

// ---------------- 
// Business User routing

// Business User profile
router.get("/:business_name",                         user_business_page);
router.get("/edit/:business_name",                    edit_user_business_page);
router.put("/saveUser/:business_name",                save_edit_user_business);

// Discount Slot
router.get("/:business_name/create-discount-slot",    create_discount_slot_page);
router.post("/:business_name/create-discount-slot",   create_discount_slot_process);
router.get("/:business_name/view-discount-slots",     view_discount_slots_page);
router.get("/:business_name/delete-discount-slot/:uuid",    delete_discount_slot);

// Outlets
router.get("/:business_name/create-outlet",           create_outlet_page);
router.post("/:business_name/create-outlet",          create_outlet_process);
router.get("/:business_name/view-outlets",            view_outlets_page);
router.get("/business/:business_name/edit/:postal_code",       edit_outlets_page);
router.put("/:business_name/saveOutlet/:postal_code", save_edit_outlet);

router.get("/:business_name/reservation-status",      view_reservation_status_page);

function getRole(role) {
	if (role == 'admin') {
		var admin = true;
		var business = false;
		var customer = false;
	}
	else if (role == 'business') {
		var admin = false;
		var business = true;
		var customer = false;
	}
	else if (role == 'customer') {
		var admin = false;
		var business = false;
		var customer = true;
	}
	return [admin, business, customer];
}

async function user_business_page(req, res) {
    const user = BusinessUser.findOne({
        where: {
            "business_name": req.params.business_name
        }
    })
    var role = getRole(req.user.role);
    var admin = role[0];
    var business = role[1];
    var customer = role[2];

	return res.render('user/business/userBusiness', {
        admin: admin,
        business: business,
        customer: customer
    });
};

async function edit_user_business_page(req, res) {
    const user = BusinessUser.findOne({
        where: {
            "business_name": req.params.business_name
        }
    }).then((user) => {
        var role = getRole(req.user.role);
        var admin = role[0];
        var business = role[1];
        var customer = role[2];

        res.render('user/business/update_userBusiness', {
            user,
            admin: admin,
            business: business,
            customer: customer // passes user object to handlebar
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
    const user = BusinessUser.findOne({
        where: {
            "business_name": req.params.business_name
        }
    })
    var role = getRole(req.user.role);
    var admin = role[0];
    var business = role[1];
    var customer = role[2];
    return res.render('user/business/create_discountslot', {
        admin: admin,
        business: business,
        customer: customer
    });
};

async function create_discount_slot_process(req, res) {
    let errors = [];
    
    let { BusinessName, Location, Time, Discount } = req.body;

    const discountslot = await DiscountSlot.create({
        "business_name":  BusinessName,
        "location":  Location,
        "time": Time,
        "discount": Discount
    });
    res.redirect(`/u/${BusinessName}/view-discount-slots`);
};

async function view_discount_slots_page(req, res) {
    const user = BusinessUser.findOne({
        where: {
            "business_name": req.params.business_name
        }
    })
    var role = getRole(req.user.role);
    var admin = role[0];
    var business = role[1];
    var customer = role[2];
    
    const discountslot = await DiscountSlot.findAll({
        where: {
            "business_name": {
                [Op.eq]: req.params.business_name
            }
        }
    });
    return res.render('user/business/retrieve_discountslots', {
        discountslot: discountslot,
        admin: admin,
        business: business,
        customer: customer
    });
};

async function delete_discount_slot(req, res) {
    DiscountSlot.findOne({
        where: {
            "business_name" : req.params.business_name,
            "uuid" : req.params.uuid
        },
    }).then((discount_slot) => {
        if (discount_slot != null) {
            DiscountSlot.destroy({
                where: {
                    "business_name" : req.params.business_name,
                    "uuid" : req.params.uuid
                }
            }).then(() => {
                res.redirect(`/u/${req.params.business_name}/view-discount-slots`);
            }).catch( err => console.log(err));
        } else {
	    res.redirect('/404');
    }
    });
};

async function create_outlet_page(req, res) {
    const user = BusinessUser.findOne({
        where: {
            "business_name": req.params.business_name
        }
    })
    var role = getRole(req.user.role);
    var admin = role[0];
    var business = role[1];
    var customer = role[2];
	return res.render('user/business/create_outlet', {
        admin: admin,
        business: business,
        customer: customer
    });
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

    const user = BusinessUser.findOne({
        where: {
            "business_name": req.params.business_name
        }
    })
    var role = getRole(req.user.role);
    var admin = role[0];
    var business = role[1];
    var customer = role[2];
    
	return res.render('user/business/retrieve_outlets', {
        outlet: outlet,
        admin: admin,
        business: business,
        customer: customer
    });
};

async function edit_outlets_page(req, res){
    const user = BusinessUser.findOne({
        where: {
            "business_name": req.params.business_name
        }
    })
    var role = getRole(req.user.role);
    var admin = role[0];
    var business = role[1];
    var customer = role[2];

    Outlets.findOne({
        where: {
            "outlet_name" : req.params.business_name,
            "postal_code": req.params.postal_code
        }
    }).then((outlet) => {
        res.render(`user/business/update_outlet`, {
            outlet,
            admin: admin,
            business: business,
            customer: customer // passes user object to handlebar
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
    const user = BusinessUser.findOne({
        where: {
            "business_name": req.params.business_name
        }
    })
    var role = getRole(req.user.role);
    var admin = role[0];
    var business = role[1];
    var customer = role[2];
	return res.render('user/business/retrieve_reservationBusiness', {
        admin: admin,
        business: business,
        customer: customer
    });
};

// ---------------- 	
// Customer user routing

router.get("/customer/:user_email",             user_customer_page);
router.get("/customer/edit/:user_email",        edit_user_customer_page);
router.put("/customer/saveUser/:user_email",    save_edit_user_customer);
router.get("/my-reservations",                  view_reservations_page);
router.get("/customer/delete/:user_email",       delete_customer_user);


async function user_customer_page(req, res) {
    const user = CustomerUser.findOne({
        where: {
            "email": req.params.user_email
        }
    })
    var role = getRole(req.user.role);
    var admin = role[0];
    var business = role[1];
    var customer = role[2];
	return res.render('user/customer/userCustomer', {
        admin: admin,
        business: business,
        customer: customer
    });
};

async function edit_user_customer_page(req, res) {
    const user = CustomerUser.findOne({
        where: {
            "email": req.params.user_email
        }
    }).then((user) => {
        var role = getRole(req.user.role);
        var admin = role[0];
        var business = role[1];
        var customer = role[2];
        res.render('user/customer/update_userCustomer', {
            user,
            admin: admin,
            business: business,
            customer: customer // passes user object to handlebar
        });
    }).catch(err => console.log(err)); // To catch no user ID
};
 
async function save_edit_user_customer(req, res) {
    let { FirstName, LastName, Contact, Email } = req.body;

    User.update({
        email : Email
    }, {
        where: {
            email : req.params.user_email
        }
    });

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
            res.redirect(`/u/customer/${Email}`);
    }).catch(err => console.log(err));  
};

async function view_reservations_page(req, res) {
    const user = CustomerUser.findOne({
        where: {
            "email": req.params.user_email
        }
    })
    var role = getRole(req.user.role);
    var admin = role[0];
    var business = role[1];
    var customer = role[2];
	return res.render('user/customer/reservationCustomer', {
        admin: admin,
        business: business,
        customer: customer
    });
};

async function delete_customer_user(req, res) {
    User.findOne({
        where: {
            email : req.params.user_email
        },
    }).then((user) => {
        if (user != null) {
            User.destroy({
                where: {
                    email : req.params.user_email
                }
            })
        }
        else {
	    res.redirect('/404');
    }
    });

    CustomerUser.findOne({
        where: {
            "email" : req.params.user_email
        },
    }).then((user) => {
        if (user != null) {
            CustomerUser.destroy({
                where: {
                    "email" : req.params.user_email
                }
            }).then(() => {
                flashMessage(res,'success', 'Customer account deleted', 'far fa-trash-alt', true );
                req.logout();
	            return res.redirect("/home"); 
            }).catch( err => console.log(err));
        } else {
	    res.redirect('/404');
    }
    });
};
