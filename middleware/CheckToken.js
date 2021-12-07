

const CheckToken = (req,res,next) => {
    if(!req.headers.authorization) res.status(404).json({status: 'error', message: 'Request không có Access Token'});
    const token = req.headers.authorization;
    

}

module.exports = CheckToken