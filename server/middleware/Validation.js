// server/middleware/validation.js
const validatePassword = (req, res, next) => {
    const { password } = req.body;
    
    // Password must be at least 6 characters
    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters long'
      });
    }
  
    // Add more password requirements if needed
    // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    // if (!passwordRegex.test(password)) {
    //   return res.status(400).json({
    //     error: 'Password must contain at least one letter and one number'
    //   });
    // }
  
    next();
  };
  
  module.exports = { validatePassword };
  