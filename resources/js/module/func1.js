// 使用require是用commonjs引用法
// const $ = require("jquery"); //使用jquery模組

//新的寫法
import $ from "jquery";

$(document).ready(function(){
  console.log('hihi')
})