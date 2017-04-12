/**
 * Created by Administrator on 2017/2/15.
 */
//rem缩放实现 所有横屏安100份分；
(function selSuit(){
  var html=document.getElementsByTagName("html")[0];
  var cw=document.documentElement.clientWidth;
  var ch=document.documentElement.clientHeight;
  //设置html的 fontsize
  var html_fontsize=html.style.fontSize=cw/100+"px";
  //设置左中右布局的高度
  var ch_rem=ch/parseFloat(html_fontsize)+"rem";
  $(".container").css("minHeight",ch);


  window.onresize=selSuit;
  console.log("font-size:"+html.style.fontSize);
//飞入左右选取
  setTimeout(function(){
    $("#left_select,#right_select").addClass("animated bounceInLeft");
  });

})();
//屏幕竖放提示
//自动判断设备横屏or竖屏



//
$("#left_back").click(function(){
  $(".left_box").animate({"left":"-100%"},1500);
  $(".middle_box").animate({"left":"0"},1500);
  $(".right_box").animate({"left":"100%"},1500);
  console.log("3");
});
//页面右边到中间
$("#right_back").click(function(){
  $(".left_box").animate({"left":"-100%"},1500);
  $(".middle_box").animate({"left":"0"},1500);
  $(".right_box").css({"position":"fixed"}).animate({"left":"100%"},1500);
});
//设置跳转和图片
$(".left_box #container").on("click","a",function(e){
  if(e.target.tagName=="A"){
    var href=$(this).data("link");
    if(href==""){
      e.preventDefault();
      var input=prompt();
      console.log(input);
      $(this).data("link",input);
      console.log(href);
    }else{
      //location.href=href;
      window.open(href);
    }
  }

});
$(".left_box #container a:nth-child(1)").css("backgroundImage","url('img/baidu.png')");
$(".left_box #container a:nth-child(2)").css("backgroundImage","url('img/fenghuang.png')");
$(".left_box #container a:nth-child(3)").css("backgroundImage","url('img/tudou.png')");
$(".left_box #container a:nth-child(4)").css("backgroundImage","url('img/douyu.png')");
$(".left_box #container a:nth-child(5)").css("backgroundImage","url('img/githup.png')");
$(".left_box #container a:nth-child(6)").css("backgroundImage","url('img/stackoverflow.png')");
var cat_video=document.getElementById("cat_video");
//点击进入开始视频
$(".btn").click(function(){
  cat_video.play();
  $(".btn").hide("slow");
});
//点击x关闭视频
$("#v_container>a").click(function(){
  $("#v_container").css("display","none");
  beginMusic();
  cat_video.pause();
  $(".box").show("slow");
});

$("#left_select").mouseover(function(){
  $("#left_select").removeClass("animated bounceInLeft").addClass("animated swing 2");
  $("#eye").css("left","11.2rem");
}).click(function(){
  $(".left_box").animate({"left":0},2000);
  $(".middle_box").animate({"left":"100%"},2000);
  $(".right_box").animate({"left":"200%"},2000);
});
$("#left_select").mouseout(function(){
  $("#left_select").removeClass("animated swing 2");
  $("#eye").css("left","11.4rem");
});
$("#right_select").mouseover(function(){
  $("#right_select").removeClass("animated bounceInLeft").addClass("animated swing 2");
  $("#eye").css("left","11.6rem");
}).click(function(){
  $(".left_box").animate({"left":"-200%"},2000);
  $(".middle_box").animate({"left":"-100%"},2000);
  $(".right_box").animate({"left":0},2000).css({"position":"absolute"});

});
$("#right_select").mouseout(function(){
  $("#right_select").removeClass("animated swing 2");
  $("#eye").css("left","11.4rem");
});


//right  tabs control
$(".right_box .tabs a")
  .mouseover("a",function(){
    $(this).addClass("active").stop().animate({"top":"-10px"},300);
  })
  .click(function(e){
    e.preventDefault();
    $(this).css("backgroundPositionX","-90px").css("color","#FDC62A")
      .parent().siblings().children().css("backgroundPositionX",0).css("color","#000");
    $(this).parent().addClass("active").siblings().removeClass("active");
    $(this).stop().animate({"top":"-10px"},300);
    //下拉控制 根据a中href 找对应的 div，控制其显示
    console.log($(this).attr("href"));
    $($(this).attr("href")).fadeIn(800).siblings(".pull_tab").hide();
  }
)
  .mouseleave("a",function(){
    $(this).removeClass("active").stop().animate({"top":0},300);
  });
$(".accordion").on("click",".title",function(e){
  var $target=$(e.target);//获得目标元素
  //找到目标元素的下一个兄弟元素，设置其切换伸缩效果
  $target.next().slideToggle();
});
window.onload=function(){
  /**功能点5：页面加载完成后，异步请求当前登录用户的消费统计数据，绘制SVG统计图——使用第三方绘图库：FusionCharts**/

  $.ajax({
    type: 'GET',
    url: 'data/8_buy_stat.php',
    success: function(list){
      //list形如：[{label:'',value:xx},{}]
      //使用FusionCharts绘制统计图
      var fc = new FusionCharts({
        type: 'column2d',//column3d、column3d、bar2d、bar3d、pie2d、pie3d、doughnut2d、doughnut3d
        width: '100%',
        height: '400',
        dataSource: {     //指定数据源
          data: list
        }
      });
      fc.render('container-buy-stat-svg'); //指定渲染在哪个容器中
    }
  });

  //功能点6：当视频启动时，背景音乐停止
  //音视频控制
  var video=document.getElementById("bg_video");
  video.onplay=function(){
    stopMusic();
  };
  video.onpause=function(){
    beginMusic();
  };
  //停止pumping动画
//function pause_video(){
//  var video=document.getElementById("bg_video");
//  video.pause();
//}

$(".video").click(function(){
  console.log(this);
  if(!video.paused){
    video.pause();
  }
});


  //window.load结尾
};

//播放背景音乐
function beginMusic(){
  var audio=document.getElementById("bg_music");
  audio.play();
  audio.volume=0.2;
}
function stopMusic(){
  var audio=document.getElementById("bg_music");
  audio.pause();
}

//视频播放完成事件
cat_video.onended=function(){
  $("#v_container").css("display","none");
  $(".box").show("slow");
  beginMusic();
};
//当点击播放视频时 音乐停止

