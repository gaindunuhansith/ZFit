import Facility, { type IFacility } from "../models/facility.model.js";

export const createFacility = async (data: Partial<IFacility>) => Facility.create(data);

export const getFacilities = async () => Facility.find().populate("equipments");

export const getFacilityById = async (id: string) => Facility.findById(id).populate("equipments");

export const updateFacility = async (id: string, data: Partial<IFacility>) =>
  Facility.findByIdAndUpdate(id, data, { new: true });

export const deleteFacility = async (id: string) =>
  Facility.findByIdAndDelete(id);
