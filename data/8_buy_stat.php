<?php
/**
*根据客户端提交的用户名，访问数据库读取过去的消费记录——SQL分组求和，——太麻烦
*模拟创建过去12个月中的消费总金额，直接伪造出JSON数据即可，
*返回数据形如：
*[
*   {"label":"10月","value":3500},
*   {"label":"11月","value":3000},
*   ...
*]
**/
header('Content-Type: application/json;charset=UTF-8');
//TODO:此处应该访问数据库，获取数据
$output = [
    ['label'=>'html', 'value'=>7],
    ['label'=>'css', 'value'=>7.5],
    ['label'=>'js', 'value'=>6.5],
    ['label'=>'jquery', 'value'=>6],
    ['label'=>'bootstrap', 'value'=>6.5],
    ['label'=>'ionic', 'value'=>6],
    ['label'=>'Angularjs', 'value'=>5],
    ['label'=>'h5', 'value'=>6.5],
    ['label'=>'ps', 'value'=>7],
    ['label'=>'page design', 'value'=>6]
];
echo json_encode($output);


