const ProductSchema = require('../model/ProductSchema');
const multer = require('multer');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'dh3sptfo2',
    api_key: '293775476763951',
    api_secret: '2VGrf9jRppUf6J7gdRKuG1rqRZc'
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

        const imgs = req.files
        let links = [];
        for (const element of imgs) {
            await cloudinary.uploader.upload('uploads/' + element.filename, function (error, result) { links.push(result.url); fs.unlinkSync('./uploads/' + element.filename) });
        }
        const image = [];
        const sizeIMG = 'h_500,w_500';
        for (const elm of links){
            await image.push(elm.replace('upload/','upload/'+sizeIMG+'/'));
        }
        
        const product = { nameProduct, category, type, image : links, sale, description, status, categoryColor };


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