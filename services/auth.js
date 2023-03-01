/**
 * auth.js
 * @description :: service functions used in authentication
 */

const model = require('../model/index');
const dbService = require('../utils/dbService');
const {
  JWT,MAX_LOGIN_RETRY_LIMIT,LOGIN_REACTIVE_TIME
} = require('../constants/authConstant');
const jwt = require('jsonwebtoken');
const common = require('../utils/common');
const dayjs = require('dayjs');
const bcrypt = require('bcrypt');

/**
 * @description : service to generate JWT token for authentication.
 * @param {obj} user : user who wants to login.
 * @param {string} secret : secret for JWT.
 * @return {string}  : returns JWT token.
 */
const generateToken = async (user,secret) => {
  return jwt.sign( {
    id:user.id,
    'username':user.username
  }, secret, { expiresIn: JWT.EXPIRES_IN * 60 });
};

/**
 * @description : service of login user.
 * @param {string} username : username of user.
 * @param {string} password : password of user.
 * @return {obj} : returns authentication status. {flag, data}
 */
const loginUser = async (username,password) => {
  try {
    let where = { $or:[{ username:username },{ email:username }] };
    where.isActive = true;where.isDeleted = false;            const user = await dbService.findOne(model.user,where);
    if (!user) {
      return {
        flag:true,
        data:'User not exists'
      };
    }
    let userAuth = await dbService.findOne(model.userAuthSettings, { userId: user.id });
    if (userAuth && userAuth.loginRetryLimit >= MAX_LOGIN_RETRY_LIMIT) {
      let now = dayjs();
      if (userAuth.loginReactiveTime) {
        let limitTime = dayjs(userAuth.loginReactiveTime);
        if (limitTime > now) {
          let expireTime = dayjs().add(LOGIN_REACTIVE_TIME, 'minute');
          if (!(limitTime > expireTime)){
            return {
              flag:true,
              data:`you have exceed the number of limit.you can login after ${common.getDifferenceOfTwoDatesInTime(now,limitTime)}.`
            };
          }
          await dbService.update(model.userAuthSettings, { userId:user.id }, {
            loginReactiveTime: expireTime.toISOString(),
            loginRetryLimit: userAuth.loginRetryLimit + 1
          });
          return {
            flag: true,
            data:`you have exceed the number of limit.you can login after ${common.getDifferenceOfTwoDatesInTime(now,expireTime)}.`
          };
        } else {
          await dbService.update(model.userAuthSettings, { userId:user.id }, {
            loginReactiveTime: null,
            loginRetryLimit: 0
          });
          userAuth = await dbService.findOne(model.userAuthSettings, { userId: user.id });
        }
      } else {
        // send error
        let expireTime = dayjs().add(LOGIN_REACTIVE_TIME, 'minute');
        await dbService.update(model.userAuthSettings, { userId:user.id }, {
          loginReactiveTime: expireTime.toISOString(),
          loginRetryLimit: userAuth.loginRetryLimit + 1
        });
        return {
          flag: true,
          data:`you have exceed the number of limit.you can login after ${common.getDifferenceOfTwoDatesInTime(now,expireTime)}.`
        };
      }
    }
    if (password){
      let isPasswordMatched  = await user.isPasswordMatch(password);
      if (!isPasswordMatched){
        await dbService.update(model.userAuthSettings,{ userId:user.id },{ loginRetryLimit:userAuth.loginRetryLimit + 1 });
        return {
          flag:true,
          data:'Incorrect Password'
        };
      }
    }
    const userData = user.toJSON();
    let token = await generateToken(userData,JWT.DESKTOP_SECRET);
    if (userAuth && userAuth.loginRetryLimit){
      await dbService.update(model.userAuthSettings, { userId:user.id }, {
        loginRetryLimit: 0,
        loginReactiveTime: null
      });
    }
    let expire = dayjs().add(JWT.EXPIRES_IN, 'second').toISOString();
    await dbService.createOne(model.userTokens, {
      userId: user.id,
      token: token,
      tokenExpiredTime: expire
    });
    let userToReturn = {
      ...userData,
      token
    };
    return {
      flag:false,
      data:userToReturn
    };

  } catch (error) {
    throw new Error(error.message);
  }
};
/**
 * @description : service to change password.
 * @param {obj} params : object of new password, old password and user`s id.
 * @return {obj}  : returns status of change password. {flag,data}
 */
const changePassword = async (params)=>{
  try {
    let password = params.newPassword;
    let oldPassword = params.oldPassword;
    let where = { id:params.userId };
    where.isActive = true;where.isDeleted = false;        let user = await dbService.findOne(model.user,where);
    if (!user || !user.id) {
      return {
        flag:true,
        data:'User not found'
      };
    }
    const isPasswordMatched = await user.isPasswordMatch(oldPassword);
    if (!isPasswordMatched){
      return {
        flag:true,
        data:'Incorrect Old Password'
      };
    }
    password = await bcrypt.hash(password, 8);
    let updatedUser = dbService.update(model.user,where,{ password:password });
    if (!updatedUser) {
      return {
        flag:true,
        data:'password can not changed due to some error.please try again'
      };
    }
    return {
      flag:false,
      data:'Password changed successfully'
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
/**
 * @description : service to reset password.
 * @param {obj} userId : user`s id
 * @param {string} newPassword : new password to be set.
 * @return {}  : returns status whether new password is set or not. {flag, data}
 */
const resetPassword = async (userId, newPassword) => {
  try {
    let where = { id: userId };
    where.isActive = true;where.isDeleted = false;        const dbUser = await dbService.findOne(model.user,where);
    if (!dbUser) {
      return {
        flag: true,
        data: 'User not found',
      };
    }
    newPassword = await bcrypt.hash(newPassword, 8);
    let updatedUser = await dbService.update(model.user, where, { password: newPassword });
    if (!updatedUser) {
      return {
        flag: true,
        data: 'Password is not reset successfully',
      };
    }
    await dbService.update(model.userAuthSettings, { userId:userId }, {
      resetPasswordCode: '',
      expiredTimeOfResetPasswordCode: null,
      loginRetryLimit: 0
    });
    // Send Email from here
    return {
      flag: false,
      data: 'Password reset successfully',
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  loginUser,
  changePassword,
  resetPassword,
};
