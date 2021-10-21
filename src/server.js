const express = require("express");
const app = express();
const { userRouter, blogRouter } = require("./routes");
const mongoose = require("mongoose");
const { generateFakeData } = require("../faker2");

const MONGO_URI =
  "";

const server = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // mongoose.set('debug', true)
    // let result = mongoose.connect(MONGO_URI)

    // json을 자바스크립트로 변경
    app.use(express.json());

    // url이 user로 시작할 경우
    app.use("/user", userRouter);
    app.use("/blog", blogRouter);

    app.listen(3000, async () => {
      console.log("server listening on port 3000");
      // await generateFakeData(10, 10, 10);
    });
  } catch (error) {
    console.log(error);
  }
};

server();

// 1:1 & 1:N
// 개별적으로 읽을때, 내장하려는 문서가 자주 바뀔 때 -> 관계

// 같이 불러올 때가 많을 때, 읽기 비중이 더 높을 때 -> 내장(쓰기(CUD) < 읽기(R))

// 1:N
// N < 100 -> 내장
// 100 < N < 1000 -> 부분(ID만) 내장
// 1000 < N -> 관계
// N을 다양한 조건을 톰색 시 -> 관계

// 확실하지 않을 경우 관계로...!
// 처음부터 완벽하게 할 필요는 없다.
