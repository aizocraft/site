import { Request, Response, NextFunction } from 'express';
declare const optionalAuthMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default optionalAuthMiddleware;
//# sourceMappingURL=optionalAuth.d.ts.map