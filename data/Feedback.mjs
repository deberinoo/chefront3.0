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
            "read" : {type: DataTypes.BOOLEAN, allowNull:false, defaultValue: false}                
        }, {
            "sequelize" : database,
            "modelName" : "Feedback",
            "hooks"     : {
                "afterUpdate" : Feedback._auto_update_timestamp
            }            
        })
    }
    get dateCreated() { return this.getDataValue("dateCreated"); }
    get uuid() { return this.getDataValue("uuid"); }
    get email() { return this.getDataValue("email"); }
    get name() { return this.getDataValue("name"); }
    get phone() { return this.getDataValue("phone"); }
    get message() { return this.getDataValue("message"); }
    get read() { return this.getDataValue("read"); }

    set name(name) { return this.setDataValue("name", name); }
}