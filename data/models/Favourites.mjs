import ORM from 'sequelize'
const {Sequelize, DataTypes,Model} = ORM;

export class Favourites extends Model {
    static initialize(database){
        Favourites.init({
            "uuid" : { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4},
            "dateCreated" : { type: DataTypes.DATE(), allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')},
            "dataUpdated" : { type: DataTypes.DATE(), allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')},
            "email" : { type: DataTypes.STRING(128), allowNull: false},
            "name" : { type: DataTypes.STRING(64), allowNull: false},
            "location" : { type: DataTypes.STRING(64), allowNull: false},
        }, {
            "sequelize" : database,
            "modelName" : "Favourites",
            "hooks"     : {
                "afterUpdate" : Favourites._auto_update_timestamp
            }
        })
    }
    static _auto_update_timestamp(instance, options) {
        instance.dateUpdated = Sequelize.literal('CURRENT_TIMESTAMP');
    }

    get uuid()           { return String(this.getDataValue("uuid")); }
    get name()           { return String(this.getDataValue("name")); }
    get location()       { return String(this.getDataValue("location")); }

    set uuid(uuid)                      { this.setDataValue("uuid", uuid); }
    set name(name)                      { this.setDataValue("name", name); }
    set location(location)              { this.setDataValue("location", location); }
}
