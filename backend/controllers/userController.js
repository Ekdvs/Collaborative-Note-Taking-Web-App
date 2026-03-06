import User from "../models/user.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import generatedAccesToken from "../utill/generatedAccesToken.js";
import generateRefreshToken from "../utill/generatedRefreshToken.js";



//register user
export const registerUser =async(request,response)=>{
    try {

        //get user data from request body
        const {name,email,password} = request.body;
        if(!name || !email || !password){
            return response.status(400).json({
                message:'Please provide all required fields',
                error:true,
                success:false
            })
        }

        //check mail uniqueness
        const existingUser = await User.findOne({email});
        if(existingUser){
            return response.status(400).json({
                message:'Email already exists',
                error:true,
                success:false
            })
        }

        //password hashing
        const salt = await bcrypt.genSalt(16);
        const hashedPassword = await bcrypt.hash(password,salt);

        //save user to database
        const newUser = new User({
            name,
            email:email.toLowerCase(),
            password:hashedPassword
        })
        await newUser.save();

        //sending email verification token
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');
        newUser.email_verification_token = emailVerificationToken;
        await newUser.save();

        return response.status(201).json({
            message:'User registered successfully',
            error:false,
            success:true,
            data:{user:newUser}
        })
        
    } catch (error) {
        console.log(error.message)
        return response.status(500).json({
            message:'Internal sever error',
            error:true,
            success:false
    })
    }

}

//login user
export const loginUser = async(request,response)=>{
    try {
        const {email,password} = request.body;
        if(!email || !password){
            return response.status(400).json({
                message:'Please provide all required fields',
                error:true,
                success:false
            })
        }
        
        const user = await User.findOne({email:email.toLowerCase()});
        if(!user){
            return response.status(400).json({
                message:'Invalid email or password',
                error:true,
                success:false
            })
        }
        //check email verification
        /*if(!user.verify_email){
            return response.status(400).json({
                message:'Please verify your email before logging in',
                error:true,
                success:false
            });
        }*/
        const checkpassword = await bcrypt.compare(password,user.password);
        if(!checkpassword){
            return response.status(400).json({
                message:'Invalid email or password',
                error:true,
                success:false
            })
        }

        //update last login date
        user.last_login_date = new Date();
        await user.save();

        //create access token and refresh token
        const accessToken = await generatedAccesToken(user);
        const refreshToken = await generateRefreshToken(user);

        return response.status(200).json({
            message:'User logged in successfully',
            error:false,
            success:true,
            data:{
                accessToken,
                refreshToken,
                userInfo:user
            }
        })


    } catch (error) {
        console.log(error.message)
        return response.status(500).json({
            message:'Internal sever error',
            error:true,
            success:false
            
        })
    }
}