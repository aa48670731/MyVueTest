<script setup>
import { ref } from "vue";
import axios from "axios";
getList();
const value = ref("");
const list = ref([]);

// 接口写在本地，localhost:3000,基于ChatGPT跑的接口（）
// 发起网络请求的函数前都要加上async，作为异步函数
async function getList() {
  // await关键字在异步函数里才能使用！async和await一定是同时出现的
  const res = await axios({
    // 接口地址以字符串形式传入
    url: "http://localhost:3000/get_list",
    //下面是公网测试用
    // url: "https://36.158.228.122:56872/api/get_list",
    // 请求方法也是以字符串形式传入
    method: "GET",
  });
  list.value = res.data.list;
  console.log(res);
}

async function add() {
  value.value = value.value.trim();
  if (value.value === "") {
    return;
  }
  await axios({
    url: "http://localhost:3000/add_todo",
    //下面是公网测试用
    // url: "https://36.158.228.122:56872/api/add_todo",
    method: "POST",
    data: {
      value: value.value,
      isCompleted: false,
    },
  });

  getList();
  value.value = "";
}

async function update(id) {
  await axios({
    url: "http://localhost:3000/update_todo",
    //下面是公网测试用
    // url: "https://36.158.228.122:56872/api/update_todo",
    method: "POST",
    data: {
      id,
    },
  });

  getList();
}

async function del(id) {
  await axios({
    url: "http://localhost:3000/del_todo",
    //下面是公网测试用
    // url: "https://36.158.228.122:56872/api/del_todo",
    method: "POST",
    data: {
      id,
    },
  });

  getList();
}
</script>
<template>
  <div class="todo-app">
    <div class="title">待办事项APP——萌萌的小尸</div>

    <div class="todo-form">
      <input
        v-model="value"
        type="text"
        class="todo-input"
        placeholder="添加一条待办事项"
      />
      <div @click="add" class="todo-button">添加</div>
    </div>

    <div
      v-for="(item, index) in list"
      :class="[item.isCompleted ? 'completed' : 'item']"
    >
      <!-- _id是getList接口返回的id，具有唯一性 -->
      <div>
        <input
          @click="update(item._id)"
          v-model="item.isCompleted"
          type="checkbox"
        />
        <span class="name">{{ item.value }}</span>
      </div>

      <div @click="del(item._id)" class="del">删除</div>
    </div>
  </div>
</template>

<style scoped>
.todo-app {
  box-sizing: border-box;
  margin-top: 40px;
  margin-left: 1%;
  padding-top: 30px;
  width: 98%;
  height: 500px;
  background: #ffffff;
  border-radius: 5px;
}

.title {
  text-align: center;
  font-size: 30px;
  font-weight: 700;
}

.todo-form {
  display: flex;
  margin: 20px 0 30px 20px;
}

.todo-button {
  width: 100px;
  height: 52px;
  border-radius: 0 20px 20px 0;

  text-align: center;
  background: linear-gradient(to right, #ff9a9e, #fad0c4, #fbc2eb);
  /* 从左到右的粉色渐变 */
  color: #fff;
  line-height: 52px;
  cursor: pointer;
  font-size: 14px;
  user-select: none;
}

.todo-input {
  padding: 0px 15px 0px 15px;
  border-radius: 20px 0 0 20px;
  border: 1px solid #dfe1e5;
  outline: none;
  width: 60%;
  height: 50px;
}

.item {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80%;
  height: 50px;
  margin: 8px auto;
  padding: 16px;
  border-radius: 20px;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 20px;
}

.del {
  color: red;
}

.completed {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80%;
  height: 50px;
  margin: 8px auto;
  padding: 16px;
  border-radius: 20px;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 20px;
  text-decoration: line-through;
  opacity: 0.4;
}
</style>
