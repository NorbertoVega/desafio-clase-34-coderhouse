const mongoose = require("mongoose");

const productosCollection = "productos";

const productosSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail : { type: String, required: true }
});

const ProductoModel = mongoose.model(productosCollection, productosSchema);

module.exports = ProductoModel;