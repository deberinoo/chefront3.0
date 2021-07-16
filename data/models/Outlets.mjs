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

    get role() { return this.getDataValue("role"); }
    get uuid() { return this.getDataValue("uuid"); }
    get email() { return this.getDataValue("email"); }
    get name() { return this.getDataValue("name"); }

    set name(name) { return this.setDataValue("name", name); }
}
