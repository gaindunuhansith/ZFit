import Trainer, { type ITrainer } from "../models/Trainer.model.js";

export const createTrainer = async (data: Partial<ITrainer>) => Trainer.create(data);

export const getTrainers = async () => Trainer.find();

export const getTrainerById = async (id: string) => Trainer.findById(id);

export const updateTrainer = async (id: string, data: Partial<ITrainer>) =>
  Trainer.findByIdAndUpdate(id, data, { new: true });

export const deleteTrainer = async (id: string) =>
  Trainer.findByIdAndDelete(id);
