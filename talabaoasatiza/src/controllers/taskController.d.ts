import type { Request as ExpressRequest, Response as ExpressResponse } from "express";
import type { AuthRequest } from "../utils/authMiddleware.js";
export declare function createTask(req: ExpressRequest, res: ExpressResponse): Promise<ExpressResponse<any, Record<string, any>>>;
export declare function assignTaskToClass(req: AuthRequest, res: ExpressResponse): Promise<ExpressResponse<any, Record<string, any>>>;
export declare function getTasksForUser(req: ExpressRequest, res: ExpressResponse): Promise<ExpressResponse<any, Record<string, any>>>;
export declare function updateTaskStatus(req: ExpressRequest, res: ExpressResponse): Promise<ExpressResponse<any, Record<string, any>>>;
//# sourceMappingURL=taskController.d.ts.map