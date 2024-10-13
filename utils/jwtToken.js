// export const generateToken = (user, message, statusCode, res) => {
//   const token = user.generateJsonWebToken();
//   // Determine the cookie name based on the user's role
//   const cookieName = user.role === 'Admin' ? 'adminToken' : 'patientToken';

//   res
//     .status(statusCode)
//     .cookie(cookieName, token, {
//       expires: new Date(
//         Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
//       ),
    
//     })
//     .json({
//       success: true,
//       message,
//       user,
//       token,
//     });
// };

export const generateToken = (user, message, statusCode, res) => {
    const token = user.generateJsonWebToken();
  
    // Determine the cookie name based on the user's role
    const cookieName = user.role === 'Admin' ? 'adminToken' : 'patientToken';
  res
     .status(statusCode)
     .cookie(cookieName,token,{
      expires:new Date(
        Date.now()+process.env.COOKIE_EXPIRE  * 24 * 60 * 60 * 1000 
      ),
      httpOnly: true,
     })
      .json({
        success: true,
        message,
        user,
        token,
      });
  };
  


// export const generateToken = (user, message, statusCode, res) => {
//   // Ensure user model has generateJsonWebToken method defined
//   const token = user.generateJsonWebToken();

//   // Determine the cookie name based on the user's role
//   const cookieName = user.role === 'Admin' ? 'adminToken' : 'patientToken';

//   // Set cookie options with security features
//   const cookieOptions = {
//     expires: new Date(
//       Date.now() + (process.env.COOKIE_EXPIRE || 5) * 24 * 60 * 60 * 1000 // Default to 5 days if COOKIE_EXPIRE is not set in .env
//     ),
//     httpOnly: true, // Prevents client-side JavaScript from accessing the token
//     sameSite: 'Strict', // Protects from CSRF
//     secure: process.env.NODE_ENV === 'production' // Only send cookie over HTTPS in production
//   };

//   // Send the response with the token in both the cookie and the JSON response
//   res
//     .status(statusCode)
//     .cookie(cookieName, token, cookieOptions)  // Set the cookie with token
//     .json({
//       success: true,
//       message,
//       user,
//       token,
//     });
// };
