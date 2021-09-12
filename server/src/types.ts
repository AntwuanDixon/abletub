import { Request, Response } from 'express';
import { Session, SessionData } from 'express-session'
import { Redis } from 'ioredis';
import { createUpvoteLoader } from './utils/createUpvoteLoader';
import { createUserLoader } from './utils/createUserLoader';
import { Comment } from "./entities/Comment"

export type MyContext = {
    req: Request & { 
      session: Session & Partial<SessionData> & { userId?: number } & { audioFile?: string } & { newComment: Comment };
    };
    redis: Redis;
    res: Response;
    userLoader: ReturnType<typeof createUserLoader>;
    updootLoader: ReturnType<typeof createUpvoteLoader>;
}