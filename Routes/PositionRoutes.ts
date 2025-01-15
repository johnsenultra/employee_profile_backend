import { Router } from 'express'
import PositionController from '../controller/positionController'

const router = Router()

// Routes accessible to all authenticated users
router.get('/categories', PositionController.getAllCategories)
router.get('/categories/:categoryId/positions', PositionController.getPositionsByCategory)
router.get('/employees/:employeeId/position', PositionController.getEmployeePosition)
router.get('/positions/', PositionController.getEmployeesPosition)
router.get('/search', PositionController.search)

router.get('/totalFaculties', PositionController.totalCategoryFaculty)
router.get('/totalNonTeachingStaff', PositionController.totalCategoryNonteachingStaff)

// for admin if had an admin middleware
router.post('/categories', PositionController.createCategory)
router.post('/positions', PositionController.createPosition)
router.put('/employees/:employee_id/position', PositionController.updateEmployeePosition)

export default router