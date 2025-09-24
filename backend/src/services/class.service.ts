import Class, {type IClass } from '../models/class.model.js';

export const createClass = async (data: Omit<IClass,'createdAt'|'updatedAt'>) => {
  return await Class.create(data);
};

export const getClasses = async () => {
  return await Class.find();
};

export const getClassById = async (id: string) => {
  return await Class.findById(id);
};

export const updateClass = async (id: string, data: Partial<Omit<IClass,'createdAt'|'updatedAt'>>) => {
  return await Class.findByIdAndUpdate(id, data, { new: true });
};

export const deleteClass = async (id: string) => {
  return await Class.findByIdAndDelete(id);
};
