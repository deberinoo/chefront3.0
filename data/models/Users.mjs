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
            "contact" : { type: DataTypes.INTEGER(16), allowNull: true},
            "password" : { type: DataTypes.STRING(64), allowNull: false},
            "skips" : { type: DataTypes.INTEGER(16), allowNull: true, defaultValue: 0},
            "deposited" : { type: DataTypes.STRING(128), allowNull: true, defaultValue: "No" },
            "banned" : {type: DataTypes.STRING(128), allowNull: true, defaultValue: "No"},
            "verified" : {type: DataTypes.STRING(128), allowNull: true, defaultValue: "No"},
            "document": {type: DataTypes.CHAR(255), allowNull: true},
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

    get uuid()           { return String(this.getDataValue("uuid")); }
    get name()           { return String(this.getDataValue("name")); }
    get email()          { return String(this.getDataValue("email")); }
    get contact()        { return String(this.getDataValue("contact")); }
    get password()       { return String(this.getDataValue("password")); }
    get role()           { return String(this.getDataValue("role")); }
    get dateCreated()    { return new Date(this.getDataValue("dateCreated")); }
    get dateUpdated()    { return new Date(this.getDataValue("dateUpdated")); }

    set uuid(uuid)       { this.setDataValue("uuid", uuid); }
    set name(name)       { this.setDataValue("nname", name); }
    set email(email)     { this.setDataValue("email", email); }
    set contact(contact) { this.setDataValue("contact", contact); }
    set role(role)       { this.setDataValue("role", role); }
}