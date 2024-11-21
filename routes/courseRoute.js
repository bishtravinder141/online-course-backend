const express = require("express");
const {
    getAllCourses,
    addNewCourse,
    getCourseLectures,
    addCourseLectures,
    deleteCourse,
    deleteCourseLecture
} = require("../controllers/courseController");
const singleUpload = require("../middleware/multer");
const { isAuthenticated, authorizeAdmin } = require("../middleware/auth");
const router = express.Router();

router.get("/course",isAuthenticated, getAllCourses);
router.post("/create-course",isAuthenticated,authorizeAdmin,singleUpload, addNewCourse);
router.get("/course-lectures/:id",isAuthenticated,authorizeAdmin,singleUpload, getCourseLectures);
router.post("/add-course-lectures/:id",isAuthenticated,authorizeAdmin,singleUpload, addCourseLectures);
router.delete("/delete-course/:id",isAuthenticated,authorizeAdmin,deleteCourse);
router.delete("/delete-course-lecture",isAuthenticated,authorizeAdmin,deleteCourseLecture);





module.exports = router