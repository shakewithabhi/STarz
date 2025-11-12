import { clerkClient } from "@clerk/express";

 // Middleware to check if user is authenticated

 const protectEducator = async (req,res,next) => {
     try {
        const userId = req.auth.userId;
        const resonse = await clerkClient.users.getUser(userId);
        if(resonse.publicMetadata.role !== "educator"){
            return res.json({success:false, message:"Access denied. Educator role required."});
        } 

        next();
     } catch (error) {
        res.json({success:false, message:error.message});
     }
 }

 export default protectEducator;