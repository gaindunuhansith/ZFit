import express from 'express';
import {
    createItem,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem
} from '../controllers/inventoryItem.controller.js'
import authenticate from '../middleware/auth.middleware.js';

const router = express.Router();


router.get('/items', authenticate(), getAllItems);


router.post('/items', authenticate(['manager']), createItem);


router.get('/items/:id', authenticate(), getItemById);


router.put('/items/:id', authenticate(['manager']), updateItem);


router.delete('/items/:id', authenticate(['manager']), deleteItem);


export default router