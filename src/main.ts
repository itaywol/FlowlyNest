import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as expressSession from 'express-session';
import * as passport from 'passport';
import * as connectMongo from 'connect-mongo';
const MongoStore = connectMongo(expressSession);

export function isProduction(): boolean {
  return process.env.NODE_ENV.toString() === 'production';
}

function initMiddlewares(app: INestApplication) {
  app.enableCors({
    origin: process.env.EXPRESS_CORS || '*',
    credentials: true,
  });
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(
    expressSession({
      secret: process.env.SESSION_SECRET || 'henriIsTheMostEvilCatInTheWorld',
      name: process.env.SESSION_COOKIE_NAME || 'performa_auth',
      store: new MongoStore({
        stringify: false,
        url: process.env.MONGO_URI,
        collection: process.env.SESSION_MONGO_COLLECTION_NAME || 'authSessions',
      }),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: parseInt(
          process.env.SESSION_COOKIE_MAX_AGE || '30*24*24*60*60*1000',
        ),
        httpOnly: true,
        secure: isProduction(),
        sameSite: true,
        domain: process.env.PUBLIC_DOMAIN || 'localhost',
      },
    }),
  );
  app.use(passport.initialize());
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  initMiddlewares(app);
  if (!isProduction()) {
    app.enableCors();
  }
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
