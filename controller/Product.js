const ProductSchema = require('../model/ProductSchema');

class Product {

    async postProduct(req, res) {
        const nameProduct = req.body.nameProduct;
        const category = req.body.category;
        const type = req.body.type;
        const image = req.files;
        const sale = req.body.sale;
        const description = req.body.description;
        const status = req.body.status;
        const categoryColor = req.body.categoryColor;

        const product = { nameProduct, category, type, image, sale, description, status, categoryColor };
        console.log(image);


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