import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import CategoryService from "../services/inventoryCategory.service.js";


// create an instance of the service
const categoryService = new CategoryService();

// zod validation schema for creating a category
const createCategorySchema = z.object({
    categoryName: z.string().min(2, "Category name must be at least 2 characters long").max(50, "Category name must be at most 50 characters long"),
    categoryDescription: z.string().min(5, "Category description must be at least 5 characters long").max(200, "Category description must be at most 200 characters long"),
});

// zod validation schema for updating a category
const updateCategorySchema = z.object({
    categoryName: z.string().min(2, "Category name must be at least 2 characters long").max(50, "Category name must be at most 50 characters long").optional(),
    categoryDescription: z.string().min(5, "Category description must be at least 5 characters long").max(200, "Category description must be at most 200 characters long").optional(),
});

//zod validation schema for category ID
const categoryIdSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID format"),
});

// Controller to create a new category
export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const validated = createCategorySchema.parse(req.body);
        const category = await categoryService.createCategory(validated);

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category
        });
    }catch(error){
        next(error);
    }
};

// Controller to get all categories
export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
      count: categories.length,
    });
  } catch (error) {
    next(error);
  }
};



// Controller to Get by ID
export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = categoryIdSchema.parse({ id: req.params.id });
    const category = await categoryService.getCategoryById(id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category retrieved successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// Controller to update a category

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = categoryIdSchema.parse({ id: req.params.id });
    const validated = updateCategorySchema.parse(req.body);

    const category = await categoryService.updateCategory(id, validated);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// Controller to delete a category
export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = categoryIdSchema.parse({ id: req.params.id });
    const category = await categoryService.deleteCategory(id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};


