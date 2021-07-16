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
            "res_date" : { type: DataTypes.DATEONLY(), allowNull: false},
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

    get reservation_id() { return this.getDataValue("reservation_id"); }
    get outlet_name() { return this.getDataValue("outlet_name"); }
    get location() { return this.getDataValue("location"); }
    get user_name() { return this.getDataValue("user_name"); }
    get user_email() { return this.getDataValue("user_email"); }
    get user_contact() { return this.getDataValue("user_contact"); }
    get date() { return this.getDataValue("date"); }
    get pax() { return this.getDataValue("pax"); }
    get time() { return this.getDataValue("time"); }
    get discount() { return this.getDataValue("discount"); }
    
}
