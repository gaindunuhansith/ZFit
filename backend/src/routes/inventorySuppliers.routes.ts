import express from 'express';
import {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier,
} from '../controllers/inventorySupplier.controller.js';
import authenticate from '../middleware/auth.middleware.js';


const router = express.Router();

// GET /api/v1/suppliers - Get all suppliers
router.get('/', authenticate(['manager', 'staff']), getAllSuppliers);

// POST /api/v1/suppliers - Create a new supplier
router.post('/', authenticate(['manager']), createSupplier);

// GET /api/v1/suppliers/:id - Get supplier by ID
router.get('/:id',authenticate(['manager', 'staff']), getSupplierById);

// PUT /api/v1/suppliers/:id - Update supplier by ID
router.put('/:id',authenticate(['manager']), updateSupplier);

// DELETE /api/v1/suppliers/:id - Delete supplier by ID
router.delete('/:id', authenticate(['manager']), deleteSupplier);

export default router;

