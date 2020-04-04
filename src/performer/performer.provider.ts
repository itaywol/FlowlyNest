import { PERFORMER_MODEL, DATABASE_PROVIDER } from 'src/constants';
import { Connection } from 'mongoose';
import { PerformerSchema } from 'src/schemas/performer.schema';

export const performerProvider = [
  {
    provide: PERFORMER_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Performer', PerformerSchema),
    inject: [DATABASE_PROVIDER],
  },
];
