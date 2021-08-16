import ORM from 'sequelize'
const {Sequelize, DataTypes,Model} = ORM;

export class Feedback extends Model {
    static initialize(database){
        Feedback.init({
            "uuid" : { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4},
            "dateCreated" : { type: DataTypes.DATE(), allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')},
            "name" : { type: DataTypes.STRING(64), allowNull: false},
            "phone" : { type: DataTypes.INTEGER(8), allowNull: false},
            "email" : { type: DataTypes.STRING(128), allowNull: false},
            "message" : { type: DataTypes.STRING(2000), allowNull: false},
            "read" : {type: DataTypes.STRING(128), allowNull: false, defaultValue: "No"}                
        }, {
            "sequelize" : database,
            "modelName" : "Feedback",
            "hooks"     : {
                "afterUpdate" : Feedback._auto_update_timestamp
            }            
        })
    }
    get uuid()     { return String(this.getDataValue("uuid")); }
    get email()    { return String(this.getDataValue("email")); }
    get name()     { return String(this.getDataValue("name")); }
    get phone()    { return String(this.getDataValue("phone")); }
    get message()  { return String(this.getDataValue("message")); }
    get read()     { return Boolean(this.getDataValue("read")); }
    get dateCreated() { return new Date(this.getDataValue("dateCreated")); }
    get dateUpdated() { return new Date(this.getDataValue("dateUpdated")); }


    set uuid(uuid)        { this.setDataValue("uuid", uuid); }
    set name(name)        { this.setDataValue("name", name); }
    set phone(phone)      { this.setDataValue("phone", phone); }
    set email(email)      { this.setDataValue("email", email); }
    set message(message)  { this.setDataValue("message", message); }
    set read(read)        { this.setDataValue("read", read); }
}