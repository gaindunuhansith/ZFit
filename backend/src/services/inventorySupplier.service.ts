import Suppllier from "../models/supplier.model.js";
import type { IInventorySupplier } from "../models/supplier.model.js";

export default class SupplierService{
    //Cretate supplier
    async createSupplier(data: { supplierName: String, supplierEmail: String, supplierPhone: String, supplierAddress: String}): Promise<IInventorySupplier>{
        const supplier = new Suppllier(data);
        return await supplier.save();
    }

    //Get all suppliers
    async getAllSupllier(): Promise<IInventorySupplier[]>{
        return await Suppllier.find().sort({ supplierName: 1})
    }

    //Get supplier by id
    async getSupplierById(id: String): Promise<IInventorySupplier| null>{
        return await Suppllier.findById(id);
    }

    //Update supplier
    async updateSupplier(
        id: String,
        data: { supplierName: String | undefined, supplierEmail: String | undefined, supplierPhone: String | undefined, supplierAddress: String | undefined}
    ): Promise<IInventorySupplier | null>{
        return await Suppllier.findByIdAndUpdate(
            id,
            {...data, updatedAt: new Date()},
            {new: true, runValidators: true}
        )
    }

    //Delete supplier
    async deleteSupllier(id: String): Promise<IInventorySupplier | null>{
        return await Suppllier.findByIdAndDelete(id);
    }
}