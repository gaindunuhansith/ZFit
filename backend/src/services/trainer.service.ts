import TrainerModel, { type TrainerDocument, type ITrainer } from "../models/trainer.model.js";
import mongoose from "mongoose";

// CREATE
export const createTrainer = async (data: ITrainer): Promise<TrainerDocument> => {
  return TrainerModel.create(data);
};

// GET ALL
export const getAllTrainers = async (): Promise<TrainerDocument[]> => {
  return TrainerModel.find();
};

// GET BY ID
export const getTrainerById = async (id: string): Promise<TrainerDocument | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid Trainer ID");
  return TrainerModel.findById(id);
};

// UPDATE
export const updateTrainer = async (id: string, data: Partial<ITrainer>): Promise<TrainerDocument | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid Trainer ID");
  return TrainerModel.findByIdAndUpdate(id, data, { new: true });
};

// DELETE
export const deleteTrainer = async (id: string): Promise<TrainerDocument | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid Trainer ID");
  return TrainerModel.findByIdAndDelete(id);
};
