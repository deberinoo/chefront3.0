import ORM from 'sequelize'
const {Sequelize, DataTypes,Model} = ORM;

export class Outlets extends Model {
    static initialize(database){
        Outlets.init({
            "uuid" : { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4},
            "dateCreated" : { type: DataTypes.DATE(), allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')},
            "dataUpdated" : { type: DataTypes.DATE(), allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')},
            "name" : { type: DataTypes.STRING(64), allowNull: false},
            "location" : { type: DataTypes.STRING(64), allowNull: false},
            "address" : { type: DataTypes.STRING(64), allowNull: false},
            "postal_code" : { type: DataTypes.INTEGER(6), allowNull: false},
            "price" : { type: DataTypes.INTEGER(3), allowNull: false},
            "contact" : { type: DataTypes.INTEGER(8), allowNull: false},
            "description" : { type: DataTypes.STRING(300), allowNull: false},
            "thumbnail" : { type: DataTypes.CHAR(255), allowNull: false},
            "verified" : {type: DataTypes.BOOLEAN, allowNull:false, defaultValue: false}
        }, {
            "sequelize" : database,
            "modelName" : "Outlets",
            "hooks"     : {
                "afterUpdate" : Outlets._auto_update_timestamp
            }
        })
    }
    static _auto_update_timestamp(instance, options) {
        instance.dateUpdated = Sequelize.literal('CURRENT_TIMESTAMP');
    }

    get uuid()        { return String(this.getDataValue("uuid")); }
    get name()        { return String(this.getDataValue("name")); }
    get location()    { return String(this.getDataValue("location")); }
    get address()     { return String(this.getDataValue("address")); }
    get postal_code() { return String(this.getDataValue("postal_code")); }
    get price()       { return String(this.getDataValue("price")); }
    get contact()     { return String(this.getDataValue("contact")); }
    get description() { return String(this.getDataValue("description")); }
    get thumbnail()   { return String(this.getDataValue("thumbnail")); }
    get verified()    { return Boolean(this.getDataValue("verified")); }
    get dateCreated() { return new Date(this.getDataValue("dateCreated")); }
    get dateUpdated() { return new Date(this.getDataValue("dateUpdated")); }

    set uuid(uuid)               { this.setDataValue("uuid", uuid); }
    set name(name)               { this.setDataValue("name", name); }
    set location(location)       { this.setDataValue("location", location); }
    set address(address)         { this.setDataValue("address", address); }
    set postal_code(postal_code) { this.setDataValue("postal_code", postal_code); }
    set price(price)             { this.setDataValue("price", price); }
    set contact(contact)         { this.setDataValue("contact", contact); }
    set description(description) { this.setDataValue("description", description); }
    set thumbnail(thumbnail)     { this.setDataValue("thumbnail", thumbnail); }
    set verified(verified)       { this.setDataValue("verified", verified); }
}
