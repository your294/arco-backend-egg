import { Application } from 'egg';

export default (app: Application) => {
  // const logger = app.middleware.myLogger({ allowedMethod: ['POST'] }, app)
  const { controller, router } = app;
  // const jwt = app.middleware.jwt({ secret: app.config.jwt.secret })
  router.prefix('/API');
  // user
  router.post('/users/login', controller.user.userLogin);
  router.get('/users/isLogin', controller.user.isUserLogin);
};
