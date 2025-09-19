import express from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/inventoryCategory.controller.js';

const router = express.Router();

// POST   /api/v1/inventory/categories
router.post('/categories', createCategory);

// GET    /api/v1/inventory/categories
router.get('/categories', getAllCategories);

// GET    /api/v1/inventory/categories/:id
router.get('/categories/:id', getCategoryById);

// PUT    /api/v1/inventory/categories/:id
router.put('/categories/:id', updateCategory);

// DELETE /api/v1/inventory/categories/:id
router.delete('/categories/:id', deleteCategory);

export default router;
