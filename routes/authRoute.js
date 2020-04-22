const router = require('express').Router();

const signupValidator = require('../validator/auth/signupValidator')
const loginValidator = require('../validator/auth/loginValidator')


const {
    signupGetController,
    signupPostController,
    loginGetController,
    loginPostController,
    logoutController,
    changePasswordGetController,
    changePasswordPostController
} = require('../controllers/authController')

const { isUnauthenticated, isAuthenticated } = require('../middleware/authMiddleware')



router.get('/signup', isUnauthenticated, signupGetController)

router.post('/signup', signupValidator, signupPostController)

router.get('/login', isUnauthenticated, loginGetController)

router.post('/login', isUnauthenticated, loginValidator, loginPostController)

router.get('/changePassword', isAuthenticated, changePasswordGetController)
router.post('/changePassword', isAuthenticated, changePasswordPostController)

router.get('/logout', logoutController)

module.exports = router;