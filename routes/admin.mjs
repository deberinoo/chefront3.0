import { Router } from 'express';
const router = Router();
export default router;

//import { CustomerUser, UserRole } from '../models/Customer.mjs';
//import { BusinessUser, BusinessRole } from '../models/Business.mjs';

import ORM             from 'sequelize';
const { Sequelize, DataTypes, Model, Op } = ORM;

router.get("/customerUsers", async function(req, res) {
/*    const users_created = await CustomerUser.findAll({
        where: {
            "first_name": {
                [Op.ne]:"null"
            }
        }
    });
*/
	return res.render('admin/retrieve_customerUsers.html', {users_created: users_created});
})


router.get("/businessUsers", async function(req, res) {
/*    const business_created = await BusinessUser.findAll({
        where: {
            "business_name": {
                [Op.ne]:"null"
            }
        }
    });
*/
	return res.render('admin/retrieve_businessUsers.html', {business_created: business_created});
})