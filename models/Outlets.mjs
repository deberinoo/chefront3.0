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
        }, {
            "sequelize" : database,
            "modelName" : "Feedback"            
        })
    }
    
}
