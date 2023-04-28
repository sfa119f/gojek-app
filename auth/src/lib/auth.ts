import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken'

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (!token) {
      throw new Error('you are not authenticated')
    }
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    (req as CustomRequest).token = decode
    next()
  } catch (err) {
    if (err.message.includes('you are not authenticated')) {
      return res.status(401).json({ data: null, error: err.message })
    }
    return res.status(500).json({ data: null, error: err.message })
  }
}
