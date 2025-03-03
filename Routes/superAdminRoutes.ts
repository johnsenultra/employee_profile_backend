import { Router } from 'express';
import { SuperAdminController } from '../controller/superAdminController';
import { authenticateToken } from '../middlewares/auth.middleware';
import { superAdminGuard } from '../middlewares/superAdminMiddleware';

const router = Router();
const superAdminController = new SuperAdminController();

// Bind controller methods to maintain correct 'this' context
const controllerMethods = {
  signin: superAdminController.signin.bind(superAdminController),
  createUser: superAdminController.createUser.bind(superAdminController),
  getUsers: superAdminController.getUsers.bind(superAdminController),
  getUsersCount: superAdminController.getUsersCount.bind(superAdminController),
  searchUsers: superAdminController.searchUsers.bind(superAdminController),
  changeUserPassword: superAdminController.changeUserPassword.bind(superAdminController),
};

// Public route - no authentication needed
router.post('/signin', controllerMethods.signin);
  
// Protected routes - need both authentication and super admin rights
router.post(
  '/create-user',
  authenticateToken(true) as any,
  superAdminGuard,
  controllerMethods.createUser
);

router.get(
  '/users',
  authenticateToken(true) as any,
  superAdminGuard,
  controllerMethods.getUsers
);
router.get(
  '/users/count',
  authenticateToken(true) as any,
  superAdminGuard,
  controllerMethods.getUsersCount
)
router.get(
  '/users/search',
  authenticateToken(true) as any,
  superAdminGuard,
  controllerMethods.searchUsers
);
router.put(
  '/users/:id/password',
  authenticateToken(true) as any,
  superAdminGuard,
  controllerMethods.changeUserPassword
)

export default router;