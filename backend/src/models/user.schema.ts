import mongoose from 'mongoose';
import { compareValue, hashValue }  from '../util/bcrypt.util.js';

export interface UserDocument extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    verified: boolean;
    contactNo: string;
    dob: Date;
    profile: {
        avatar: string;
        address: string;
        emergencyContact: string;
    };
    status: string;
    createdAt: Date;
    updatedAt: Date;

    comparePassword(val: string): Promise<boolean>;
    omitPassword(): Pick<
    UserDocument,
    "_id" | "email" | "verified" | "contactNo" | "dob" | "profile" | "status" | "createdAt" | "updatedAt"
    >
}

const userSchema = new mongoose.Schema<UserDocument>({
        name: { 
            type: String, 
            required: true, 
            unique: true 
        },
        email: { 
            type: String, 
            required: true
        },
        password: { 
            type: String, 
            required: true
        },
        verified: { 
            type: Boolean, 
            required: true, 
            default: false
        },
        contactNo: { 
            type: String, 
            required: true
        },
        dob: { 
            type: Date 
        },
        profile: {
            avatar: {
                 type: String 
                },
            address: { 
                type: String, 
                required: true
            },
            emergencyContact: { 
                type: String
            }
        }

    }, 
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next){
    if(!this.isModified("password")){
        return next();
    }

    this.password = await hashValue(this.password);
    return next();
});

userSchema.methods.comparePassword = async function (val: string){
    return compareValue(val, this.password);
};

userSchema.methods.omitPassword = function () {
    const user = this.toObject();
    delete user.password;
    return user;
}

const UserModel = mongoose.model<UserDocument>("User", userSchema);
export default UserModel;
