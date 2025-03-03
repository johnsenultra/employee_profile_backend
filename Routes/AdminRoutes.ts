import { Router } from 'express';
import { AdminController } from '../controller/AdminController';

const router = Router();
const adminController = new AdminController();

// Public route - no authentication needed
router.post('/signin', adminController.signin.bind(adminController));

// Protected routes - require JWT authentication
router.post('/create-user', adminController.createUser.bind(adminController));
router.get('/users', adminController.getUsers.bind(adminController));
router.get('/users/count', adminController.getUsersCount.bind(adminController));

export default router;