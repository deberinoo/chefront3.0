import ORM from 'sequelize'
const {Sequelize, DataTypes,Model} = ORM;

export class Categories extends Model {
    static initialize(database){
        Categories.init({
            "uuid" : { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4},
            "dateCreated" : { type: DataTypes.DATE(), allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')},
            "dataUpdated" : { type: DataTypes.DATE(), allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')},
            "name" : { type: DataTypes.STRING(64), allowNull: false},
            "description" : { type: DataTypes.STRING(300), allowNull: false},
            "thumbnail" : { type: DataTypes.CHAR(255), allowNull: false}
        }, {
            "sequelize" : database,
            "modelName" : "Categories",
            "hooks"     : {
                "afterUpdate" : Categories._auto_update_timestamp
            }
        })
    }
    static _auto_update_timestamp(instance, options) {
        instance.dateUpdated = Sequelize.literal('CURRENT_TIMESTAMP');
    }

    get name()        { return String(this.getDataValue("name")); }
    get description() { return String(this.getDataValue("description")); }
    get thumbnail()   { return String(this.getDataValue("thumbnail")); }
    get dateCreated() { return new Date(this.getDataValue("dateCreated")); }
    get dateUpdated() { return new Date(this.getDataValue("dateUpdated")); }

    set name(name)               { this.setDataValue("name", name); }
    set description(description) { this.setDataValue("description", description); }
    set thumbnail(thumbnail)     { this.setDataValue("thumbnail", thumbnail); }
}
