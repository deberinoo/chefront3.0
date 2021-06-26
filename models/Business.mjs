import ORM from 'sequelize'
const {Sequelize, DataTypes,Model} = ORM;

export class BusinessRole {
    static get User() {return "business"}
}

export class BusinessUser extends Model {
    static initialize(database){
        BusinessUser.init({
            "uuid" : { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4},
            "dateCreated" : { type: DataTypes.DATE(), allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')},
            "dataUpdated" : { type: DataTypes.DATE(), allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')},
            "business_name" : { type: DataTypes.STRING(64), allowNull: false},
            "address" : { type: DataTypes.STRING(64), allowNull: false},
            "contact" : { type: DataTypes.INTEGER(16), allowNull: false},
            "email" : { type: DataTypes.STRING(128), allowNull: false},
            "password" : { type: DataTypes.STRING(64), allowNull: false},
            "role" : { type: DataTypes.ENUM(BusinessRole.User), defaultValue: "business", allowNull: false},
            "verified" : {type: DataTypes.BOOLEAN, allowNull:false, defaultValue: false}
        }, {
            "sequelize" : database,
            "modelName" : "BusinessUser",
            "hooks"     : {
                "afterUpdate" : BusinessUser._auto_update_timestamp
            }
        })
    }
    static _auto_update_timestamp(instance, options) {
        instance.dateUpdated = Sequelize.literal('CURRENT_TIMESTAMP');
    }

    get role() { return this.getDataValue("role"); }
    get uuid() { return this.getDataValue("uuid"); }
    get email() { return this.getDataValue("email"); }
}
