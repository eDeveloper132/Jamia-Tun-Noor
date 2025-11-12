import type { Request, Response } from "express";
export declare function listUsers(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function createUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteUser: (req: Request, res: Response) => Promise<void>;
export declare const updateUserClass: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=userController.d.ts.map