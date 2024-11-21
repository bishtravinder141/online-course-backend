const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv")
dotenv.config();
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter your name"]
    },

    email: {
        type: String,
        required: [true, "Please Enter your mail"],
        unique: true,
        validator: validator.isEmail
    },

    password: {
        type: String,
        required: [true, "Please Enter your Password"],
        minLength: [6, "password must be at least 6 Characters"],
        select: false
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },

    subscription: {
        id: String,
        status: String
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        }
    },
    playList: [{
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        },
        poster: String
    }],

    createdAt: {
        type: Date,
        default: Date.now
    },
    ResetPasswordToken: String,
    ResetPasswordToken: String
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const hashPassword = await bcrypt.hash(this.password, 10);
    this.password = hashPassword;
})

// compare password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.getJWTToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "15d"
    })
}

module.exports = mongoose.model("User", userSchema)