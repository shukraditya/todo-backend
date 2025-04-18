import jwt from 'jsonwebtoken'

function authMiddleware(req,res,next){
    const token = req.headers['authorization']?.replace('Bearer ','')
    // console.log(req.headers['authorization'])
    if(!token){
        res.status(401).json({
            message: 'No token provided'
        })
    }

    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err){
            return res.status(401).json({message:'Invalid Token'})
        }
        req.userId = decoded.id
        next()
    })
}


export default authMiddleware