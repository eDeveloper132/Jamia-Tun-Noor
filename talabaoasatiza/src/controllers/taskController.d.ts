import type { Request, Response } from "express";
export declare function createTask(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getTasksForUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateTaskStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=taskController.d.ts.map