const jwt = require('jsonwebtoken');

const auth =(req,res,next) =>{
    const token = req.header('x-auth-token');
    if(!token){
        return res.status(401).json({msg:'No token,authorization denied'});
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        console.log('Decoded Token ',decoded)
        req.user = decoded.user;
        next();
    }catch (err){
        res.status(401).json({msg:'Token is not valid or expired'});
    }
};

module.exports = auth;