import { Router } from 'express';
import { flashMessage } from '../utils/flashmsg.mjs';
import { CustomerUser } from '../models/Customer.mjs';
import { BusinessUser } from '../models/Business.mjs';
import { User } from '../models/Users.mjs';
import { Feedback } from '../models/Feedback.mjs'

import ORM             from 'sequelize';
const { Sequelize, DataTypes, Model, Op } = ORM;

const router = Router();
export default router;

router.get("/customerUsers",                        view_customer_users_page);
router.get("/businessUsers",                        view_business_users_page);
router.get("/businessUsers",                        delete_business_user);
router.get("/deleteBusinessUser/:business_name",    delete_business_user);

router.get("/feedback",                 view_feedback_page);
router.get("/deleteFeedback/:uuid",     delete_feedback);


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

async function delete_business_user(req, res) {
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

async function delete_feedback(req, res) {
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

