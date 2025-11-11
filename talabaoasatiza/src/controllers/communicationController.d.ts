import type { Response } from "express";
import type { AuthRequest } from "../utils/authMiddleware.js";
export declare function listStudentsForTeacher(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function sendStudentEmail(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=communicationController.d.ts.map