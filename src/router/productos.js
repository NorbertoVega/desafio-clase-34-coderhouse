const { Router } = require('express');
const ProductosDaoMongoDB = require('../daos/ProductosDaoMongoDB.js');
const generateProduct = require('../utils/product.utils.js');
const logger = require('../logger/logger.js');

const router = Router();

router.get('/tableProd', async (req, res) => {
    try {
        logger.info(`Ruta: ${req.protocol}://${req.get('host')}${req.url}, Method: ${req.method}`);
        const contenedorProductos = new ProductosDaoMongoDB(false);
        const allProducts = await contenedorProductos.getAll();
        res.render('table', { productList: allProducts, emptyList: allProducts.length === 0, faker: false });
    }
    catch (error) {
        logger.error(`Error al intentar renderizar tabla de productos: ${error}`);
    }
});

router.get('/productos-test', (req, res) => {
    try {
        logger.info(`Ruta: ${req.protocol}://${req.get('host')}${req.url}, Method: ${req.method}`);
        const fakerProducts = generateProduct();
        res.render('table', { productList: fakerProducts, emptyList: fakerProducts.length === 0, faker: true});
    }
    catch (error) {
        logger.error(`Error al intentar renderizar tabla de productos mock: ${error}`);
    }
});

module.exports = router;