import type { Response } from "express";
import type { AuthRequest } from "../utils/authMiddleware.js";
export declare function listClassesForTeacher(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function sendClassEmail(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=communicationController.d.ts.map