const Sequelize = require('sequelize');

module.exports = class Temp extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            image: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            kind: {
                type: Sequelize.ENUM("TOP", "BOTTOM", "OUTER", "OP"),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,
            modelName: 'Temp',
            tableName: 'temps',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db){
        db.Temp.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'id'});
    }
};