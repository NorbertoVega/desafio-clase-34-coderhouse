const ContenedorMongoDB = require('../contenedores/ContenedorMongoDB.js');
const ProductoModel = require('../contenedores/mongooseModels/ProductoModel.js');

class ProductosDaoMongoDB extends ContenedorMongoDB {

    constructor(isInitialized) {
        super(ProductoModel, isInitialized);
    }
}

module.exports = ProductosDaoMongoDB;