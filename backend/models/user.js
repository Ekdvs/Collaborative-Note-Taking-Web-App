import mongoose  from "mongoose";

const userSchema =  new mongoose.Schema(
    {
        name:{
            type:String,
            required:[  true,"Please provide a name for this user"],
            trim:true,
            maxlength:[50,"Name should be less than 50 characters"]
        },
        email:{
            type:String,
            required:[true,"Please provide an email for this user"],
            unique:true,
            trim:true,
            lowercase:true,
            match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Please provide a valid email address"]
        },
        password:{
            type:String,
            required:[true,"Please provide a password for this user"],
            minlength:[6,"Password should be at least 6 characters long"]
        },
        avatar:{
            type:String,
            default:"https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
        },
        mobile:{
            type:String,
            trim:true,
        },
        refresh_token:{
            type:String,
            default:''
        },
        verify_email:{
            type:Boolean,
            default:false,
        },
        email_verification_token:{
            type:String,
            default:''
        },
        last_login_date:{
            type:Date,
            default:''
        },

    },
    {
        timestamps:true
    }
)
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.email_verification_token;  
  return obj;
};
const User = mongoose.model("User",userSchema);

export default User;