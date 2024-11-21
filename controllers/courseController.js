const Course = require("../models/courseModel");
const getDataUri = require("../utils/DataUri");
const cloudinary = require("cloudinary")

const getAllCourses = async (req, res, next) => {
    let courses = await Course.find().select("-lectures");
    res.status(200).send({
        success: true,
        courses
    })
}


const addNewCourse = async (req, res, next) => {
    const { title, description, category, createdBy, poster } = req.body;
    try {

        const file = req.file;
        const fileUri = getDataUri(file);
        const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);

        await Course.create({
            title,
            description,
            category,
            createdBy,
            poster: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        })
        res.status(201).json({
            success: true,
            message: "Course has been created Successfully ",
        });
    } catch (err) {
        res.status(400).send({
            success: false,
            message: "Error"
        })
    }
}


const getCourseLectures = async (req, res, next) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404).send({
            success: false,
            message: "Course not Found"
        })
    }

    course.views += 1;

    await course.save()

    res.status(200).json({
        success: true,
        lectures: course.lectures
    })

}
const addCourseLectures = async (req, res, next) => {

    let { title, description } = req.body
    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404).send({
            success: false,
            message: "Course not Found"
        })
    }

    const file = req.file;
    const fileUri = getDataUri(file);
    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content,{
        resource_type:"video"
    });

    course.lectures.push({
        title,
        description,
        video: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }

    })
    course.numberOfVideos = course.lectures.length
    await course.save()

    res.status(200).json({
        success: true,
        message: "Lectures is Added"
    })

}


const deleteCourse = async (req, res, next) => {
    const {id} = req.params;
    try {
      const course=await Course.findById(id);

     if(!course){
        res.status(404).json({
            success: false,
            message: "Course not Found ",
        }); 
     }

   await cloudinary.v2.uploader.destroy(course.poster.public_id);

   for(let i=0;i<course.lectures.length;i++){
    const singleLecture=course.lectures[i];
    await cloudinary.v2.uploader.destroy(singleLecture.video.public_id,{
        resource_type:"video"
    });
 
   }

   await course.deleteOne()

        res.status(200).json({
            success: true,
            message: "Course has been deleted Successfully ",
        });
    } catch (err) {
        res.status(400).send({
            success: false,
            message: "Error"
        })
    }
}



const deleteCourseLecture = async (req, res, next) => {
    const {courseId,lectureId} = req.query;
    try {
      const course=await Course.findById(courseId);

     if(!course){
        res.status(404).json({
            success: false,
            message: "Course not Found ",
        }); 
     }

     const lecture=course.lectures.find(item=>{
        if(item._id.toString()===lectureId.toString()) return item
     })

   await cloudinary.v2.uploader.destroy(lecture.video.public_id,{
    resource_type:"video"
   });


 
   course.lectures=course.lectures.filter(item=>{
    if(item._id.toString()!==lectureId.toString()) return item
   })

   course.numberOfVideos = course.lectures.length

   await course.save()

        res.status(200).json({
            success: true,
            message: "lecture has been deleted Successfully ",
        });
    } catch (err) {
        res.status(400).send({
            success: false,
            message: "Error"
        })
    }
}
module.exports = { getAllCourses, addNewCourse, getCourseLectures, addCourseLectures,deleteCourse,deleteCourseLecture }