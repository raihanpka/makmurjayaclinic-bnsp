/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  // Node
  TZ: Env.schema.string(),
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.string(),

  // App
  APP_KEY: Env.schema.secret(),
  APP_URL: Env.schema.string({ format: 'url', tld: false }),

  // Database
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),

  // Session
  SESSION_DRIVER: Env.schema.enum(['cookie', 'memory', 'database', 'redis'] as const),

  // Redis
  REDIS_HOST: Env.schema.string({ format: 'host' }),
  REDIS_PORT: Env.schema.number(),
  REDIS_PASSWORD: Env.schema.secret.optional(),

  // Mail
  SMTP_HOST: Env.schema.string(),
  SMTP_PORT: Env.schema.number(),
  SMTP_USERNAME: Env.schema.string.optional(),
  SMTP_PASSWORD: Env.schema.string.optional(),
  MAIL_FROM_ADDRESS: Env.schema.string(),
  MAIL_FROM_NAME: Env.schema.string(),

  // Drive
  DRIVE_DISK: Env.schema.enum(['local'] as const),

  // Queue
  QUEUE_REDIS_HOST: Env.schema.string({ format: 'host' }),
  QUEUE_REDIS_PORT: Env.schema.number(),

  // Domain rules
  STOCK_ALERT_MINIMUM: Env.schema.number(),
  EXPIRY_ALERT_DAYS: Env.schema.string(),
  SESSION_LIFETIME: Env.schema.number(),
  MAX_PRESCRIPTION_SIZE_MB: Env.schema.number(),
})
