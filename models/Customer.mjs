import ORM from 'sequelize'
const {Sequelize, DataTypes, Model} = ORM;

export class UserRole{
    static get Admin() {return "admin"}
    static get User() {return "customer"}
}

export class CustomerUser extends Model {
    static initialize(database){
        CustomerUser.init({
            "uuid" : { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4},
            "dateCreated" : { type: DataTypes.DATE(), allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')},
            "dataUpdated" : { type: DataTypes.DATE(), allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')},
            "first_name" : { type: DataTypes.STRING(64), allowNull: false},
            "last_name" : { type: DataTypes.STRING(64), allowNull: false},
            "contact" : { type: DataTypes.INTEGER(16), allowNull: false},
            "email" : { type: DataTypes.STRING(128), allowNull: false},
            "password" : { type: DataTypes.STRING(64), allowNull: false},
            "role" : { type: DataTypes.ENUM(UserRole.User, UserRole.Admin), defaultValue: UserRole.User, allowNull: false},
            "verified" : {type: DataTypes.BOOLEAN, allowNull:false, defaultValue: false}
        }, {
            "sequelize" : database,
            "modelName" : "CustomerUser",
            "hooks"     : {
                "afterUpdate" : CustomerUser._auto_update_timestamp
            }
        })
    }
    static _auto_update_timestamp(instance, options) {
        instance.dateUpdated = Sequelize.literal('CURRENT_TIMESTAMP');
    }

    get first_name() { return this.getDataValue("first_name"); }
    get last_name() { return this.getDataValue("last_name"); }
    get contact() { return this.getDataValue("contact"); }
    get password() { return this.getDataValue("password"); }
    get dateCreated() { return this.getDataValue("dateCreated"); }
    get dateUpdated() { return this.getDataValue("dateUpdated"); }

    set first_name(first_name) { return this.setDataValue("first_name", first_name); }
    set last_name(last_name) { return this.setDataValue("last_name", last_name); }
    set contact(contact) { return this.setDataValue("contact", contact); }
    set password(password) { return this.setDataValue("password", password); }
    set dateCreated(dateCreated) { return this.setDataValue("dateCreated",dateCreated); }
    set dateUpdated(dateUpdated) { return this.setDataValue("dateUpdated",dateUpdated); }
}
