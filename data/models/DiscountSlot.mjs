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

    get id() { return this.getDataValue("id"); }
    get business_name() { return this.getDataValue("business_name"); }
    get location() { return this.getDataValue("location"); }
    get time() { return this.getDataValue("time"); }
    get discount() { return this.getDataValue("discount"); }
    get expired() { return this.getDataValue("expired"); }
}
