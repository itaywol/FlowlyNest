import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import * as expressSession from 'express-session';
import * as passport from 'passport';
import * as connectMongo from 'connect-mongo';
const MongoStore = connectMongo(expressSession);

export function isProduction(): boolean {
  return process.env.NODE_ENV.toString() === 'production';
}

export const session = expressSession({
  secret: process.env.SESSION_SECRET || 'henriIsTheMostEvilCatInTheWorld',
  name: 'auth',
  store: new MongoStore({
    stringify: false,
    url: process.env.MONGO_URI,
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: parseInt(
      process.env.SESSION_COOKIE_MAX_AGE || '30*24*24*60*60*1000',
    ),
    secure: isProduction(),
    domain: process.env.PUBLIC_DOMAIN || 'localhost',
    sameSite: 'none',
    httpOnly: true,
  },
});
function initMiddlewares(app: INestApplication) {
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(session);
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
