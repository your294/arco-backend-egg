import { SECRET_KEY } from 'config/secret';
import { Service } from 'egg';
import * as jwt from 'jsonwebtoken';

export default class UserService extends Service {
  // 封装业务
  async userLogin({
    Account,
    Code,
  }: {
    Account: string;
    Code: string;
  }): Promise<any> {
    try {
      const user = await this.ctx.app.mysql.get('user', { Account, Code });
      if (user) {
        const token = jwt.sign({ username: user.Account! }, SECRET_KEY, {
          expiresIn: '1h',
        });
        return { user, token };
      }
    } catch (e) {
      throw e;
    }
    return undefined;
  }

  async isLogin(token: string): Promise<any> {
    const jwtPromise = new Promise((resolve, reject) => {
      if (token.slice(0, 6) === 'Bearer') {
        token = token.slice(7);
      }
      jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
          console.error('Token 验证失败:', err);
          reject(new Error(err));
          return;
        }
        console.log('Token 验证成功，用户信息:', decoded);
        resolve(decoded);
      });
    });
    return jwtPromise;
  }

  async findOneUser(Account: string): Promise<any> {
    try {
      const user = await this.ctx.app.mysql.get('user', { Account });
      if (user) {
        return user;
      }
    } catch (e) {
      throw e;
    }
  }
}
