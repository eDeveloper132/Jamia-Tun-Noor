import type { Request, Response } from 'express';
import { ClassModel } from '../models/Class.js';

export const getAllClasses = async (req: Request, res: Response) => {
  try {
    const classes = await ClassModel.find({});
    res.status(200).json({ classes });
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
