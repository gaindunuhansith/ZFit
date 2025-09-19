import { type Request, type Response } from "express";
import { z } from "zod";
import SupplierService from "../services/inventorySupplier.service.js";

const supplierService = new SupplierService();

export const createSupplierSchema = z.object({
  supplierName: z.string().min(1, "Supplier name is required"),
  supplierEmail: z.string().email("Invalid email address"),
  supplierPhone: z.string().min(5, "Phone number is required"),
  supplierAddress: z.string().min(1, "Address is required"),
});

export const updateSupplierSchema = z.object({
  supplierName: z.string().min(1, "Supplier name is required").optional(),
  supplierEmail: z.string().email("Invalid email address").optional(),
  supplierPhone: z.string().min(5, "Phone number is required").optional(),
  supplierAddress: z.string().min(1, "Address is required").optional(),
});

const supplierIdSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID format"),
});

//Controller to create a new supplier
export const createSupplier = async (req: Request, res: Response) => {
  try{
    const validated = createSupplierSchema.parse(req.body);
    const supplier = await supplierService.createSupplier(validated);

    res.status(201).json({
      success: true,
      message: "Supplier created successfully",
      data: supplier
    })
  }catch(error){
    handleError(res, error);
  }
}

  //controller to get all suppliers
  export const getAllSuppliers = async (req: Request, res: Response) => {
    try{
      const suppliers = await supplierService.getAllSuppliers()

      res.status(200).json({
        success: true,
        message: "Suppliers retrieved successfully",
        data: suppliers,
        count: suppliers.length
      })
    }catch(error){
      handleError(res, error);
    }
}

//controller to get by id
export const getSupplierById = async (req: Request, res: Response) => {
  try{
    const { id } = supplierIdSchema.parse({ id: req.params.id })
    const supplier = await supplierService.getSupplierById(id)

    if(!supplier){
      return res.status(404).json({
        success: false,
        message: "Supplier not found"
      })
    }

    res.status(200).json({
      success: true,
      message: "Supplier retrieved successfully",
      data: supplier,
    })
  }catch(error){
    handleError(res, error);
  }
}

//controller to update supplier
export const updateSupplier = async (req: Request, res: Response) => {
  try {
    const { id } = supplierIdSchema.parse({ id: req.params.id });
    const validated = updateSupplierSchema.parse(req.body);

    const category = await supplierService.updateSupplier(id, validated);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Supplier updated successfully",
      data: category,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Controller to delete a supplier
export const deleteSupplier = async (req: Request, res: Response) => {
  try {
    const { id } = supplierIdSchema.parse({ id: req.params.id });
    const category = await supplierService.deleteSupplier(id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Supplier deleted successfully",
      data: category,
    });
  } catch (error) {
    handleError(res, error);
  }
};

//centralized error handling function
const handleError = (res: Response, error: unknown) => {
  console.error("Error:", error)

  if(error instanceof z.ZodError){
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }))
    })
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  })
}


