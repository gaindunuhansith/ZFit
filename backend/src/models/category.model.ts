import mongoose, { Document } from "mongoose";

export interface ICategory extends Document {
    categoryName: string;
    categoryDescription: string;
}

const categorySchema = new mongoose.Schema<ICategory>({
    categoryName: {
        type: String,
        required: true
    },
    categoryDescription: {
        type: String,
        required: true
    },
});

const Category = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
