import ORM from 'sequelize'
const {Sequelize, DataTypes,Model} = ORM;

export class UserRole {
    static get Admin()    {return "admin"};
    static get Business() {return "business"};
    static get Customer() {return "customer"};
}

export class User extends Model {
    static initialize(database){
        User.init({
            "uuid" : { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4},
            "dateCreated" : { type: DataTypes.DATE(), allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')},
            "dataUpdated" : { type: DataTypes.DATE(), allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')},
            "name" : { type: DataTypes.STRING(64), allowNull: false},
            "email" : { type: DataTypes.STRING(128), allowNull: false},
            "contact" : { type: DataTypes.INTEGER(16), allowNull: false},
            "password" : { type: DataTypes.STRING(64), allowNull: false},
            "role" : { type: DataTypes.STRING(10), allowNull: false},
        }, {
            
            "sequelize" : database,
            "modelName" : "User",
            "hooks"     : {
                "afterUpdate" : User._auto_update_timestamp
            }
        })
    }
    static _auto_update_timestamp(instance, options) {
        instance.dateUpdated = Sequelize.literal('CURRENT_TIMESTAMP');
    }
}