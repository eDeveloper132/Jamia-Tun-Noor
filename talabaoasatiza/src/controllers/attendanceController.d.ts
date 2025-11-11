import type { Request, Response } from "express";
export declare function markAttendance(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function bulkAttendance(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getUserAttendance(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getMyAttendance(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function markOrUpdateMyAttendance(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=attendanceController.d.ts.map