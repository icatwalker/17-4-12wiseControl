/**
 * Created by Administrator on 2017/4/10.
 */
//rem缩放实现 所有横屏安100份分；
(function selSuit(){
    var url,username,password,xmldata;
    var html=document.getElementsByTagName("html")[0];
    var cw=document.documentElement.clientWidth;
    var ch=document.documentElement.clientHeight;
    console.log(cw);
    //设置html的 fontsize
    var html_fontsize=html.style.fontSize=cw/100+"px";
    //设置左中右布局的高度
    var ch_rem=ch/parseFloat(html_fontsize)+"rem";
    $(".container").css("height",ch_rem);
    window.onresize=selSuit;
    console.log("font-size:"+html.style.fontSize);
//飞入左右选取
//    获取节目单
    var url="wpgetxmlids.asp?rnd="+Math.random(999);
    getChannelList(url);


    //p3页获得
    $.ajax({
        data:{username:username,password:password},
        url: url,
        dataType: 'xml',
        type: 'GET',		//提交方式
        timeout: 35000,		//失败时间
        error: function(xml)
        {
            $("#title").text("加载数据出错！点击刷新！")
        },
        success: function(xml)
        {
            console.log(xml);
            $("#menuItemList").html("");
            $("#title").text("节目单信息(读取/刷新)");
            var userInfo=$(xml).find("userInfo");
            var clientInfo=$(xml).find("clientInfo");//获得终端信息标签
            var menuID=$(clientInfo).attr("menuID");
            var hostName=$(clientInfo).attr("hostName");
            var clientName=$(clientInfo).attr("clientName");
            var menuInfo=$(clientInfo).attr("menuInfo");  //获取当前节目单信息
            var menuPath=$(clientInfo).attr("menuPath");
            var playVol=$(clientInfo).attr("playVol");
            var mplayVol="128";
            var volokget=0;
            var findex=playVol.indexOf("_");
            if (findex>=0)
            {
                //if (parseInt(playVol.substr(findex+1,1))==1)
                //{
                playVol=playVol.substr(0,findex);
                //}
                findex=playVol.indexOf("/");
                if (findex>=0)
                {
                    mplayVol=playVol.substr(findex+1,playVol.length-findex-1);
                    playVol=playVol.substr(0,findex);
                }
            }
            $("#menuInfo").val(menuInfo);				//当前节目单名称存到隐藏域
            $("#menuPath").val(menuPath);
            var clientInfobarHtml="<span>终端名称："+clientName+"</span><span style='margin-left:2em;'>计算机名："+hostName+"</span>";
            clientInfobarHtml=clientInfobarHtml+"<div>节目单名："+menuInfo +"</div>"
            clientInfobarHtml=clientInfobarHtml+"<div id=\"soundnum\">"+playVol+"</div><div id=\"ItemSoundNum\">"+mplayVol+"</div>";
            $("#clientInfoBar").html(clientInfobarHtml);
//alert($(xml).text());
            $(xml).find("item").each(function(i)//遍历每个节目项并加载到页面中
            {
                var itemType,markID,iconLink,descLink,downLink,taskName,moreInfo,taskDesc,duringTime,winFrame,downLink;
                //读取所有属性
                itemType=$(this).find("itemType").text();  //任务类型
                markID=$(this).find("markID").text();		//任务号 素材号-栏目号-主任务号-栏目内任务号
                iconLink=$(this).find("iconLink").text();//图标
                descLink=$(this).find("descLink").text();	//描述连接
                downLink=$(this).find("downLink").text();	//下载、内容连接
                taskName=$(this).find("taskName").text();	//任务名
                moreInfo=$(this).find("moreInfo");	//其他信息字符串
                moreInfo=moreInfo.text().split("\\027");
                taskDesc=moreInfo[0];		//任务描述
                duringTime=moreInfo[1];		//任务持续时间
                winFrame=moreInfo[2];		//任务项所在窗口
                var tempMarkID,itemID,columnID,taskID,column_taskID,cmdstr;
                //素材号-栏目号-主任务号-栏目内任务号
                tempMarkID=markID.split("-");
                itemID=tempMarkID[0];   //素材号
                columnID=tempMarkID[1];	//栏目号
                taskID=tempMarkID[2];	//任务号
                column_taskID=tempMarkID[3];//栏目内任务号

                if(itemID=="0"){itemID=taskID;} //如果素材ID为0则任务号代替
                var ctrlBarHtml="<div id='ctrlBar"+markID+"' class='controlBarDiv' ></div>";//节目项控制菜单
                var imagesrc="<span style='position:relative;top:0;left:0;'><img style='width:3em;height:3em;' src='"+iconLink+"' align='absmiddle'/></span>"//类型图片
                var tempstr="<div class='menuitem' itemType='"+itemType+"' markID='"+markID+"' iconLink='"+iconLink+"' descLink='"+descLink+"' downLink='"+downLink+"' taskName='"+taskName+"' moreInfo='"+moreInfo+"' taskDesc='"+taskDesc+"' duringTime='"+duringTime+"' winFrame='"+winFrame+"' downLink='"+downLink+"'  onclick=\"showCtrlBar('ctrlBar"+markID+"','"+taskID+"',"+itemType+");\" itemid='"+itemID +"'>"+imagesrc+taskDesc+"</div>";
                $("#menuItemList").append(tempstr);
                $("#context").append(ctrlBarHtml);
            });
            //timeShowMsg("title","加载数据成功！",500);
        }
    });

})();

function getChannelList(url){
    url="wpgetxmlids.asp?rnd="+Math.random(999);
    $.ajax({
        data:{gettype:"channel"},
        url: url,
        dataType: 'xml',
        type: 'GET',		//提交方式
        timeout: 15000,		//失败时间
        error: function(xml)
        {
            $("#title").text("获取频道数据出错!");
        },
        success: function(xml)
        {
            console.log(xml);
            var channels=$(xml).find("channel");
            $("#channelList").html("");
            channels.each(function(index, element) {
                var name,path,desc;
                name=$(this).find("name").text();
                path=$(this).find("path").text();
                desc=$(this).find("desc").text();

               var  htmllist=`<li><a href='page3_video.html'>${name}</a></li>`;
                if($("#menuPath").val()==path){
                    $("#channelList").append(htmllist);
                }else{
                    $("#channelList").append(htmllist);
                }
            });

        }
    });
}

function docmd(cmdtype,cmdData){
    if(!isNaN(cmdtype)){//执行显示端命令
        cmdstr=cmdtype+","+cmdData;
        //alert(cmdstr);
        //发送指令
        var sendcmdurl="wpsendclientmsg.asp";
        $.ajax({
            data:{wpsendclientmsg:cmdstr},
            url: sendcmdurl,
            dataType:'html',
            type: 'GET',
            timeout: 15000,		//超时时间
            error:function(xml){
                //alert("发送指令失败");
                timeShowMsg("title","发送指令失败",500);		//失败报错
            },
            success:function(xml){
                if(xml){
                    timeShowMsg("title","指令发送成功",500);		//发送成功
                }
            }
        });
    }
    if(cmdtype=="keycode"){//发送键盘动作
        cmdData="-keyevent "+cmdData;
        var sendcmdurl="wpsendkeys.asp";
        $.ajax({
            data:{wpsendkeys:cmdData},
            url: sendcmdurl,
            dataType:'html',
            type: 'GET',
            timeout: 5000,		//超时时间
            error:function(xml){
                timeShowMsg("title","发送指令失败",500);		//失败报错
            },
            success:function(xml){
                if(xml){
                    timeShowMsg("title","指令发送成功",500);		//发送成功
                }
            }
        });
    }
}

function showCtrlBar(barID,taskID,itemtype){		//显示节目项目控制条函数
    var markID = "";
    var downLink = "";
    var flag = 0;
    markID=barID.replace("ctrlBar","");
    $(".controlBarDiv").slideUp(0);
    $("#"+barID).slideToggle(0);
    $(".menuitem").siblings(".controlBarDiv").hide();
    $(".controlBarDiv").html("");
    $("#itemCtrlBar").find("li[title=FullScreenItemID]").attr("onclick", "docmd(68,'" + barID + "')"); //全屏素材
    $("#itemCtrlBar").find("li[title=FullScreenTaskID]").attr("onclick", "docmd(67,'" + taskID + "')"); //全屏任务
    downLink=$("#itemCtrlBar").find("li[title=DownLoadFile]").parents(".controlBarDiv").prev().attr("downLink");
    if (itemtype == 10 || itemtype == 1010)
    {
        $("#itemCtrlBar").find("li[title=PageDown]").text("暂停");
        $("#itemCtrlBar").find("li[title=PageUp]").text("继续");
        $("#itemCtrlBar").find("li[title=Home]").text("快进");
        $("#itemCtrlBar").find("li[title=End]").text("快退");
        $("#itemCtrlBar").find("li[title=PageDown]").attr("onclick", "docmd(3002,0)"); //暂停播放
        $("#itemCtrlBar").find("li[title=PageUp]").attr("onclick", "docmd(3003,0)"); //继续播放
        $("#itemCtrlBar").find("li[title=Home]").attr("onclick", "docmd(3006,0)"); //快进
        $("#itemCtrlBar").find("li[title=End]").attr("onclick", "docmd(3007,0)"); //快退
        flag = 1;
    }
    else if (itemtype == 8 || itemtype == 1008)
    {
        $("#itemCtrlBar").find("li[title=PageDown]").text("上一页");
        $("#itemCtrlBar").find("li[title=PageUp]").text("下一页");
        $("#itemCtrlBar").find("li[title=Home]").text("首  页");
        $("#itemCtrlBar").find("li[title=End]").text("尾  页");
        $("#itemCtrlBar").find("li[title=PageDown]").attr("onclick", "docmd('keycode','0xFF9B')"); //上一页PPT，PAGEDOWN键
        $("#itemCtrlBar").find("li[title=PageUp]").attr("onclick", "docmd('keycode','0xFF55')"); //下一页PPT，PAGEUP键
        $("#itemCtrlBar").find("li[title=Home]").attr("onclick", "docmd('keycode','0xFF50')"); //跳转到PPT第一页，按HOME键
        $("#itemCtrlBar").find("li[title=End]").attr("onclick", "docmd('keycode','0xFF57')"); //跳转到PPT最后一页，按END键
    }
    else if (itemtype == 0 || itemtype == 1000 || itemtype == 12 || itemtype == 1012)
    {
        if (downLink!=null && (downLink.indexOf(".ppt") >= 0 || downLink.indexOf(".pps") >= 0))
        {
            $("#itemCtrlBar").find("li[title=PageDown]").text("上一页");
            $("#itemCtrlBar").find("li[title=PageUp]").text("下一页");
            $("#itemCtrlBar").find("li[title=Home]").text("首  页");
            $("#itemCtrlBar").find("li[title=End]").text("尾  页");
            $("#itemCtrlBar").find("li[title=PageDown]").attr("onclick", "docmd('keycode','0xFF55')"); //上一页PPT，PAGEDOWN键
            $("#itemCtrlBar").find("li[title=PageUp]").attr("onclick", "docmd('keycode','0xFF9B')"); //下一页PPT，PAGEUP键
            $("#itemCtrlBar").find("li[title=Home]").attr("onclick", "docmd('keycode','0xFF50')"); //跳转到PPT第一页，按HOME键
            $("#itemCtrlBar").find("li[title=End]").attr("onclick", "docmd('keycode','0xFF57')"); //跳转到PPT最后一页，按END键
        }
        else
        {
            $("#itemCtrlBar").find("li[title=PageDown]").text("暂停");
            $("#itemCtrlBar").find("li[title=PageUp]").text("继续");
            $("#itemCtrlBar").find("li[title=Home]").text("快进");
            $("#itemCtrlBar").find("li[title=End]").text("快退");
            $("#itemCtrlBar").find("li[title=PageDown]").attr("onclick", "docmd(3002,0)"); //暂停播放
            $("#itemCtrlBar").find("li[title=PageUp]").attr("onclick", "docmd(3003,0)"); //继续播放
            $("#itemCtrlBar").find("li[title=Home]").attr("onclick", "docmd(3006,0)"); //快进
            $("#itemCtrlBar").find("li[title=End]").attr("onclick", "docmd(3007,0)"); //快退
            flag = 1;
        }
    }

    $("#itemCtrlBar").find("li[title=TurnTask]").attr("onclick","docmd(16,'"+taskID+"')");//跳转到当前任务
    $("#itemCtrlBar").find("li[title=StopTask]").attr("onclick","docmd(70,'0')");//停止任务，切换到最后一条。

    $("#"+barID).html($("#hiddenItemCtrlBar").html());

    if (downLink!=null)
    {
        if(downLink.indexOf("http:")==0){

        }else if(downLink.indexOf("DisplayFile")==0){
            downLink="$$"+$("#menuPath").val()+"onlydownload_"+downLink;
            downLink="http://"+window.location.host+"/"+downLink;
        }else{
            downLink="$$"+downLink;
            downLink="http://"+window.location.host+"/"+downLink;
        }
        downLink=encodeURI(downLink);
    }
    if (flag == 1)
    {
        $("#itemCtrlBar").find("li[title=ViewItem]").text("控制条");
        $("#itemCtrlBar").find("li[title=ViewItem]").attr("onclick", "docmd(3008,0)"); //显示/隐藏扩展窗口(标题条)
    }
    else
    {
        $("#itemCtrlBar").find("li[title=ViewItem]").text("预览素材");
        if (downLink!=null) $("#itemCtrlBar").find("li[title=ViewItem]").attr("onclick","window.open('"+downLink.replace(downLink,"onlydownload_","")+"')");//预览文件
    }
    if (downLink!=null) $("#itemCtrlBar").find("li[title=DownLoadFile]").attr("onclick", "window.open('" + downLink + "')");  //下载文件
}
