import 'dotenv/config'
import app from './app.js'

BigInt.prototype.toJSON = function () {
    return this.toString();
};

const PORT = process.env.API_PORT || 3001
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})