<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<%
    String sendCodeTime = session.getAttribute("SEND_CODE_TIME").toString(); //从session里把a拿出来，并赋值给M
%>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
    <title><@spring.message "site"/></title>
    <style>
        *{padding:0;margin:0;}
        a{text-decoration:none;}
        input{border:0;font-size:14px;line-height:38px;text-indent:5px;width:230px;float:left;font-family:"微软雅黑";}
        img{border:0;display:block;}
        .mainBox{
            overflow:hidden;
            position:relative;
            height:485px;
            margin-top:7%;
        }
        .logoC{
            height:109px;
            width:962px;
            background:url(${resource}/images/login/logo_bg.png);
            background-repeat:no-repeat;
            overflow:hidden;
            margin:0 auto;
        }
        .links{
            margin-top:75px;
            float:right;
        }
        .links a{
            float:left;
            font-size:12px;
            color:#787878;
            padding:0 18px;
            border-right:1px solid #787878;

        }
        .links a:hover{
            color:#005bac;
        }
        .bottomBg{
            height:375px;
            background:#efefef;
            width:962px;
            margin:0 auto;
        }
        .loginC{
            width:100%;
            background:#005bac;
            height:313px;
            position:absolute;
            bottom:32px;
        }
        .small{
            width:962px;
            margin:0 auto;
            overflow:hidden;
        }
        .intro{
            float:left;
            background:#0055a0;
            width:560px;
        }
        .loginBox{
            width:345px;
            float:left;
            background:#ffffff;
            height:313px;

            overflow:hidden;
            <#if rc.locale == "zh_CN" >
            font-family: "黑体";
            <#else>
            font-family: Arial;
            </#if>
        }
        .iptArea{
            line-height:38px;
            border:1px solid #bdbdbd;
            width:306px;
            margin:0 auto;
            box-sizing:border-box;
            padding-left:39px;
            overflow:hidden;
        }
        .delete{
            height:38px;
            width:30px;
            float:left;
        }
        .user{
            background:url(${resource}/images/login/user.png);
            background-repeat:no-repeat;
            margin-top:34px;
        }
        .password{
            background:url(${resource}/images/login/key.png);
            background-repeat:no-repeat;
            margin-top:20px;
        }
        .chek{
            overflow:hidden;
            width:306px;
            margin:0 auto;
            margin-top:30px;
            <#if rc.locale == "zh_CN" >
            font-family: "黑体";
            <#else>
            font-family: Arial;
            </#if>
        }
        .chek div{
            float:left;
            font-size:12px;
            color:#999999;
            margin-right:36px;
        }
        .chek div input{
            float:left;
            width:18px;
            margin-top:1px;
        }
        .chek .forgot{
            float:right;
            margin-right:0;

        }
        .chek .forgot a{
            color:#999999;
        }
        .loginBtn{
            width:146px;
            height:35px;
            margin:0 auto;
            margin-top:27px;
        }
        .getCheckCodeBtn{
            width:106px;
            height:35px;
            margin:0 auto;
            margin-top:27px;
        }
        .lill{
            color:#999999;
            width:306px;
            text-align:center;
            margin:0 auto;
            margin-top:13px;
            font-size:12px;
        }
        .cblock{
            float:left;
            width:57px;
            height:313px;
            background:#0055a0;
        }
    </style>
    <meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7"/>
    <script src="${base}/resource/common/jquery.min.js"></script>
    <script src="${resource}/js/jquery.json-2.4.js"></script>
    <link rel="shortcut icon" href="http://www.stonefair.org.cn/favicon.ico"/>
    <#if rc.locale=="zh_CN">
        <script src="${base}/resource/language/cn.js"></script>
        <#else>
            <script src="${base}/resource/language/en.js"></script>
    </#if>
</head>

<body onload="checkTime()">
<div class="mainBox">
    <div class="logoC">
        <div class="links">
            <#if rc.locale=="zh_CN">
                <a href="http://stonefair.org.cn/CHI/">展会官网</a>
                <#else>
                    <a href="http://stonefair.org.cn/" style="font-family: Arial">Official Website</a>
            </#if>
            <a href="${base}/?locale=lc">中文</a>
            <a href="${base}/?locale=le" style="font-family: Arial; border: 0;">English</a>
        </div>
    </div>
    <div class="bottomBg">
    </div>
    <div class="loginC">
        <div class="small">
            <div class="intro">
                <#if rc.locale == "zh_CN" >
                    <img src="${resource}/images/login/intro_cn.png">
                    <#else>
                        <img src="${resource}/images/login/intro_en.png">
                </#if>
            </div>
            <div class="loginBox">
                <div class="user iptArea">
                    <input id="username" type="text" placeholder='<@spring.message "login.inputUsername"/>'>

                    <div class="delete">
                        <a href="#"><img src="${resource}/images/login/delete.png"></a>
                    </div>
                </div>
                <div class="password iptArea">
                    <input id="password" type="password" placeholder='<@spring.message "login.inputPassword"/>'>

                    <div class="delete">
                        <a href="#"><img src="${resource}/images/login/delete.png"></a>
                    </div>
                </div>
                <div>手机号：<input id="mobilephone" type="text" name="mobilephone" value="" maxlength="11"/></div>
                <div>验证码：<input type="text" name="mobilecode">
                    <button id="getCheckCodeBtn" type="button" onclick="sendCode(this);" title="获取验证码">获取验证码</button>
                </div>
                <#if rc.locale == "zh_CN" >
                    <div class="chek">
                        <div class="rememberU"><input type="checkbox"><@spring.message "login.rememberAccount"/></div>
                        <div class="rememberP"><input type="checkbox"><@spring.message "login.rememberPassword"/></div>
                        <div class="forgot"><a href="#" id="findpassword"><@spring.message "login.forgotPassword"/></a></div>
                    </div>
                    <#else>
                        <div class="chek">
                            <div class="rememberU"><input type="checkbox"><@spring.message "login.rememberAccount"/></div><br/>
                            <div class="rememberP"><input type="checkbox"><@spring.message "login.rememberPassword"/></div>
                            <div class="forgot"><a href="#" id="findpassword"><@spring.message "login.forgotPassword"/></a></div>
                        </div>
                </#if>

                <div class="loginBtn">
                    <a href="#" id="loginButton">
                        <#if rc.locale == "zh_CN" >
                            <img src="${resource}/images/login/login_btn_cn.png">
                            <#else>
                                <img src="${resource}/images/login/login_btn_en.png">
                        </#if>
                    </a>
                </div>
                <div class="lill">
                    <#if rc.locale == "zh_CN" >
                        该平台仅对参展商开放，账号密码由组委会提供。
                        <#else>
                            <div style="text-align: center;">Exclusive for Exhibitors. Username and Original Password will be provided by the Organizer.</div>
                    </#if>
                </div>
            </div>
            <div class="cblock"></div>
        </div>
    </div>

</div>

</body>
<script>
    $(function () {
        if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE6.0") {
            $(".iptArea").css("width", "270px");
        }
        else if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE7.0") {
            $(".iptArea").css("width", "270px");
            $("#username").css("margin-top", "12px");
            $("#key").css("margin-top", "12px");
            $("input").css("line-height", "14px");
        }
        else if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE8.0") {
            $("#username").css("margin-top", "12px");
            $("#key").css("margin-top", "12px");
            $("input").css("line-height", "14px");
        }
        else if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE9.0") {
            $("#username").css("margin-top", "12px");
            $("#key").css("margin-top", "12px");
            $("input").css("line-height", "14px");
        }
    })
</script>
<script>
    var english = false;
    $(document).ready(function () {
        function sendCode() {
            var phone = document.getElementById("mobilephone");
            $.ajax({
                cache:false,
                type: "get",
                contentType: "application/json; charset=utf-8",
                data: $.toJSON({
                    "inputPhone": value
                }),
                url: "${base}/sendSms",
                success: function (result) {
                    $("#getCheckCodeBtn").removeClass("disabled")
                    if (result.resultCode == 1) {
                        alert("用户密码错误。")
                    } else if (result.resultCode > 1) {
                        alert("服务器错误")
                    } else {
                        window.location.href = "${base}/user/main.html"
                    }
                },
                dataType: "json"
            });
            var value = phone.value.trim();
            if(value && value.length == 11){
                var zone = 1;
                $("[name='zone']").each(function () {
                    if (this.checked) {
                        zone = $(this).val();
                    }
                });
                $.ajax({
                    cache:false,
                    type: "get",
                    contentType: "application/json; charset=utf-8",
                    data: $.toJSON({
                        "inputPhone": value
                    }),
                    url: "${base}/sendSms",
                    success: function (result) {
                        $("#getCheckCodeBtn").removeClass("disabled")
                        if (result.resultCode == 1) {
                            alert("用户密码错误。")
                        } else if (result.resultCode > 1) {
                            alert("服务器错误")
                        } else {
                            window.location.href = "${base}/user/main.html"
                        }
                    },
                    dataType: "json"
                });
                // 1分钟内禁止点击
                for (var i = 1; i <= 60; i++) {
                    // 1秒后显示
                    window.setTimeout("updateTime(" + (60 - i) + ")", i * 1000);
                }
            }else{
                alert("请输入正确的手机号码");
                phone.focus();
                return;
            }
        }

        function updateTime(i){
            // setTimeout传多个参数到function有点麻烦，只能重新获取对象
            var obj = document.getElementById("getCheckCodeBtn");
            if(i > 0){
                obj.innerHTML  = "距离下次获取还有" + i + "秒";
                obj.disabled = true;
            }else{
                obj.innerHTML = "获取验证码";
                obj.disabled = false;
            }
        }

        function checkTime(){
            if(sendCodeTime){
                var nowTime = new Date().getTime();
                var flag = Math.floor((nowTime - sendCodeTime)/1000);
                if(flag < 60){
                    var end = 60 - flag;
                    // 进页面马上开始，选i为0
                    for (var i = 0; i <= end; i++) {
                        window.setTimeout("updateTime(" + (end - i) + ")", i * 1000);
                    }
                }
            }
        }

        $("#findpassword").click(function () {
            <#if rc.locale == "zh_CN" >
            location.href = "${resource}/findPassword.html";
            <#else>
            location.href = "${resource}/findPasswordEn.html";
            </#if>
        });
        $("#loginButton").click(function () {
            if ($("#username").val() == '' || $("#password").val() == '') {
                alert("用户名或密码不能为空");
                return;
            }
            var zone = 1;
            $("[name='zone']").each(function () {
                if (this.checked) {
                    zone = $(this).val();
                }
            });
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: $.toJSON({
                    "username": $("#username").val(),
                    "password": $("#password").val(),
                    "inputPhone": $("#mobilephone").val(),
                    "inputCode": $("#mobilecode").val(),
                    "english": english,
                    "area": zone
                }),
                url: "${base}/login",
                success: function (result) {
                    $("#loginButton").removeClass("disabled")
                    if (result.resultCode == 1) {
                        alert("用户密码错误。")
                    } else if (result.resultCode > 1) {
                        alert("服务器错误")
                    } else {
                        window.location.href = "${base}/user/main.html"
                    }
                },
                dataType: "json"
            });
        });
    });
</script>
</html>
