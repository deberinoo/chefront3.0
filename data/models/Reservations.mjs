import ORM from 'sequelize'
const {Sequelize, DataTypes,Model} = ORM;

export class Reservations extends Model {
    static initialize(database){
        Reservations.init({
            "uuid" : { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4},
            "dateCreated" : { type: DataTypes.DATE(), allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')},
            "dataUpdated" : { type: DataTypes.DATE(), allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')},
            "reservation_id" : { type: DataTypes.STRING(5), allowNull: false},// need to find a way to randomize this
            "name" : { type: DataTypes.STRING(64), allowNull: false},
            "location" : { type: DataTypes.STRING(64), allowNull: false},
            "user_name" : { type: DataTypes.STRING(64), allowNull: false},
            "user_email" : { type: DataTypes.STRING(64), allowNull: false},
            "user_contact" : { type: DataTypes.STRING(64), allowNull: false},
            "date" : { type: DataTypes.DATEONLY(), allowNull: false},
            "pax" : { type: DataTypes.INTEGER(1), allowNull: false},
            "time" : { type: DataTypes.STRING(6), allowNull: false},
            "discount" : { type: DataTypes.STRING(2), allowNull: false},
        }, {
            "sequelize" : database,
            "modelName" : "Reservations",
            "hooks"     : {
                "afterUpdate" : Reservations._auto_update_timestamp
            }
        })
    }
    static _auto_update_timestamp(instance, options) {
        instance.dateUpdated = Sequelize.literal('CURRENT_TIMESTAMP');
    }

    get uuid()           { return String(this.getDataValue("uuid")); }
    get reservation_id() { return String(this.getDataValue("reservation_id")); }
    get name()           { return String(this.getDataValue("name")); }
    get location()       { return String(this.getDataValue("location")); }
    get user_name()      { return String(this.getDataValue("user_name")); }
    get user_email()     { return String(this.getDataValue("user_email")); }
    get user_contact()   { return String(this.getDataValue("user_contact")); }
    get date()           { return String(this.getDataValue("date")); }
    get pax()            { return String(this.getDataValue("pax")); }
    get time()           { return String(this.getDataValue("time")); }
    get discount()       { return String(this.getDataValue("discount")); }
    get dateCreated()    { return new Date(this.getDataValue("dateCreated")); }
    get dateUpdated()    { return new Date(this.getDataValue("dateUpdated")); }

    set uuid(uuid)                      { this.setDataValue("uuid", uuid); }
    set reservation_id(reservation_id)  { this.setDataValue("reservation_id", reservation_id); }
    set name(name)                      { this.setDataValue("name", name); }
    set location(location)              { this.setDataValue("location", location); }
    set user_name(user_name)            { this.setDataValue("user_name", user_name); }
    set user_email(user_email)          { this.setDataValue("user_email", user_email); }
    set user_contact(user_contact)      { this.setDataValue("user_contact", user_contact); }
    set date(date)                      { this.setDataValue("date", date); }
    set pax(pax)                        { this.setDataValue("pax", pax); }
    set time(time)                      { this.setDataValue("time", time); }
    set discount(discount)              { this.setDataValue("discount", discount); }
}
