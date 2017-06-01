package com.zhenhappy.ems.util;

import com.zhenhappy.ems.entity.TVisitorMsgLog;
import com.zhenhappy.ems.service.expoxicec.ExpiXicecRegisterLogMsgService;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;

/**
 * Created by wangxd on 2016/5/13.
 */
public class WriterUtil {
    @Autowired
    private static ExpiXicecRegisterLogMsgService expiXicecRegisterLogMsgService;

    public static void write(HttpServletResponse response, String obj) {
        try {
            response.setContentType("text/html; charset=utf-8");
            PrintWriter out = response.getWriter();
            out.println(obj);
            out.flush();
            out.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void writePlain(HttpServletResponse response, String obj) {
        try {
            response.setContentType("text/plain; charset=utf-8");
            PrintWriter out = response.getWriter();
            out.println(obj);
            out.flush();
            out.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    //保存短信发送日志
    public static void saveLog(String fairName, String phone, String content){
        TVisitorMsgLog visitorMsgLog = new TVisitorMsgLog();
        visitorMsgLog.setMsgContent(content);
        visitorMsgLog.setCreateTime(new Date());
        visitorMsgLog.setLogSubject(fairName + "特装报图用户注册");
        visitorMsgLog.setReply(0);
        visitorMsgLog.setLogContent("发送特装报图用户注册验证码");
        visitorMsgLog.setGUID("");
        visitorMsgLog.setMsgSubject(fairName+ "_特装报图用户注册");
        visitorMsgLog.setMsgFrom("");
        visitorMsgLog.setMsgTo(phone);
        visitorMsgLog.setStatus(0);
        visitorMsgLog.setCustomerID(-1);  //-1表示是系统自动发送
        expiXicecRegisterLogMsgService.insertLogMsg(visitorMsgLog);
    }
}
