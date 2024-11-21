const User = require("../models/userModel");
const Course = require("../models/courseModel");

const sendToken = require("../utils/SendToken");

const userRegister = async (req, res, next) => {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) {
        res.status(409).send({
            success: false,
            message: "User Already Exists",
        });
    }

    user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "tempId",
            url: "tempurl",
        },
    });

    res.status(201).send({
        success: true,
        data: user._id,
        message: "User has been Registered",
    });

}

const userLogin = async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");;

    if (!user) {
        res.status(404).send({
            success: false,
            message: "Email and Password is Incorrect"
        });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        res.status(400).send({
            success: false,
            message: "Incorrect Email and Password",
        });
    }

    sendToken(res, user, "You are loggedIn Succesfully", 201);

}

const logout = async (req, res, next) => {
    res.status(200).cookie("token", null, {
        expires: new Date(Date.now())
    }).json({
        success: true,
        message: "Logged out succesfully"
    })

}

const getMyProfile = async (req, res, next) => {
    const user = await User.findById(req.user._id);
    res.status(200).json({
        success: true,
        user
    })

}

const changePassword = async (req, res, next) => {
    const { oldPassword, newPassword } = req.body
    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch) {
        res.status(400).send({
            success: false,
            message: "Incorrect old Password",
        });
    }
    user.password = newPassword;

    await user.save();

    res.status(200).json({
        success: true,
        message: "password has been Changed"
    })

}

const updateProfile = async (req, res, next) => {
    const { name, email } = req.body
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (email) user.email = email

    await user.save();

    res.status(201).json({
        success: true,
        message: "Profile Updated Succesfully"
    })

}


const addToplayList = async (req, res, next) => {

    const user = await User.findById(req.user._id);

    const course = await Course.findById(req.body.id);

    if (!course) {
        res.status(404).json({
            success: false,
            message: "Invalid Course Id"
        })
    }

    const itemExist = user.playList.find((it) => { if(it.course.toString() === course._id.toString()) return true })
    if (itemExist) {
        res.status(409).json({
            success: true,
            message: "Item already Exists"
        })
    }

    user.playList.push({
        course: course._id,
        poster: course.poster.url
    })

    await user.save();

    res.status(200).json({
        success: true,
        message: "Succesfully Added to playlist"
    })

}

const deletePlayList = async (req, res, next) => {

    const user = await User.findById(req.user._id);

    const course = await Course.findById(req.query.id);

    if (!course) {
        res.status(404).json({
            success: false,
            message: "Invalid Course Id"
        })
    }

    const newPlayList = user.playList.filter(item => item.course.toString() !== course._id.toString());
    user.playList = newPlayList

    await user.save()
    res.status(200).json({
        success: true,
        message: "Remove From PlayList"
    })

}
module.exports = { userRegister, userLogin, logout, getMyProfile, changePassword, updateProfile, addToplayList, deletePlayList }