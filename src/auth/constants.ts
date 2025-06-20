export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'default',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'default',
};
