const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({

    title: {
        type: String,
        require: [true, "Please Enter course Title"],
        minLength: [4, "Title must be at least 4 characters"],
        maxLength: [80, "Title can't exceed 80 characters"]
    },
    description: {
        type: String,
        require: [true, "Please Enter course Description"],
        minLength: [20, "Description must be at least 20 characters"],
    },

    lectures: [
        {
            title: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            video: {
                public_id: {
                    type: String,
                    required: true,
                },
                url: {
                    type: String,
                    required: true,
                }
            },
        }
    ],
    poster: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    views: {
        type: Number,
        default: 0,
    },
    numberOfVideos: {
        type: Number,
        default: 0,
    },
    category: {
        type: String,
        required: true,
    },
    createdBy: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },



})

module.exports = mongoose.model("Course", courseSchema)