import type { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from "express";
export interface AuthRequest extends ExpressRequest {
    user?: any;
}
export declare function requireAuth(req: AuthRequest, res: ExpressResponse, next: NextFunction): Promise<void | ExpressResponse<any, Record<string, any>>>;
export declare function requireRole(roles: string[]): (req: AuthRequest, res: ExpressResponse, next: NextFunction) => void | ExpressResponse<any, Record<string, any>>;
//# sourceMappingURL=authMiddleware.d.ts.map