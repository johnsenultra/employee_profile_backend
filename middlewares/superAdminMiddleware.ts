import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { verify } from 'jsonwebtoken';

export const superAdminGuard = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
   ): Promise<void> => {
   try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
         res.status(401).json({ message: 'Authorization required' });
         return;
      }

      const decoded = verify(token, process.env.JWT_KEY) as any;
      // console.log("Decoded token: ", decoded);
      
      if (decoded.data.userType !== 'super_admin') {
         res.status(403).json({ message: 'Access denied. Super admin rights required.' });
         return;
      }

      req.currentUser = decoded.data;
      next();
   } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
      return;
   }
};
