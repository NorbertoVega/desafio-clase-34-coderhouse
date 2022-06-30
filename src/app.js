const express = require('express');
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const moment = require('moment');
const ProductosDaoMongoDB = require('./daos/ProductosDaoMongoDB.js');
const MensajesDaoMongoDB = require('./daos/MensajesDaoMongoDB');
const routerProductos = require('./router/productos.js');
const routerUsers = require('./router/usuarios.js');
const routerRandom = require('./router/randoms.js');
const routerInfo = require('./router/info.js');
const logger = require('./logger/logger.js');
const compression = require('compression');

const initializeServer = (PORT, modo) => {

    const app = express();
    const httpServer = new HttpServer(app);
    const io = new IOServer(httpServer);

    const contenedorMensajes = new MensajesDaoMongoDB(true);

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(compression());

    app.set('views', './views');
    app.set('view engine', 'ejs');

    app.use(express.static('./public'))

    const renderAllMessages = async () => {
        try {
            const messages = await contenedorMensajes.getAll();
            io.sockets.emit('render-all-messages', messages);
        }
        catch (error) {
            logger.error(`Websocket - Error al obtener todos los mensajes: ${error}`);
        }
    }

    io.on('connection', (socket) => {
        try {
            socket.on('add-new-product', async data => {
                logger.info(`Websocket: add-new-product`);
                const contenedorProductos = new ProductosDaoMongoDB(false);
                const id = await contenedorProductos.save(data).catch((error) => logger.error(`Websocket - Error al guardar producto: ${error}`));
                if (id !== null && id != undefined) {
                    const newProduct = await contenedorProductos.getById(id);
                    io.sockets.emit('render-new-product', JSON.parse(JSON.stringify(newProduct)));
                }
            });

            socket.on('user-logged-in', data => {
                logger.info(`Websocket: user-logged-in`);
                if (data)
                    renderAllMessages();
            })

            socket.on('add-new-message', data => {
                logger.info(`Websocket: add-new-message`);
                const now = moment();
                data = { ...data, time: now.format('D/MM/YYYY h:mm:ss') }
                contenedorMensajes.save(data)
                    .then(() => {
                        renderAllMessages();
                    })
                    .catch((error) => {
                        logger.error(`Websocket - Error al guardar mensaje: ${error}`);
                    });
            });
        }
        catch (error) {
            logger.error(`Websocket error: ${error}`);
        }
    });

    app.use('/api', routerProductos);
    app.use('/api', routerUsers);
    app.use('/api', routerRandom);
    app.use('/api', routerInfo);

    app.use((req, res) => {
        res.status(404);
        logger.warn(`Ruta: ${req.protocol}://${req.get('host')}${req.url}, Method: ${req.method}`);
        res.send({ error: 'El recurso solicitado no existe' });
    });

    if (modo === 'FORK') {
        httpServer.listen(PORT, () =>
            console.log(`Servidor corriendo en puerto ${PORT}`)
        );
    }
    else {
        httpServer.listen(PORT);
    }
}

module.exports = initializeServer;
