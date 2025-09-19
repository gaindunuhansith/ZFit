import Category from "../models/category.model.js";
import type { ICategory } from "../models/category.model.js";

export default class CategoryService {
  // CREATE category
  async createCategory(data: { categoryName: string; categoryDescription: string }): Promise<ICategory> {
    const category = new Category(data);
    return await category.save();
  }

  // GET all categories
  async getAllCategories(): Promise<ICategory[]> {
    return await Category.find().sort({ categoryName: 1 });
  }

  // GET category by ID
  async getCategoryById(id: string): Promise<ICategory | null> {
    return await Category.findById(id);
  }

  // UPDATE category
  async updateCategory(
    id: string,
    data: { categoryName?: string | undefined; categoryDescription?: string | undefined}
  ): Promise<ICategory | null> {
    return await Category.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
  }

  // DELETE category
  async deleteCategory(id: string): Promise<ICategory | null> {
    return await Category.findByIdAndDelete(id);
  }
}
