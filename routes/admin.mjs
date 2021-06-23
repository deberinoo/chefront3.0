import { Router } from 'express';
import { CustomerUser } from '../models/Customer.mjs';
import { BusinessUser } from '../models/Business.mjs';
import { Feedback } from '../models/Feedback.mjs'

import ORM             from 'sequelize';
const { Sequelize, DataTypes, Model, Op } = ORM;

const router = Router();
export default router;

router.get("/customerUsers",     view_customer_users_page);
router.get("/businessUsers",     view_business_users_page);
router.get("/feedback",          view_feedback_page)

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