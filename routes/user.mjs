import { Router }           from 'express';
import { flashMessage }     from '../utils/flashmsg.mjs';

import { User, UserRole }   from '../data/models/Users.mjs'
import { DiscountSlot }     from '../data/models/DiscountSlot.mjs';
import { Outlets }          from '../data/models/Outlets.mjs';
import { Reservations } 	from '../data/models/Reservations.mjs';

import { UploadFile, DeleteFilePath }       from '../utils/multer.mjs';

import ORM             from 'sequelize';
const { Op } = ORM;

const router = Router();
export default router;

// ---------------- 
// Business User routing

// Business User profile
router.get("/b/:name",                                  user_business_page);
router.get("/b/edit/:name",                             edit_user_business_page);
router.put("/b/saveUser/:name",                         save_edit_user_business);
router.get("/b/delete/:user_email",                     delete_business_user);

// Discount Slot
router.get("/b/:name/create-discount-slot",             create_discount_slot_page);
router.post("/b/:name/create-discount-slot",            create_discount_slot_process);
router.get("/b/:name/view-discount-slots",              view_discount_slots_page);
router.get("/b/:name/edit-discount-slot/:uuid",         edit_discount_slot_page);
router.put("/b/:name/saveDiscountSlot/:uuid",           save_edit_discount_slot);
router.get("/b/:name/delete-discount-slot/:uuid",       delete_discount_slot);

// Outlets
router.get("/b/:name/create-outlet",                    create_outlet_page);
router.post("/b/:name/create-outlet",                   UploadFile.single("Thumbnail"), create_outlet_process);
router.get("/b/:name/view-outlets",                     view_outlets_page);
//router.get("/outlets-data",                           outlets_data);
router.get("/b/:name/edit-outlet/:postal_code",         edit_outlet_page);
router.put("/b/:name/saveOutlet/:postal_code",          UploadFile.single("Thumbnail"), save_edit_outlet);
router.get("/b/:name/delete-outlet/:postal_code",       delete_outlet);

// Reservations
router.get("/b/:name/reservation-status",               view_reservation_status_page);

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
    const user = User.findOne({
        where: {
            "name": req.params.name
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
    let { Name, Email, Address, Contact } = req.body;

    const user = User.findOne({
        where: {
            role: UserRole.Business,
            name: req.params.name
        }
    })

    User.update({
        name: Name,
        email: Email,
        address: Address,
        contact: Contact
    }, {
        where: {
            role: UserRole.Business,
            name: req.params.name
        }
        }).then(() => {
            console.log(`user name saved as ${Name}`);
            res.redirect(`/u/b/${Name}`);
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
            "name": {
                [Op.eq]: req.params.name
            }
        }
    });
    const user = User.findOne({
        where: {
            "name": req.params.name
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
    let { Name, Location, Time, Discount } = req.body;

    const discountslot = await DiscountSlot.create({
        "name":  Name,
        "location":  Location,
        "time": Time,
        "discount": Discount
    });
    res.redirect(`/u/b/${Name}/view-discount-slots`);
};

async function view_discount_slots_page(req, res) {
    const user = User.findOne({
        where: {
            "name": req.params.name
        }
    })
    var role = getRole(req.user.role);
    var admin = role[0];
    var business = role[1];
    var customer = role[2];
    
    const discountslot = await DiscountSlot.findAll({
        where: {
            "name": {
                [Op.eq]: req.params.name
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

async function edit_discount_slot_page(req, res){
    const outlet = await Outlets.findAll({
        where: {
            "name": {
                [Op.eq]: req.params.name
            }
        }
    });
    const user = User.findOne({
        where: {
            "name": req.params.name
        }
    })
    var role = getRole(req.user.role);
    var admin = role[0];
    var business = role[1];
    var customer = role[2];

    DiscountSlot.findOne({
        where: {
            "name" : req.params.name,
            "uuid": req.params.uuid
        }
    }).then((discount_slot) => {
        res.render(`user/business/update_discountslot`, {
            discount_slot,
            admin: admin,
            business: business,
            customer: customer,
            outlet: outlet
        });
    }).catch(err => console.log(err)); // To catch no user ID
};

function save_edit_discount_slot(req, res){
    let { Name, Location, Time, Discount } = req.body;

    DiscountSlot.update({
        name: Name,
        location:  Location,
        time: Time,
        discount: Discount
    }, {
        where: {
            uuid : req.params.uuid
        }
        }).then(() => {
            res.redirect(`/u/b/${Name}/view-discount-slots`);
    }).catch(err => console.log(err)); 
};

function delete_discount_slot(req, res) {
    DiscountSlot.findOne({
        where: {
            "name" : req.params.name,
            "uuid" : req.params.uuid
        },
    }).then((discount_slot) => {
        if (discount_slot != null) {
            DiscountSlot.destroy({
                where: {
                    "name" : req.params.name,
                    "uuid" : req.params.uuid
                }
            }).then(() => {
                res.redirect(`/u/b/${req.params.name}/view-discount-slots`);
            }).catch( err => console.log(err));
        } else {
	    res.redirect('/404');
    }
    });
};

function create_outlet_page(req, res) {
    const user = User.findOne({
        where: {
            "name": req.params.name
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
    
    let { Name, Location, Address, Postalcode, Price, Contact, Description } = req.body;
    console.log(`${req.file.path}`)

    const outlet = await Outlets.create({
        "name":  Name,
        "location":  Location,
        "address":  Address,
        "postal_code":  Postalcode,
        "price":  Price,
        "contact":  Contact,
        "description": Description,
        "thumbnail" : req.file.path
    });
    res.redirect(`/u/b/${Name}/view-outlets`);
};

async function view_outlets_page(req, res) {
    const user    = req.user;
    const outlets = await user.getOutlets();
    const owner   = await (outlets[0].getOwner());

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

//async function view_outlets_page(req, res) {
//    console.log("Looking at all the outlets ");
//    var role = getRole(req.user.role);
//    var admin = role[0];
//    var business = role[1];
//    var customer = role[2];
//    
//    //const outlet = await Outlets.findAll({raw:true});
//    return res.render('user/business/retrieve_outlets', {
//        admin: admin,
//        business: business,
//        customer: customer});
//
//}
//
///**
// * Provides bootstrap table with data
// * @param {import('express')Request}  req Express Request handle
// * @param {import('express')Response} res Express Response handle
// */
//async function outlets_data(req, res) {
//    try {
//        console.log('finding data');
//        let pageSize = parseInt(req.query.limit);
//        let offset = parseInt(req.query.offset);
//        let sortBy = req.query.sort ? req.query.sort : "dateCreated";
//        let sortOrder = req.query.order ? req.query.order : "desc";
//        let search = req.query.search;
//        if (pageSize < 0) {
//            throw new HttpError(400, "Invalid page size");
//        }
//        if (offset < 0) {
//            throw new HttpError(400, "Invalid offset index");
//        }
//        
//        /** @type {import('sequelize/types').WhereOptions} */
//        const conditions = search
//            ? {
//                [Op.or]: {
//                    name: { [Op.substring]: search },
//                    location: { [Op.substring]: search},
//                    address: { [Op.substring]: search},
//                    postal_code: { [Op.substring]: search},
//                    price: { [Op.substring]: search},
//                    contact: { [Op.substring]: search},
//                    description: { [Op.substring]: search}  
//                }
//            }
//            : undefined;
//        const total = await Outlets.count({ where: conditions });
//        const pageTotal = Math.ceil(total / pageSize);
//
//        const pageContents = await Outlets.findAll({
//            offset: offset,
//            limit: pageSize,
//            order: [[sortBy, sortOrder.toUpperCase()]],
//            where: conditions,
//            raw: true, // Data only, model excluded
//        });
//        return res.json({
//            total: total,
//            rows: pageContents,
//        });
//    } catch (error) {
//        console.error("Failed to retrieve all Outlets");
//        console.error(error);
//        return res.status(500).end();
//    }
//}
//
function edit_outlet_page(req, res){
    const user = User.findOne({
        where: {
            "name": req.params.name
        }
    })
    var role = getRole(req.user.role);
    var admin = role[0];
    var business = role[1];
    var customer = role[2];

    Outlets.findOne({
        where: {
            "name" : req.params.name,
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
    let { Name, Location, Address, Postalcode, Price, Contact, Description } = req.body;

    

    Outlets.update({
        name:  Name,
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
        }).then(() => {if (req.files.length > 0) {
            console.log(`Replaced profile image ${thumbnail} with ${req.files[0].path}`)
            //	Delete old file
            DeleteFilePath(`${process.cwd()}/${thumbnail}`);
            thumbnail = req.files[0].path;
        }
            res.redirect(`/u/b/${Name}/view-outlets`);
    }).catch(err => console.log(err)); 
};

function delete_outlet(req, res) {
    Outlets.findOne({
        where: {
            "name" : req.params.name,
            "postal_code" : req.params.postal_code
        },
    }).then((outlet) => {
        if (outlet!= null) {
            Outlets.destroy({
                where: {
                    "name" : req.params.name,
                    "postal_code" : req.params.postal_code
                }
            }).then(() => {
                res.redirect(`/u/b/${req.params.name}/view-outlets`);
            }).catch( err => console.log(err));
        } else {
	    res.redirect('/404');
    }
    });
};

function view_reservation_status_page(req, res) {
    const user = User.findOne({
        where: {
            "name": req.params.name
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
    const user = User.findOne({
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
    const user = User.findOne({
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
    let { Name, Contact, Email } = req.body;

    User.update({
        name : Name,
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
            "email" : req.params.user_email
        },
    }).then((user) => {
        if (user != null) {
            User.destroy({
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
    
    let { reservation_id, name, location, user_name, user_email, user_contact, date, pax, time, discount } = req.body;

    const reservation = await Reservations.create({
        "reservation_id" : reservation_id,
        "name" : name,
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
    const user = User.findOne({
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
            "name": reservation.name,
            "location": reservation.location
        }
    });
    
    const discountslot = await DiscountSlot.findAll({
        where: {
            "name": reservation.name,
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
    let { BusinessName, Location, Name, ResDate, Pax, Email, Contact } = req.body;

    Reservations.update({
        name : BusinessName,
        location : Location,
        user_name : Name,
        user_email : Email,
        user_contact : Contact,
        date : ResDate,
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

