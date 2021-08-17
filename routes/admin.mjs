import { Router }           from 'express';
import { flashMessage }     from '../utils/flashmsg.mjs';

import { User, UserRole }   from '../data/models/Users.mjs';
import { Outlets }          from '../data/models/Outlets.mjs';
import { Feedback }         from '../data/models/Feedback.mjs';
import { Categories }       from '../data/models/Categories.mjs';
import { Reservations } 	from '../data/models/Reservations.mjs';
import { DiscountSlot }     from '../data/models/DiscountSlot.mjs';

import { sendMailVerifiedBusiness,sendMailBannedAccount,sendMailFeedbackResponse} from '../data/mail.mjs';

import { UploadFile, DeleteFilePath }       from '../utils/multer.mjs';
import Hash             from 'hash.js';


import ORM                  from 'sequelize';
const { Op } = ORM;

const router = Router();
export default router;

/**
 * Regular expressions for form testing
 **/ 
 const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
 const regexName  = /^[a-z ,.'-]+$/i;
 //	Min 8 character, 1 upper, 1 lower, 1 number, 1 symbol
 //const regexPwd   = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
 
 // Min 8 character, 1 letter, 1 number 
 const regexPwd = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/


router.use(ensure_auth)
router.use(ensure_admin)

// User management routes
router.get("/businessUsers",                        view_business_users_page);
router.get("/all-business-data",                    all_business_data);
router.get("/accept_document/:email",               accept_document);
router.get("/deleteBusinessUser/:name",             delete_business_user);

router.get("/customerUsers",                        view_customer_users_page);
router.get("/all-customer-data",                    all_customer_data);
router.get("/deleteCustomerUser/:email",            delete_customer_user);

router.get("/adminDashboard",                       view_admin_dashboard_page);
router.get("/adminUsers",                           view_admin_users_page);
router.get("/all-admin-data",                       all_admin_data);
router.get("/deleteAdminUser/:name",                delete_admin_user);
router.get("/editAdminUser/:name",                  edit_admin_page);
router.put("/saveAdminUser/:name",                  save_edit_admin_user);
router.get("/createAdminUser",                      create_admin_user_page);
router.post("/createAdminUser",                     create_admin_user_process);

// Outlet management routes
router.get("/outlets",                              view_outlets_page);
router.get("/all-outlets-data",                     all_outlets_data);
router.get("/deleteOutlet/:postal_code",            delete_outlet);

// Feedback management routes
router.get("/feedback",                             view_feedback_page);
router.get("/reply_feedback/:uuid",                 reply_feedback_page);
router.post("/reply_feedback/:uuid",                reply_feedback_process);
router.get("/all-feedbacks-data",                   all_feedbacks_data);
router.get("/deleteFeedback/:uuid",                 delete_feedback);

// Categories management routes
router.get("/create-category",                      create_category_page);
router.post("/create-category",                     UploadFile.single("Thumbnail"), create_category_process);
router.get("/categories",                           view_categories_page);
router.get("/edit-category/:name",                  edit_category_page);
router.put("/save-category/:name",                  UploadFile.any("Thumbnail"), save_edit_category);
router.get("/all-categories-data",                  all_categories_data);
router.get("/deleteCategory/:name",                 delete_category);

// ----------------
// Authentication
function ensure_auth(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect("/auth/login");
    }
    else {
        return next();
    }
};

async function ensure_admin(req, res, next) {
    /** @type {ModelUser} */
    const user = req.user;
    if (user.role == UserRole.Admin) {
        return next();
    }
    else {
        return res.sendStatus(403);
    }
}

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

function view_customer_users_page(req, res) {
    var role = getRole(req.user.role);
    var admin = role[0];
    var business = role[1];
    var customer = role[2];
	return res.render('admin/retrieve_customerUsers', {
        admin: admin,
        business: business,
        customer: customer,
    });
};

async function all_customer_data(req, res) {
    try {
        console.log('finding data');
        let pageSize = parseInt(req.query.limit);
        let offset = parseInt(req.query.offset);
        let sortBy = req.query.sort ? req.query.sort : "dateCreated";
        let sortOrder = req.query.order ? req.query.order : "desc";
        let search = req.query.search;
        if (pageSize < 0) {
            throw new HttpError(400, "Invalid page size");
        }
        if (offset < 0) {
            throw new HttpError(400, "Invalid offset index");
        }
        
        /** @type {import('sequelize/types').WhereOptions} */
        const conditions = {role: req.user.role = "customer"}
        search
        ?{
            [Op.or]: {
                name: { [Op.substring]: search},
                contact: { [Op.substring]: search},
                email: { [Op.substring]: search}
            }
        }
        : undefined;
        const total = await User.count({ where: conditions });
        const pageTotal = Math.ceil(total / pageSize);
 
        const pageContents = await User.findAll({
            offset: offset,
            limit: pageSize,
            order: [[sortBy, sortOrder.toUpperCase()]],
            where: conditions,
            raw: true, // Data only, model excluded
        });
        return res.json({
            total: total,
            rows: pageContents,
        });
    } catch (error) {
        console.error("Failed to retrieve all Customers");
        console.error(error);
        return res.status(500).end();
    }
 }

function delete_customer_user(req, res) {
    const user = User.findOne({
        where: {
            "email" : req.params.email
        },
    }).then((user) => {
        if (user != null) {
            User.destroy({
                where: {
                    "email" : req.params.email
                }
            });
            Reservations.destroy({
                where: {
                    "user_email" : req.params.email
                }
            }).then(() => {
                res.redirect('/admin/customerUsers');
            }).catch( err => console.log(err));
        } else {
	    res.redirect('/404');
    }
    });
};

function view_business_users_page(req, res) {
    var role = getRole(req.user.role);
    var admin = role[0];
    var business = role[1];
    var customer = role[2];
	return res.render('admin/retrieve_businessUsers', {
        admin: admin,
        business: business,
        customer: customer,
    });
};

/**
* Provides bootstrap table with data
* @param {import('express')Request}  req Express Request handle
* @param {import('express')Response} res Express Response handle
*/
async function all_business_data(req, res) {
    try {
        console.log('finding data');
        let pageSize = parseInt(req.query.limit);
        let offset = parseInt(req.query.offset);
        let sortBy = req.query.sort ? req.query.sort : "dateCreated";
        let sortOrder = req.query.order ? req.query.order : "desc";
        let search = req.query.search;
        if (pageSize < 0) {
            throw new HttpError(400, "Invalid page size");
        }
        if (offset < 0) {
            throw new HttpError(400, "Invalid offset index");
        }
        
        /** @type {import('sequelize/types').WhereOptions} */
        const conditions = {role: req.user.role = "business"}
        search
        ?{
            [Op.or]: {
                name: { [Op.substring]: search},
                contact: { [Op.substring]: search},
                email: { [Op.substring]: search}
            }
        }
        : undefined;
        const total = await User.count({ where: conditions });
        const pageTotal = Math.ceil(total / pageSize);
 
        const pageContents = await User.findAll({
            offset: offset,
            limit: pageSize,
            order: [[sortBy, sortOrder.toUpperCase()]],
            where: conditions,
            raw: true, // Data only, model excluded
        });
        return res.json({
            total: total,
            rows: pageContents,
        });
    } catch (error) {
        console.error("Failed to retrieve all Businesses");
        console.error(error);
        return res.status(500).end();
    }
 }

function accept_document(req,res){
    let email = req.params.email
    User.update({
        verified: "Yes"
    }, {
        where: {
            email : email
        }
        })
    sendMailVerifiedBusiness(email)
    .then((result) => console.log('Email sent...', result))
			.catch((error) => console.log(error.message));
		
    return res.redirect('/admin/businessUsers')
}

function delete_business_user(req, res) {
    User.findOne({
        where: {
            "name" : req.params.name
        },
    }).then((user) => {
        if (user != null) {
            User.destroy({
                where: {
                    "name" : req.params.name
                }
            });
            Outlets.destroy({
                where: {
                    "name" : req.params.name
                }
            });
            Reservations.destroy({
                where: {
                    "name" : req.params.name
                }
            });
            DiscountSlot.destroy({
                where: {
                    "name" : req.params.name
                }
            }).then(() => {
                res.redirect('/admin/businessUsers');
            }).catch( err => console.log(err));
        } else {
	    res.redirect('/404');
    }
    });
};

function view_outlets_page(req, res) {
    var role = getRole(req.user.role);
    var admin = role[0];
    var business = role[1];
    var customer = role[2];
    return res.render('admin/retrieve_outlets', {
        admin: admin,
        business: business,
        customer: customer,
    });
};

/**
* Provides bootstrap table with data
* @param {import('express')Request}  req Express Request handle
* @param {import('express')Response} res Express Response handle
*/
async function all_outlets_data(req, res) {
    try {
        console.log('finding data');
        let pageSize = parseInt(req.query.limit);
        let offset = parseInt(req.query.offset);
        let sortBy = req.query.sort ? req.query.sort : "dateCreated";
        let sortOrder = req.query.order ? req.query.order : "desc";
        let search = req.query.search;
        if (pageSize < 0) {
            throw new HttpError(400, "Invalid page size");
        }
        if (offset < 0) {
            throw new HttpError(400, "Invalid offset index");
        }
        
        /** @type {import('sequelize/types').WhereOptions} */
        const conditions = search
        ?{
            [Op.or]: {
                location: { [Op.substring]: search},
                postal_code: { [Op.substring]: search}  
            }
        }
        : undefined;
        const total = await Outlets.count({ where: conditions });
        const pageTotal = Math.ceil(total / pageSize);
 
        const pageContents = await Outlets.findAll({
            offset: offset,
            limit: pageSize,
            order: [[sortBy, sortOrder.toUpperCase()]],
            where: conditions,
            raw: true, // Data only, model excluded
        });
        return res.json({
            total: total,
            rows: pageContents,
        });
    } catch (error) {
        console.error("Failed to retrieve all Outlets");
        console.error(error);
        return res.status(500).end();
    }
 }

function delete_outlet(req, res) {
    Outlets.findOne({
        where: {
            "postal_code" : req.params.postal_code
        },
    }).then((outlet) => {
        if (outlet != null) {
            Outlets.destroy({
                where: {
                    "postal_code" : req.params.postal_code
                }
            }).then(() => {
                res.redirect('/admin/allOutlets');
            }).catch( err => console.log(err));
        } else {
	    res.redirect('/404');
    }
    });
};

function view_feedback_page(req, res) {
    var role = getRole(req.user.role);
    var admin = role[0];
    var business = role[1];
    var customer = role[2];
	return res.render('admin/retrieve_feedback', {
        admin: admin,
        business: business,
        customer: customer,
    });
};

/**
* Provides bootstrap table with data
* @param {import('express')Request}  req Express Request handle
* @param {import('express')Response} res Express Response handle
*/
async function all_feedbacks_data(req, res) {
    try {
        console.log('finding data');
        let pageSize = parseInt(req.query.limit);
        let offset = parseInt(req.query.offset);
        let sortBy = req.query.sort ? req.query.sort : "dateCreated";
        let sortOrder = req.query.order ? req.query.order : "desc";
        let search = req.query.search;
        if (pageSize < 0) {
            throw new HttpError(400, "Invalid page size");
        }
        if (offset < 0) {
            throw new HttpError(400, "Invalid offset index");
        }
        
        /** @type {import('sequelize/types').WhereOptions} */
        const conditions = search
        ?{
            [Op.or]: {
                name: { [Op.substring]: search},
                phone: { [Op.substring]: search},
                email: { [Op.substring]: search}
            }
        }
        : undefined;
        const total = await Feedback.count({ where: conditions });
        const pageTotal = Math.ceil(total / pageSize);
 
        const pageContents = await Feedback.findAll({
            offset: offset,
            limit: pageSize,
            order: [[sortBy, sortOrder.toUpperCase()]],
            where: conditions,
            raw: true, // Data only, model excluded
        });
        return res.json({
            total: total,
            rows: pageContents,
        });
    } catch (error) {
        console.error("Failed to retrieve all Feedbacks");
        console.error(error);
        return res.status(500).end();
    }
 }

 async function reply_feedback_page(req, res) {
    let feedbackId = req.params.uuid
    const current_feedback = await Feedback.findOne({ 
        where: {
            uuid : feedbackId
        },
    })
    return res.render('admin/reply_feedback', { message : current_feedback.message, uuid: feedbackId});
};


async function reply_feedback_process(req, res) {
    let reply = req.body.Reply
    const current_feedback = await Feedback.findOne({ 
        where: {
            uuid : req.params.uuid
        },
    })
    Feedback.update({
       read : "Yes"
    }, {
        where: {
           uuid : req.params.uuid
        }
    })
    sendMailFeedbackResponse(current_feedback.email,reply)
        .then((result) => console.log('Email sent...', result))
        .catch((error) => console.log(error.message));
    return res.redirect("/admin/feedback");
};

function delete_feedback(req, res) {
    let feedbackId = req.params.uuid
    Feedback.findOne({
        where: {
            uuid : feedbackId
        },
        attributes : ['uuid']
    }).then((feedback) => {
        if (feedback != null) {
            Feedback.destroy({
                where: {
                    uuid : feedbackId
                }
            }).then(() => {
                res.redirect('/admin/feedback');
            }).catch( err => console.log(err));
        }
    });
};

function view_categories_page(req, res) {
    var role = getRole(req.user.role);
    var admin = role[0];
    var business = role[1];
    var customer = role[2];
    return res.render('admin/retrieve_categories', {
        admin: admin,
        business: business,
        customer: customer,
    });
};

function create_category_page(req, res) {
    var role = getRole(req.user.role);
    var admin = role[0];
    var business = role[1];
    var customer = role[2];
    return res.render('admin/create_category', {
        admin: admin,
        business: business,
        customer: customer,
    });
};

async function create_category_process(req, res) {
    let { Name, Description } = req.body;

    const category = await Categories.create({
        "name":  Name,
        "description": Description,
        "thumbnail" : req.file.path
    });
    res.redirect('/admin/categories');
};

function edit_category_page(req, res){
    var role = getRole(req.user.role);
    var admin = role[0];
    var business = role[1];
    var customer = role[2];
    Categories.findOne({
        where: {
            "name" : req.params.name
        }
    }).then((categories) => {
        res.render(`admin/update_category`, {
            admin: admin,
            business: business,
            customer: customer,
            categories:categories
        });
    }).catch(err => console.log(err)); // To catch no user ID
};

function save_edit_category(req, res){
    let { Name, Description } = req.body;

    Categories.update({
        name: Name,
        description: Description,
        thumbnail: req.path.file
    }, {
        where: {
            name : req.params.name
        }
        }).then(() => {
            res.redirect('/admin/categories');
    }).catch(err => console.log(err)); 
};

async function all_categories_data(req, res) {
    try {
        console.log('finding data');
        let pageSize = parseInt(req.query.limit);
        let offset = parseInt(req.query.offset);
        let sortBy = req.query.sort ? req.query.sort : "dateCreated";
        let sortOrder = req.query.order ? req.query.order : "desc";
        let search = req.query.search;
        if (pageSize < 0) {
            throw new HttpError(400, "Invalid page size");
        }
        if (offset < 0) {
            throw new HttpError(400, "Invalid offset index");
        }
        
        /** @type {import('sequelize/types').WhereOptions} */
        const conditions = search
        ?{
            [Op.or]: {
                name: { [Op.substring]: search}
            }
        }
        : undefined;
        const total = await Categories.count({ where: conditions });
        const pageTotal = Math.ceil(total / pageSize);
 
        const pageContents = await Categories.findAll({
            offset: offset,
            limit: pageSize,
            order: [[sortBy, sortOrder.toUpperCase()]],
            where: conditions,
            raw: true, // Data only, model excluded
        });
        return res.json({
            total: total,
            rows: pageContents,
        });
    } catch (error) {
        console.error("Failed to retrieve all Categories");
        console.error(error);
        return res.status(500).end();
    }
 }
 
function delete_category(req, res) {
    Categories.findOne({
        where: {
            "name" : req.params.name,
        },
    }).then((categories) => {
        if (categories!= null) {
            categories.destroy({
                where: {
                    "name" : req.params.name
                }
            }).then(() => {
                res.redirect('/admin/categories');
            }).catch( err => console.log(err));
        } else {
	    res.redirect('/404');
    }
    });
};

async function view_admin_dashboard_page(req, res) {
    var role = getRole(req.user.role);
    var admin = role[0];
    var business = role[1];
    var customer = role[2];
    
    const outlet_count = await Outlets.count({
        where:{
            "name": {
                [Op.ne]: 'null'
        }
    }});

    const business_count = await User.count({
        where:{
            "role":{
                [Op.eq]: 'business'
            }
        }
    });

    const customer_count = await User.count({
        where:{
            "role":{
                [Op.eq]: 'customer'
            }
        }
    });

    const feedback_count = await Feedback.count({
        where:{
            "name": {
                [Op.ne]: 'null'
        },
        "email": {
            [Op.ne]: 'null'
        }
    }});

    const admin_count = await User.count({
        where:{
            "role":{
                [Op.eq]: 'admin'
            }
        }
    });
	return res.render('admin/admin_dashboard', {
        admin: admin,
        business: business,
        customer: customer,
        outlet_count:outlet_count,
        business_count:business_count,
        customer_count:customer_count,
        feedback_count:feedback_count,
        admin_count:admin_count
    });
};

function view_admin_users_page(req, res) {
    var role = getRole(req.user.role);
    var admin = role[0];
    var business = role[1];
    var customer = role[2];
    if (req.user.name == "root"){
	return res.render('admin/retrieve_adminUsersRoot', {
        admin: admin,
        business: business,
        customer: customer,
    });
    } 
    else {
    return res.render('admin/retrieve_adminUsers', {
        admin: admin,
        business: business,
        customer: customer,
    });
    }
};

async function all_admin_data(req, res) {
    try {
        console.log('finding data');
        let pageSize = parseInt(req.query.limit);
        let offset = parseInt(req.query.offset);
        let sortBy = req.query.sort ? req.query.sort : "dateCreated";
        let sortOrder = req.query.order ? req.query.order : "desc";
        let search = req.query.search;
        if (pageSize < 0) {
            throw new HttpError(400, "Invalid page size");
        }
        if (offset < 0) {
            throw new HttpError(400, "Invalid offset index");
        }
        
        /** @type {import('sequelize/types').WhereOptions} */
        const conditions = {role: req.user.role = "admin"}
        search
        ?{
            [Op.or]: {
                name: { [Op.substring]: search},
                email: { [Op.substring]: search}
            }
        }
        : undefined;
        const total = await User.count({ where: conditions });
        const pageTotal = Math.ceil(total / pageSize);
 
        const pageContents = await User.findAll({
            offset: offset,
            limit: pageSize,
            order: [[sortBy, sortOrder.toUpperCase()]],
            where: conditions,
            raw: true, // Data only, model excluded
        });
        return res.json({
            total: total,
            rows: pageContents,
        });
    } catch (error) {
        console.error("Failed to retrieve all Customers");
        console.error(error);
        return res.status(500).end();
    }
 }

 function delete_admin_user(req, res) {
    User.findOne({
        where: {
            "name" : req.params.name
        },
    }).then((user) => {
        if (user != null) {
            User.destroy({
                where: {
                    "name" : req.params.name
                }
            }).then(() => {
                res.redirect('/admin/adminUsers');
            }).catch( err => console.log(err));
        } else {
	    res.redirect('/404');
    }
    });
};

function edit_admin_page(req, res) {
    const user = User.findOne({
        where: {
            "name": req.params.name
        }
    }).then((user) => {
        var role = getRole(req.user.role);
        var admin = role[0];
        var business = role[1];
        var customer = role[2];
        res.render('admin/update_adminUser', {
            user,
            admin: admin,
            business: business,
            customer: customer
        });
    }).catch(err => console.log(err));
};

function save_edit_admin_user(req, res) {
    let { Name, Email } = req.body;
    const user = User.findOne({
        where: {
            role: UserRole.Admin,
            name: req.params.name
        }
    });

    User.update({
        name: Name,
        email: Email,
    }, { where: {role: UserRole.Admin, name: req.params.name}}
    ).then(() => {
        console.log(`admin name saved as ${Name}`);
        res.redirect('/admin/adminUsers');
    }).catch(err => console.log(err));  
};

function create_admin_user_page(req,res){
    return res.render('admin/create_adminUser');
};

async function create_admin_user_process(req,res){
    let errors = [];
    
    let { Name, Email, InputPassword, ConfirmPassword } = req.body;

	try {
		if (! regexName.test(Name)) {
			errors = errors.concat({ text: "Invalid name provided! It must be minimum 3 characters and starts with a alphabet." });
		}

		if (! regexEmail.test(Email)) {
			errors = errors.concat({ text: "Invalid email address!" });
		}

		else {
			const user = await User.findOne({where: {email: Email}});
			if (user != null) {
				errors = errors.concat({ text: "This email cannot be used!" });
			}
		}

		if (! regexPwd.test(InputPassword)) {
			errors = errors.concat({ text: "Password requires minimum eight characters, at least one uppercase letter, one lowercase letter and one number!" });
		}
		else if (InputPassword !== ConfirmPassword) {
			errors = errors.concat({ text: "Password do not match!" });
		}

		if (errors.length > 0) {
			throw new Error("There are validation errors");
		}
	}
	catch (error) {
		console.error("There is errors with the creating form body.");
		console.error(error);
		return res.render('admin/create_adminUser', { errors: errors });
	}
    try{
        const Password =  Hash.sha256().update(InputPassword).digest('hex')
        User.create({
			"name": Name,
			"email": Email,
			"password": Password,
			"role": UserRole.Admin
		})
        flashMessage(res, 'success', 'Successfully created an admin user.');
        res.redirect("/admin/adminUsers");
    }
    catch (error) {
		//	Else internal server error
		console.error(`Failed to create a new user: ${Email} `);
		console.error(error);
		return res.status(500).end();
	}
};