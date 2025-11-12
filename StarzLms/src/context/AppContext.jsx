import { createContext,useEffect,useState } from "react";
import { dummyCourses } from "../assets/assets";
import { data, useNavigate } from "react-router-dom";
import humanizationDuration from 'humanize-duration'
import {useAuth,useUser} from '@clerk/clerk-react'
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const {getToken}= useAuth();
  const {user} = useUser();

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userData, setUserData] = useState(null);

  const fetchAllCourses = async () => {
    try {
      const {data} = await axios.get(backendUrl + '/api/course/all')

      if(data.success){
        setAllCourses(data.courses)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  };

  //fetch user data

  const fetchUserData = async (res,req) => {

    if(user.publicMetadata.role === 'educator'){
      setIsEducator(true);
    }

        try {
          const token = await getToken();

          const {data}= await axios.get(backendUrl + '/api/user/data', {headers:{Authorization: `Bearer ${token}`}})
          if(data.success){
            setUserData(data.user)
          }else{
            toast.error(data.message)
          }
        } catch (error) {
           toast.error(error.message)
        }
  }

  // const calculateRating = (course) => {
  //   console.log(course.courseRatings);
  //  if(course.courseRatings.length === 0) return 0;
  //  let totalRating = 0;
  //  course.courseRatings.forEach((rating) => {
  //     totalRating += rating.rating;
  //   });
  //   return (totalRating / course.courseRatings.length);
  // }

  // const calculateRating = ({ courseRatings = [] }) =>
  //   courseRatings.length
  //     ? +(courseRatings.reduce((sum, { rating }) => sum + rating, 0) / courseRatings.length).toFixed(1)
  //     : 0;

  const calculateRating = (course) => {
    const ratings = course?.courseRatings ?? []; // default to []
    if (ratings.length === 0) return 0;
    
    const total = ratings.reduce((sum, r) => sum + (r?.rating ?? 0), 0);
    return Math.floor(total / ratings.length)
  };

  // calculate chapter time
  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.map((lecture)=> time += lecture.lectureDuration);
    return humanizationDuration(time * 60 * 1000, { units: ['h', 'm'] });
  }
  
  //function to calculate course duration

  const calculateCourseDuration = (course) => {
    let time = 0

    course.courseContent.map((chapter) => chapter.chapterContent.map((lecture) =>time+= lecture.lectureDuration ));
    return humanizationDuration(time * 60 * 1000, { units: ['h', 'm'] });
  }

  //function calculate the number of lectures in a course
  const calculateNoOfLectures = (course) => {
    let totalLectures = 0;
    course.courseContent.forEach((chapter) => {
      if(Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length;
      }
    });
    return totalLectures;
  }

  //fetch user enrolled courses
  const fetchEnrolledCourses = async () => {

    // Simulating fetching enrolled courses
try {
      const token = await getToken();
      const {data} = await axios.get(backendUrl + '/api/user/enrolled-courses', {headers:{Authorization: `Bearer ${token}`}})
  
      if(data.success){
        setEnrolledCourses(data.enrolledCourses.reverse());
      }else{
        toast.error(data.message);
      }
} catch (error) {
      toast.error(error.message);
}
  };


  useEffect(() => {
    fetchAllCourses();
  }, []);


  useEffect(()=>{
    if(user){
      fetchUserData();
    fetchEnrolledCourses();
    }
  }, [user]);

  const value = {
    currency,
    allCourses,
    navigate,
    calculateRating,
    isEducator,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    enrolledCourses,
    fetchEnrolledCourses,
    backendUrl, userData, setUserData, getToken, fetchAllCourses
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
