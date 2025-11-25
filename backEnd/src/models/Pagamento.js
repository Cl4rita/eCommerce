const { DataTypes } = require('sequelize')
const db = require('../db/conn') 

const Pagamento = db.define('pagamento',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idPedido: { // Chave para Pedido (Se for um RECEBIMENTO de cliente)
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'pedidos', 
            key: 'id'  
        }
    },
    idCompra: { // Chave para Compra (Se for um PAGAMENTO a fornecedor)
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'compras', 
            key: 'id'  
        }
    },
    dataPagamento: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    valor: {
        type: DataTypes.DECIMAL(10,2), 
        allowNull: false
    },
    metodo: {
        type: DataTypes.ENUM(
            'CARTAO_CREDITO', 
            'PIX', 
            'BOLETO',
            'TRANSFERENCIA',
            'DEBITO'
        ),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM(
            'PENDENTE', 
            'APROVADO', 
            'RECUSADO', 
            'ESTORNADO'
        ),
        allowNull: false,
        defaultValue: 'PENDENTE'
    }
},{
    timestamps: true,
    tableName: 'pagamentos'
})

module.exports = Pagamento