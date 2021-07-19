import ORM from 'sequelize'
const {Sequelize, DataTypes,Model} = ORM;

export class DiscountSlot extends Model {
    static initialize(database){
        DiscountSlot.init({
            "uuid" : { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4},
            "dateCreated" : { type: DataTypes.DATE(), allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')},
            "dataUpdated" : { type: DataTypes.DATE(), allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')},
            "name" : { type: DataTypes.STRING(64), allowNull: false},
            "location" : { type: DataTypes.STRING(64), allowNull: false},
            "time" : { type: DataTypes.STRING(64), allowNull: false},
            "discount" : { type: DataTypes.STRING(64), allowNull: false},
            "expired" : {type: DataTypes.BOOLEAN, allowNull:false, defaultValue: false}
        }, {
            "sequelize" : database,
            "modelName" : "DiscountSlot",
            "hooks"     : {
                "afterUpdate" : DiscountSlot._auto_update_timestamp
            }
        })
    }
    static _auto_update_timestamp(instance, options) {
        instance.dateUpdated = Sequelize.literal('CURRENT_TIMESTAMP');
    }

    get uuid()      { return String(this.getDataValue("uuid")); }
    get name()      { return String(this.getDataValue("name")); }
    get location()  { return String(this.getDataValue("location")); }
    get time()      { return String(this.getDataValue("time")); }
    get discount()  { return String(this.getDataValue("discount")); }
    get expired()   { return String(this.getDataValue("expired")); }
    get dateCreated() { return new Date(this.getDataValue("dateCreated")); }
    get dateUpdated() { return new Date(this.getDataValue("dateUpdated")); }

    set uuid(uuid)         { this.setDataValue("uuid", uuid); }
    set name(name)         { this.setDataValue("name", name); }
    set location(location) { this.setDataValue("location", location); }
    set time(time)         { this.setDataValue("time", time); }
    set discount(discount) { this.setDataValue("discount", discount); }
    set expired(expired)   { this.setDataValue("expired", expired); }
}
