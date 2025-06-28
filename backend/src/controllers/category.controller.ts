import { Request, Response } from "express";
import { CategoryModel } from "../models/category.model";

interface AuthRequest extends Request {
  user?: any;
}

// Get all categories for a user
export const getCategories = async (req: AuthRequest, res: Response) => {
  try {
    const categories = await CategoryModel.find({ user_id: req.user._id });
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new category
export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const categoryExists = await CategoryModel.findOne({
      name: req.body.name,
      user_id: req.user._id,
    });

    if (categoryExists) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const category = await CategoryModel.create({
      ...req.body,
      user_id: req.user._id,
    });

    res.status(201).json(category);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update category
export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const category = await CategoryModel.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      req.body,
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete category
export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const category = await CategoryModel.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user._id,
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
