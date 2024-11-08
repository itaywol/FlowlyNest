import { PERFORMANCE_MODEL, DATABASE_PROVIDER } from '../constants';
import { Connection } from 'mongoose';
import { PerformanceSchema } from 'schemas/performance.schema';

export const performanceProvider = [
  {
    provide: PERFORMANCE_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Performance', PerformanceSchema),
    inject: [DATABASE_PROVIDER],
  },
];
