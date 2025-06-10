import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret',
  jwtExpiresIn: '7d',
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback'
    },
    facebook: {
      appId: process.env.FACEBOOK_APP_ID || '',
      appSecret: process.env.FACEBOOK_APP_SECRET || '',
      callbackUrl: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:3000/api/auth/facebook/callback'
    },
    pinterest: {
      clientId: process.env.PINTEREST_CLIENT_ID || '',
      clientSecret: process.env.PINTEREST_CLIENT_SECRET || '',
      callbackUrl: process.env.PINTEREST_CALLBACK_URL || 'http://localhost:3000/api/auth/pinterest/callback'
    }
  }
};
