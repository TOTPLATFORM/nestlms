import { BadRequestException, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { errorResponse } from '../helpers/functions';

export class CheckDemoMode implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method,url } = req;
    const isDemo = process.env.DEMO_MODE;
    
    const searchString = "/api/admin/";
    const isAdmin = req.originalUrl.includes(searchString);

    if (method === 'POST' && isDemo === 'demo' && isAdmin) {
      res.status(403).json(errorResponse('This is disbled for demo!'));
      // throw new BadRequestException(
      //   errorResponse('This is disble for demo!'),
      // );
    }
    next();
  }
}
