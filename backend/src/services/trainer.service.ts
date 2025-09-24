import Trainer, { type ITrainer } from '../models/Trainer.model.js';

export const createTrainer = async (data: Omit<ITrainer,'createdAt'|'updatedAt'>) => {
  return await Trainer.create(data);
};

export const getTrainers = async () => {
  return await Trainer.find();
};

export const getTrainerById = async (id: string) => {
  return await Trainer.findById(id);
};

export const updateTrainer = async (id: string, data: Partial<Omit<ITrainer,'createdAt'|'updatedAt'>>) => {
  return await Trainer.findByIdAndUpdate(id, data, { new: true });
};

export const deleteTrainer = async (id: string) => {
  return await Trainer.findByIdAndDelete(id);
};
