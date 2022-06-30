const { Router } = require('express');
const getRandom = require('../utils/rand.js');
const config = require('../../config.js');
const logger = require('../logger/logger.js');

const router = Router();

router.get('/randoms', (req, res) => {
    try {
        logger.info(`Ruta: ${req.protocol}://${req.get('host')}${req.url}, Method: ${req.method}`);
        let cant = 100;
        if (req.query.cant)
            cant = Number(req.query.cant);

        res.send({ port: config.PORT, pid: process.pid, date: new Date().toLocaleString(), generatedRandoms: getRandom(cant) })
    }
    catch (err) {
        console.log('Error al calcular los números aleatorios:', err);
    }
});

module.exports = router;