const { DataTypes } = require('sequelize')
const db = require('../db/conn') 

const Fornecedor = db.define('fornecedor',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nomeEmpresa: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    cnpj: {
        type: DataTypes.STRING(18), // Ex: XX.XXX.XXX/0001-XX
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    telefone: {
        type: DataTypes.STRING(20),
        allowNull: true
    }
},{
    timestamps: true,
    tableName: 'fornecedores'
})

module.exports = Fornecedor