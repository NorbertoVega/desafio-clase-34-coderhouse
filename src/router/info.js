const { Router } = require('express');
const parseArgs = require('minimist');
const os = require('os');
const config = require('../../config.js');
const logger = require('../logger/logger.js');

const router = Router();
const args = parseArgs(process.argv.slice(2));
const numCpus = config.MODO === 'FORK' ? 1 : os.cpus().length;

router.get('/info', (req, res) => {
    try {
        logger.info(`Ruta: ${req.protocol}://${req.get('host')}${req.url}, Method: ${req.method}`);
        const info = {
            argEntrada: args,
            pathEjec: process.argv[0],
            os: process.platform,
            processId: process.pid,
            nodeVersion: process.version,
            carpetaProy: process.argv[1],
            memoryUse: process.memoryUsage().rss,
            numCpus : numCpus
        }
        //console.log({info});
        res.send(info);
    }
    catch (error) {
        logger.error(`Error en /api/info: ${error}`);
    }
});

router.get('/infobloq', (req, res) => {
    try {
        logger.info(`Ruta: ${req.protocol}://${req.get('host')}${req.url}, Method: ${req.method}`);
        const info = {
            argEntrada: args,
            pathEjec: process.argv[0],
            os: process.platform,
            processId: process.pid,
            nodeVersion: process.version,
            carpetaProy: process.argv[1],
            memoryUse: process.memoryUsage().rss,
            numCpus : numCpus
        }
        console.log({info});
        res.send(info);
    }
    catch (error) {
        logger.error(`Error en /api/info: ${error}`);
    }
});

module.exports = router;