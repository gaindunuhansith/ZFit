import FacilityModel, { type FacilityDocument, type IFacility } from "../models/facility.model.js";
import mongoose from "mongoose";

// CREATE
export const createFacility = async (data: IFacility): Promise<FacilityDocument> => {
  return FacilityModel.create(data);
};

// GET ALL
export const getAllFacilities = async (): Promise<FacilityDocument[]> => {
  return FacilityModel.find().populate("equipments");
};

// GET BY ID
export const getFacilityById = async (id: string): Promise<FacilityDocument | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid Facility ID");
  return FacilityModel.findById(id).populate("equipments");
};

// UPDATE
export const updateFacility = async (id: string, data: Partial<IFacility>): Promise<FacilityDocument | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid Facility ID");
  return FacilityModel.findByIdAndUpdate(id, data, { new: true }).populate("equipments");
};

// DELETE
export const deleteFacility = async (id: string): Promise<FacilityDocument | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid Facility ID");
  return FacilityModel.findByIdAndDelete(id);
};
