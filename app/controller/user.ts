import { Controller } from 'egg';

export default class UserController extends Controller {
  async userLogin() {
    const { ctx, service } = this;
    const { Account, Code } = ctx.request.body;
    try {
      const user = await service.user.userLogin({ Account, Code });
      ctx.response.body = {
        message: 'success',
        user,
      };
      ctx.response.status = 200;
    } catch (e) {
      ctx.response.body = {
        message: 'fail',
        error: e,
      };
      ctx.response.status = 500;
    }
  }

  /**
   * 如果未登录, 返回未登录态false
   * 如果尚在登录态，返回相应信息, 并在HTTP Header中携带如下样式
   * Authorization: Bearer <token>
   */
  async isUserLogin() {
    const { ctx, service } = this;
    const token = ctx.request.header.authorization;

    try {
      const account = await service.user.isLogin(token);
      const user = await service.user.findOneUser(account.username);
      if (user) {
        ctx.body = {
          message: 'success',
          data: user,
        };
        ctx.status = 200;
      } else {
        ctx.body = {
          message: 'fail',
          error: 'user is undefined',
        };
        ctx.status = 404; // 使用 404 表示用户未找到
      }
    } catch (e: any) {
      ctx.body = {
        message: 'fail',
        error: e,
      };
      ctx.status = 500;
    }
  }
}
