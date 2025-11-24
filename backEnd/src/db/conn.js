const { Sequelize } = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql'
    })

sequelize.authenticate()
.then(() => {
    console.log('Conexão realizada com sucesso!')
})
.catch((err) => {
    console.error('Erro ao conectar com banco de dados!', err)
})

module.exports = sequelize