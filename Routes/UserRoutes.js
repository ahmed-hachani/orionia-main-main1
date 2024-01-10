const express = require('express');
const router = express.Router();
const { Login, Register, deleteUserById,  getAllUsers,getUserById, showAllUserInfo,updateUserById, getTotalRegistrations } = require("../controllers/user");
const ApiRateLimiter = require("../middleware/attempts");
const VerifyToken = require("../middleware/verifyToken");




// Register a new user
router.post('/register', ApiRateLimiter, Register);

// Log in a user
router.post("/login", ApiRateLimiter, Login);


// Get user profile (assuming Profile is defined in UserCtrl)
//router.get("/profile", VerifyToken, UserCtrl.Profile);

// Log out a user
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.get('/users/info', showAllUserInfo);
router.put('/users/:id', updateUserById);
router.delete('/users/:id', deleteUserById);
router.get('/registrations/count', getTotalRegistrations);

module.exports = router;
