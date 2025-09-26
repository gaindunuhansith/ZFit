import mongoose from "mongoose";
import NutritionModel, { type NutritionDocument, type INutrition } from "../models/nutrition.model.js";

export const createNutrition = async (data: INutrition): Promise<NutritionDocument> => {
  return NutritionModel.create(data);
};

export const getAllNutrition = async (): Promise<NutritionDocument[]> => {
  return NutritionModel.find();
};

export const getNutritionById = async (id: string): Promise<NutritionDocument | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid Nutrition ID");
  return NutritionModel.findById(id);
};

export const updateNutrition = async (id: string, data: Partial<INutrition>): Promise<NutritionDocument | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid Nutrition ID");
  return NutritionModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteNutrition = async (id: string): Promise<NutritionDocument | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid Nutrition ID");
  return NutritionModel.findByIdAndDelete(id);
};


