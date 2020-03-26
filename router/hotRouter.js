const express = require('express')
const router = express.Router()
const {findHotByKw,
     insertHot,
     findHot,
     delHot,
     updateHot,
     findHotByPage} = require('../controls/HotControl')

/**
 * @api {post} /admin/hot/add   添加热门话题
 * @apiName add
 * @apiGroup Hot
 *
 * @apiParam {String} name 话题名称.
 * @apiParam {String} desc 话题内容.
 *
 * @apiSuccess {String} err 状态码r.
 * @apiSuccess {String} msg  信息提示.
 */
router.post('/add',(req,res)=>{
  // 接受数据
  let {name,desc} = req.body 
  // 处理数据 插入数据库
  insertHot({name,desc})
  .then(()=>{res.send({err:0,msg:'插入成功'})})
  .catch((err)=>{
    res.send({err:-1,msg:'插入失败请重试'})})
  // 返回数据
})
/**
 * @api {post} /admin/Hot/info  话题id查询
 * @apiName info
 * @apiGroup Hot
 *
 *@apiParam {String} _id 主键id. 

 * @apiSuccess {String} err 状态码r.
 * @apiSuccess {String} msg  信息提示.
 * @apiSuccess {Array} list  查询到的数据.
 */
// 根据id获取商品 
router.post('/infos',(req,res)=>{
  let  {_id} = req.body
  findHot(_id)
  .then((infos)=>{res.send({list:infos,err:0,msg:'查询成功'})})
  .catch((err)=>{res.send({err:-1,msg:'查询失败请重试'})})
})
/**
 * @api {post} /admin/hot/del  话题删除
 * @apiName del
 * @apiGroup Hot
 *
 * @apiParam   {String} _id  话题主键id
 * 
 * @apiSuccess {String} err 状态码r.
 * @apiSuccess {String} msg  信息提示.
 * @apiSuccess {Array} list  查询到的数据.
 */
// 2. 删除h话题
router.post('/del',(req,res)=>{
  // 获取要删除数据的id
  let {_id} = req.body
  delHot(_id)
  .then(()=>{res.send({err:0,msg:'删除成功'})})
  .catch((err)=>{res.send({err:-1,msg:'删除失败请重试'})})

})

/**
 * @api {post} /admin/hot/update   话题修改
 * @apiName update
 * @apiGroup Hot
 *
 * @apiParam {String} _id  话题主键id
 * @apiParam {String} name 话题名字.
 * @apiParam {String} desc 话题内容.
 *
 * @apiSuccess {String} err 状态码r.
 * @apiSuccess {String} msg  信息提示.
 */

router.post('/update',(req,res)=>{
  // 获取修改数据的参数
  let {_id,name,img,desc,topic} = req.body 
  updateHot(_id,{name,img,desc,topic})
  .then(()=>{res.send({err:0,msg:'修改成功'})})
  .catch((err)=>{res.send({err:-1,msg:'修改失败请重试'})})
})
/**
 * @api {post} /admin/hot/infopage   分页查询
 * @apiName infopage
 * @apiGroup Hot
 *
 * @apiParam {String} page 查询页码数.
 * @apiParam {String} pageSize 每页的数据条数.
 *
 * @apiSuccess {String} err 状态码r.
 * @apiSuccess {String} msg  信息提示.
 */
router.post('/infoPage',(req,res)=>{
  let page = req.body.page||1 //查询的第几页数据
  let pageSize = req.body.pageSize ||2 //每页几条数据
  findHotByPage(page,pageSize)
  .then((data)=>{
     console.log(data)
     let {result,allCount}=data 
    res.send({err:0,msg:'查询成功',list:result,allCount})
  })
  .catch((err)=>{res.send({err:-1,msg:'查询失败请重试'})})
})

// 模糊查询 关键字查询带分页功能
// 也要和分页做关联
/**
 * @api {post} /admin/hot/kwinfo   关键字查询
 * @apiName kwinfo
 * @apiGroup Hot
 *
 * @apiParam {String} kw 关键字 
 * @apiParam {String} page 页码数 
 * @apiParam {String} pageSize 每页条数.
 *
 * @apiSuccess {String} err 状态码r.
 * @apiSuccess {String} msg  信息提示.
 */
router.post('/kwInfo',(req,res)=>{
  let kw = req.body.kw ||''
  let page = req.body.page||1
  let pageSize = req.body.pageSize||2
  findHotByKw(kw,page,pageSize)
  .then((data)=>{
    res.send({err:0,msg:'查询成功',list:data.result,allCount:data.allCount})
  })
  .catch((err)=>{res.send({err:-1,msg:'查询失败请重试'})})
})
module.exports = router