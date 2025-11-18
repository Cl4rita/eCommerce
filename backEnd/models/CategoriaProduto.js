const { DataTypes } = require('sequelize')
const db = require('../db/conn') 

const CategoriaProduto = db.define('categoriaProduto',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING(80),
        allowNull: false,
        unique: true
    },
    descricao: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    is_ativo: { // Para desativar categorias sem deletar
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
},{
    timestamps: true,
    tableName: 'categorias_produtos'
})

module.exports = CategoriaProduto