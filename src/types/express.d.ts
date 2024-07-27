/* eslint-disable no-unused-vars */
import { Beast } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        beast: Beast;
      };
    }
  }
}

export {};
