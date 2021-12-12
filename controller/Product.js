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
        const type = req.body.type;
        const sale = req.body.sale;
        const description = req.body.description;
        const status = req.body.status;
        const categoryColor = req.body.categoryColor;

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
        
        const product = { nameProduct, category, type, image, sale, description, status, categoryColor };


        await ProductSchema.create(product).then((response) => {
            if (!response) {
                res.status(500).json({ status: 'error' })
            }
            else {
                res.status(201).json({ status: 'success', product })
            }
        })

    }
}

module.exports = new Product();