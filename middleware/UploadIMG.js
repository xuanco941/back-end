const multer = require('multer');

const storageimg = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});


const upload = multer({ storage: storageimg }).array('image');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})
// app.post('/', upload, async (req, res) => {
//     let url = [];
//     imgs = req.files;
//     for (const element of imgs) {
//         await cloudinary.uploader.upload('uploads/' + element.filename, function (error, result) { url.push(result.url); fs.unlinkSync('./uploads/' + element.filename) });
//     }
//     res.json(url);
// })