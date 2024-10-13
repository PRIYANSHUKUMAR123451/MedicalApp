

// import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
// import { User } from "../models/userSchema.js"; // Import the User model
// import ErrorHandler from "../middlewares/errorMiddleware.js"; // Corrected import path for ErrorHandler
// import { generateToken } from "../utils/jwtToken.js";

// // Patient registration
// export const patientRegister = catchAsyncErrors(async (req, res, next) => {
//     const {
//         firstName,
//         lastName,
//         email,
//         phone,
//         password,
//         gender,
//         dob,
//         nic,
//         role,
//     } = req.body;

//     // Validate required fields
//     if (
//         !firstName ||
//         !lastName ||
//         !email ||
//         !phone ||
//         !password ||
//         !gender ||
//         !dob ||
//         !nic ||
//         !role
//     ) {
//         return next(new ErrorHandler("Please fill the full form!", 400));
//     }

//     // Check for duplicate user
//     let user = await User.findOne({ email }); // Make sure User model is defined
//     if (user) {
//         return next(new ErrorHandler("User Already Registered!", 400));
//     }

//     // Create new user
//     user = await User.create({
//         firstName,
//         lastName,
//         email,
//         phone,
//         password,
//         gender,
//         dob,
//         nic,
//         role,
//     });

 
//     // res.status(200).json({
//     //     success: true,
//     //     message: "User Registered!",
//     // });
   
// });

// // User login
// export const login = catchAsyncErrors(async (req, res, next) => {
//     const { email, password, confirmPassword, role } = req.body;

//     // Validate required fields
//     if (!email || !password || !confirmPassword || !role) {
//         return next(new ErrorHandler("Please provide all details", 400));
//     }

//     // Check if passwords match
//     if (password !== confirmPassword) {
//         return next(new ErrorHandler("Password and Confirm Password do not match", 400));
//     }

//     // Check if user exists
//     const user = await User.findOne({ email }).select("+password");
//     if (!user) {
//         return next(new ErrorHandler("Invalid password or email", 400));
//     }

//     // Check if password matches
//     const isPasswordMatched = await user.comparePassword(password);
//     if (!isPasswordMatched) {
//         return next(new ErrorHandler("Invalid password or email", 400));
//     }

//     // Check if role matches
//     if (role !== user.role) {
//         return next(new ErrorHandler("User with this role not found!", 400));
//     }

//     // Successful login
//     // res.status(200).json({
//     //     success: true,
//     //     message: "User Logged In Successfully!",
//     // });
//     generateToken(user,"user Logged in Registered!",200,res);
// });






import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js"; // Import the User model
import ErrorHandler from "../middlewares/errorMiddleware.js"; // Corrected import path for ErrorHandler
import { generateToken } from "../utils/jwtToken.js" // Import generateToken utility
import cloudinary from "cloudinary";
// Patient registration
export const patientRegister = catchAsyncErrors(async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        role,
    } = req.body;

    // Validate required fields
    if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !password ||
        !gender ||
        !dob ||
        !nic ||
        !role
    ) {
        return next(new ErrorHandler("Please fill the full form!", 400));
    }

    // Check for duplicate user
    let user = await User.findOne({ email }); // Make sure User model is defined
    if (user) {
        return next(new ErrorHandler("User Already Registered!", 400));
    }

    // Create new user
    user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        role,
    });

    // Generate token and send response
    generateToken(user, "User Registered Successfully!", 201, res);
});

// User login
export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password, confirmPassword, role } = req.body;

    // Validate required fields
    if (!email || !password || !confirmPassword || !role) {
        return next(new ErrorHandler("Please provide all details", 400));
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        return next(new ErrorHandler("Password and Confirm Password do not match", 400));
    }

    // Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid password or email", 400));
    }

    // Check if password matches
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid password or email", 400));
    }

    // Check if role matches
    if (role !== user.role) {
        return next(new ErrorHandler("User with this role not found!", 400));
    }

    // Successful login - Generate token and send response
    generateToken(user, "User Logged In Successfully!", 200, res);
});
 

export const addNewAdmin = catchAsyncErrors(async (req, res, next) =>  {
        const{    
            firstName,
            lastName,
            email,
            phone,
            password,
            gender,
            dob,
            nic
          
        }=req.body;
        if (
            !firstName ||
            !lastName ||
            !email ||
            !phone ||
            !password ||
            !gender ||
            !dob ||
            !nic 
           
            ) {
            return next(new ErrorHandler("Please fill the full form!", 400));
        }
        const isRegistered = await User.findOne({email});
        if(isRegistered){
          return next(new ErrorHandler(`${isRegistered.role} with this email already exist!`));
        }
        const admin=await User.create({firstName, lastName, email,phone, password, gender,  dob, nic, role:"Admin",});
        res.status(200).json({
            success:true,
            message:"New Admin Registered!",
        });
});
//doctor
export const getAllDoctors=catchAsyncErrors(async(req,res,next)=>{
    const doctors=await User.find({role:"Doctor"});
    res.status(200).json({
        success:true,
        doctors,
    });
});

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
      success: true,
      user,
    });
  });
  

  // Logout function for dashboard admin
export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
    res
      .status(201)
      .cookie("adminToken", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
      })
      .json({
        success: true,
        message: "Admin Logged Out Successfully.",
      });
  });

  // Logout function for frontend patient
export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
    res
      .status(201)
      .cookie("patientToken", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
      })
      .json({
        success: true,
        message: "Patient Logged Out Successfully.",
      });
  });
  

  export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return next(new ErrorHandler("Doctor Avatar Required!", 400));
    }
    const { docAvatar } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(docAvatar.mimetype)) {
      return next(new ErrorHandler("File Format Not Supported!", 400));
    }
    const {
      firstName,
      lastName,
      email,
      phone,
      nic,
      dob,
      gender,
      password,
      doctorDepartment
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !nic ||
      !dob ||
      !gender ||
      !password ||
      !doctorDepartment 
    ) {
      return next(new ErrorHandler("Please Fill Full Form!", 400));
    }
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
      return next(
        new ErrorHandler(`${isRegistered.role} Already registered with this email!`,
             400
            )
      );
    }
    
    const cloudinaryResponse = await cloudinary.uploader.upload(
      docAvatar.tempFilePath
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(
        "Cloudinary Error:",
        cloudinaryResponse.error || "Unknown Cloudinary error"
      );
    //   return next(
    //     new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
    //   );
    }
    
    const doctor = await User.create({
      firstName,
      lastName,
      email,
      phone,
      nic,
      dob,
      gender,
      password,
      role: "Doctor",
      doctorDepartment,
      docAvatar: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });
    res.status(200).json({
      success: true,
      message: "New Doctor Registered",
      doctor
    });
  });
  