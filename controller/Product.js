const ProductSchema = require('../model/ProductSchema');
const multer = require('multer');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  })



const storageimg = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

class Product {

    upload = multer({ storage: storageimg }).any();

    async postProduct(req, res) {
        const nameProduct = req.body.nameProduct;
        const category = req.body.category;
        const type = {
            size: req.body.size,
            amount: req.body.amount
        };
        const sale = req.body.sale;
        const description = req.body.description;
        const status = req.body.status;
        const color = req.body.color;
        const price = req.body.price;

        let links = [];
        for (const element of req.files) {
            await cloudinary.uploader.upload('uploads/' + element.filename,
            function (error, result) {
                 links.push(result.url); fs.unlinkSync('./uploads/' + element.filename) 
                });
        }
        const image = [];
        const sizeIMG = 'h_500,w_500';
        for (const elm of links){
            image.push(elm.replace('upload/','upload/'+sizeIMG+'/'));
        }
        
        const product = { nameProduct, price ,category, type, image, sale, description, status, color };


        await ProductSchema.create(product).then((response) => {
            if (!response) {
                res.status(500).json({ status: 'error' })
            }
            else {
                res.status(201).json({ status: 'success', product })
            }
        })

    }

    async getAllProduct(req, res){
        ProductSchema.find({}).then(product => {
            product ? res.status(200).json(product) : res.status(404).json('error');
        })
    }
}

module.exports = new Product();