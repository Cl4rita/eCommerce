const { DataTypes } = require('sequelize')
const db = require('../db/conn') 

const Produto = db.define('produto',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: true // Pode ser preenchida posteriormente
    },
    modelo: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    preco: {
        type: DataTypes.DECIMAL(10,2), // Preço de venda
        allowNull: false
    },
    imagem_url: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true // Por padrão, o produto está visível para venda
    }
},{
    timestamps: true,
    tableName: 'produtos'
})

module.exports = Produto