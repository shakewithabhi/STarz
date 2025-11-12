import Course from "../models/course.js";

//get all courses
export const getAllCourses = async (req, res)=>{
    try {
        const courses = await Course.find({
            isPublished: true
        }).select(['-courseContent', '-enrolledStudents']).populate({path:'educator'}, );

        res.json({success:true, courses});
    } catch (error) {
        res.json({success:false, message:error.message});
    }
}

// set course by id 

export const getCourseById = async (req, res) => {
    const {id} = req.params;

    try {
        const courseData = await Course.findById(id).populate({path:'eductor'});
        

        //remove lectureurl if preview is false
        courseData.courseContent.forEach(chapter =>{
            chapter.chapterContent.forEach(lecture =>{
                if(!lecture.isPreview){
                    lecture.lectureUrl = "";
                }
            })
        })

        res.json({success:true, courseData});
    } catch (error) {
        res.json({success:false, message:error.message});
    }
}