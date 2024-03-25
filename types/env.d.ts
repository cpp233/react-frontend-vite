import { z } from 'zod';
import logger from '@utils/logger';

const envList = z.object({
  NODE_ENV: z.string(),
});
envList.parse(process.env);
logger.trace(process.env);

declare global {
  namespace NodeJS {
    type ProcessEnv = z.infer<typeof envList>;
    // interface ProcessEnv extends z.infer<typeof envList> {};
  }
}
