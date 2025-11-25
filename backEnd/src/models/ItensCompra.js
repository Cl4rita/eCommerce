const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const ItensCompra = db.define('itensCompra',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idCompra: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'compras', 
            key: 'id'  
        }
    },
    idProduto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'produtos', 
            key: 'id'  
        }
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    custoUnitario: { // Preço que você pagou pelo produto (custo)
        type: DataTypes.DECIMAL(10,2), 
        allowNull: false
    }
},{
    indexes: [{
        unique: true,
        fields: ['idCompra', 'idProduto']
    }],
    timestamps: false, 
    tableName: 'itens_compras'
})

module.exports = ItensCompra