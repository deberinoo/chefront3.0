import { Router }       from 'express';
import { flashMessage } from '../utils/flashmsg.mjs';

import { User }         from '../data/models/Users.mjs';
import { Outlets }      from '../data/models/Outlets.mjs';
import { Feedback }     from '../data/models/Feedback.mjs'


import { sendMailBannedAccount,sendMailFeedbackResponse} from '../data/mail.mjs';


import ORM              from 'sequelize';
const { Op } = ORM;

const router = Router();
export default router;

router.use(ensure_auth)
router.use(ensure_admin)

//Admin login

// User management routes
router.get("/businessUsers",                        view_business_users_page);
router.get("/deleteBusinessUser/:business_name",    delete_business_user);

router.get("/customerUsers",                        view_customer_users_page);
router.get("/deleteCustomerUser/:email",            delete_customer_user);

// Outlet management routes
router.get("/allOutlets",                           view_outlets_page);
router.get("/deleteOutlet/:postal_code",            delete_outlet);

// Feedback management routes
router.get("/feedback",                             view_feedback_page);
router.get("/reply_feedback/:message",              reply_feedback_page);
router.post("/reply_feedback/:email",               reply_feedback_process);
router.get("/deleteFeedback/:uuid",                 delete_feedback);

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

async function view_customer_users_page(req, res) {
    const user = await CustomerUser.findAll({
        where: {
            "first_name": {
                [Op.ne]:"null"
            }
        }
    });
	return res.render('admin/retrieve_customerUsers', {user: user});
};

function delete_customer_user(req, res) {
    CustomerUser.findOne({
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
            CustomerUser.destroy({
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

async function view_business_users_page(req, res) {
    const business = await BusinessUser.findAll({
        where: {
            "business_name": {
                [Op.ne]:"null"
            }
        }
    });
	return res.render('admin/retrieve_businessUsers', {business: business});
};

function delete_business_user(req, res) {
    BusinessUser.findOne({
        where: {
            "business_name" : req.params.business_name
        },
    }).then((user) => {
        if (user != null) {
            User.destroy({
                where: {
                    "email" : user.email
                }
            });
            BusinessUser.destroy({
                where: {
                    "business_name" : req.params.business_name
                }
            }).then(() => {
                res.redirect('/admin/businessUsers');
            }).catch( err => console.log(err));
        } else {
	    res.redirect('/404');
    }
    });
};

async function view_outlets_page(req, res) {
    const outlet = await Outlets.findAll({
        where: {
            "business_name": {
                [Op.ne]:"null"
            }
        }
    });
	return res.render('admin/retrieve_allOutlets', {outlet: outlet});
};

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

async function view_feedback_page(req, res) {
    const feedback = await Feedback.findAll({
        where: {
            "name": {
                [Op.ne]:"null"
            }
        }
    });
	return res.render('admin/retrieve_feedback', {feedback : feedback});
};


function reply_feedback_page(req, res) {
    return res.render('admin/reply_feedback', { message : req.params.message});
};


function reply_feedback_process(req, res) {
    let email = req.params.email
    let reply = req.body.Reply
    Feedback.update({
       read : true
    }, {
        where: {
            email: email
        }
    })
    sendMailFeedbackResponse(email,reply)
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


