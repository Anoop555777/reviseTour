const express = require('express');
const userController = require('../../controller/userController');
const authController = require('../../controller/authController');
const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.logIn);
router.patch('/forgetpassword', authController.forgetPassword);
router.patch('/resetpassword/:token', authController.resetPassword);

router.use(authController.protectedRoutes);

router.get(
  '/me',

  userController.setId,
  userController.getMe
);
router.patch(
  '/updatemypassword',

  authController.updatepassword
);
router.patch(
  '/updateMe',

  userController.userMe
);

router.patch(
  '/deleteMe',

  userController.deleteMe
);

router.use(authController.restrict('admin'));
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
