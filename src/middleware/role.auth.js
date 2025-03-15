const userAuthRoleBase = (requiredRole) => (req, res, next) => {
  try {
      // Ensure user is authenticated
      const user = req.user;
      console.log("userrole",user)

      if (!user) {
          return res.status(401).json({ message: "Please authenticate" });
      }

      // Check if the role is "doctor"
      if (user.role !== requiredRole) {
          return res.status(403).json({ message: "Access denied" });
      }

      next();
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};

//   const userAuthRoleBase = (requiredRoles) => (req, res, next) => {
//     try {
//         // Ensure user or doctor is authenticated
//         const user = req.user || req.doctor;

//         if (!user) {
//             return res.status(401).json({ message: "Please authenticate" });
//         }

//         // Convert requiredRoles to an array if it's a string
//         if (!Array.isArray(requiredRoles)) {
//             requiredRoles = [requiredRoles];
//         }

//         // Check if the authenticated user has the required role
//         if (!requiredRoles.includes(user.role)) {
//             return res.status(403).json({ message: "Access denied" });
//         }

//         next();
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

  // const doctorAuthRoleBase = (requiredRole) => (req, res, next) => {
  //   try {
  //     if (!req.user) {
  //       return res.status(401).json({ message: "Please authenticate" });
  //     }
  
  //     if (requiredRole && req.user.role !== requiredRole) {
  //       return res.status(403).json({ message: "Access denied" });
  //     }
  
  //     next();
  //   } catch (error) {
  //     res.status(400).json({ message: error.message });
  //   }
  // };
  module.exports = { userAuthRoleBase };