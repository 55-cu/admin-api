// 用户相关的路由
/*
1 注册 
   接受用户 邮箱 密码 验证码 
   1. 验证码ok 
   2. 用户是否存在
   3. 注册
2 获取验证码
   用户发一个邮箱 
   我给邮箱发一个验证码
3 登录
*/ 

const  express = require('express')
const  {userReg,userLogin,logOut,findUserByPage,updateUser,delUser} = require("../controls/userControl.js")
const tokenMiddlWare = require('../middleware/tokenMiddleWare')
// const  Mail = require('../utils/mail')
// const  mails={} 
const router = express.Router()
// router.post('/getCode',(req,res)=>{
//   let {mail} = req.body 
//   let code =parseInt(Math.random()*9999)
//   Mail.send(mail,code).then(()=>{
//     mails[mail] = code 
//     res.send({err:0,msg:'验证码发送ok'})
//   })
//   .catch(()=>{
//     res.send({err:-1,msg:'验证码发送nook'})
//   })
// })

 /**
 * @api {post} /admin/user/reg  用户注册
 * @apiName reg
 * @apiGroup User
 *
 * @apiParam {String} user  用户名.
 * @apiParam {String} pass  注册密码.
 *
 * @apiSuccess {String} err 状态码r.
 * @apiSuccess {String} msg  信息提示.
 */
router.post('/reg',(req,res)=>{
  let {user,pass} = req.body 
  // console.log(req.body)
  userReg(user,pass)
  .then(()=>{res.send({err:0,msg:'注册ok'})})
  .catch((err)=>{res.send({err:-2,msg:err})})
})

 /**
 * @api {post} /admin/user/login  用户登录
 * @apiName login
 * @apiGroup User
 *
 * @apiParam {String} user  注册名称.
 * @apiParam {String} pass  注册密码.
 *
 * @apiSuccess {String} err 状态码r.
 * @apiSuccess {String} msg  信息提示.
 */
router.post('/login',(req,res)=>{
  let {user,pass} = req.body 
  userLogin(user,pass)
  .then((info)=>{ 
    // // 登录成功之后产生token 并返回
    // let token =createToken()
    res.send({err:0,msg:'登录成功',userInfo:info})
  })
  .catch((err)=>{ res.send({err:-1,msg:err})})
})

// 退出登录 也需要验证token  tokenMiddlWare中间件
router.post('/logout',(req,res)=>{
  let {_id} = req.body 
  // 数据库里的token的清空
  logOut(_id)
  .then(()=>{
    res.send({err:0,msg:'退出ok'})
  })

})

/**
 * @api {post} /admin/user/infopage   用户查询
 * @apiName infopage
 * @apiGroup User
 *
 * @apiParam {String} page 查询页码数.
 * @apiParam {String} pageSize 每页的数据条数.
 *
 * @apiSuccess {String} err 状态码r.
 * @apiSuccess {String} msg  信息提示.
 */
router.post('/infopage',(req,res)=>{
  let page = req.body.page||1 //查询的第几页数据
  let pageSize = req.body.pageSize ||2 //每页几条数据
  findUserByPage(page,pageSize)
  .then((data)=>{
     let {result,allCount}=data 
    res.send({err:0,msg:'查询成功',list:result,allCount})
  })
  .catch((err)=>{res.send({err:-1,msg:'查询失败请重试'})})
})

/**
 * @api {post} /admin/user/update   用户密码修改
 * @apiName update
 * @apiGroup User
 *
 * @apiParam {String} user 用户名称.
 * @apiParam {String} oldpass 旧密码.
 * @apiParam {String} newpass 修改的密码.
 *
 * @apiSuccess {String} err 状态码r.
 * @apiSuccess {String} msg  信息提示.
 */

router.post('/update',(req,res)=>{
  // 获取修改数据的参数
  let {user,oldpass,newpass} = req.body 
  updateUser(user,oldpass,newpass)
  .then(()=>{res.send({err:0,msg:'修改成功'})})
  .catch((err)=>{res.send({err:-1,msg:err+'请重试'})})
})

/**
 * @api {post} /admin/user/del  用户删除
 * @apiName del
 * @apiGroup User
 *
 * @apiParam   {String} _id  用户主键id
 * 
 * @apiSuccess {String} err 状态码r.
 * @apiSuccess {String} msg  信息提示.
 * @apiSuccess {Array} list  查询到的数据.
 */
// 2. 删除菜品
router.post('/del',(req,res)=>{
  // 获取要删除数据的id
  let {_id} = req.body
  delUser(_id)
  .then(()=>{res.send({err:0,msg:'删除成功'})})
  .catch((err)=>{res.send({err:-1,msg:'删除失败请重试'})})

})

module.exports = router