const UserModel = require("../db/model/userModel")
const {createToken} = require('../utils/jwt')
let userReg = async (user,pass)=>{
  //  1. 用户是否重复
  let isExst = await UserModel.findOne({user})
  let result
  // 如果查询到数据 返回查到的数据 没有返回假 
  if(isExst){
    throw '邮箱已注册'
  }else{
    result = await UserModel.insertMany({user,pass})
  }
  //  2. 插入数据库
  return result
}

//用户修改
let updateUser = async (user,oldpass,newpass)=>{
  //  1. 用户是否重复
  let isExst = await UserModel.findOne({user,pass:oldpass})
  let result
  // 如果查询到数据 返回查到的数据 没有返回假 
  if(isExst){
    result = await UserModel.updateOne({user},{pass:newpass})
  }else{
    throw '该用户未注册'
  }
  //  2. 插入数据库
  return result
}
// 删除用户
let delUser = async (_id)=>{
  // _id 就是要删除的词典主键id
 let result = await UserModel.deleteOne({_id})
 return result
}

// 用户登录
let userLogin = async (user,pass)=>{
  let result = await UserModel.findOne({user,pass})

  if(result){
    //  登录成功 产生新的token
    let {_id,user} = result
    let token =createToken({_id,user}) 
    //将token更新数据库
    let updateResult  = await UserModel.updateOne({_id},{token})
    // 错误处理判断
    return {_id,user,token}
  }else{
    throw '用户名或密码不存在'
  }
}
//  判断token 和用户是否统一 
let tokenCheck = async (_id,token)=>{
   let result = await UserModel.findOne({_id,token})
   if(result){
     return result 
   }else{
     throw '用户token不匹配'
   }
}
// 退出登录
let logOut = async (_id)=>{
 let result = await UserModel.updateOne({_id},{token:''})
 if(result){
  return result 
}else{
  throw '退出失败请重试'
}
}

// 分页查询
let findUserByPage = async (page,pageSize)=>{
  let  allUser = await UserModel.find() 
  // 总数据条数
  let  allCount = allUser.length
  // 每一页的数据
  let result =await UserModel.find().skip((Number(page)-1)*pageSize).limit(Number(pageSize))
  return {result,allCount}
}

module.exports={
  userReg,
  userLogin,
  tokenCheck,
  logOut,
  findUserByPage,
  updateUser,
  delUser
}