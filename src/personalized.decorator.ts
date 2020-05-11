import { SetMetadata } from '@nestjs/common';

export const Personalized = (personalized: boolean) =>
  SetMetadata('personalized', personalized);
