import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const auth =async (request,response,next)=>{
    try {

        //get token from header
        const token = (request.headers.authorization?.startsWith("Bearer ")
        ? request.headers.authorization.split(" ")[1]
        : null);

        //console.log("token",token)

        if(!token){
            return response.status(401).json({
                message:'Unauthorized, no token provided',
                error:true,
                success:false
            })
        }

        //verify token
        const decoded = jwt.verify(token,process.env.SECRET_KEY_ACCESS_TOKEN);

        //find user from decoded token
        const user = await User.findById(decoded.id).select("-password");

        if(!user){
            return response.status(401).json({
                message:'Unauthorized, user not found',
                error:true,
                success:false
            })
        }

        //attach user to request object
        request.user = user;
        request.userId = user._id;
        next();

    } catch (error) {
        console.log(error.message);
        return response.status(401).json({
            message:'Unauthorized, invalid token',
            error:true,
            success:false
        })
    }
}

export default auth;