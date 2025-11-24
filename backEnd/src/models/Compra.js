const { DataTypes } = require('sequelize')
const db = require('../db/conn') 

const Compra = db.define('compra',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    referenciaFornecedor: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    dataCompra: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    // Tipo de NFE (Nota Fiscal de Entrada) ou documento de aquisição
    numeroDocumento: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true
    },
    valorTotal: {
        type: DataTypes.DECIMAL(10,2), 
        allowNull: false,
        defaultValue: 0.00
    },
    statusCompra: {
        type: DataTypes.ENUM(
            'AGUARDANDO_NOTA',
            'RECEBIDA_PARCIAL', 
            'RECEBIDA_TOTAL', 
            'CANCELADA'
        ),
        allowNull: false,
        defaultValue: 'AGUARDANDO_NOTA'
    }
},{
    timestamps: true,
    tableName: 'compras'
})

module.exports = Compra