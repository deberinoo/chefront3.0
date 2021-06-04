const router = Router();
export default router;

import { Router } from 'express';
import { CustomerUser, UserRole } from '../models/Customer.mjs';
import { BusinessUser, BusinessRole } from '../models/Business.mjs';

import ORM             from 'sequelize';
const { Sequelize, DataTypes, Model, Op } = ORM;

router.get("/customerUsers", async function(req, res) {
    const user = await CustomerUser.findAll({
        where: {
            "first_name": {
                [Op.ne]:"null"
            }
        }
    });

	return res.render('admin/retrieve_customerUsers', {user: user});
})


router.get("/businessUsers", async function(req, res) {
    const business = await BusinessUser.findAll({
        where: {
            "business_name": {
                [Op.ne]:"null"
            }
        }
    });

	return res.render('admin/retrieve_businessUsers', {business: business});
})