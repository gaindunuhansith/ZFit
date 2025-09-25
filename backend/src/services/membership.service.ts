import MembershipPlanModel from "../models/membership.model.js";
import AppAssert from "../util/AppAssert.js";
import { CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND } from "../constants/http.js";

type CreateMembershipParams = {
    name: string;
    description?: string | undefined;
    price: number;
    currency: string;
    durationInDays: number;
    category: string;
};

type UpdateMembershipParams = {
    name?: string | undefined;
    description?: string | undefined;
    price?: number | undefined;
    currency?: string | undefined;
    durationInDays?: number | undefined;
    category?: string | undefined;
};


export const getAllMemberships = async () => {
    const memberships = await MembershipPlanModel.find();
    return memberships;
};


export const getMembershipById = async (membershipId: string) => {
    const membership = await MembershipPlanModel.findById(membershipId);
    AppAssert(membership, NOT_FOUND, "Membership not found");
    return membership;
};


export const getMembershipsByCategory = async (category: string) => {
    const memberships = await MembershipPlanModel.find({ category });
    return memberships;
};


export const createMembership = async (data: CreateMembershipParams) => {

    
    const existingMembership = await MembershipPlanModel.findOne({ name: data.name });

    AppAssert(!existingMembership, CONFLICT, "Membership with this name already exists");

    const membership = await MembershipPlanModel.create(data);
    AppAssert(membership, INTERNAL_SERVER_ERROR, "Failed to create membership");
    
    return membership;
};


export const updateMembership = async (membershipId: string, updateData: UpdateMembershipParams) => {
    
    const existingMembership = await MembershipPlanModel.findById(membershipId);
    AppAssert(existingMembership, NOT_FOUND, "Membership not found");

    if (updateData.name) {
        const duplicateName = await MembershipPlanModel.findOne({ 
            name: updateData.name, 
            _id: { $ne: membershipId } 
        });
        AppAssert(!duplicateName, CONFLICT, "Membership with this name already exists");
    }

    const updatedMembership = await MembershipPlanModel.findByIdAndUpdate(
        membershipId, 
        updateData, 
        { new: true }
    );
    
    AppAssert(updatedMembership, INTERNAL_SERVER_ERROR, "Failed to update membership");
    return updatedMembership;
};


export const deleteMembership = async (membershipId: string) => {

    const membership = await MembershipPlanModel.findById(membershipId);

    AppAssert(membership, NOT_FOUND, "Membership not found");

    await MembershipPlanModel.findByIdAndDelete(membershipId);
    
    return { message: "Membership deleted successfully" };
};


export const getMembershipCategories = () => {
    return ["weights", "crossfit", "yoga", "mma", "other"];
};