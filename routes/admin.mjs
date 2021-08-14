import { Router }       from 'express';
import { flashMessage } from '../utils/flashmsg.mjs';

import { User }         from '../data/models/Users.mjs';
import { Outlets }      from '../data/models/Outlets.mjs';
import { Feedback }     from '../data/models/Feedback.mjs';
import { Categories }   from '../data/models/Categories.mjs';

import { UploadFile, DeleteFilePath }       from '../utils/multer.mjs';


import ORM              from 'sequelize';
const { Op } = ORM;

const router = Router();
export default router;

router.use(ensure_auth)
router.use(ensure_admin)

//Admin login

// User management routes
router.get("/businessUsers",                        view_business_users_page);
router.get("/all-business-data",                    all_business_data);
router.get("/deleteBusinessUser/:name",             delete_business_user);

router.get("/customerUsers",                        view_customer_users_page);
router.get("/all-customer-data",                    all_customer_data);
router.get("/deleteCustomerUser/:email",            delete_customer_user);

// Outlet management routes
router.get("/allOutlets",                           view_outlets_page);
router.get("/all-outlets-data",                     all_outlets_data);
router.get("/deleteOutlet/:postal_code",            delete_outlet);

// Feedback management routes
router.get("/feedback",                             view_feedback_page);
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

function ensure_auth(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect("/auth/adminlogin");
    }
    else {
        return next();
    }
}

function ensure_admin(req, res, next) {
    /** @type {ModelUser} */
    const user = req.user;
    if (user.email == "chefrontceo@gmail.com") {
        return next();
    }
    else {
        return res.sendStatus(403);
    }
}

function view_customer_users_page(req, res) {
	return res.render('admin/retrieve_customerUsers');
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
    User.findOne({
        where: {
            "email" : req.params.email
        },
    }).then((user) => {
        if (user != null) {
            User.destroy({
                where: {
                    "email" : user.email
                }
            });
            User.destroy({
                where: {
                    "email" : req.params.email
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
	return res.render('admin/retrieve_businessUsers');
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

function delete_business_user(req, res) {
    User.findOne({
        where: {
            "name" : req.params.name
        },
    }).then((user) => {
        if (user != null) {
            User.destroy({
                where: {
                    "name" : user.name
                }
            });
            Outlets.destroy({
                where: {
                    "name" : req.params.name
                }
            });
            User.destroy({
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
    return res.render('admin/retrieve_allOutlets');
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
	return res.render('admin/retrieve_feedback');
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
    return res.render('admin/retrieve_allCategories');
};

function create_category_page(req, res) {
    return res.render('admin/create_category');
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
    Categories.findOne({
        where: {
            "name" : req.params.name
        }
    }).then((categories) => {
        res.render(`admin/update_category`,{categories:categories});
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