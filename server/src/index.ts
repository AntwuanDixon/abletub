import "reflect-metadata";
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { COOKIE_NAME, __prod__ } from './constants';
import Redis from 'ioredis';
import connectRedis from 'connect-redis';
import session from 'express-session';
import cors from 'cors';
import { createConnection } from 'typeorm';
import { User } from "./entities/User";
import { _Post as Post } from "./entities/Post";
import path from "path";
import { Updoot } from "./entities/Updoot";
import { MyContext } from "./types";
import { createUserLoader } from "./utils/createUserLoader";
import { createUpvoteLoader } from "./utils/createUpvoteLoader";


const main = async () => {
    const conn = await createConnection({
        type: "postgres",
        database: 'lireddit4',
        username: 'postgres',
        password: 'postgres',
        logging: true,
        synchronize: true,
        migrations: [path.join(__dirname, "./migrations/*")],
        entities: [Post, User, Updoot]
    });
    
    // await User.delete({});
    await conn.runMigrations();

    const app = express();
    
    // await Post.delete({});
    const RedisStore = connectRedis(session)
    const redis = new Redis();
    app.use(
        cors({
        origin: 'http://localhost:3000',
        credentials: true
    }));

    // 
    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({ 
                client: redis,
                disableTouch: true,
            }),
            cookie: {
                maxAge: 1000 * 60 * 24 * 365 * 10, // 10 years
                httpOnly: true,
                sameSite: "lax", //csrf
                secure: __prod__, // cookie only works in https
            },
            saveUninitialized: false,
            secret: "foo",
            resave: false,
        })
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({ 
            req,
            res,
            redis,
            userLoader: createUserLoader(),
            updootLoader: createUpvoteLoader()
        }),
    });

    apolloServer.applyMiddleware({ 
        app, 
        cors: false
    });

    app.listen(process.env.PORT || 4000, () => {
    console.log("Node server started");

    });
};

main().catch((err) => {
    console.log('err::::',err)
})
