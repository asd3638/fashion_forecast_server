const Sequelize = require('sequelize');

module.exports = class Look extends Sequelize.Model{
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
            modelName: 'Look',
            tableName: 'looks',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db){
        db.Look.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'id'});
    }
};