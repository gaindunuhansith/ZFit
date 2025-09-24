import express from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/inventoryCategory.controller.js';
import authenticate from '../middleware/auth.middleware.js';

const router = express.Router();

// POST   /api/v1/inventory/categories
router.post('/categories', authenticate(['manager']), createCategory);

// GET    /api/v1/inventory/categories
router.get('/categories', authenticate(['manager','staff']), getAllCategories);

// GET    /api/v1/inventory/categories/:id
router.get('/categories/:id', authenticate(['manager','staff']), getCategoryById);

// PUT    /api/v1/inventory/categories/:id
router.put('/categories/:id', authenticate(['manager']), updateCategory);

// DELETE /api/v1/inventory/categories/:id
router.delete('/categories/:id', authenticate(['manager']), deleteCategory);

export default router;
