package com.zhenhappy.ems.action;

import com.zhenhappy.ems.dao.expoxicec.FairTypeDao;
import com.zhenhappy.ems.dao.expoxicec.TexpoBuildInfoDao;
import com.zhenhappy.ems.dao.expoxicec.TexpoXicecDao;
import com.zhenhappy.ems.dto.*;
import com.zhenhappy.ems.entity.TExpoBuildInfo;
import com.zhenhappy.ems.entity.TExpoXicec;
import com.zhenhappy.ems.entity.TFairInfo;
import com.zhenhappy.ems.entity.TVisitorMsgLog;
import com.zhenhappy.ems.service.ExhibitorService;
import com.zhenhappy.ems.service.expoxicec.TExpoXicecService;
import com.zhenhappy.ems.service.expoxicec.ExpiXicecRegisterLogMsgService;
import com.zhenhappy.ems.service.expoxicec.FairInfoService;
import com.zhenhappy.system.SystemConfig;
import org.apache.commons.lang.StringUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.task.TaskExecutor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.i18n.SessionLocaleResolver;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.*;

/**
 * Created by lianghaijian on 2014-03-31.
 */
@Controller
@RequestMapping(value = "/")
public class PublicAction {
    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private SystemConfig systemConfig;
    @Autowired
    private ExhibitorService exhibitorService;
    @Autowired
    TaskExecutor taskExecutor;// 注入Spring封装的异步执行器
    @Autowired
    private TexpoXicecDao texpoXicecDao;
    @Autowired
    private TExpoXicecService tExpoXicecService;
    @Autowired
    private FairInfoService fairInfoService;
    @Autowired
    private FairTypeDao fairTypeDao;
    @Autowired
    private ExpiXicecRegisterLogMsgService expiXicecRegisterLogMsgService;
    @Autowired
    private TexpoBuildInfoDao texpoBuildInfoDao;

    private static Logger log = Logger.getLogger(PublicAction.class);

    /**
     * 查询所有已经激活的展会
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "loadAllEnableFairName")
    public List<TFairInfo> loadAllEnableFairName() {
        List<TFairInfo> fairInfoList = new ArrayList<TFairInfo>();
        try {
            fairInfoList = fairInfoService.loadAllEnableFair();
        } catch (Exception e) {
            log.error("query enable fair error.", e);
        }
        return fairInfoList;
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    public String loginPage(HttpServletRequest request, HttpServletResponse response) {
        request.getSession().removeAttribute("tExpoXicec");
        request.getSession().removeAttribute("tFairId");
        request.getSession().removeAttribute(ExpoXicecPrinciple.PRINCIPLE_SESSION_ATTRIBUTE);
        if ("le".equals(request.getParameter("locale"))) {
            request.getSession().setAttribute(SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME, Locale.US);
        } else {
            request.getSession().setAttribute(SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME, Locale.CHINA);
        }
        return "/public/login";
    }

    @RequestMapping(value = "/getCheckingCodeTime")
    @ResponseBody
    public CheckingCodeTimeResponse getCheckingCodeTime(HttpServletRequest request) {
        CheckingCodeTimeResponse response = new CheckingCodeTimeResponse();
        Long codeTime = (Long) request.getSession().getAttribute(SMSUtil.SEND_CODE_TIME);
        response.setCodeTime(codeTime);
        return response;
    }

    /**
     * 发送手机验证码
     *
     * @param inputPhone 手机号
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "sendSms", method = RequestMethod.POST)
    public BaseResponse sendSMS(@RequestParam("inputPhone") String inputPhone,
                                /*@RequestParam("fair_type") Integer fairType,*/
                                HttpServletRequest httpServletRequest){
        BaseResponse response = new BaseResponse();
        List<TExpoXicec> tExpoXicecList = tExpoXicecService.loadTExpoXicecByPhone(inputPhone);
        if(tExpoXicecList != null && tExpoXicecList.size()>0){
            response.setResultCode(1);
        }else{
            StringBuilder code = new StringBuilder();
            Random random = new Random();
            // 生成6位验证码
            for (int i = 0; i < 6; i++) {
                code.append(String.valueOf(random.nextInt(10)));
            }
            HttpSession session = httpServletRequest.getSession();
            session.setAttribute(SMSUtil.VALIDATE_PHONE, inputPhone);
            session.setAttribute(SMSUtil.VALIDATE_PHONE_CODE, code.toString());
            session.setAttribute(SMSUtil.SEND_CODE_TIME, new Date().getTime());
            String smsText = "【金泓信展览】您的验证码是："+code;

            //TFairInfo tFairInfo = loadAllEnableFairByFairId(fairType);
            sendMobileCode(inputPhone, smsText, "");

            /*IClientProfile profile = DefaultProfile.getProfile("cn-hangzhou", "LTAIy13SYtslNdfV", "oDX5C0HRCJA1s5Su0lzMkMqOA2DDcN");
            try {
                DefaultProfile.addEndpoint("cn-hangzhou", "cn-hangzhou", "Sms",  "sms.aliyuncs.com");
                IAcsClient client = new DefaultAcsClient(profile);
                SingleSendSmsRequest request = new SingleSendSmsRequest();
                request.setSignName("金泓信展览");
                request.setTemplateCode("SMS_60000087");
                request.setParamString( "{\"code\" : code}");
                request.setParamString( "{\"group\" : \"【金泓信展览】\"}");
                request.setRecNum(inputPhone);
                SingleSendSmsResponse httpResponse = client.getAcsResponse(request);
                WriterUtil.saveLog("", inputPhone, smsText);
            } catch (ClientException e) {
                e.printStackTrace();
            }*/

            response.setResultCode(0);
        }
        return response;
    }

    public void saveLog(String fairName, String phone, String content){
        TVisitorMsgLog visitorMsgLog = new TVisitorMsgLog();
        visitorMsgLog.setMsgContent(content);
        visitorMsgLog.setCreateTime(new Date());
        visitorMsgLog.setLogSubject(fairName + "_特装报图用户注册");
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

    /**
     * 根据选中的展会查询对应信息
     * @return
     */
    @Transactional
    public TFairInfo loadAllEnableFairByFairId(int fairId){
        List<TFairInfo> fairInfoList = fairTypeDao.queryByHql("from TFairInfo where fair_enable=? and id=?" , new Object[]{1, fairId});
        return fairInfoList.size()>0?fairInfoList.get(0):null;
    }

    /**
     * 注册信息
     *
     * @return
     */
    @RequestMapping(value = "registerInfo")
    @ResponseBody
    public BaseResponse registerInfo(@RequestParam("username") String username,
                                     @RequestParam("password") String password,
                                     @RequestParam("phone") String mobilephone,
                                     @RequestParam("email") String email,
                                     /*@RequestParam("fair_type") Integer fairtype,*/
                                     @RequestParam("company") String company, HttpServletRequest httpServletRequest){
        BaseResponse response = new BaseResponse();
        TExpoXicec tExpoXicec = new TExpoXicec();
        tExpoXicec.setUsername(username);
        tExpoXicec.setPassword(password);
        tExpoXicec.setMobilephone(mobilephone);
        tExpoXicec.setEmail(email);
        tExpoXicec.setCompany(company);
        //tExpoXicec.setFair_type(fairtype);
        tExpoXicec.setCreate_Time(new Date());
        tExpoXicec.setUpdate_Time(new Date());
        tExpoXicec.setUser_role(0);
        tExpoXicec.setStatus(1);
        tExpoXicec.setVip(0);
        tExpoXicec.setEmail_num(0);
        tExpoXicec.setMsg_num(0);
        tExpoXicec.setRegister_type(0);
        texpoXicecDao.create(tExpoXicec);
        response.setResultCode(0);
        return response;
    }

    /**
     * 注册信息
     *
     * @return
     */
    @RequestMapping(value = "registerInfoCode", method = RequestMethod.GET)
    public ModelAndView registerInfoCode(@RequestParam("phone") String mobilephone, HttpServletRequest httpServletRequest){
        ModelAndView modelAndView = new ModelAndView();
        TExpoXicec tExpoXicec = new TExpoXicec();
        tExpoXicec.setMobilephone(mobilephone);
        modelAndView.addObject("tExpoXicec", tExpoXicec);
        modelAndView.setViewName("/user/expoxicec/registerInfo");
        return modelAndView;
    }

    /**
     * 判断用户输入的验证码与发送的验证码是否一致
     *
     * @param inputCode 验证码
     * @return
     */
    @RequestMapping(value = "compareCheckingCode")
    @ResponseBody
    public BaseResponse compareCheckingCode(@RequestParam("inputCode") String inputCode,
                                            HttpServletRequest httpServletRequest){
        BaseResponse response = new BaseResponse();
        HttpSession session = httpServletRequest.getSession();
        String code = (String) session.getAttribute(SMSUtil.VALIDATE_PHONE_CODE);
        if(code.equalsIgnoreCase(inputCode)){
            response.setResultCode(0);
        } else {
            response.setResultCode(1);
        }
        return response;
    }

    public void sendMobileCode(final String phone, final String content, final String fairName) {
        StringBuffer sbf = new StringBuffer();
        taskExecutor.execute(new Runnable() {
            public void run() {
                try {
                    HttpClient httpClient = new DefaultHttpClient();
                    String httpUrlEx = "http://113.106.91.228:9000/WebService.asmx/mt2?Sn=SDK100&Pwd=123321";
                    String httpArg = "&mobile=" + phone + "&content=" + content;
                    String httpUrl = httpUrlEx + httpArg;
                    HttpGet post = new HttpGet(httpUrl);
                    HttpResponse response = httpClient.execute(post);
                    if (response.getStatusLine().getStatusCode() == 200) {
                        //保存短信记录到表里
                        TVisitorMsgLog visitorMsgLog = new TVisitorMsgLog();
                        visitorMsgLog.setMsgContent(content);
                        visitorMsgLog.setCreateTime(new Date());
                        visitorMsgLog.setLogSubject(fairName + "_特装报图用户注册");
                        visitorMsgLog.setReply(0);
                        visitorMsgLog.setLogContent("发送特装报图用户注册验证码");
                        visitorMsgLog.setGUID("");
                        visitorMsgLog.setMsgSubject(fairName+ "_特装报图用户注册");
                        visitorMsgLog.setMsgFrom("");
                        visitorMsgLog.setMsgTo(phone);
                        visitorMsgLog.setStatus(0);
                        visitorMsgLog.setCustomerID(-1);  //-1表示是系统自动发送
                        expiXicecRegisterLogMsgService.insertLogMsg(visitorMsgLog);

                        System.out.println("httpUrl: " + httpUrl + ", 短信验证码发送成功");
                    } else {
                        System.out.println("httpUrl: " + httpUrl + ", 短信验证码发送失败");
                    }
                } catch (Exception e) {
                    System.out.println("短信验证码发送失败");
                }
            }
        });
    }

    /**
     * login method
     *
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "login", method = RequestMethod.POST)
    public LoginResponse login(@RequestBody LoginRequest request, HttpServletRequest httpServletRequest) {
        LoginResponse response = new LoginResponse();
        try {
            TExpoXicec tExpoXicec = tExpoXicecService.loadTExpoXicecByPhoneAndPassword(request.getInputPhone(), request.getPassword()/*, request.getFair_type()*/);
            if(tExpoXicec != null){
                //普通用户登录，即跳转到前端报图界面
                if(0 == tExpoXicec.getUser_role()){
                    httpServletRequest.getSession().setAttribute(ExpoXicecPrinciple.PRINCIPLE_SESSION_ATTRIBUTE, tExpoXicec);
                    httpServletRequest.getSession().setAttribute("tExpoXicec", tExpoXicec);
                    List<TExpoBuildInfo> tExpoBuildInfoList = texpoBuildInfoDao.queryByHql("from TExpoBuildInfo where userid = ?", new Object[]{tExpoXicec.getId()});
                    if(tExpoBuildInfoList != null && tExpoBuildInfoList.size()>0){
                        response.setResultCode(1);
                    }else{
                        response.setResultCode(1);
                    }
                    //表示系统管理员登录，即跳转到后台系统界面
                }else if(1 == tExpoXicec.getUser_role()){
                    httpServletRequest.getSession().setAttribute(ExpoXicecPrinciple.PRINCIPLE_SESSION_ATTRIBUTE, tExpoXicec);
                    httpServletRequest.getSession().setAttribute("tExpoXicec", tExpoXicec);
                    response.setResultCode(2);
                }
            }else{
                response.setResultCode(3);
            }
        } catch (Exception e) {
            log.error("login error.phone: " + request.getInputPhone(), e);
            response.setResultCode(3);
        }
        return response;
    }

    @RequestMapping(value = "changeLanguage", method = RequestMethod.GET)
    public void changeLanguage(HttpServletRequest request, HttpServletResponse response,
                               @RequestParam("locale") String locale) {
        String refer = request.getHeader("referer");
        if (locale.equals("us")) {
            request.getSession().setAttribute(SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME, Locale.US);
        } else {
            request.getSession().setAttribute(SessionLocaleResolver.LOCALE_SESSION_ATTRIBUTE_NAME, Locale.CHINA);
        }
        try {
            response.sendRedirect(refer);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @RequestMapping(value = "logout")
    public void logout(HttpServletRequest request, HttpServletResponse response) throws IOException {
        request.getSession().removeAttribute("tExpoXicec");
        request.getSession().removeAttribute("tFairId");
        request.getSession().removeAttribute(Principle.PRINCIPLE_SESSION_ATTRIBUTE);
        response.sendRedirect(request.getContextPath());
    }

    @RequestMapping("contact")
    public String contactUs(){
        return "/public/contact";
    }

    /**
     * findPassword method
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "findPassword")
    public String findPassword(@RequestParam("company") String company,
                               @RequestParam("telphone") String telphone/*,
                               @RequestParam("curType") Integer curType*/) {
        if (StringUtils.isNotEmpty(company) && StringUtils.isNotEmpty(telphone)) {
            String password = "";
            try {
                //password = (String) jdbcTemplate.queryForObject("select password from [t_expoXicec] where company = ? and fair_type=" + curType, new Object[]{company}, java.lang.String.class);
                password = (String) jdbcTemplate.queryForObject("select password from [t_expoXicec] where company = ? ", new Object[]{company}, java.lang.String.class);
            } catch (Exception e) {
                return "company";
            }
            try {
                //password = (String) jdbcTemplate.queryForObject("select password from [t_expoXicec] where mobilephone = ? and fair_type= " + curType, new Object[]{telphone}, java.lang.String.class);
                password = (String) jdbcTemplate.queryForObject("select password from [t_expoXicec] where mobilephone = ? ", new Object[]{telphone}, java.lang.String.class);
            } catch (Exception e) {
                return "telphone";
            }
            try {
                //password = (String) jdbcTemplate.queryForObject("select password from [t_expoXicec] where company = ? and mobilephone = ? and fair_type= " + curType, new Object[]{company, telphone}, java.lang.String.class);
                password = (String) jdbcTemplate.queryForObject("select password from [t_expoXicec] where company = ? and mobilephone = ? ", new Object[]{company, telphone}, java.lang.String.class);
            } catch (Exception e) {
                return "all";
            }
            return password;
        } else {
            return "";
        }
    }

    /**
     * findPassword method
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "findPasswordEn")
    public String findPasswordEn (@RequestParam("username") String username, @RequestParam("booth") String booth){
        if (StringUtils.isNotEmpty(username) && StringUtils.isNotEmpty(booth)) {
            Integer eid = 0;
            try {
                eid = (Integer) jdbcTemplate.queryForObject("select eid from [t_exhibitor_booth] where booth_number = ?", new Object[]{booth}, java.lang.Integer.class);
            } catch (Exception e) {
                return "booth";
            }
            String password = "";
            try {
                password = (String) jdbcTemplate.queryForObject("select password from [t_exhibitor] where username = ?", new Object[]{username}, java.lang.String.class);
            } catch (Exception e) {
                return "username";
            }
            try {
                password = (String) jdbcTemplate.queryForObject("select password from [t_exhibitor] where eid = ? and username = ?", new Object[]{eid, username}, java.lang.String.class);
            } catch (Exception e) {
                return "all";
            }
            return password;
        } else return "";
    }

    /**
     * modifyPassword method
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "modifyPassword")
    public String modifyPassword(HttpServletRequest request,
                                 @RequestParam("oldpassword") String oldpassword,
                                 @RequestParam("newpassword") String newpassword,
                                 @RequestParam("renewpassword") String renewpassword) {
        TExpoXicec tExpoXicec = (TExpoXicec)request.getSession().getAttribute("tExpoXicec");
        if (StringUtils.isNotEmpty(oldpassword) && StringUtils.isNotEmpty(newpassword) && StringUtils.isNotEmpty(renewpassword)) {
            String result = "";
            if(newpassword.equalsIgnoreCase(oldpassword)){
                return "same";
            } else if(!newpassword.equalsIgnoreCase(renewpassword)){
                return "unsame";
            }else{
                if(tExpoXicec != null){
                    tExpoXicec.setPassword(newpassword);
                    texpoXicecDao.update(tExpoXicec);
                    request.getSession().removeAttribute("tExpoXicec");
                    return "密码修改成功";
                }else{
                    return "oldpassword";
                }
            }
        } else {
            return "";
        }
    }

    /**
     * redirect to contact us page.
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "contactUs", method = RequestMethod.GET)
    public ModelAndView redirectContactUsPage(HttpServletRequest request, Locale locale) {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("/user/expoxicec/contactus");
        return modelAndView;
    }
}
