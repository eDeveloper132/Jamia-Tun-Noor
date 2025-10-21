import type { Request, Response, NextFunction } from "express";
export interface AuthRequest extends Request {
    user?: any;
}
export declare function requireAuth(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function requireRole(roles: string[]): (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=authMiddleware.d.ts.map