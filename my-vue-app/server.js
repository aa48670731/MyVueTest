// 安装依赖： npm install express mongodb
import express from 'express'
import { MongoClient, ObjectId } from 'mongodb'
import cors from 'cors'



const app = express()
app.use(cors())
app.use(express.json()) // 解析 JSON 请求体

// MongoDB 连接配置
const uri = 'mongodb://localhost:27017' // 本地 MongoDB 地址
const client = new MongoClient(uri)
const dbName = 'website_vue' // 你的数据库名

// 获取列表的接口
app.get('/get_list', async (req, res) => {
    await client.connect()
    const db = client.db(dbName)
    const data = await db.collection('list').find({}).toArray()
    res.json({ ok: true, list: data })
    return res
})


// 添加数据的接口
app.post('/add_todo', async (req, res) => {
    const body = req.body
    console.log('收到数据:', body)

    await client.connect()
    const db = client.db(dbName)

    const result = await db.collection('list').insertOne(body)

    res.json({
        ok: true,
        message: '添加成功',
        insertedId: result.insertedId
    })

})

// 切换 isCompleted 的接口
app.post('/update_todo', async (req, res) => {
    const id = req.body.id

    if (!id) {
        return res.json({ ok: false, message: '缺少 id 参数' })
    }

    await client.connect()
    const db = client.db(dbName)

    // 查找当前记录
    const item = await db.collection('list').findOne({ _id: new ObjectId(id) })
    if (!item) {
        return res.json({ ok: false, message: '数据不存在' })
    }
    // 取反 isCompleted
    const newStatus = !item.isCompleted
    // 更新
    await db.collection('list').updateOne(
        { _id: new ObjectId(id) },
        { $set: { isCompleted: newStatus } }
    )
    res.json({
        ok: true,
        message: '更新成功',
        newStatus
    })
})

// 删除数据的接口
app.post('/del_todo', async (req, res) => {
    const { id } = req.body

    if (!id || !ObjectId.isValid(id)) {
        return res.json({
            ok: false,
            message: '缺少或无效的 id 参数'
        })
    }

    await client.connect()
    const db = client.db(dbName)

    const result = await db.collection('list').deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
        return res.json({
            ok: false,
            message: '未找到对应数据'
        })
    }

    res.json({
        ok: true,
        message: '删除成功'
    })

})

// 启动服务
app.listen(3000, () => {
    console.log('服务器运行在 http://localhost:3000')
})
