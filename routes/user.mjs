import { Router }           from 'express';
import { flashMessage }     from '../utils/flashmsg.mjs';
import { BusinessUser }     from '../data/Business.mjs';
import { CustomerUser }     from '../data/Customer.mjs';
import { DiscountSlot }     from '../data/DiscountSlot.mjs';
import { Outlets }          from '../data/Outlets.mjs';
import { User }             from '../data/Users.mjs'
import { Reservations } 	from '../data/Reservations.mjs';
import { UploadFile }       from '../utils/multer.mjs';

import Passport        from 'passport';
import ORM             from 'sequelize';
const { Sequelize, DataTypes, Model, Op } = ORM;

const router = Router();
export default router;

// ---------------- 
// Business User routing

// Business User profile
router.get("/b/:business_name",                               user_business_page);
router.get("/b/edit/:business_name",                          edit_user_business_page);
router.put("/b/saveUser/:business_name",                      save_edit_user_business);
router.get("/b/delete/:user_email",                           delete_business_user);

// Discount Slot
router.get("/b/:business_name/create-discount-slot",          create_discount_slot_page);
router.post("/b/:business_name/create-discount-slot",         create_discount_slot_process);
router.get("/b/:business_name/view-discount-slots",           view_discount_slots_page);
router.get("/b/:business_name/edit-discount-slot/:uuid",      edit_discount_slot_page);
router.put("/b/:business_name/saveDiscountSlot/:uuid",        save_edit_discount_slot);
router.get("/b/:business_name/delete-discount-slot/:uuid",    delete_discount_slot);

// Outlets
router.get("/b/:business_name/create-outlet",                 create_outlet_page);
router.post("/b/:business_name/create-outlet",                UploadFile.single("Thumbnail"), create_outlet_process);
router.get("/b/:business_name/view-outlets",                  view_outlets_page);
router.get("/b/:business_name/edit-outlet/:postal_code",      edit_outlet_page);
router.put("/b/:business_name/saveOutlet/:postal_code",       UploadFile.single("Thumbnail"), save_edit_outlet);
router.get("/b/:business_name/delete-outlet/:postal_code",    delete_outlet);

// Reservations
router.get("/b/:business_name/reservation-status",            view_reservation_status_page);

// ----------------
// Check user role
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
// ----------------

function user_business_page(req, res) {
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

function edit_user_business_page(req, res) {
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

function save_edit_user_business(req, res) {
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
            res.redirect(`/u/b/${BusinessName}`);
    }).catch(err => console.log(err));  
};

function delete_business_user(req, res) {
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
            BusinessUser.destroy({
                where: {
                    email : req.params.user_email
                }
            })
        }
        else {
	    res.redirect('/404');
    }
    });

    BusinessUser.findOne({
        where: {
            "email" : req.params.user_email
        },
    }).then((user) => {
        if (user != null) {
            BusinessUser.destroy({
                where: {
                    "email" : req.params.user_email
                }
            }).then(() => {
                flashMessage(res,'success', 'Business account deleted', 'fa fa-trash', true );
                req.logout();
	            return res.redirect("/home"); 
            }).catch( err => console.log(err));
        } else {
	    res.redirect('/404');
    }
    });
};

async function create_discount_slot_page(req, res) {
    const outlet = await Outlets.findAll({
        where: {
            "business_name": {
                [Op.eq]: req.params.business_name
            }
        }
    });
    const user = BusinessUser.findOne({
        where: {
            "business_name": req.params.business_name
        }
    });
    var role = getRole(req.user.role);
    var admin = role[0];
    var business = role[1];
    var customer = role[2];
    return res.render('user/business/create_discountslot', {
        admin: admin,
        business: business,
        customer: customer,
        outlet: outlet
    });
};

async function create_discount_slot_process(req, res) {
    let { BusinessName, Location, Time, Discount } = req.body;

    const discountslot = await DiscountSlot.create({
        "business_name":  BusinessName,
        "location":  Location,
        "time": Time,
        "discount": Discount
    });
    res.redirect(`/u/b/${BusinessName}/view-discount-slots`);
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

function edit_discount_slot_page(req, res){
    const user = BusinessUser.findOne({
        where: {
            "business_name": req.params.business_name
        }
    })
    var role = getRole(req.user.role);
    var admin = role[0];
    var business = role[1];
    var customer = role[2];

    DiscountSlot.findOne({
        where: {
            "business_name" : req.params.business_name,
            "uuid": req.params.uuid
        }
    }).then((discount_slot) => {
        res.render(`user/business/update_discountslot`, {
            discount_slot,
            admin: admin,
            business: business,
            customer: customer // passes user object to handlebar
        });
    }).catch(err => console.log(err)); // To catch no user ID
};

function save_edit_discount_slot(req, res){
    let { BusinessName, Location, Time, Discount } = req.body;

    DiscountSlot.update({
        business_name:  BusinessName,
        location:  Location,
        time: Time,
        discount: Discount
    }, {
        where: {
            uuid : req.params.uuid
        }
        }).then(() => {
            res.redirect(`/u/b/${BusinessName}/view-discount-slots`);
    }).catch(err => console.log(err)); 
};

function delete_discount_slot(req, res) {
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
                res.redirect(`/u/b/${req.params.business_name}/view-discount-slots`);
            }).catch( err => console.log(err));
        } else {
	    res.redirect('/404');
    }
    });
};

function create_outlet_page(req, res) {
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
    console.log(`${req.file.path}`)

    const outlet = await Outlets.create({
        "business_name":  BusinessName,
        "location":  Location,
        "address":  Address,
        "postal_code":  Postalcode,
        "price":  Price,
        "contact":  Contact,
        "description": Description,
        "thumbnail" : req.file.path
    });
    res.redirect(`/u/b/${BusinessName}/view-outlets`);
};

async function view_outlets_page(req, res) {
    const outlet = await Outlets.findAll({
        where: {
            "business_name": {
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

function edit_outlet_page(req, res){
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
            "business_name" : req.params.business_name,
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

function save_edit_outlet(req, res){
    let { BusinessName, Location, Address, Postalcode, Price, Contact, Description } = req.body;

    Outlets.update({
        business_name:  BusinessName,
        location:  Location,
        address:  Address,
        postal_code:  Postalcode,
        price:  Price,
        contact:  Contact,
        description: Description,
        thumbnail: req.file.path
    }, {
        where: {
            postal_code : req.params.postal_code
        }
        }).then(() => {
            res.redirect(`/u/b/${BusinessName}/view-outlets`);
    }).catch(err => console.log(err)); 
};

function delete_outlet(req, res) {
    Outlets.findOne({
        where: {
            "business_name" : req.params.business_name,
            "postal_code" : req.params.postal_code
        },
    }).then((outlet) => {
        if (outlet!= null) {
            Outlets.destroy({
                where: {
                    "business_name" : req.params.business_name,
                    "postal_code" : req.params.postal_code
                }
            }).then(() => {
                res.redirect(`/u/b/${req.params.business_name}/view-outlets`);
            }).catch( err => console.log(err));
        } else {
	    res.redirect('/404');
    }
    });
};

function view_reservation_status_page(req, res) {
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

router.get("/c/:user_email",                        user_customer_page);
router.get("/c/edit/:user_email",                   edit_user_customer_page);
router.put("/c/saveUser/:user_email",               save_edit_user_customer);
router.get("/c/delete/:user_email",                 delete_customer_user);

// Customer reservation

router.post("c/create-reservation",                                                create_reservation_process);
router.get("/c/my-reservations/:user_email",                                       view_reservations_page);
router.get("/c/my-reservations/:user_email/edit-reservation/:reservation_id",      edit_reservation_page);
router.put("/c/my-reservations/:user_email/save-reservation/:reservation_id",      save_edit_reservation);
router.get("/c/my-reservations/:user_email/cancel-reservation/:reservation_id",    delete_reservation);

function user_customer_page(req, res) {
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

function edit_user_customer_page(req, res) {
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
 
function save_edit_user_customer(req, res) {
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
            res.redirect(`/u/c/${Email}`);
    }).catch(err => console.log(err));  
};

function delete_customer_user(req, res) {
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
                flashMessage(res,'success', 'Customer account deleted', 'fa fa-trash', true );
                req.logout();
	            return res.redirect("/home"); 
            }).catch( err => console.log(err));
        } else {
	    res.redirect('/404');
    }
    });
};

async function create_reservation_process(req, res) {
    let errors = [];
    
    let { reservation_id, business_name, location, user_name, user_email, user_contact, date, pax, time, discount } = req.body;

    const reservation = await Reservations.create({
        "reservation_id" : reservation_id,
        "business_name" : business_name,
        "location" : location,
        "user_name" : user_name,
        "user_email" : user_email,
        "user_contact" : user_contact,
        "date" : date,
        "pax" : pax,
        "time" : time,
        "discount" : discount
    });
    res.redirect("/retrieve_reservation/:user_email");
};

async function view_reservations_page(req, res) {
	const reservation = await Reservations.findAll({
        where: {
            "user_email": {
                [Op.eq]: req.params.user_email
            }
        }
    });
    const user = CustomerUser.findOne({
        where: {
            "email": req.params.user_email
        }
    })
    var role = getRole(req.user.role);
    var admin = role[0];
    var business = role[1];
    var customer = role[2];
    return res.render('user/customer/retrieve_reservationCustomer', {
        reservation: reservation,
        admin: admin,
        business: business,
        customer: customer
    });
};

async function edit_reservation_page(req, res){
    var role = getRole(req.user.role);
    var admin = role[0];
    var business = role[1];
    var customer = role[2];

    const reservation = await Reservations.findOne({
        where: {
            "user_email": req.params.user_email,
            "reservation_id": req.params.reservation_id
        }
    });

    const restaurant = await Outlets.findOne({
        where: {
            "business_name": reservation.business_name,
            "location": reservation.location
        }
    });
    
    const discountslot = await DiscountSlot.findAll({
        where: {
            "business_name": reservation.business_name,
            "location": reservation.location
        }
    });

    Reservations.findOne({
        where: {
            "user_email": req.params.user_email,
            "reservation_id": req.params.reservation_id
        }
    })
    .then((reservation) => {
        res.render('user/customer/update_reservationCustomer', {
            reservation: reservation,
            restaurant: restaurant,
            discountslot: discountslot,
            admin: admin,
            business: business,
            customer: customer 
        });
    }).catch(err => console.log(err)); // To catch no user ID
};

function save_edit_reservation(req, res){
    let { BusinessName, Location, ResDate, Pax, Name, Email, Contact } = req.body;

    Reservations.update({
        business_name : BusinessName,
        location : Location,
        user_name : Name,
        user_email : Email,
        user_contact : Contact,
        res_date : ResDate,
        pax : Pax
    }, {
        where: {
            user_email: req.params.user_email,
            reservation_id: req.params.reservation_id
        }
        }).then(() => {
            res.redirect(`/u/c/my-reservations/${req.params.user_email}`);
    }).catch(err => console.log(err)); 
};

function delete_reservation(req, res) {
    Reservations.findOne({
        where: {
            "user_email": req.params.user_email,
            "reservation_id": req.params.reservation_id
        },
    }).then((reservation) => {
        if (reservation!= null) {
            Reservations.destroy({
                where: {
                    "user_email": req.params.user_email,
                    "reservation_id": req.params.reservation_id
                },
            }).then(() => {
                res.redirect(`/u/c/my-reservations/${req.params.user_email}`);
            }).catch( err => console.log(err));
        } else {
	    res.redirect('/404');
    }
    });
};

