const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const ProdutoFornecedor = db.define('produtoFornecedor',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idProduto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'produtos', 
            key: 'id'  
        }
    },
    idFornecedor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'fornecedores', 
            key: 'id'  
        }
    },
    custoUnitarioAtual: { // Informação extra: Custo atual do produto com este fornecedor
        type: DataTypes.DECIMAL(10,2), 
        allowNull: true // Pode ser preenchido posteriormente
    },
    codigoReferencia: { // Referência do produto no sistema do fornecedor
        type: DataTypes.STRING(50),
        allowNull: true
    }
},{
    // Garante que a relação entre um Produto e um Fornecedor é única
    indexes: [{
        unique: true,
        fields: ['idProduto', 'idFornecedor']
    }],
    timestamps: true,
    tableName: 'produtos_fornecedores'
})

module.exports = ProdutoFornecedor