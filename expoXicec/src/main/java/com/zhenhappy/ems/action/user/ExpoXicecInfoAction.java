package com.zhenhappy.ems.action.user;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.profile.DefaultProfile;
import com.aliyuncs.profile.IClientProfile;
import com.aliyuncs.sms.model.v20160927.SingleSendSmsRequest;
import com.aliyuncs.sms.model.v20160927.SingleSendSmsResponse;
import com.zhenhappy.ems.action.BaseAction;
import com.zhenhappy.ems.dao.expoxicec.FairTypeDao;
import com.zhenhappy.ems.dao.expoxicec.TexpoBuildInfoDao;
import com.zhenhappy.ems.dao.expoxicec.TexpoXicecDao;
import com.zhenhappy.ems.dto.*;
import com.zhenhappy.ems.dto.admin.*;
import com.zhenhappy.ems.entity.*;
import com.zhenhappy.ems.service.expoxicec.*;
import com.zhenhappy.ems.sys.Constants;
import com.zhenhappy.ems.util.JXLExcelView;
import com.zhenhappy.ems.util.JdbcUtils_C3P0;
import com.zhenhappy.system.SystemConfig;
import com.zhenhappy.util.Page;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.task.TaskExecutor;
import org.springframework.orm.hibernate3.HibernateTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by wangxd on 2017-01-17.
 */
@Controller
@RequestMapping(value = "user")
@SessionAttributes(value = ExpoXicecPrinciple.PRINCIPLE_SESSION_ATTRIBUTE)
public class ExpoXicecInfoAction extends BaseAction {
    private static Logger log = Logger.getLogger(ExpoXicecInfoAction.class);
    private List<TExpoBuildInfoShow> tExpoBuildExhibitionBoothInfoShowList = new ArrayList<TExpoBuildInfoShow>();

    @Autowired
    TaskExecutor taskExecutor;
    @Autowired
    private ExpiXicecRegisterLogMsgService expiXicecRegisterLogMsgService;
    @Autowired
    private TexpoBuildInfoDao texpoBuildInfoDao;
    @Autowired
    private FairTypeDao tFairInfoDao;
    @Autowired
    private SystemConfig systemConfig;
    @Autowired
    private FairTypeDao fairTypeDao;
    @Autowired
    private TexpoXicecDao texpoXicecDao;
    @Autowired
    private ExpoXicecManagerService expoXicecManagerService;
    @Autowired
    private TExpoXicecService tExpoXicecService;
    @Autowired
    private UserFairService userFairService;
    @Autowired
    private FairInfoService fairInfoService;
    @Autowired
    private TExpoBuildInfoService tExpoBuildInfoervice;
    @Autowired
    private ExpoReviewInfoService expoReviewInfoService;
    @Autowired
    private HibernateTemplate hibernateTemplate;
    @Autowired
    private ExhibitionTypeService exhibitionTypeService;
    @Autowired
    private DocumentInfoService documentInfoService;

    /**
     * redirect to fair enable list page.
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "fair_enable_list", method = RequestMethod.GET)
    public ModelAndView redirectFair_Enable_List_Page(HttpServletRequest request, Locale locale) {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("/user/expoxicec/fairEnableList");
        return modelAndView;
    }

    /**
     * 根据fairid查询用户所在的报图列表
     * @param request
     * @return
     */
    @RequestMapping(value = "admin/redirectUserBoothSetupByFairType", method = RequestMethod.GET)
    public ModelAndView queryUserBoothSetupListByFairType(@ModelAttribute QueryUserBoothSetupListInfo queryUserBoothSetupListInfo,
                                                          HttpServletRequest request) {
        ModelAndView modelAndView = new ModelAndView();
        TExpoXicec tExpoXicec = (TExpoXicec)request.getSession().getAttribute("tExpoXicec");
        if(tExpoXicec != null){
            if(StringUtils.isNotEmpty(queryUserBoothSetupListInfo.getFairId())){
                String[] fairId = queryUserBoothSetupListInfo.getFairId().split("-");
                if(fairId != null && fairId.length>1){
                    Integer fairIdValue = Integer.parseInt(fairId[1]);
                    TFairInfo tFairInfo = tFairInfoDao.query(fairIdValue);
                    if(tFairInfo != null){
                        modelAndView.addObject("tFairInfo", tFairInfo);
                        request.getSession().setAttribute("tFairId", fairIdValue);
                        List<TExpoBuildInfo> tExpoBuildInfoList = texpoBuildInfoDao.queryByHql("from TExpoBuildInfo where userid = ? and fairid=? ", new Object[]{tExpoXicec.getId(), fairIdValue});
                        if(tExpoBuildInfoList != null && tExpoBuildInfoList.size()>0){
                            modelAndView.addObject("redirect", "/BoothAudit/user/boothlist");
                            modelAndView.setViewName("/user/expoxicec/boothlist");
                        }else {
                            modelAndView.addObject("redirect","/BoothAudit/user/boothempty");
                            modelAndView.setViewName("/user/expoxicec/boothempty");
                        }
                    }else{
                        request.getSession().removeAttribute("tExpoXicec");
                        request.getSession().removeAttribute("tFairId");
                        request.getSession().removeAttribute(Principle.PRINCIPLE_SESSION_ATTRIBUTE);
                        modelAndView.addObject("alert", "系统出错，请重新登录");
                        modelAndView.addObject("redirect", "/");
                        modelAndView.setViewName("/public/login");
                    }
                }
            }
        }else{
            request.getSession().removeAttribute("tExpoXicec");
            request.getSession().removeAttribute("tFairId");
            request.getSession().removeAttribute(Principle.PRINCIPLE_SESSION_ATTRIBUTE);
            modelAndView.addObject("alert", "系统出错，请重新登录");
            modelAndView.addObject("redirect", "/");
            modelAndView.setViewName("/public/login");
        }
        modelAndView.addObject("tExpoXicec", tExpoXicec);
        return modelAndView;
    }

    /**
     * redirect to booth empty page.
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "boothempty", method = RequestMethod.GET)
    public ModelAndView redirectBoothEmpty(HttpServletRequest request, Locale locale) {
        ModelAndView modelAndView = new ModelAndView();
        Integer fairId = (Integer)request.getSession().getAttribute("tFairId");
        //TExpoXicec tExpoXicec = (TExpoXicec) request.getSession().getAttribute(ExpoXicecPrinciple.PRINCIPLE_SESSION_ATTRIBUTE);
        TExpoXicec tExpoXicec = (TExpoXicec)request.getSession().getAttribute("tExpoXicec");
        TFairInfo tFairInfo = tFairInfoDao.query(fairId);
        if(tFairInfo != null){
            if(tExpoXicec != null){
                modelAndView.addObject("contactname", tExpoXicec.getCompany());
                modelAndView.addObject("mobile", tExpoXicec.getMobilephone());
                modelAndView.setViewName("/user/expoxicec/addbooth");
            }else{
                modelAndView.addObject("redirect","/BoothAudit/user/boothempty");
                modelAndView.setViewName("/user/expoxicec/boothempty");
            }
        }else{
            modelAndView.addObject("redirect","/BoothAudit/user/boothempty");
            modelAndView.setViewName("/user/expoxicec/boothempty");
        }
        return modelAndView;
    }

    /**
     * redirect to information manager.service page.
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "addbooth", method = RequestMethod.GET)
    public ModelAndView redirectAddBooth(HttpServletRequest request, Locale locale) {
        ModelAndView modelAndView = new ModelAndView();
        //TExpoXicec tExpoXicec = (TExpoXicec) request.getSession().getAttribute(ExpoXicecPrinciple.PRINCIPLE_SESSION_ATTRIBUTE);
        TExpoXicec tExpoXicec = (TExpoXicec)request.getSession().getAttribute("tExpoXicec");
        if(tExpoXicec != null){
            modelAndView.addObject("contactname", tExpoXicec.getUsername());
            modelAndView.addObject("mobile", tExpoXicec.getMobilephone());
        }
        modelAndView.setViewName("/user/expoxicec/addbooth");
        return modelAndView;
    }

    /**
     * redirect to information manager.service page.
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "admin/addbooth/for/user", method = RequestMethod.GET)
    public ModelAndView redirectAdminAddBoothForUser(@ModelAttribute QueryBoothListInfoRequest queryBoothListInfoRequest,HttpServletRequest request, Locale locale) {
        ModelAndView modelAndView = new ModelAndView();
        TExpoXicec tExpoXicec = tExpoXicecService.loadTExpoXicecByPhoneForAdmin(queryBoothListInfoRequest.getTelphone());
        //TExpoXicec tExpoXicec = (TExpoXicec) request.getSession().getAttribute(ExpoXicecPrinciple.PRINCIPLE_SESSION_ATTRIBUTE);
        Integer fairId = (Integer)request.getSession().getAttribute("tFairId");
        if(fairId != null){
            TFairInfo tFairInfo = tFairInfoDao.query(fairId);
            modelAndView.addObject("tFairInfo", tFairInfo);
            if(tExpoXicec != null){
                modelAndView.addObject("tExpoXicecFair", tExpoXicec);
                modelAndView.addObject("contactname", tExpoXicec.getUsername());
                modelAndView.addObject("mobile", tExpoXicec.getMobilephone());
            }
            modelAndView.setViewName("/user/expoxicec/admin/admin_fair_booth_add");
        }else{
            request.getSession().removeAttribute("tExpoXicec");
            request.getSession().removeAttribute("tFairId");
            request.getSession().removeAttribute(Principle.PRINCIPLE_SESSION_ATTRIBUTE);
            modelAndView.addObject("alert", "系统出错，请重新登录");
            modelAndView.addObject("redirect", "/");
            modelAndView.setViewName("/public/login");
        }
        return modelAndView;
    }

    /**
     * redirect to information manager.service page.
     *
     * @param booth
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/queryCompanyInfoByBoothNumber", method = RequestMethod.POST)
    public JSONObject queryCompanyInfoByBoothNumber(HttpServletRequest request,
                                                    @RequestParam("booth") String booth,
                                                    @RequestParam(value = "page", required = false, defaultValue = "1") Integer page,
                                                    @RequestParam(value = "pageSize", required = false, defaultValue = "30") Integer pageSize) {
        //TExpoXicec tExpoXicec = (TExpoXicec) request.getSession().getAttribute(ExpoXicecPrinciple.PRINCIPLE_SESSION_ATTRIBUTE);
        int tFairId = (Integer)request.getSession().getAttribute("tFairId");
        TExpoXicec tExpoXicec = (TExpoXicec)request.getSession().getAttribute("tExpoXicec");
        List<TExpoXicecExhibitorInfo> expoXicecExhibitorInfoList = getExhibitorInfoByExhibitorType(booth, tFairId, tExpoXicec.getId());
        JSONObject root = new JSONObject();
        JSONArray children = new JSONArray();
        if(expoXicecExhibitorInfoList != null){
            Integer count = expoXicecExhibitorInfoList.size();
            root.put("total", count);
            JSONObject child;
            for (TExpoXicecExhibitorInfo tExpoXicecExhibitorInfo : expoXicecExhibitorInfoList) {
                List<TExpoBuildInfo> tExpoBuildInfoList = tExpoBuildInfoervice.loadTExpoXicecListBoothNum(tExpoXicecExhibitorInfo.getBooth_number());
                boolean addBoothFlag = true;
                if(tExpoBuildInfoList != null && tExpoBuildInfoList.size()>0){
                    for(TExpoBuildInfo tExpoBuildInfo:tExpoBuildInfoList){
                        if(3 == tExpoBuildInfo.getCurrent_Audit_Status()){
                            addBoothFlag = false;
                            break;
                        }
                    }
                }else{
                    addBoothFlag = true;
                }
                if(addBoothFlag){
                    child = new JSONObject();
                    child.put("eid", tExpoXicecExhibitorInfo.getEid());
                    child.put("booth", tExpoXicecExhibitorInfo.getBooth_number());
                    child.put("company", tExpoXicecExhibitorInfo.getCompany());
                    child.put("area", tExpoXicecExhibitorInfo.getExhibitor_area());
                    child.put("id", tExpoXicecExhibitorInfo.getId());
                    child.put("exhibition_area", tExpoXicecExhibitorInfo.getExhibition_area());
                    children.add(child);
                }
            }
            root.put("items", children);
            return root;
        }else{
            root.put("items", children);
            return root;
        }
    }

    /**
     * create booth
     *
     * @param booth, company, contact, mobile, type
     * @return
     */
    @RequestMapping(value = "createbooth", method = RequestMethod.POST)
    public ModelAndView addExhibitorAccount(@RequestParam("Booth") String booth,
                                            @RequestParam("company") String company,
                                            @RequestParam("contact") String contact,
                                            @RequestParam("bootharea") String bootharea,
                                            @RequestParam("exhibition_area") String exhibition_area,
                                            @RequestParam("mobile") String mobile,
                                            @RequestParam("type") Integer type,
                                            HttpServletRequest request,
                                            Locale locale) throws IOException {
        ModelAndView modelAndView = new ModelAndView();
        try{
            TExpoBuildInfo tExpoBuildInfo = new TExpoBuildInfo();
            TExpoXicec tExpoXicec = tExpoXicecService.loadTExpoXicecByPhoneForAdmin(mobile);
            TExpoXicec tExpoXicecRole = (TExpoXicec) request.getSession().getAttribute(ExpoXicecPrinciple.PRINCIPLE_SESSION_ATTRIBUTE);
            Integer fairId = (Integer)request.getSession().getAttribute("tFairId");
            TFairInfo tFairInfo = tFairInfoDao.query(fairId);
            if(tExpoXicec != null){
                TUserFair tUserFair = userFairService.loadAllUserFairByUserIdAndFairType(tExpoXicec.getId(), fairId);
                if(tUserFair == null){
                    tUserFair = new TUserFair();
                    tUserFair.setFair_id(fairId);
                    tUserFair.setUser_id(tExpoXicec.getId());
                    userFairService.saveTUserFair(tUserFair);
                }
                tExpoBuildInfo.setUserid(tExpoXicec.getId());
                tExpoBuildInfo.setFairid(fairId);
                tExpoBuildInfo.setBooth_Number(booth);
                tExpoBuildInfo.setExhibitor_Company(company);
                tExpoBuildInfo.setExhibitor_Type(type);
                tExpoBuildInfo.setCurrent_Audit_Status(1);
                tExpoBuildInfo.setBooth_area(bootharea);
                tExpoBuildInfo.setExhibition_area(exhibition_area);
                tExpoBuildInfo.setCreate_time(new Date());
                tExpoBuildInfo.setUpdate_time(new Date());
                texpoBuildInfoDao.create(tExpoBuildInfo);
                modelAndView.addObject("alert", "添加成功");
                if(0 == tExpoXicecRole.getUser_role()){
                    modelAndView.addObject("redirect", "/BoothAudit/user/boothlist");
                    modelAndView.setViewName("/user/expoxicec/boothlist");
                }else if(1 == tExpoXicecRole.getUser_role()){
                    request.getSession().setAttribute("tFairId", fairId);
                    modelAndView.addObject("tExpoXicecFair", tExpoXicec);
                    List<TExpoBuildInfo> tExpoBuildInfoList = tExpoBuildInfoervice.loadTExpoXicecListByUserIdAndFairId(tExpoXicec.getId(), fairId);
                    modelAndView.addObject("tExpoBuildInfoList", tExpoBuildInfoList);
                    modelAndView.addObject("tExpoXicecDetailInfo", tExpoXicec);
                    modelAndView.addObject("tFairInfo", tFairInfo);
                    modelAndView.addObject("redirect", "/BoothAudit/user/boothlist");
                    modelAndView.setViewName("/user/expoxicec/boothlist");
                }
            }else{
                request.getSession().removeAttribute("tExpoXicec");
                request.getSession().removeAttribute("tFairId");
                request.getSession().removeAttribute(Principle.PRINCIPLE_SESSION_ATTRIBUTE);
                modelAndView.addObject("alert", "时间超时，请重新登录");
                modelAndView.addObject("redirect", "/");
                modelAndView.setViewName("/public/login");
            }
            modelAndView.addObject("tFairInfo", tFairInfo);
        }catch (Exception e){
            log.error("create booth info error.", e);
        }
        //在这里进行保存操作
        return modelAndView;
    }

    /**
     * 根据当前点击的展位获取对应的信息
     *
     * @param boothValue
     * @return
     */
    @RequestMapping(value = "getCurrentExpoXicecInfoByBoothId", method = RequestMethod.POST)
    public ModelAndView getCurrentExpoXicecInfoByBoothId(@RequestParam("boothid") String boothValue,
                                                         HttpServletRequest request, Locale locale) throws IOException {
        ModelAndView modelAndView = new ModelAndView();
        try{
            TExpoXicec tExpoXicec = (TExpoXicec)request.getSession().getAttribute("tExpoXicec");
            if(tExpoXicec != null){
                TExpoBuildInfo tExpoBuildInfo = expoXicecManagerService.loadExpoBuildInfoByBoothNum(boothValue, tExpoXicec.getId());
                modelAndView.addObject("tExpoBuildInfo", tExpoBuildInfo);
            }else {
                request.getSession().removeAttribute("tExpoXicec");
                request.getSession().removeAttribute("tFairId");
                request.getSession().removeAttribute(Principle.PRINCIPLE_SESSION_ATTRIBUTE);
                modelAndView.addObject("alert", "时间超时，展位审核失败");
                modelAndView.addObject("redirect", "/");
                modelAndView.setViewName("/public/login");
            }
        }catch (Exception e){
            log.error("get current expoxicec inf by booth error.", e);
        }
        //在这里进行保存操作
        return modelAndView;
    }

    /**
     * type：表示展会类型
     *
     * @param tFairId 1：石材展   type=2：佛事展    type=3：茶业展
     * @return
     */
    public static List<TExpoXicecExhibitorInfo> getExhibitorInfoByExhibitorType(String param, Integer tFairId, Integer userId){
        JdbcUtils_C3P0 jdbcUtils_c3P0 = new JdbcUtils_C3P0();
        String url = "";
        if(1 == tFairId){
            url = "jdbc:jtds:sqlserver://10.33.0.224:1433;DatabaseName=xmut";
        }else if(2 == tFairId){
            url = "jdbc:jtds:sqlserver://10.33.0.224:1433;DatabaseName=foshi";
        }else if(3 == tFairId){
            url = "jdbc:jtds:sqlserver://10.33.0.224:1433;DatabaseName=tea";
        }
        return jdbcUtils_c3P0.executeDataBaseByType("net.sourceforge.jtds.jdbc.Driver", url, "Jhx03SA",
                "gogo03Jhx", "t_exhibitor_booth", tFairId, userId, param);
    }

    /**
     * redirect to booth list page.
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "boothlist", method = RequestMethod.GET)
    public ModelAndView redirectBoothList(HttpServletRequest request, Locale locale) {
        ModelAndView modelAndView = new ModelAndView();
        Integer fairId = (Integer)request.getSession().getAttribute("tFairId");
        TFairInfo tFairInfo = tFairInfoDao.query(fairId);
        modelAndView.addObject("tFairInfo", tFairInfo);
        modelAndView.setViewName("/user/expoxicec/boothlist");
        return modelAndView;
    }

    @ResponseBody
    @RequestMapping(value = "/getBoothSetupFlag", method = RequestMethod.POST)
    public BaseResponse getBoothSetupFlag(HttpServletRequest request) {
        BaseResponse response = new BaseResponse();
        Integer fairId = (Integer)request.getSession().getAttribute("tFairId");
        TFairInfo tFairInfo = tFairInfoDao.query(fairId);
        if(tFairInfo != null){
            response.setDescription(1 == tFairInfo.getFair_enable()?"1":"0");
        }else {
            response.setDescription("0");
        }
        response.setResultCode(0);
        return response;
    }

    /**
     * 加载展会下对应的展位模板信息
     *
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/getBoothTemplate", method = RequestMethod.POST)
    public ExpoBoothTemplateInfoResponse getBoothTemplate(HttpServletRequest request) {
        ExpoBoothTemplateInfoResponse expoBoothListResponse = new ExpoBoothTemplateInfoResponse();
        Integer fairId = (Integer)request.getSession().getAttribute("tFairId");
        TFairInfo tFairInfo = tFairInfoDao.query(fairId);
        if(tFairInfo != null){
            List<TDocumentInfo> tDocumentInfoList = documentInfoService.loadAllDocumentTypeByDocumentFairId(tFairInfo.getId());
            net.sf.json.JSONArray jsonArrayEx = net.sf.json.JSONArray.fromObject(tDocumentInfoList);
            expoBoothListResponse.settExpoBuildTemplateInfoList(jsonArrayEx.toString());
        }
        return expoBoothListResponse;
    }

    /**
     * 显示账号下对应的所有展位信息
     *
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/getBoothList", method = RequestMethod.POST)
    public ExpoBoothListResponse getBoothList(HttpServletRequest request) {
        ExpoBoothListResponse expoBoothListResponse = new ExpoBoothListResponse();
        //TExpoXicec tExpoXicec = (TExpoXicec) request.getSession().getAttribute(ExpoXicecPrinciple.PRINCIPLE_SESSION_ATTRIBUTE);
        TExpoXicec tExpoXicec = (TExpoXicec)request.getSession().getAttribute("tExpoXicec");
        Integer fairId = (Integer)request.getSession().getAttribute("tFairId");
        TFairInfo tFairInfo = tFairInfoDao.query(fairId);
        if(tExpoXicec != null){
            List<TExpoBuildInfo> tExpoBuildInfoList = texpoBuildInfoDao.queryByHql("from TExpoBuildInfo where userid = ? and fairid=?", new Object[]{tExpoXicec.getId(), fairId});
            List<TExpoBuildInfoShow> tExpoBuildInfoShowList = new ArrayList<TExpoBuildInfoShow>();
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            for(TExpoBuildInfo tExpoBuildInfo:tExpoBuildInfoList){
                TExpoBuildInfoShow tExpoBuildInfoShow = new TExpoBuildInfoShow();
                if(tFairInfo != null){
                    tExpoBuildInfoShow.setFair_enable(1 == tFairInfo.getFair_enable()?1:0);
                }
                tExpoBuildInfoShow.setId(tExpoBuildInfo.getId());
                tExpoBuildInfoShow.setUserid(tExpoBuildInfo.getUserid());
                tExpoBuildInfoShow.setBooth_Number(tExpoBuildInfo.getBooth_Number());
                tExpoBuildInfoShow.setExhibitor_Company(tExpoBuildInfo.getExhibitor_Company());
                TExhibitionType tExhibitionType = exhibitionTypeService.getExhibitionTypeByDocumentTypeId(tExpoBuildInfo.getExhibitor_Type());
                if(tExhibitionType != null){
                    tExpoBuildInfoShow.setExhibitor_Type(tExhibitionType.getExhibition_type_name());
                }
                tExpoBuildInfoShow.setExhibition_Liability_Insurance_Image(tExpoBuildInfo.getExhibition_Liability_Insurance_Image());
                tExpoBuildInfoShow.setExhibition_Aauthorization_Image(tExpoBuildInfo.getExhibition_Aauthorization_Image());
                tExpoBuildInfoShow.setExhibition_Power_Attorney_Image(tExpoBuildInfo.getExhibition_Power_Attorney_Image());
                tExpoBuildInfoShow.setBuilding_Units_Information_Image(tExpoBuildInfo.getBuilding_Units_Information_Image());
                tExpoBuildInfoShow.setSpecial_Booth_Information_Image(tExpoBuildInfo.getSpecial_Booth_Information_Image());
                tExpoBuildInfoShow.setBuilding_Material_Report_Image(tExpoBuildInfo.getBuilding_Material_Report_Image());
                tExpoBuildInfoShow.setStaff_Qualification_Certificate_Image(tExpoBuildInfo.getStaff_Qualification_Certificate_Image());
                tExpoBuildInfoShow.setCurrent_Status(tExpoBuildInfo.getCurrent_Audit_Status());
                if(1 == tExpoBuildInfo.getCurrent_Audit_Status()){
                    tExpoBuildInfoShow.setCurrent_Audit_Status("上传资料");
                    tExpoBuildInfoShow.setCurrent_Audit_Status_Button("提交审核");
                }else if(2 == tExpoBuildInfo.getCurrent_Audit_Status()){
                    tExpoBuildInfoShow.setCurrent_Audit_Status("等待审核");
                    tExpoBuildInfoShow.setCurrent_Audit_Status_Button("等待审核中");
                }else if(3 == tExpoBuildInfo.getCurrent_Audit_Status()){
                    tExpoBuildInfoShow.setCurrent_Audit_Status("审核通过");
                    tExpoBuildInfoShow.setCurrent_Audit_Status_Button("审核通过");
                }else if(4 == tExpoBuildInfo.getCurrent_Audit_Status()){
                    tExpoBuildInfoShow.setCurrent_Audit_Status("审核不通过");
                    tExpoBuildInfoShow.setCurrent_Audit_Status_Button("审核不通过");
                }else {
                    tExpoBuildInfoShow.setCurrent_Audit_Status("上传资料");
                    tExpoBuildInfoShow.setCurrent_Audit_Status_Button("提交审核");
                }
                tExpoBuildInfoShow.setCreate_time(formatter.format(tExpoBuildInfo.getCreate_time()));
                tExpoBuildInfoShow.setUpdate_time(formatter.format(tExpoBuildInfo.getUpdate_time()));
                tExpoBuildInfoShow.setBooth_area(tExpoBuildInfo.getBooth_area());
                tExpoBuildInfoShow.setExhibition_area(tExpoBuildInfo.getExhibition_area());
                tExpoBuildInfoShow.setBak_field3(tExpoBuildInfo.getBak_field3());
                tExpoBuildInfoShow.setBak_field4(tExpoBuildInfo.getBak_field4());
                tExpoBuildInfoShow.setLogin_name(tExpoXicec.getUsername());
                tExpoBuildInfoShow.setLogin_telphone(tExpoXicec.getMobilephone());

                List<TExpoReviewInfo> tExpoReviewInfoList = expoXicecManagerService.loadExpoReviewInfoByFairIdAndBoothNum(fairId, tExpoBuildInfo.getBooth_Number());
                List<ExpoReviewInfo> expoReviewInfoList = new ArrayList<ExpoReviewInfo>();
                for(TExpoReviewInfo tExpoReviewInfo:tExpoReviewInfoList){
                    ExpoReviewInfo expoReviewInfo = new ExpoReviewInfo();
                    expoReviewInfo.setId(tExpoReviewInfo.getId());
                    expoReviewInfo.setBooth_Number(tExpoReviewInfo.getBooth_Number());
                    expoReviewInfo.setReview_header(tExpoReviewInfo.getReview_header());
                    expoReviewInfo.setReview_content(tExpoReviewInfo.getReview_content());
                    expoReviewInfo.setReview_time(formatter.format(tExpoReviewInfo.getReview_time()));
                    expoReviewInfoList.add(expoReviewInfo);
                }
                net.sf.json.JSONArray jsonArray = net.sf.json.JSONArray.fromObject(expoReviewInfoList);
                tExpoBuildInfoShow.setCurrent_Review_Info(jsonArray.toString());

                tExpoBuildInfoShowList.add(tExpoBuildInfoShow);
            }
            net.sf.json.JSONArray jsonArrayEx = net.sf.json.JSONArray.fromObject(tExpoBuildInfoShowList);
            expoBoothListResponse.settExpoBuildInfoList(jsonArrayEx.toString());
        }
        return expoBoothListResponse;
    }

    /**
     * 显示文档模板
     * @param response
     * @param templateID
     */
    @RequestMapping(value = "showExhibitionTemplate", method = RequestMethod.GET)
    public void showExhibitionTemplate(HttpServletResponse response, @RequestParam("templateID") String templateID) {
        try {
            String[] value = templateID.split("-");
            if(value.length>1){
                TDocumentInfo tDocumentInfo = documentInfoService.getExhibitionTypeByDocumentId(Integer.parseInt(value[1]));
                if (tDocumentInfo != null && StringUtils.isNotEmpty(tDocumentInfo.getDocument_Template())) {
                    OutputStream outputStream = response.getOutputStream();
                    String fileName = (new Date()).toString();
                    if(tDocumentInfo.getDocument_Template().toLowerCase().contains(".doc")){
					/*response.reset();// 清空输出流
					response.setContentType("application/pdf");
					response.setHeader( "Content-disposition", "attachment;filename=" + logoFileName);*/
                        response.setCharacterEncoding("utf-8");

                        fileName = tDocumentInfo.getDocument_Name();
                        fileName = new String(fileName.getBytes("iso-8859-1"), "utf-8");
                        response.setContentType("application/x-download");
                        fileName = URLEncoder.encode(fileName, "UTF-8");
                        response.setHeader( "Content-disposition", "attachment;filename=" + fileName + ".doc");

                        //response.setContentType("application/ms-word");
                    }
                    //response.setContentType("application/pdf");
                    File logo = new File(tDocumentInfo.getDocument_Template());
                    if (!logo.exists())
                        return;
                    FileUtils.copyFile(logo, outputStream);
                    outputStream.close();
                    outputStream.flush();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * save audit info by admin
     *
     * @param saveAuditInfoRequest
     * @return
     */
    @RequestMapping(value = "admin/audit/save", method = RequestMethod.POST)
    public ModelAndView saveAuditInfoByAdmin(@ModelAttribute SaveAuditInfoRequest saveAuditInfoRequest,
                                             HttpServletRequest request,
                                             Locale locale) throws IOException {
        ModelAndView modelAndView = new ModelAndView();
        try{
            TExpoReviewInfo tExpoReviewInfo = new TExpoReviewInfo();
            tExpoReviewInfo.setBooth_Number(saveAuditInfoRequest.getBoothNumber());
            TExpoBuildInfo tExpoBuildInfo = tExpoBuildInfoervice.loadExpoReviewInfoByUserIdAndFairIdAndBoothNum(saveAuditInfoRequest.getUserId(), saveAuditInfoRequest.getFairId(), saveAuditInfoRequest.getBoothNumber());
            if(tExpoBuildInfo != null){
                tExpoBuildInfo.setCurrent_Audit_Status(saveAuditInfoRequest.getBoothReviewStatus());
                tExpoBuildInfo.setCurrent_Audit_Content(saveAuditInfoRequest.getAuditMsg());
                tExpoBuildInfoervice.updateTExpoBuildInfo(tExpoBuildInfo);
            }
            tExpoReviewInfo.setFair_id(saveAuditInfoRequest.getFairId());
            tExpoReviewInfo.setReview_content(saveAuditInfoRequest.getAuditMsg());
            tExpoReviewInfo.setReview_header(saveAuditInfoRequest.getBoothReviewStatus() == 3?"审核通过":"审核不通过");
            tExpoReviewInfo.setReview_time(new Date());
            expoReviewInfoService.saveExpoReviewInfo(tExpoReviewInfo);
            String auditContentValue = "";
            if(saveAuditInfoRequest.getBoothReviewStatus() == 3){
                auditContentValue = "审核通过";
            }else{
                auditContentValue = "审核不通过," + saveAuditInfoRequest.getAuditMsg();
            }
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd(HH:mm:ss)");
            String auditContent = formatter.format(new Date()) + auditContentValue;
            //sendSmsAuditResultByAdmin("【金泓信展览】" + saveAuditInfoRequest.getFairName(), "【" + saveAuditInfoRequest.getBoothNumber() + "】", auditContent, saveAuditInfoRequest.getSendSmsMobilePhone());
            saveLog(saveAuditInfoRequest.getFairName(), saveAuditInfoRequest.getSendSmsMobilePhone(), saveAuditInfoRequest.getFairName()
                    + "展位" + "【" + saveAuditInfoRequest.getBoothNumber() + "】" + "截至" + formatter.format(new Date()) + "的资料" + auditContentValue);

            if(saveAuditInfoRequest.isSendAuditSMS()){
                String smsText = "【金泓信展览】" + saveAuditInfoRequest.getFairName() + "展位『" + saveAuditInfoRequest.getBoothNumber() + "』"
                        + formatter.format(new Date()) + "的资料" + (saveAuditInfoRequest.getBoothReviewStatus()==3?"审核通过":("审核不通过" + "," + saveAuditInfoRequest.getAuditMsg()));
                sendMobileCode(saveAuditInfoRequest.getSendSmsMobilePhone(), smsText, saveAuditInfoRequest.getFairName());
            }

            modelAndView.addObject("tExpoBuildInfo", tExpoBuildInfo);
            TExpoXicec tExpoXicec = tExpoXicecService.loadTExpoXicecByPhoneForAdmin(saveAuditInfoRequest.getSendSmsMobilePhone());
            modelAndView.addObject("tExpoXicecFair", tExpoXicec);
            List<TExpoBuildInfo> tExpoBuildInfoList = tExpoBuildInfoervice.loadTExpoXicecListByUserIdAndFairId(tExpoXicec.getId(), saveAuditInfoRequest.getFairId());
            modelAndView.addObject("tExpoBuildInfoList", tExpoBuildInfoList);
            TFairInfo tFairInfo = fairInfoService.loadFairInfoByFairId(saveAuditInfoRequest.getFairId());
            modelAndView.addObject("tFairInfo", tFairInfo);
            modelAndView.setViewName("/user/expoxicec/admin/admin_fair_booth_details");
        }catch (Exception e){
            log.error("save audit info by admin error.", e);
            request.getSession().removeAttribute("tExpoXicec");
            request.getSession().removeAttribute("tFairId");
            request.getSession().removeAttribute(Principle.PRINCIPLE_SESSION_ATTRIBUTE);
            modelAndView.addObject("alert", "时间超时，展位审核失败");
            modelAndView.addObject("redirect", "/");
            modelAndView.setViewName("/public/login");
        }
        //在这里进行保存操作
        return modelAndView;
    }
    //保存短信发送日志
    public void saveLog(String fairName, String phone, String content){
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
        hibernateTemplate.saveOrUpdate(visitorMsgLog);
    }


    public void sendSmsAuditResultByAdmin(String fairname, String boothNumber, String auditContent, String mobilePhone) throws ClientException {
        IClientProfile profile = DefaultProfile.getProfile("cn-hangzhou", "LTAIy13SYtslNdfV", "oDX5C0HRCJA1s5Su0lzMkMqOA2DDcN");
        DefaultProfile.addEndpoint("cn-hangzhou", "cn-hangzhou", "Sms",  "sms.aliyuncs.com");
        IAcsClient client = new DefaultAcsClient(profile);
        SingleSendSmsRequest request = new SingleSendSmsRequest();
        try {
            request.setSignName("金泓信展览");
            request.setTemplateCode("SMS_60135082");
            request.setParamString( "{\"fairname\" : fairname}");
            request.setParamString( "{\"boothnumber\" : boothNumber}");
            request.setParamString( "{\"auditcontent\" : auditContent}");
            request.setRecNum(mobilePhone);
            SingleSendSmsResponse httpResponse = client.getAcsResponse(request);
        } catch (Exception e) {
            e.printStackTrace();
        }
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
                        visitorMsgLog.setLogSubject(fairName + "_特装报图审核短信");
                        visitorMsgLog.setReply(0);
                        visitorMsgLog.setLogContent("特装报图审核短信");
                        visitorMsgLog.setGUID("");
                        visitorMsgLog.setMsgSubject(fairName+ "_特装报图审核短信");
                        visitorMsgLog.setMsgFrom("");
                        visitorMsgLog.setMsgTo(phone);
                        visitorMsgLog.setStatus(0);
                        visitorMsgLog.setCustomerID(-1);  //-1表示是系统自动发送
                        expiXicecRegisterLogMsgService.insertLogMsg(visitorMsgLog);
                    }
                } catch (Exception e) {
                    System.out.println("特装报图审核短信发送失败" + e);
                }
            }
        });
    }

    @ResponseBody
    @RequestMapping(value = "admin/getBoothByFairIdAndBoothNum", method = RequestMethod.POST)
    public BoothReviewInfoResponse getBoothByFairIdAndBoothNum(HttpServletRequest request,
                                                               @RequestParam("userid") Integer userid,
                                                               @RequestParam("fairid") Integer fairid,
                                                               @RequestParam("boothNum") String boothNum) {
        BoothReviewInfoResponse boothReviewInfoResponse = new BoothReviewInfoResponse();
        List<TExpoReviewInfo> tExpoReviewInfoList = expoXicecManagerService.loadExpoReviewInfoByFairIdAndBoothNum(fairid, boothNum);
        TExpoBuildInfo tExpoBuildInfo = tExpoBuildInfoervice.loadExpoReviewInfoByUserIdAndFairIdAndBoothNum(userid, fairid, boothNum);
        List<TExpoReviewInfoForAdmin> tExpoReviewInfoForAdminList = new ArrayList<TExpoReviewInfoForAdmin>();
        if(tExpoReviewInfoList != null && tExpoReviewInfoList.size()>0){
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

            for(TExpoReviewInfo tExpoReviewInfo:tExpoReviewInfoList){
                TExpoReviewInfoForAdmin tExpoReviewInfoForAdmin = new TExpoReviewInfoForAdmin();
                tExpoReviewInfoForAdmin.setReviewStatus(tExpoBuildInfo.getCurrent_Audit_Status()==3?3:4);
                tExpoReviewInfoForAdmin.setBooth_Number(tExpoReviewInfo.getBooth_Number());
                tExpoReviewInfoForAdmin.setFair_id(tExpoReviewInfo.getFair_id());
                tExpoReviewInfoForAdmin.setId(tExpoReviewInfo.getId());
                tExpoReviewInfoForAdmin.setReview_content(tExpoReviewInfo.getReview_content());
                tExpoReviewInfoForAdmin.setReview_header(tExpoReviewInfo.getReview_header());
                tExpoReviewInfoForAdmin.setReview_time(formatter.format(tExpoReviewInfo.getReview_time()));
                tExpoReviewInfoForAdminList.add(tExpoReviewInfoForAdmin);
            }
        }
        net.sf.json.JSONArray jsonArrayEx = net.sf.json.JSONArray.fromObject(tExpoReviewInfoForAdminList);
        boothReviewInfoResponse.setBoothReviewInfoList(jsonArrayEx.toString());
        return boothReviewInfoResponse;
    }

    @ResponseBody
    @RequestMapping(value = "admin/audit/delete", method = RequestMethod.POST)
    public BaseResponse deleteAuditByReviewId(HttpServletRequest request,
                                              @RequestParam("xicecReviewId") Integer xicecReviewId) {
        BaseResponse response = new BaseResponse();
        TExpoReviewInfo tExpoReviewInfo = expoXicecManagerService.loadExpoBuildInfoByExpoBuildId(xicecReviewId);
        if(tExpoReviewInfo != null){
            expoXicecManagerService.deleteExpoBuildInfo(tExpoReviewInfo);
            response.setResultCode(0);
            response.setDescription("操作成功！");
        }
        return response;
    }

    @ResponseBody
    @RequestMapping(value = "/uploadImage", method = RequestMethod.POST)
    public UpdateBoothImageInfoResponse uploadImage(@ModelAttribute UpdateBoothImageInfoRequest updateBoothImageInfoRequestRequest,
                                                    HttpServletRequest request,
                                                    @RequestParam("fileUpload") MultipartFile file) {
        UpdateBoothImageInfoResponse updateBoothImageInfoResponse = new UpdateBoothImageInfoResponse();
        String fileName = FilenameUtils.getBaseName(file.getOriginalFilename()) + "." + FilenameUtils.getExtension(file.getOriginalFilename());
        String appendix_directory = systemConfig.getVal(Constants.appendix_directory).replaceAll("\\\\\\\\", "\\\\");
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String dateString = formatter.format(new Date());
        String boothidValue = updateBoothImageInfoRequestRequest.getBoothId();
        String newFileName = boothidValue + "_" + new Date().getTime() + "_" + fileName;
        int tFairId = (Integer)request.getSession().getAttribute("tFairId");
        List<TFairInfo> fairInfoList = fairTypeDao.queryByHql("from TFairInfo where fair_enable=? and id=?" , new Object[]{1, tFairId});
        if(fairInfoList != null && fairInfoList.size()>0) {
            TFairInfo tFairInfo = fairInfoList.get(0);
            TExpoXicec tExpoXicec = (TExpoXicec)request.getSession().getAttribute("tExpoXicec");
            if(tExpoXicec != null){
                //上传的路径为：展会时间（考虑有春秋两季）--》用户名--》展会名称--》展位号
                TDocumentInfo tDocumentInfo = documentInfoService.getExhibitionTypeByDocumentId(Integer.parseInt(updateBoothImageInfoRequestRequest.getTempId()));
                if(tDocumentInfo.getDocument_Common() != null && tDocumentInfo.getDocument_Common() == 1){
                    appendix_directory = appendix_directory + "\\" + tFairInfo.getFair_begin_time() +  "\\" + fairInfoList.get(0).getFair_name_alias() +
                            "\\" + tExpoXicec.getUsername() + "\\common\\" + updateBoothImageInfoRequestRequest.getTempId() + "\\";
                }else{
                    appendix_directory = appendix_directory + "\\" + tFairInfo.getFair_begin_time() +  "\\" + fairInfoList.get(0).getFair_name_alias() +
                            "\\" + tExpoXicec.getUsername() + "\\" + boothidValue + "\\" + updateBoothImageInfoRequestRequest.getTempId() + "\\";
                }
                //appendix_directory = appendix_directory + "\\" + updateBoothImageInfoRequestRequest.getTempId() + "\\";
                File uploadFile1 = upload(file, appendix_directory, newFileName);
                renameFile(appendix_directory, fileName, newFileName);
                File newfile = new File(appendix_directory + "/" + newFileName);
                if(newfile.exists()){
                    updateBoothImageInfoResponse.setResult(true);
                    updateBoothImageInfoResponse.setPreview(true);
                    updateBoothImageInfoResponse.setTempid(updateBoothImageInfoRequestRequest.getTempId());
                    /*SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    String dateString = formatter.format(new Date());*/
                    updateBoothImageInfoResponse.setCreateTime(dateString);
                    updateBoothImageInfoResponse.setImageId(UUID.randomUUID().toString());
                    updateBoothImageInfoResponse.setImagesrc(newFileName);
                    updateBoothImageInfoResponse.setBoothid(boothidValue);
                }else{
                    updateBoothImageInfoResponse.setResult(false);
                }
            }else{
                updateBoothImageInfoResponse.setResult(false);
            }
        }else{
            updateBoothImageInfoResponse.setResult(false);
        }
        return updateBoothImageInfoResponse;
    }

    public File upload(@RequestParam MultipartFile file, String destDir, String fileName){
        File targetFile = new File(destDir, fileName);
        if(!targetFile.exists()) {
            targetFile.mkdirs();
        }
        try {
            file.transferTo(targetFile);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return targetFile;
    }

    public void renameFile(String path,String oldname,String newname) {
        if (!oldname.equals(newname)) {//新的文件名和以前文件名不同时,才有必要进行重命名
            File oldfile = new File(path + "/" + oldname);
            File newfile = new File(path + "/" + newname);
            if (!oldfile.exists()) {
                return;//重命名文件不存在
            }
            if (newfile.exists())//若在该目录下已经有一个文件和新文件名相同，则不允许重命名
                System.out.println(newname + "已经存在！");
            else {
                oldfile.renameTo(newfile);
            }
            System.out.println(oldfile.getAbsolutePath());
        } else {
            System.out.println("新文件名和旧文件名相同...");
        }
    }

    /**
     * load expoxicec image.
     *
     * @param response
     * @param tempid
     */
    @RequestMapping(value = "loadImgByImageType", method = RequestMethod.GET)
    public void loadImgByImageType(HttpServletResponse response,
                                   HttpServletRequest request,
                                   @RequestParam("tempid") int tempid,
                                   @RequestParam("imagename") String imagename,
                                   @RequestParam("boothid") String boothid,
                                   @RequestParam("mobilephone") String mobilephone) {
        try {
            String filename = new String(imagename.getBytes("iso-8859-1"),"UTF-8");
            String appendix_directory = systemConfig.getVal(Constants.appendix_directory).replaceAll("\\\\\\\\", "\\\\");
            int tFairId = (Integer)request.getSession().getAttribute("tFairId");
            List<TFairInfo> fairInfoList = fairTypeDao.queryByHql("from TFairInfo where fair_enable=? and id=?" , new Object[]{1, tFairId});
            String logoFileName = "";
            if(fairInfoList != null && fairInfoList.size()>0) {
                TFairInfo tFairInfo = fairInfoList.get(0);
                TExpoXicec tExpoXicec = null;
                //mobilephone不为空，说明是管理员查看对应的用户的信息
                if(StringUtils.isNotEmpty(mobilephone)){
                    tExpoXicec = tExpoXicecService.loadTExpoXicecByPhoneForAdmin(mobilephone);
                }else{
                    tExpoXicec = (TExpoXicec)request.getSession().getAttribute("tExpoXicec");
                }
                if(tExpoXicec != null){
                    TDocumentInfo tDocumentInfo = documentInfoService.getExhibitionTypeByDocumentId(tempid);
                    if(tDocumentInfo.getDocument_Common() != null && tDocumentInfo.getDocument_Common() == 1){
                        logoFileName = appendix_directory + "\\" + tFairInfo.getFair_begin_time() + "\\" + fairInfoList.get(0).getFair_name_alias() +
                                "\\" + tExpoXicec.getUsername() + "\\common\\" + tempid;
                    }else{
                        logoFileName = appendix_directory + "\\" + tFairInfo.getFair_begin_time() + "\\" + fairInfoList.get(0).getFair_name_alias() +
                                "\\" + tExpoXicec.getUsername() + "\\" + boothid + "\\" + tempid;
                    }
                }
                /*List<TDocumentInfo> tDocumentInfoList = documentInfoService.loadAllDocumentTypeByDocumentFairId(tFairId);
                for(TDocumentInfo tDocumentInfo:tDocumentInfoList){
                    if(tDocumentInfo.getId() == tempid){
                        logoFileName = appendix_directory + "\\" + tDocumentInfo.getId() + "\\";
                        break;
                    }
                }*/
                logoFileName = logoFileName + "\\" + filename;
                if (StringUtils.isNotEmpty(logoFileName)) {
                    OutputStream outputStream = response.getOutputStream();
                    File logo = new File(logoFileName);
                    if (!logo.exists()) {
                        return;
                    }
                    FileUtils.copyFile(new File(logoFileName), outputStream);
                    outputStream.close();
                    outputStream.flush();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @ResponseBody
    @RequestMapping(value = "/loadImageByCurrentBoothIdAndTempId", method = RequestMethod.POST)
    public LoadBoothImageInfoListResponse loadImageByCurrentBoothIdAndTempId(HttpServletResponse response,
                                                                             HttpServletRequest request,
                                                                             @RequestParam("boothid") String boothid,
                                                                             @RequestParam("tempid") int tempid,
                                                                             @RequestParam("mobilephone") String mobilephone) {
        LoadBoothImageInfoListResponse baseResponse = new LoadBoothImageInfoListResponse();
        List<BoothImageInfo> boothImageInfoArrayList = new ArrayList<BoothImageInfo>();
        String appendix_directory = systemConfig.getVal(Constants.appendix_directory).replaceAll("\\\\\\\\", "\\\\");
        int tFairId = (Integer)request.getSession().getAttribute("tFairId");
        //List<TFairInfo> fairInfoList = fairTypeDao.queryByHql("from TFairInfo where fair_enable=? and id=?" , new Object[]{1, tFairId});
        List<TFairInfo> fairInfoList = fairTypeDao.queryByHql("from TFairInfo where id=?" , new Object[]{tFairId});
        TExpoXicec tExpoXicec = null;
        //mobilephone不为空，说明是管理员查看对应的用户的信息
        if(StringUtils.isNotEmpty(mobilephone)){
            tExpoXicec = tExpoXicecService.loadTExpoXicecByPhoneForAdmin(mobilephone);
        }else{
            tExpoXicec = (TExpoXicec)request.getSession().getAttribute("tExpoXicec");
        }
        if(tExpoXicec != null){
            TExpoBuildInfo tExpoBuildInfo = expoXicecManagerService.loadExpoBuildInfoByBoothNum(boothid, tExpoXicec.getId());
            String logoFileName = "";
            List<TDocumentInfo> tDocumentInfoList = documentInfoService.loadAllDocumentTypeByDocumentFairId(tFairId);
            try{
                if(fairInfoList != null && fairInfoList.size()>0) {
                    TFairInfo tFairInfo = fairInfoList.get(0);
                    appendix_directory = appendix_directory + "\\" + tFairInfo.getFair_begin_time() +  "\\" + fairInfoList.get(0).getFair_name_alias() +
                            "\\" + tExpoXicec.getUsername() + "\\" + boothid;
                    for(TDocumentInfo tDocumentInfo:tDocumentInfoList){
                        if(tDocumentInfo.getId() == tempid){
                            if(tDocumentInfo.getDocument_Common() != null && tDocumentInfo.getDocument_Common() == 1){
                                appendix_directory = systemConfig.getVal(Constants.appendix_directory).replaceAll("\\\\\\\\", "\\\\");
                                logoFileName = appendix_directory + "\\" + tFairInfo.getFair_begin_time() +  "\\" + fairInfoList.get(0).getFair_name_alias() +
                                        "\\" + tExpoXicec.getUsername() + "\\common\\" + tDocumentInfo.getId() + "\\";
                            }else {
                                logoFileName = appendix_directory + "\\" + tDocumentInfo.getId() + "\\";
                            }
                            break;
                        }
                    }
                    String [] fileName = getFileName(logoFileName);
                    if(fileName != null){
                        for(String name:fileName){
                            BoothImageInfo boothImageInfo = new BoothImageInfo();
                            String fileModifyDate = getModifiedTime(name, logoFileName + "\\" + name);
                            boothImageInfo.setFileName(name);
                            boothImageInfo.setModifyDate(fileModifyDate);
                            boothImageInfo.setPreview(true);
                            boothImageInfo.setTempid(String.valueOf(tempid));
                            boothImageInfo.setCurBoothid(boothid);
                            if(tExpoBuildInfo != null){
                                boothImageInfo.setCurReviewStatus(tExpoBuildInfo.getCurrent_Audit_Status());
                            }
                            boothImageInfoArrayList.add(boothImageInfo);
                        }
                        net.sf.json.JSONArray resultJson = net.sf.json.JSONArray.fromObject(boothImageInfoArrayList);
                        baseResponse.setBoothImageInfoArrayListReslut(resultJson.toString());
                        baseResponse.setResultCode(0);
                    }
                }else{
                    baseResponse.setResultCode(1);
                }
            }catch (Exception e){
                baseResponse.setResultCode(1);
            }
        }else {
            baseResponse.setResultCode(1);
        }
        return baseResponse;
    }

    /*public LoadBoothImageInfoListResponse loadImageByCurrentBoothIdAndTempId(HttpServletResponse response,
                                                                             HttpServletRequest request,
                                                                             @RequestParam("boothid") String boothid,
                                                                             @RequestParam("tempid") Integer tempid,
                                                                             @RequestParam("mobilephone") String mobilephone) {
        LoadBoothImageInfoListResponse baseResponse = new LoadBoothImageInfoListResponse();
        List<BoothImageInfo> boothImageInfoArrayList = new ArrayList<BoothImageInfo>();
        String appendix_directory = systemConfig.getVal(Constants.appendix_directory).replaceAll("\\\\\\\\", "\\\\");
        int tFairId = (Integer)request.getSession().getAttribute("tFairId");
        List<TFairInfo> fairInfoList = fairTypeDao.queryByHql("from TFairInfo where fair_enable=? and id=?" , new Object[]{1, tFairId});
        TExpoXicec tExpoXicec = null;
        //mobilephone不为空，说明是管理员查看对应的用户的信息
        if(StringUtils.isNotEmpty(mobilephone)){
            tExpoXicec = tExpoXicecService.loadTExpoXicecByPhoneForAdmin(mobilephone);
        }else{
            tExpoXicec = (TExpoXicec)request.getSession().getAttribute("tExpoXicec");
        }
        if(tExpoXicec != null){
            TExpoBuildInfo tExpoBuildInfo = expoXicecManagerService.loadExpoBuildInfoByBoothNum(boothid, tExpoXicec.getId());
            String logoFileName = "";
            try{
                if(fairInfoList != null && fairInfoList.size()>0) {
                    TFairInfo tFairInfo = fairInfoList.get(0);
                    appendix_directory = appendix_directory + "\\" + tFairInfo.getFair_begin_time() +  "\\" + fairInfoList.get(0).getFair_name_alias() +
                            "\\" + tExpoXicec.getUsername() + "\\" + boothid;
                    if("1".equalsIgnoreCase(tempid)){
                        logoFileName = appendix_directory + "\\exhibition_liability_insurance\\";
                    }else if("2".equalsIgnoreCase(tempid)){
                        logoFileName = appendix_directory + "\\exhibit_letter_authorization\\";
                    }else if("3".equalsIgnoreCase(tempid)){
                        logoFileName = appendix_directory + "\\power_of_attorney\\";
                    }else if("4".equalsIgnoreCase(tempid)){
                        logoFileName = appendix_directory + "\\building_units_information\\";
                    }else if("5".equalsIgnoreCase(tempid)){
                        logoFileName = appendix_directory + "\\special_booth_drawings\\";
                    }else if("6".equalsIgnoreCase(tempid)){
                        logoFileName = appendix_directory + "\\material_inspection_report\\";
                    }else if("7".equalsIgnoreCase(tempid)){
                        logoFileName = appendix_directory + "\\copy_technical_qualification_certificate\\";
                    }
                    String [] fileName = getFileName(logoFileName);
                    if(fileName != null){
                        for(String name:fileName)
                        {
                            BoothImageInfo boothImageInfo = new BoothImageInfo();
                            String fileModifyDate = getModifiedTime(name, logoFileName + "\\" + name);
                            boothImageInfo.setFileName(name);
                            boothImageInfo.setModifyDate(fileModifyDate);
                            boothImageInfo.setPreview(true);
                            boothImageInfo.setTempid(tempid);
                            boothImageInfo.setCurBoothid(boothid);
                            if(tExpoBuildInfo != null){
                                boothImageInfo.setCurReviewStatus(tExpoBuildInfo.getCurrent_Audit_Status());
                            }
                            boothImageInfoArrayList.add(boothImageInfo);
                        }
                        net.sf.json.JSONArray resultJson = net.sf.json.JSONArray.fromObject(boothImageInfoArrayList);
                        baseResponse.setBoothImageInfoArrayListReslut(resultJson.toString());
                        baseResponse.setResultCode(0);
                    }
                }else{
                    baseResponse.setResultCode(1);
                }
            }catch (Exception e){
                baseResponse.setResultCode(1);
            }
        }else {
            baseResponse.setResultCode(1);
        }
        return baseResponse;
    }*/

    /**
     * delete expoxicec image.
     *
     * @param response
     * @param tempid
     */
    @ResponseBody
    @RequestMapping(value = "deleteImgByImageType", method = RequestMethod.POST)
    public BaseResponse deleteImgByImageType(HttpServletResponse response,
                                             HttpServletRequest request,
                                             @RequestParam("tempid") int tempid,
                                             @RequestParam("imagename") String imagename,
                                             @RequestParam("boothid") String boothid) {
        BaseResponse baseResponse = new BaseResponse();
        try {
            //String filename = new String(imagename.getBytes("iso-8859-1"),"UTF-8");
            String appendix_directory = systemConfig.getVal(Constants.appendix_directory).replaceAll("\\\\\\\\", "\\\\");
            int tFairId = (Integer)request.getSession().getAttribute("tFairId");
            List<TFairInfo> fairInfoList = fairTypeDao.queryByHql("from TFairInfo where fair_enable=? and id=?" , new Object[]{1, tFairId});
            String logoFileName = "";
            if(fairInfoList != null && fairInfoList.size()>0) {
                TFairInfo tFairInfo = fairInfoList.get(0);
                //TExpoXicec tExpoXicec = (TExpoXicec) request.getSession().getAttribute(ExpoXicecPrinciple.PRINCIPLE_SESSION_ATTRIBUTE);
                TExpoXicec tExpoXicec = (TExpoXicec)request.getSession().getAttribute("tExpoXicec");
                if(tExpoXicec != null){
                    appendix_directory = appendix_directory + "\\" + tFairInfo.getFair_begin_time() +
                            "\\" + fairInfoList.get(0).getFair_name_alias() + "\\" + tExpoXicec.getUsername();
                }
                TDocumentInfo tDocumentInfo = documentInfoService.getExhibitionTypeByDocumentId(tempid);
                if(tDocumentInfo.getDocument_Common() != null && tDocumentInfo.getDocument_Common() == 1){
                    logoFileName = appendix_directory + "\\common\\" + tempid + "\\";
                }else{
                    logoFileName = appendix_directory + "\\" + boothid + "\\" + tempid + "\\";
                }
                logoFileName = logoFileName  + imagename;
                File deleteFile = new File(logoFileName);
                if (StringUtils.isNotEmpty(logoFileName) && deleteFile.exists()) {
                    deleteFile.delete();
                    baseResponse.setResultCode(0);
                    baseResponse.setDescription("删除成功");
                }else {
                    baseResponse.setResultCode(1);
                    baseResponse.setDescription("删除失败");
                }
            }
        } catch (Exception e) {
            baseResponse.setResultCode(1);
            baseResponse.setDescription("删除失败");
            e.printStackTrace();
        }
        return baseResponse;
    }

    /**
     * 提交审核展位信息并刷新
     *
     * @param boothNum
     * @return
     */
    @RequestMapping(value = "submitAllBoothInfo", method = RequestMethod.POST)
    public ModelAndView redirectBoothListForSubmitAllBoothInfo(HttpServletRequest request, @RequestParam("BoothId") String boothNum) {
        ModelAndView modelAndView = new ModelAndView();
        try {
            if(StringUtils.isNotEmpty(boothNum)){
                String appendix_directory = systemConfig.getVal(Constants.appendix_directory).replaceAll("\\\\\\\\", "\\\\");
                int tFairId = (Integer)request.getSession().getAttribute("tFairId");
                //TExpoXicec tExpoXicec = (TExpoXicec) request.getSession().getAttribute(ExpoXicecPrinciple.PRINCIPLE_SESSION_ATTRIBUTE);
                TExpoXicec tExpoXicec = (TExpoXicec)request.getSession().getAttribute("tExpoXicec");
                if(tExpoXicec != null){
                    List<TFairInfo> fairInfoList = fairTypeDao.queryByHql("from TFairInfo where fair_enable=? and id=?" , new Object[]{1, tFairId});
                    if(fairInfoList != null && fairInfoList.size()>0) {
                        TFairInfo tFairInfo = fairInfoList.get(0);
                        appendix_directory = appendix_directory + "\\" + tFairInfo.getFair_begin_time() +
                                "\\" + fairInfoList.get(0).getFair_name_alias() + "\\" + tExpoXicec.getUsername() + "\\" + boothNum;
                        /*//布展委托函
                        File exhibit_letter_authorization_file =  new File(appendix_directory + "\\exhibit_letter_authorization\\");
                        if(exhibit_letter_authorization_file.isDirectory()){
                            if(exhibit_letter_authorization_file.listFiles().length == 0) {
                                modelAndView.addObject("alert", "请上传布展委托函证件");
                                modelAndView.addObject("redirect", "/BoothAudit/user/boothlist");
                                modelAndView.setViewName("/user/expoxicec/boothlist");
                                return modelAndView;
                            }
                        }else{
                            modelAndView.addObject("alert", "请上传布展委托函证件");
                            modelAndView.addObject("redirect", "/BoothAudit/user/boothlist");
                            modelAndView.setViewName("/user/expoxicec/boothlist");
                            return modelAndView;
                        }
                        //授权委托书
                        File power_of_attorney_file =  new File(appendix_directory + "\\power_of_attorney\\");
                        if(power_of_attorney_file.isDirectory()){
                            if(power_of_attorney_file.listFiles().length == 0) {
                                modelAndView.addObject("alert", "请上传授权委托书证件");
                                modelAndView.addObject("redirect", "/BoothAudit/user/boothlist");
                                modelAndView.setViewName("/user/expoxicec/boothlist");
                                return modelAndView;
                            }
                        }else {
                            modelAndView.addObject("alert", "请上传授权委托书证件");
                            modelAndView.addObject("redirect", "/BoothAudit/user/boothlist");
                            modelAndView.setViewName("/user/expoxicec/boothlist");
                            return modelAndView;
                        }
                        //搭建单位相关资料
                        File building_units_information_file =  new File(appendix_directory + "\\building_units_information\\");
                        if(building_units_information_file.isDirectory()){
                            if(building_units_information_file.listFiles().length == 0) {
                                modelAndView.addObject("alert", "请上传搭建单位相关资料");
                                modelAndView.addObject("redirect", "/BoothAudit/user/boothlist");
                                modelAndView.setViewName("/user/expoxicec/boothlist");
                                return modelAndView;
                            }
                        }else{
                            modelAndView.addObject("alert", "请上传特装展位相关图纸");
                            modelAndView.addObject("redirect", "/user/BoothAudit/boothlist");
                            modelAndView.setViewName("/user/expoxicec/boothlist");
                            return modelAndView;
                        }
                        //特装展位相关图纸
                        File special_booth_drawings_file =  new File(appendix_directory + "\\special_booth_drawings\\");
                        if(special_booth_drawings_file.isDirectory()){
                            if(special_booth_drawings_file.listFiles().length == 0) {
                                modelAndView.addObject("alert", "请上传特装展位相关图纸");
                                modelAndView.addObject("redirect", "/BoothAudit/user/boothlist");
                                modelAndView.setViewName("/user/expoxicec/boothlist");
                                return modelAndView;
                            }
                        }
                        //搭建材料检验报告
                        File material_inspection_report_file =  new File(appendix_directory + "\\material_inspection_report\\");
                        if(material_inspection_report_file.isDirectory()){
                            if(material_inspection_report_file.listFiles().length == 0) {
                                modelAndView.addObject("alert", "请上传搭建材料检验报告");
                                modelAndView.addObject("redirect", "/BoothAudit/user/boothlist");
                                modelAndView.setViewName("/user/expoxicec/boothlist");
                                return modelAndView;
                            }
                        }else {
                            modelAndView.addObject("alert", "请上传搭建材料检验报告");
                            modelAndView.addObject("redirect", "/BoothAudit/user/boothlist");
                            modelAndView.setViewName("/user/expoxicec/boothlist");
                            return modelAndView;
                        }
                        //现场工人相关技术资格证复印件
                        File copy_technical_qualification_certificate_file =  new File(appendix_directory + "\\copy_technical_qualification_certificate\\");
                        if(copy_technical_qualification_certificate_file.isDirectory()){
                            if(copy_technical_qualification_certificate_file.listFiles().length == 0) {
                                modelAndView.addObject("alert", "请上传现场工人相关技术资格证复印件");
                                modelAndView.addObject("redirect", "/BoothAudit/user/boothlist");
                                modelAndView.setViewName("/user/expoxicec/boothlist");
                                return modelAndView;
                            }
                        }else {
                            modelAndView.addObject("alert", "请上传现场工人相关技术资格证复印件");
                            modelAndView.addObject("redirect", "/BoothAudit/user/boothlist");
                            modelAndView.setViewName("/user/expoxicec/boothlist");
                            return modelAndView;
                        }*/
                        TExpoBuildInfo tExpoBuildInfo = expoXicecManagerService.loadExpoBuildInfoByBoothNum(boothNum, tExpoXicec.getId());
                        if(tExpoBuildInfo != null){
                            tExpoBuildInfo.setCurrent_Audit_Status(2);
                            tExpoBuildInfo.setUpdate_time(new Date());
                            texpoBuildInfoDao.update(tExpoBuildInfo);
                        }
                        modelAndView.addObject("tExpoXicecFair", tExpoXicec);
                        modelAndView.addObject("tExpoBuildInfo", tExpoBuildInfo);
                        modelAndView.addObject("alert", "提交成功");
                        modelAndView.addObject("redirect", "/BoothAudit/user/boothlist");
                        modelAndView.setViewName("/user/expoxicec/boothlist");
                    }
                }else{
                    modelAndView.addObject("alert", "系统出错，请试着刷新下");
                    modelAndView.addObject("redirect", "/BoothAudit/user/boothlist");
                    modelAndView.setViewName("/user/expoxicec/boothlist");
                    return modelAndView;
                }
            }
        } catch (Exception e) {
            modelAndView.addObject("alert", "系统出错，请试着刷新下");
            modelAndView.addObject("redirect", "/BoothAudit/user/boothlist");
            modelAndView.setViewName("/user/expoxicec/boothlist");
            return modelAndView;
        }
        return modelAndView;
    }

    /**
     * 删除展位信息并刷新
     *
     * @param boothNum
     * @return
     */
    @RequestMapping(value = "deleteAllBoothInfo", method = RequestMethod.POST)
    public ModelAndView redirectBoothListForDeleteAllBoothInfo(HttpServletRequest request, @RequestParam("BoothId") String boothNum) {
        ModelAndView modelAndView = new ModelAndView();
        //TExpoXicec tExpoXicec = (TExpoXicec) request.getSession().getAttribute(ExpoXicecPrinciple.PRINCIPLE_SESSION_ATTRIBUTE);
        TExpoXicec tExpoXicec = (TExpoXicec)request.getSession().getAttribute("tExpoXicec");
        if(tExpoXicec != null){
            try{
                if(StringUtils.isNotEmpty(boothNum)) {
                    TExpoBuildInfo tExpoBuildInfo = expoXicecManagerService.loadExpoBuildInfoByBoothNum(boothNum, tExpoXicec.getId());
                    if (tExpoBuildInfo != null) {
                        texpoBuildInfoDao.delete(tExpoBuildInfo);
                    }
                    String appendix_directory = systemConfig.getVal(Constants.appendix_directory).replaceAll("\\\\\\\\", "\\\\");
                    int tFairId = (Integer)request.getSession().getAttribute("tFairId");
                    List<TFairInfo> fairInfoList = fairTypeDao.queryByHql("from TFairInfo where fair_enable=? and id=?" , new Object[]{1, tFairId});
                    if(fairInfoList != null && fairInfoList.size()>0) {
                        TFairInfo tFairInfo = fairInfoList.get(0);
                        appendix_directory = appendix_directory + "\\" + tFairInfo.getFair_begin_time() +
                                "\\" + fairInfoList.get(0).getFair_name_alias() + "\\" + tExpoXicec.getUsername() + "\\" + boothNum;
                    }
                    FileUtils.deleteDirectory(new File(appendix_directory));
                    modelAndView.addObject("alert", "删除成功");

                    List<TExpoBuildInfo> tExpoBuildInfoList = texpoBuildInfoDao.queryByHql("from TExpoBuildInfo where userid = ? and fairid=? ", new Object[]{tExpoXicec.getId(), tFairId});
                    if(tExpoBuildInfoList != null && tExpoBuildInfoList.size()>0){
                        modelAndView.addObject("redirect", "/BoothAudit/user/boothlist");
                        modelAndView.setViewName("/user/expoxicec/boothlist");
                    }else {
                        modelAndView.addObject("redirect","/BoothAudit/user/boothempty");
                        modelAndView.setViewName("/user/expoxicec/boothempty");
                    }
                }
            }catch (Exception e){
                request.getSession().removeAttribute("tExpoXicec");
                request.getSession().removeAttribute("tFairId");
                request.getSession().removeAttribute(Principle.PRINCIPLE_SESSION_ATTRIBUTE);
                modelAndView.addObject("alert", "系统出错，请重新登录");
                modelAndView.addObject("redirect", "/");
                modelAndView.setViewName("/public/login");
            }
        }else {
            request.getSession().removeAttribute("tExpoXicec");
            request.getSession().removeAttribute("tFairId");
            request.getSession().removeAttribute(Principle.PRINCIPLE_SESSION_ATTRIBUTE);
            modelAndView.addObject("alert", "系统出错，请重新登录");
            modelAndView.addObject("redirect", "/");
            modelAndView.setViewName("/public/login");
        }
        return modelAndView;
    }

    public static String [] getFileName(String path)
    {
        File file = new File(path);
        String [] fileName = file.list();
        return fileName;
    }

    /**
     * 读取文件创建时间
     */
    public static void getCreateTime(String name, String filePath){
        String strTime = null;
        try {
            Process p = Runtime.getRuntime().exec("cmd /C dir " + filePath + "/tc" );
            InputStream is = p.getInputStream();
            BufferedReader br = new BufferedReader(new InputStreamReader(is));
            String line;
            while((line = br.readLine()) != null){
                if(line.endsWith(".")){
                    strTime = line.substring(0,17);
                    break;
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        //System.out.println("文件名：" + name + ", 创建时间：" + strTime);
        //输出：创建时间   2009-08-17  10:21
    }

    /**
     * 读取修改时间的方法2
     */
    public static String getModifiedTime(String name, String filePath){
        File f = new File(filePath);
        Calendar cal = Calendar.getInstance();
        long time = f.lastModified();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        cal.setTimeInMillis(time);
        //System.out.println("文件名：" + name + "，修改时间：" + formatter.format(cal.getTime()));
        return formatter.format(cal.getTime());
        //输出：修改时间[2]    2009-08-17 10:32:38
    }

    public static void getAllFileName(String path,ArrayList<String> fileName)
    {
        File file = new File(path);
        File [] files = file.listFiles();
        String [] names = file.list();
        if(names != null)
            fileName.addAll(Arrays.asList(names));
        for(File a:files)
        {
            if(a.isDirectory())
            {
                getAllFileName(a.getAbsolutePath(),fileName);
            }
        }
    }

    //图片转化成base64字符串
    public static String GetImageStr()
    {//将图片文件转化为字节数组字符串，并对其进行Base64编码处理
        String imgFile = "C:\\Program Files\\Apache Software Foundation\\appendix\\expoXicec\\2017-3-6\\stonefair\\大地\\A6331\\exhibition_liability_insurance\\IMG_0165.JPG";//待处理的图片
        InputStream in = null;
        byte[] data = null;
        //读取图片字节数组
        try
        {
            in = new FileInputStream(imgFile);
            data = new byte[in.available()];
            in.read(data);
            in.close();
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
        //对字节数组Base64编码
        BASE64Encoder encoder = new BASE64Encoder();
        return encoder.encode(data);//返回Base64编码过的字节数组字符串
    }

    //base64字符串转化成图片
    public static boolean GenerateImage(String imgStr)
    {   //对字节数组字符串进行Base64解码并生成图片
        if (imgStr == null) //图像数据为空
            return false;
        BASE64Decoder decoder = new BASE64Decoder();
        try
        {
            //Base64解码
            byte[] b = decoder.decodeBuffer(imgStr);
            for(int i=0;i<b.length;++i)
            {
                if(b[i]<0)
                {//调整异常数据
                    b[i]+=256;
                }
            }
            //生成jpeg图片
            String imgFilePath = "C:\\Program Files\\Apache Software Foundation\\appendix\\expoXicec\\2017-3-6\\stonefair\\大地\\A6331\\exhibition_liability_insurance\\11.jpg";//新生成的图片
            OutputStream out = new FileOutputStream(imgFilePath);
            out.write(b);
            out.flush();
            out.close();
            return true;
        }
        catch (Exception e)
        {
            return false;
        }
    }

    //*************************************************后台管理界面相关跳转路径******************************************
    /**
     * 查询所有展会信息
     * @return
     */
    @Transactional
    public List<TFairInfo> loadAllFairList(){
        List<TFairInfo> fairInfoList = fairTypeDao.queryByHql("from TFairInfo " , new Object[]{});
        return fairInfoList;
    }

    /**
     * 查询所有用户信息
     * @return
     */
    @Transactional
    public List<TExpoXicec> loadAllExpoXicecList(){
        List<TExpoXicec> expoXicecList = texpoXicecDao.queryByHql("from TExpoXicec " , new Object[]{});
        return expoXicecList;
    }

    /**
     * redirect to project list page.
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "admin/projectlist", method = RequestMethod.GET)
    public ModelAndView redirectAdminProjectList(HttpServletRequest request, Locale locale) {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("/user/expoxicec/admin/admin_project_list");
        return modelAndView;
    }

    /**
     * redirect to project list page.
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "admin/userlist", method = RequestMethod.GET)
    public ModelAndView redirectAdminUsertList(HttpServletRequest request, Locale locale) {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("/user/expoxicec/admin/admin_user_list");
        return modelAndView;
    }

    /**
     * get all project info.
     *
     * @param request
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "admin/project/list", method = RequestMethod.POST)
    public ExpoFairListResponse getAllPorjectList(HttpServletRequest request, Locale locale) {
        ExpoFairListResponse expoFairListResponse = new ExpoFairListResponse();
        List<TFairInfo> tFairInfoList = loadAllFairList();
        net.sf.json.JSONArray jsonArrayEx = net.sf.json.JSONArray.fromObject(tFairInfoList);
        expoFairListResponse.settFairInfoList(jsonArrayEx.toString());
        return expoFairListResponse;
    }

    /**
     * redirect to user info edit page.
     *
     * @param userDetailInfoRequest
     * @return
     */
    @RequestMapping(value = "admin/edit/userinfo", method = RequestMethod.GET)
    public ModelAndView redirectEditUserInfo(@ModelAttribute QueryUserListRequest userDetailInfoRequest, Locale locale) {
        ModelAndView modelAndView = new ModelAndView();
        TExpoXicec tExpoXicec = tExpoXicecService.loadTExpoXicec(userDetailInfoRequest.getId());
        if(tExpoXicec != null){
            modelAndView.addObject("tExpoXicecInfo", tExpoXicec);
        }
        modelAndView.setViewName("/user/expoxicec/admin/admin_user_edit");
        return modelAndView;
    }

    /**
     * update user infp
     *
     * @param editUserInfoRequest
     * @return
     */
    @RequestMapping(value = "admin/edit/updateInfo", method = RequestMethod.POST)
    public ModelAndView updateUserInfoByAdmin(EditUserInfoRequest editUserInfoRequest, HttpServletRequest request, Locale locale) throws IOException {
        ModelAndView modelAndView = new ModelAndView();
        try{
            TExpoXicec tExpoXicec = tExpoXicecService.loadTExpoXicec(editUserInfoRequest.getId());
            if(tExpoXicec != null){
                tExpoXicec.setMobilephone(editUserInfoRequest.getMobile());
                tExpoXicec.setUsername(editUserInfoRequest.getName());
                tExpoXicec.setCompany(editUserInfoRequest.getCompany());
                tExpoXicec.setEmail(editUserInfoRequest.getEmail());
                tExpoXicec.setPassword(editUserInfoRequest.getPassword());
                tExpoXicec.setStatus(editUserInfoRequest.getStatus());
                tExpoXicec.setVip(editUserInfoRequest.getVip());
                tExpoXicec.setMsg_num(editUserInfoRequest.getSmsNum());
                tExpoXicec.setUser_role(editUserInfoRequest.isUser_role()?1:0);
                tExpoXicecService.updateTExpoXicec(tExpoXicec);
                modelAndView.addObject("alert", "操作成功");
                modelAndView.addObject("tExpoXicecDetailInfo", tExpoXicec);
                modelAndView.addObject("redirect", "../../admin/userinfo/details.html?telphone=" + editUserInfoRequest.getMobile());
                modelAndView.setViewName("/user/expoxicec/admin/admin_user_detail_info");
            }else{
                modelAndView.addObject("alert", "数据出错");
                modelAndView.addObject("redirect", "../../admin/userlist");
                modelAndView.setViewName("/user/expoxicec/admin/admin_user_list");
            }
        }catch (Exception e){
            log.error("edit user info error.", e);
        }
        return modelAndView;
    }

    /**
     * redirect to user detail info page.
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "admin/userinfo/details", method = RequestMethod.GET)
    public ModelAndView redirectAdminUsertDetailInfo(@ModelAttribute QueryUserListRequest userDetailInfoRequest,
                                                     HttpServletRequest request, Locale locale) {
        ModelAndView modelAndView = new ModelAndView();
        if(StringUtils.isNotEmpty(userDetailInfoRequest.getTelphone())){
            TExpoXicec tExpoXicec = tExpoXicecService.loadTExpoXicecByPhoneForAdmin(userDetailInfoRequest.getTelphone());
            modelAndView.addObject("tExpoXicecDetailInfo", tExpoXicec);

            List<TFairInfo> fairInfoList = new ArrayList<TFairInfo>();
            if(tExpoXicec != null){
                List<TUserFair> userFairList = userFairService.loadAllUserFairByUserId(tExpoXicec.getId());
                if(userFairList != null){
                    for(TUserFair tUserFair:userFairList){
                        TFairInfo tFairInfo = fairInfoService.loadFairInfoByFairId(tUserFair.getFair_id());
                        fairInfoList.add(tFairInfo);
                    }
                    modelAndView.addObject("fairInfoList", fairInfoList);
                }else{
                    modelAndView.addObject("fairInfoList", null);
                }
            }
        }
        modelAndView.setViewName("/user/expoxicec/admin/admin_user_detail_info");
        return modelAndView;
    }

    /**
     * redirect to user fair's booth list info page.
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "admin/fair/booth/listhead", method = RequestMethod.GET)
    public ModelAndView redirectAdminFairBoothListHead(@ModelAttribute QueryBoothListInfoRequest queryBoothListInfoRequest,
                                                     HttpServletRequest request, Locale locale) {
        ModelAndView modelAndView = new ModelAndView();
        TExpoXicec tExpoXicec = tExpoXicecService.loadTExpoXicecByPhoneForAdmin(queryBoothListInfoRequest.getTelphone());
        request.getSession().setAttribute("tFairId", queryBoothListInfoRequest.getFairid());
        if(tExpoXicec != null){
            modelAndView.addObject("tExpoXicecFair", tExpoXicec);
            List<TExpoBuildInfo> tExpoBuildInfoList = tExpoBuildInfoervice.loadTExpoXicecListByUserIdAndFairId(tExpoXicec.getId(), queryBoothListInfoRequest.getFairid());
            modelAndView.addObject("tExpoBuildInfoList", tExpoBuildInfoList);
            TFairInfo tFairInfo = fairInfoService.loadFairInfoByFairId(queryBoothListInfoRequest.getFairid());
            modelAndView.addObject("tFairInfo", tFairInfo);
            modelAndView.setViewName("/user/expoxicec/admin/admin_fair_booth_list");
        }else{
            request.getSession().removeAttribute("tExpoXicec");
            request.getSession().removeAttribute("tFairId");
            request.getSession().removeAttribute(Principle.PRINCIPLE_SESSION_ATTRIBUTE);
            modelAndView.addObject("alert", "时间超时，请重新登录");
            modelAndView.addObject("redirect", "/");
            modelAndView.setViewName("/public/login");
        }
        return modelAndView;
    }

    @ResponseBody
    @RequestMapping(value = "admin/fair/booth/listinfo", method = RequestMethod.POST)
    public ExpoFairListResponse getUserJoinPorjectListInfo(@RequestParam("fairId") String fairId, HttpServletRequest request, Locale locale) {
        ExpoFairListResponse expoFairListResponse = new ExpoFairListResponse();
        String[] telphoneAndfairIdArray = fairId.split("&");
        if(telphoneAndfairIdArray.length>1){
            String[] telphoneArray = telphoneAndfairIdArray[0].split("=");
            TExpoXicec tExpoXicec = tExpoXicecService.loadTExpoXicecByPhoneForAdmin(telphoneArray[1]);
            if(tExpoXicec != null){
                String[] fairIdArray = telphoneAndfairIdArray[1].split("=");
                TUserFair userFair = userFairService.loadAllUserFairByUserIdAndFairType(tExpoXicec.getId(), Integer.parseInt(fairIdArray[1]));
                if(userFair != null){
                    List<TExpoBuildInfo> tExpoBuildInfoList = tExpoBuildInfoervice.loadTExpoXicecListByUserIdAndFairId(userFair.getUser_id(), userFair.getFair_id());
                    net.sf.json.JSONArray jsonArrayEx = net.sf.json.JSONArray.fromObject(tExpoBuildInfoList);
                    expoFairListResponse.settFairInfoList(jsonArrayEx.toString());
                }
            }else{
                expoFairListResponse.setResultCode(1);
            }
        }else{
            expoFairListResponse.setResultCode(1);
        }
        return expoFairListResponse;
    }

    /**
     * get user join project info.
     *
     * @param request
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "admin/join/project/list", method = RequestMethod.POST)
    public ExpoFairListResponse getUserJoinPorjectList(@RequestParam("telphone") String telphone, HttpServletRequest request, Locale locale) {
        ExpoFairListResponse expoFairListResponse = new ExpoFairListResponse();
        TExpoXicec tExpoXicec = tExpoXicecService.loadTExpoXicecByPhoneForAdmin(telphone);
        List<TFairInfo> fairInfoList = new ArrayList<TFairInfo>();
        if(tExpoXicec != null){
            List<TUserFair> userFairList = userFairService.loadAllUserFairByUserId(tExpoXicec.getId());
            for(TUserFair tUserFair:userFairList){
                TFairInfo tFairInfo = fairInfoService.loadFairInfoByFairId(tUserFair.getFair_id());
                fairInfoList.add(tFairInfo);
            }
        }
        net.sf.json.JSONArray jsonArrayEx = net.sf.json.JSONArray.fromObject(fairInfoList);
        expoFairListResponse.settFairInfoList(jsonArrayEx.toString());
        return expoFairListResponse;
    }

    /**
     * redirect to user fair's booth list info page.
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "admin/booth/details", method = RequestMethod.GET)
    public ModelAndView redirectAdminBoothDetails(@ModelAttribute QueryBoothDetailsInfoRequest queryBoothDetailsInfoRequest,
                                                       HttpServletRequest request, Locale locale) {
        ModelAndView modelAndView = new ModelAndView();
        TExpoBuildInfo tExpoBuildInfo = tExpoBuildInfoervice.loadTExpoBuildInfo(queryBoothDetailsInfoRequest.getBoothid());
        modelAndView.addObject("tExpoBuildInfo", tExpoBuildInfo);
        TExpoXicec tExpoXicec = tExpoXicecService.loadTExpoXicecByPhoneForAdmin(queryBoothDetailsInfoRequest.getTelphone());
        request.getSession().setAttribute("tFairId", queryBoothDetailsInfoRequest.getFairid());
        if(tExpoXicec != null){
            List<TExpoBuildInfo> tExpoBuildInfoList = tExpoBuildInfoervice.loadTExpoXicecListByUserIdAndFairId(tExpoXicec.getId(), queryBoothDetailsInfoRequest.getFairid());
            modelAndView.addObject("tExpoXicecFair", tExpoXicec);
            modelAndView.addObject("tExpoBuildInfoList", tExpoBuildInfoList);
            TFairInfo tFairInfo = fairInfoService.loadFairInfoByFairId(queryBoothDetailsInfoRequest.getFairid());
            modelAndView.addObject("tFairInfo", tFairInfo);
            modelAndView.setViewName("/user/expoxicec/admin/admin_fair_booth_details");
            //modelAndView.setViewName("/user/expoxicec/admin/admin_fair_exhibition_list");
        }else{
            request.getSession().removeAttribute("tExpoXicec");
            request.getSession().removeAttribute("tFairId");
            request.getSession().removeAttribute(Principle.PRINCIPLE_SESSION_ATTRIBUTE);
            modelAndView.addObject("alert", "时间超时，请重新登录");
            modelAndView.addObject("redirect", "/");
            modelAndView.setViewName("/public/login");
        }
        return modelAndView;
    }

    /**
     * redirect to user fair's booth edit info page.
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "admin/fair/booth/edit", method = RequestMethod.GET)
    public ModelAndView redirectAdminFairBoothEdit(@ModelAttribute QueryBoothDetailsInfoRequest queryBoothEditInfoRequest,
                                                       HttpServletRequest request, Locale locale) {
        ModelAndView modelAndView = new ModelAndView();
        TExpoBuildInfo tExpoBuildInfo = tExpoBuildInfoervice.loadTExpoBuildInfo(queryBoothEditInfoRequest.getBoothid());
        modelAndView.addObject("tExpoBuildInfo", tExpoBuildInfo);
        TExpoXicec tExpoXicec = tExpoXicecService.loadTExpoXicecByPhoneForAdmin(queryBoothEditInfoRequest.getTelphone());
        request.getSession().setAttribute("tFairId", queryBoothEditInfoRequest.getFairid());
        if(tExpoXicec != null){
            List<TExpoBuildInfo> tExpoBuildInfoList = tExpoBuildInfoervice.loadTExpoXicecListByUserIdAndFairId(tExpoXicec.getId(), queryBoothEditInfoRequest.getFairid());
            modelAndView.addObject("tExpoXicecFair", tExpoXicec);
            modelAndView.addObject("tExpoBuildInfo", tExpoBuildInfo);
            modelAndView.addObject("tExpoBuildInfoList", tExpoBuildInfoList);
            TFairInfo tFairInfo = fairInfoService.loadFairInfoByFairId(queryBoothEditInfoRequest.getFairid());
            modelAndView.addObject("tFairInfo", tFairInfo);
            modelAndView.setViewName("/user/expoxicec/admin/admin_fair_booth_edit");
        }else{
            request.getSession().removeAttribute("tExpoXicec");
            request.getSession().removeAttribute("tFairId");
            request.getSession().removeAttribute(Principle.PRINCIPLE_SESSION_ATTRIBUTE);
            modelAndView.addObject("alert", "时间超时，请重新登录");
            modelAndView.addObject("redirect", "/");
            modelAndView.setViewName("/public/login");
        }
        return modelAndView;
    }

    /**
     * redirect to user fair's booth edit info page.
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "admin/fair/exhibitorbooth/edit", method = RequestMethod.GET)
    public ModelAndView redirectAdminFairBoothEdit(@ModelAttribute QueryExhibitorBoothInfoRequest queryBoothEditInfoRequest,
                                                   HttpServletRequest request, Locale locale) {
        ModelAndView modelAndView = new ModelAndView();
        TExpoBuildInfo tExpoBuildInfo = tExpoBuildInfoervice.loadTExpoXicecListByFairIdAndBoothNum(queryBoothEditInfoRequest.getFairid(), queryBoothEditInfoRequest.getBoothid());
        if(tExpoBuildInfo == null){
            tExpoBuildInfo = new TExpoBuildInfo();
            tExpoBuildInfo.setBooth_Number(queryBoothEditInfoRequest.getBoothid());
            tExpoBuildInfo.setBooth_area(queryBoothEditInfoRequest.getBootharea());
        }
        modelAndView.addObject("tExpoBuildInfo", tExpoBuildInfo);
        TExpoXicec tExpoXicec = tExpoXicecService.loadTExpoXicecByPhoneForAdmin(queryBoothEditInfoRequest.getTelphone());
        request.getSession().setAttribute("tFairId", queryBoothEditInfoRequest.getFairid());
        if(tExpoXicec != null){
            List<TExpoBuildInfo> tExpoBuildInfoList = tExpoBuildInfoervice.loadTExpoXicecListByUserIdAndFairId(tExpoXicec.getId(), queryBoothEditInfoRequest.getFairid());
            modelAndView.addObject("tExpoBuildInfoList", tExpoBuildInfoList);
        }else{
            tExpoXicec = new TExpoXicec();
            /*request.getSession().removeAttribute("tExpoXicec");
            request.getSession().removeAttribute("tFairId");
            request.getSession().removeAttribute(Principle.PRINCIPLE_SESSION_ATTRIBUTE);
            modelAndView.addObject("alert", "时间超时，请重新登录");
            modelAndView.addObject("redirect", "/");
            modelAndView.setViewName("/public/login");*/
        }
        modelAndView.addObject("tExpoXicecFair", tExpoXicec);
        TFairInfo tFairInfo = fairInfoService.loadFairInfoByFairId(queryBoothEditInfoRequest.getFairid());
        modelAndView.addObject("tFairInfo", tFairInfo);
        modelAndView.setViewName("/user/expoxicec/admin/admin_fair_booth_edit");
        return modelAndView;
    }

    /**
     * create booth
     *
     * @param editBoothInfoRequest
     * @return
     */
    @RequestMapping(value = "admin/edit/booth", method = RequestMethod.POST)
    public ModelAndView adminEditBoothInfo(@ModelAttribute EditBoothInfoRequest editBoothInfoRequest,
                                           HttpServletRequest request, Locale locale) throws IOException {
        ModelAndView modelAndView = new ModelAndView();
        try{
            TExpoBuildInfo tExpoBuildInfo = tExpoBuildInfoervice.loadTExpoBuildInfo(editBoothInfoRequest.getExpoxicecBuildId());
            if(tExpoBuildInfo != null){
                tExpoBuildInfo.setBooth_area(editBoothInfoRequest.getBoothName());
                tExpoBuildInfo.setExhibitor_Company(editBoothInfoRequest.getBoothCompany());
                tExpoBuildInfo.setBooth_area(editBoothInfoRequest.getBoothArea());
                tExpoBuildInfoervice.updateTExpoBuildInfo(tExpoBuildInfo);

                modelAndView.addObject("tExpoBuildInfo", tExpoBuildInfo);
                TExpoXicec tExpoXicec = tExpoXicecService.loadTExpoXicec(editBoothInfoRequest.getExpoxicecId());
                if(tExpoXicec != null){
                    tExpoXicec.setUsername(editBoothInfoRequest.getExpoxicecFairContact());
                    tExpoXicec.setMobilephone(editBoothInfoRequest.getExpoxicecFairMobile());
                    tExpoXicecService.updateTExpoXicec(tExpoXicec);
                    //这里增加日志保存

                    List<TExpoBuildInfo> tExpoBuildInfoList = tExpoBuildInfoervice.loadTExpoXicecListByUserIdAndFairId(tExpoXicec.getId(), editBoothInfoRequest.getExpoxicecFairId());
                    modelAndView.addObject("tExpoXicecFair", tExpoXicec);
                    modelAndView.addObject("tExpoBuildInfo", tExpoBuildInfo);
                    modelAndView.addObject("tExpoBuildInfoList", tExpoBuildInfoList);
                    TFairInfo tFairInfo = fairInfoService.loadFairInfoByFairId(editBoothInfoRequest.getExpoxicecFairId());
                    modelAndView.addObject("tFairInfo", tFairInfo);
                    modelAndView.setViewName("/user/expoxicec/admin/admin_fair_booth_details");
                }
            }else{
                request.getSession().removeAttribute("tExpoXicec");
                request.getSession().removeAttribute("tFairId");
                request.getSession().removeAttribute(Principle.PRINCIPLE_SESSION_ATTRIBUTE);
                modelAndView.addObject("alert", "时间超时，请重新登录");
                modelAndView.addObject("redirect", "/");
                modelAndView.setViewName("/public/login");
            }
        }catch (Exception e){
            log.error("edit booth info by admin error.", e);
        }
        //在这里进行保存操作
        return modelAndView;
    }

    /**
     * get register booth info.
     *
     * @param request
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "admin/booth/register", method = RequestMethod.POST)
    public BoothRegisterListInfoResponse showBoothRegisterInfoForAdmin(HttpServletRequest request, Locale locale,
                                                              @RequestParam("userid") Integer userid,
                                                              @RequestParam("fairid") Integer fairid,
                                                              @RequestParam("boothNum") String boothNum) {
        BoothRegisterListInfoResponse expoFairListResponse = new BoothRegisterListInfoResponse();
        List<TExpoBuildInfo> tExpoBuildInfoList = tExpoBuildInfoervice.loadTExpoXicecListByUserIdAndFairIdAndBoothnum(userid, fairid, boothNum);
        if(tExpoBuildInfoList != null && tExpoBuildInfoList.size()>0){
            float areaSum = 0;
            for(TExpoBuildInfo tExpoBuildInfo:tExpoBuildInfoList){
                areaSum += Float.parseFloat(tExpoBuildInfo.getBooth_area());
            }
            net.sf.json.JSONArray jsonArrayEx = net.sf.json.JSONArray.fromObject(tExpoBuildInfoList);
            expoFairListResponse.setTotalArea(areaSum);
            expoFairListResponse.setMatchValue(tExpoBuildInfoList.size() + "/" + tExpoBuildInfoList.size() + " (100%)");
            expoFairListResponse.setBoothRegisterListInfo(jsonArrayEx.toString());
        }else{
            expoFairListResponse.setMatchValue("");
            expoFairListResponse.setBoothRegisterListInfo("");
        }
        return expoFairListResponse;
    }

    /**
     * redirect to user fair's booth list info page.
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "admin/fair/booth/list/page", method = RequestMethod.GET)
    public ModelAndView redirectAdminFairBoothListPage(@ModelAttribute QueryBoothDetailsInfoRequest queryBoothEditInfoRequest,
                                                   HttpServletRequest request, Locale locale) {
        ModelAndView modelAndView = new ModelAndView();
        TFairInfo tFairInfo = fairInfoService.loadFairInfoByFairId(queryBoothEditInfoRequest.getFairid());
        modelAndView.addObject("tFairInfo", tFairInfo);
        TExpoXicec tExpoXicec = tExpoXicecService.loadTExpoXicecByFairId(queryBoothEditInfoRequest.getFairid());
        modelAndView.addObject("tExpoXicecFair", tExpoXicec);
        //modelAndView.setViewName("/user/expoxicec/admin/admin_fair_booth_list_page");
        modelAndView.setViewName("/user/expoxicec/admin/admin_fair_exhibition_audit_list");
        return modelAndView;
    }

    /**
     * 分页查询展位审核列表
     * @param request
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "queryFairBoothListInfoByPage")
    public QueryFairBoothListResponse queryFairBoothListInfo(@ModelAttribute QueryFairBoothListRequest request) {
        QueryFairBoothListResponse response = null;
        //TExpoBuildInfo tExpoBuildInfo = tExpoBuildInfoervice.loadTExpoBuildInfo(request.getBoothid());
        try {
            response = queryFairBoothListInfoByPage(request);
        } catch (Exception e) {
            response.setResultCode(1);
            log.error("query user list error.", e);
        }
        return response;
    }

    /**
     * 分页获取展位审核列表
     * @param request
     * @return
     * @throws UnsupportedEncodingException
     */
    @Transactional
    public QueryFairBoothListResponse queryFairBoothListInfoByPage(QueryFairBoothListRequest request) throws UnsupportedEncodingException {
        List<String> conditions = new ArrayList<String>();
        //状态
        if (request.getBoothStatus() != null && -1 != request.getBoothStatus()) {
            conditions.add(" e.current_Audit_Status = " + request.getBoothStatus() + " ");
        }
        //展位号
        if (StringUtils.isNotEmpty(request.getBoothNumber())) {
            conditions.add(" (e.booth_Number like '%" + request.getBoothNumber() + "%' OR e.booth_Number like '%" + new String(request.getBoothNumber().getBytes("ISO-8859-1"),"GBK") + "%' OR e.booth_Number like '%" + new String(request.getBoothNumber().getBytes("ISO-8859-1"),"utf-8") + "%') ");
        }
        //参展企业
        if (StringUtils.isNotEmpty(request.getBoothCompany())) {
            conditions.add(" (e.exhibitor_Company like '%" + request.getBoothCompany() + "%' OR e.exhibitor_Company like '%" + new String(request.getBoothCompany().getBytes("ISO-8859-1"),"GBK") + "%' OR e.exhibitor_Company like '%" + new String(request.getBoothCompany().getBytes("ISO-8859-1"),"utf-8") + "%') ");
        }//展位搭建
        if (StringUtils.isNotEmpty(request.getBoothSetUpCompany())) {
            conditions.add(" (t.company like '%" + request.getBoothSetUpCompany() + "%' OR t.company like '%" + new String(request.getBoothSetUpCompany().getBytes("ISO-8859-1"),"GBK") + "%' OR t.company like '%" + new String(request.getBoothSetUpCompany().getBytes("ISO-8859-1"),"utf-8") + "%') ");
        }

        conditions.add(" e.userid = t.id ");
        String conditionsSql = StringUtils.join(conditions, " and ");
        String conditionsSqlNoOrder = "";
        String conditionsSqlOrder = "";
        if(StringUtils.isNotEmpty(conditionsSql)){
            conditionsSqlNoOrder = " where " + conditionsSql;
            conditionsSqlOrder = " where " + conditionsSql + " order by e.create_time desc ";
        }

        Page page = new Page();
        page.setPageSize(request.getRows());
        if(request.getPageIndex() != null){
            page.setPageIndex(request.getPageIndex());
        }else{
            page.setPageIndex(request.getPage());
        }

        List<QueryFairBoothInfo> fairBoothInfoList = new ArrayList<QueryFairBoothInfo>();
        fairBoothInfoList = texpoXicecDao.queryPageByHQL("select count(*) from TExpoBuildInfo e, TExpoXicec t " + conditionsSqlNoOrder,
                "select new com.zhenhappy.ems.dto.admin.QueryFairBoothInfo(e.id, e.current_Audit_Status, e.booth_Number, " +
                        "e.exhibitor_Company, t.username, t.company, t.mobilephone ) " +
                        "from TExpoBuildInfo e, TExpoXicec t " + conditionsSqlOrder, new Object[]{}, page);
        QueryFairBoothListResponse response = new QueryFairBoothListResponse();
        response.setResultCode(0);
        response.setRows(fairBoothInfoList);
        response.setTotal(page.getTotalCount());
        return response;
    }

    /**
     * redirect project fair details page.
     *
     * @param request
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "admin/project/fair_details", method = RequestMethod.POST)
    public ExpoFairListResponse showFair_DetailBySelectId(HttpServletRequest request, Locale locale) {
        ExpoFairListResponse expoFairListResponse = new ExpoFairListResponse();
        /*List<TFairInfo> tFairInfoList = loadAllFairList();
        net.sf.json.JSONArray jsonArrayEx = net.sf.json.JSONArray.fromObject(tFairInfoList);
        expoFairListResponse.settFairInfoList(jsonArrayEx.toString());*/
        return expoFairListResponse;
    }

    /**
     * 分页查询展会列表
     * @param request
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "queryFairListInfoByPage")
    public QueryFairListResponse queryFairListInfoByPage(@ModelAttribute QueryFairListRequest request) {
        QueryFairListResponse response = null;
        try {
            List<TFairInfo> tFairInfoList = loadAllFairList();
            response.setResultCode(0);
            response.setRows(tFairInfoList);
            response.setTotal(tFairInfoList.size());
        } catch (Exception e) {
            response.setResultCode(1);
            log.error("query fair list error.", e);
        }
        return response;
    }

    /**
     * 添加展会.
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "admin_new_project", method = RequestMethod.GET)
    public ModelAndView redirectAdminNewProject(HttpServletRequest request, Locale locale) {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("/user/expoxicec/admin/admin_new_project");
        return modelAndView;
    }

    /**
     * create new project
     *
     * @param projectname, organization, beginDate, endDate, boothCreateMethod, sendAuditSMS
     * @return
     */
    @RequestMapping(value = "admin/project/create", method = RequestMethod.POST)
    public ModelAndView createNewProject(@RequestParam("projectname") String projectname,
                                         @RequestParam("organization") String organization,
                                         @RequestParam("beginDate") String beginDate,
                                         @RequestParam("endDate") String endDate,
                                         @RequestParam("boothCreateMethod") Integer boothCreateMethod,
                                         @RequestParam("sendAuditSMS") String sendAuditSMS,
                                         HttpServletRequest httpServletRequest,
                                         HttpServletRequest request,
                                         Locale locale) throws IOException {
        ModelAndView modelAndView = new ModelAndView();
        try{
            TFairInfo tFairInfo = new TFairInfo();
            tFairInfo.setFair_name(projectname);
            tFairInfo.setFair_name_alias(projectname);
            tFairInfo.setFair_organization(organization);
            tFairInfo.setFair_begin_time(beginDate);
            tFairInfo.setFair_end_time(endDate);
            tFairInfo.setFair_booth_hint_input_length(1);
            tFairInfo.setFair_enable(1);
            tFairInfo.setFair_booth_create_method(boothCreateMethod);
            tFairInfo.setFair_send_audit_sms(1);
            tFairInfo.setFair_booth_name_auto_capitalization(0);
            tFairInfo.setFair_use_template_company(0);
            tFairInfo.setFair_sms_show_org_sign(0);
            tFairInfoDao.create(tFairInfo);
            modelAndView.addObject("tFairInfo", tFairInfo);
            httpServletRequest.getSession().setAttribute("tFairId", tFairInfo.getId());
            //httpServletRequest.getSession().setAttribute("tFairInfoId", tFairInfo.getId());
            modelAndView.setViewName("/user/expoxicec/admin/admin_project_set");
            modelAndView.addObject("alert", "添加成功");
            modelAndView.addObject("redirect", "../../admin/project/set");

            //modelAndView.addObject("redirect", "admin/project/set");
        }catch (Exception e){
            log.error("create project info error.", e);
        }
        //在这里进行保存操作
        return modelAndView;
    }

    /**
     * redirect to project details page.
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "admin/project/details", method = RequestMethod.GET)
    public ModelAndView redirectAdminProjectDetails(@ModelAttribute QueryFairDetailRequest fairDetailRequest,
                                                    HttpServletRequest request, Locale locale) {
        ModelAndView modelAndView = new ModelAndView();
        if(StringUtils.isNotEmpty(fairDetailRequest.getFairid())){
            String[] value = fairDetailRequest.getFairid().split("-");
            if(value.length>1){
                TFairInfo tFairInfo = tFairInfoDao.query(Integer.parseInt(value[1]));
                modelAndView.addObject("tFairInfo", tFairInfo);
                if(tFairInfo != null){
                    request.getSession().setAttribute("tFairId", tFairInfo.getId());
                }
            }
        }
        modelAndView.setViewName("/user/expoxicec/admin/admin_project_details");
        return modelAndView;
    }

    /**
     * 获取展会的注册展位总数
     * @param request
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "admin/booth/register/summary", method = RequestMethod.POST)
    public ExpoBoothRegisterSummaryResponse getAdminBoothRegisterSummary(@RequestParam("fairid") Integer fairid,
                                                                         HttpServletRequest request) {
        ExpoBoothRegisterSummaryResponse response = new ExpoBoothRegisterSummaryResponse();
        try {
            List<BoothRegisterInfo> boothRegisterInfoList = getBoothRegisterInfoByExhibitorType(fairid);
            net.sf.json.JSONArray jsonArrayEx = net.sf.json.JSONArray.fromObject(boothRegisterInfoList);
            response.setBoothRegisterSummaryList(jsonArrayEx.toString());
        } catch (Exception e) {
            response.setResultCode(1);
            log.error("query user list error.", e);
        }
        return response;
    }

    /**
     * type：表示展会类型
     *
     * @param tFairId 1：石材展   type=2：佛事展    type=3：茶业展
     * @return
     */
    public static List<BoothRegisterInfo> getBoothRegisterInfoByExhibitorType(Integer tFairId){
        JdbcUtils_C3P0 jdbcUtils_c3P0 = new JdbcUtils_C3P0();
        String url = "";
        if(1 == tFairId){
            url = "jdbc:jtds:sqlserver://10.33.0.224:1433;DatabaseName=xmut";
        }else if(2 == tFairId){
            url = "jdbc:jtds:sqlserver://10.33.0.224:1433;DatabaseName=foshi";
        }else if(3 == tFairId){
            url = "jdbc:jtds:sqlserver://10.33.0.224:1433;DatabaseName=tea";
        }
        return jdbcUtils_c3P0.executeDataBaseToGetBoothRegisterInfoByType("net.sourceforge.jtds.jdbc.Driver", url, "Jhx03SA",
                "gogo03Jhx", "t_exhibitor_booth", tFairId);
    }

    /**
     * 获取展会的审核结果信息
     * @param request
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "admin/booth/audit/summary", method = RequestMethod.POST)
    public ExpoBoothAuditSummaryResponse getAdminBoothAuditSummary(@RequestParam("fairid") Integer fairid,
                                                                   HttpServletRequest request) {
        ExpoBoothAuditSummaryResponse response = new ExpoBoothAuditSummaryResponse();
        try {
            List<BoothAuditInfo> boothAuditInfoList = new ArrayList<BoothAuditInfo>();
            List<TExpoBuildInfo> tExpoBuildInfoList = tExpoBuildInfoervice.loadTExpoXicecListByFairId(fairid);
            Integer currentAuditIsReview = 0;   //待审核
            Integer currentAuditIsSuccess = 0;  //审核通过
            Integer currentAuditIsFail = 0;     //审核失败
            for(TExpoBuildInfo tExpoBuildInfo:tExpoBuildInfoList){
                if(2 == tExpoBuildInfo.getCurrent_Audit_Status()){
                    currentAuditIsReview += 1;
                }else if(3 == tExpoBuildInfo.getCurrent_Audit_Status()){
                    currentAuditIsSuccess += 1;
                }else if(4 == tExpoBuildInfo.getCurrent_Audit_Status()){
                    currentAuditIsFail += 1;
                }
            }
            BoothAuditInfo boothAuditInfo = new BoothAuditInfo();
            boothAuditInfo.setValue(currentAuditIsReview);
            boothAuditInfo.setColor("#d2d6de");
            boothAuditInfo.setHightlight("#d2d6de");
            boothAuditInfo.setLabel("待审核");
            boothAuditInfoList.add(boothAuditInfo);

            boothAuditInfo = new BoothAuditInfo();
            boothAuditInfo.setValue(currentAuditIsFail);
            boothAuditInfo.setColor("#f56954");
            boothAuditInfo.setHightlight("#f56954");
            boothAuditInfo.setLabel("不通过");
            boothAuditInfoList.add(boothAuditInfo);

            boothAuditInfo = new BoothAuditInfo();
            boothAuditInfo.setValue(currentAuditIsSuccess);
            boothAuditInfo.setColor("#00a65a");
            boothAuditInfo.setHightlight("#00a65a");
            boothAuditInfo.setLabel("通过");
            boothAuditInfoList.add(boothAuditInfo);

            net.sf.json.JSONArray jsonArrayEx = net.sf.json.JSONArray.fromObject(boothAuditInfoList);
            response.setBoothAuditSummaryList(jsonArrayEx.toString());
        } catch (Exception e) {
            response.setResultCode(1);
            log.error("query user list error.", e);
        }
        return response;
    }

    /**
     * redirect to project set page.
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "admin/project/set", method = RequestMethod.GET)
    public ModelAndView redirectAdminProjectSet(HttpServletRequest request, Locale locale) {
        ModelAndView modelAndView = new ModelAndView();
        Integer projectId = (Integer)request.getSession().getAttribute("tFairId");
        TFairInfo tFairInfo = tFairInfoDao.query(projectId);
        modelAndView.addObject("tFairInfo", tFairInfo);
        modelAndView.setViewName("/user/expoxicec/admin/admin_project_set");
        return modelAndView;
    }

    /**
     * create new project
     *
     * @param modifyFairInfoRequest(projectname, organization, beginDate, endDate, boothCreateMethod, sendAuditSMS)
     * @return
     */
    @RequestMapping(value = "admin/project/edit", method = RequestMethod.POST)
    public ModelAndView editProject(@ModelAttribute ModifyFairInfoRequest modifyFairInfoRequest,
                                    HttpServletRequest request,
                                    Locale locale) throws IOException {
        ModelAndView modelAndView = new ModelAndView();
        try{
            TFairInfo tFairInfo = tFairInfoDao.query(modifyFairInfoRequest.getProjectId());
            if(tFairInfo != null){
                tFairInfo.setFair_name(modifyFairInfoRequest.getProjectname());
                tFairInfo.setFair_name_alias(modifyFairInfoRequest.getProjectname());
                tFairInfo.setFair_organization(modifyFairInfoRequest.getOrganization());
                tFairInfo.setFair_begin_time(modifyFairInfoRequest.getBeginDate());
                tFairInfo.setFair_end_time(modifyFairInfoRequest.getEndDate());
                tFairInfo.setFair_enable(modifyFairInfoRequest.getStatus());
                tFairInfo.setFair_extend_login_url(modifyFairInfoRequest.getExtendLoginUrl());
                if(modifyFairInfoRequest.getBoothCreateMethod() != null && StringUtils.isNotEmpty(modifyFairInfoRequest.getBoothCreateMethod())){
                    tFairInfo.setFair_booth_create_method(Integer.parseInt(modifyFairInfoRequest.getBoothCreateMethod()));
                }else {
                    tFairInfo.setFair_booth_create_method(0);
                }
                if(modifyFairInfoRequest.getBoothHintMinimumInputLength() != null && StringUtils.isNotEmpty(modifyFairInfoRequest.getBoothHintMinimumInputLength())) {
                    tFairInfo.setFair_booth_hint_input_length(Integer.parseInt(modifyFairInfoRequest.getBoothHintMinimumInputLength()));
                }else {
                    tFairInfo.setFair_booth_hint_input_length(0);
                }
                if(modifyFairInfoRequest.getBoothNameAutoCapitalization() != null && StringUtils.isNotEmpty(modifyFairInfoRequest.getBoothNameAutoCapitalization())) {
                    tFairInfo.setFair_booth_name_auto_capitalization(Integer.parseInt(modifyFairInfoRequest.getBoothNameAutoCapitalization()));
                }else {
                    tFairInfo.setFair_booth_name_auto_capitalization(0);
                }
                if(modifyFairInfoRequest.getUseTemplateCompany() != null && StringUtils.isNotEmpty(modifyFairInfoRequest.getUseTemplateCompany())) {
                    tFairInfo.setFair_use_template_company(Integer.parseInt(modifyFairInfoRequest.getUseTemplateCompany()));
                }else {
                    tFairInfo.setFair_use_template_company(0);
                }
                if(modifyFairInfoRequest.getSendAuditSMS() != null && StringUtils.isNotEmpty(modifyFairInfoRequest.getSendAuditSMS())) {
                    tFairInfo.setFair_send_audit_sms(Integer.parseInt(modifyFairInfoRequest.getSendAuditSMS()));
                }else {
                    tFairInfo.setFair_send_audit_sms(0);
                }
                if(modifyFairInfoRequest.getsMSShowOrgSign() != null && StringUtils.isNotEmpty(modifyFairInfoRequest.getsMSShowOrgSign())) {
                    tFairInfo.setFair_sms_show_org_sign(Integer.parseInt(modifyFairInfoRequest.getsMSShowOrgSign()));
                }else {
                    tFairInfo.setFair_sms_show_org_sign(0);
                }
                tFairInfoDao.update(tFairInfo);
                modelAndView.addObject("tFairInfo", tFairInfo);
                modelAndView.setViewName("/user/expoxicec/admin/admin_project_set");
                modelAndView.addObject("alert", "修改成功");
                modelAndView.addObject("redirect", "../../admin/project/set");
            }else{
                request.getSession().removeAttribute("tExpoXicec");
                request.getSession().removeAttribute("tFairId");
                request.getSession().removeAttribute(Principle.PRINCIPLE_SESSION_ATTRIBUTE);
                modelAndView.addObject("alert", "找不到对应的展会，修改失败");
                modelAndView.addObject("redirect", "/");
                modelAndView.setViewName("/public/login");
            }
        }catch (Exception e){
            log.error("create project info error.", e);
        }
        //在这里进行保存操作
        return modelAndView;
    }

    /**
     * 分页查询用户列表
     * @param request
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "queryUserListByPage", method = RequestMethod.POST)
    public QueryUserListResponse queryUserListByPage(@ModelAttribute QueryUserListRequest request) {
        QueryUserListResponse response = null;
        try {
            response = queryUserListInfoByPage(request);
        } catch (Exception e) {
            response.setResultCode(1);
            log.error("query user list error.", e);
        }
        return response;
    }

    /**
     * 分页获取用户列表
     * @param request
     * @return
     * @throws UnsupportedEncodingException
     */
    @Transactional
    public QueryUserListResponse queryUserListInfoByPage(QueryUserListRequest request) throws UnsupportedEncodingException {
        List<String> conditions = new ArrayList<String>();

        //手机
        if (StringUtils.isNotEmpty(request.getTelphone())) {
            conditions.add(" (mobilephone like '%" + request.getTelphone() + "%' OR mobilephone like '%" + new String(request.getTelphone().getBytes("ISO-8859-1"),"GBK") + "%' OR mobilephone like '%" + new String(request.getTelphone().getBytes("ISO-8859-1"),"utf-8") + "%') ");
        }
        //状态
        if (request.getStatus() != null && -1 != request.getStatus()) {
            conditions.add(" status = " + request.getStatus() + " ");
        }
        //姓名
        if (StringUtils.isNotEmpty(request.getName())) {
            conditions.add(" (username like '%" + request.getName() + "%' OR username like '%" + new String(request.getName().getBytes("ISO-8859-1"),"GBK") + "%' OR username like '%" + new String(request.getName().getBytes("ISO-8859-1"),"utf-8") + "%') ");
        }
        //E
        if (StringUtils.isNotEmpty(request.getEmail())) {
            conditions.add(" (email like '%" + request.getEmail() + "%' OR email like '%" + new String(request.getEmail().getBytes("ISO-8859-1"),"GBK") + "%' OR email like '%" + new String(request.getEmail().getBytes("ISO-8859-1"),"utf-8") + "%') ");
        }//公司
        if (StringUtils.isNotEmpty(request.getCompany())) {
            conditions.add(" (company like '%" + request.getCompany() + "%' OR company like '%" + new String(request.getCompany().getBytes("ISO-8859-1"),"GBK") + "%' OR company like '%" + new String(request.getCompany().getBytes("ISO-8859-1"),"utf-8") + "%') ");
        }
        //VIP
        if (request.getVip() != null && -1 != request.getVip()) {
            conditions.add(" vip = " + request.getVip() + " ");
        }
        //创建时间
        if (StringUtils.isNotEmpty(request.getCreatetime())) {
            conditions.add(" (create_Time like '%" + request.getCreatetime() + "%' OR create_Time like '%" + new String(request.getCreatetime().getBytes("ISO-8859-1"),"GBK") + "%' OR create_Time like '%" + new String(request.getCreatetime().getBytes("ISO-8859-1"),"utf-8") + "%') ");
        }
        //注册方式
        if (request.getRegistertype() != null && -1 != request.getRegistertype()) {
            conditions.add(" register_type = " + request.getRegistertype() + " ");
        }
        //展会类型
        if(request.getFairType() != null){
            conditions.add(" fair_type = " + request.getFairType() + " ");
        }

        String conditionsSql = StringUtils.join(conditions, " and ");
        String conditionsSqlNoOrder = "";
        String conditionsSqlOrder = "";
        if(StringUtils.isNotEmpty(conditionsSql)){
            conditionsSqlNoOrder = " where " + conditionsSql;
            conditionsSqlOrder = " where " + conditionsSql + " order by create_Time desc ";
        }

        Page page = new Page();
        page.setPageSize(request.getRows());
        if(request.getPageIndex() != null){
            page.setPageIndex(request.getPageIndex());
        }else{
            page.setPageIndex(request.getPage());
        }

        List<QueryUserInfo> userInfoList = new ArrayList<QueryUserInfo>();
        userInfoList = texpoXicecDao.queryPageByHQL("select count(*) from TExpoXicec " + conditionsSqlNoOrder,
                "select new com.zhenhappy.ems.dto.admin.QueryUserInfo(id, mobilephone, status, username, email, " +
                        "company, vip, create_Time, register_type) from TExpoXicec " + conditionsSqlOrder, new Object[]{}, page);

        List<UserInfoShowPage> userInfoShowPageList = new ArrayList<UserInfoShowPage>();
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        for(QueryUserInfo userInfo:userInfoList){
            UserInfoShowPage userInfoShow = new UserInfoShowPage();
            userInfoShow.setId(userInfo.getId());
            if(StringUtils.isNotEmpty(userInfo.getCompany())){
                userInfoShow.setCompany(userInfo.getCompany());
            }else{
                userInfoShow.setCompany("");
            }
            if(userInfo.getCreate_Time() != null){
                userInfoShow.setCreate_Time(String.valueOf(userInfo.getCreate_Time()));
            }else{
                userInfoShow.setCreate_Time("");
            }
            if(userInfo.getUpdate_Time() != null){
                userInfoShow.setUpdate_Time(String.valueOf(userInfo.getUpdate_Time()));
            }else{
                userInfoShow.setUpdate_Time("");
            }
            if(StringUtils.isNotEmpty(userInfo.getEmail())){
                userInfoShow.setEmail(userInfo.getEmail());
            }else{
                userInfoShow.setEmail("");
            }
            if(userInfo.getFair_type() != null){
                userInfoShow.setFair_type(String.valueOf(userInfo.getFair_type()));
            }else{
                userInfoShow.setFair_type("");
            }
            if(userInfo.getEmail_num() != null){
                userInfoShow.setEmail_num(String.valueOf(userInfo.getEmail_num()));
            }else{
                userInfoShow.setEmail_num("");
            }
            if(StringUtils.isNotEmpty(userInfo.getMobilephone())){
                userInfoShow.setMobilephone(userInfo.getMobilephone());
            }else{
                userInfoShow.setMobilephone("");
            }
            if(userInfo.getMsg_num() != null){
                userInfoShow.setMsg_num(String.valueOf(userInfo.getMsg_num()));
            }else{
                userInfoShow.setMsg_num("");
            }
            if(StringUtils.isNotEmpty(userInfo.getPassword())){
                userInfoShow.setPassword(userInfo.getPassword());
            }else{
                userInfoShow.setPassword("");
            }
            if(userInfo.getRegister_type() != null){
                userInfoShow.setRegister_type(userInfo.getRegister_type()==1?"手机注册":"网页注册");
            }else{
                userInfoShow.setRegister_type("无类型");
            }
            if(StringUtils.isNotEmpty(userInfo.getUsername())){
                userInfoShow.setUsername(userInfo.getUsername());
            }else{
                userInfoShow.setUsername("");
            }
            if(userInfo.getUser_role() != null){
                userInfoShow.setUser_role(String.valueOf(userInfo.getUser_role()));
            }else{
                userInfoShow.setUser_role("");
            }
            if(userInfo.getStatus() != null){
                //0：未完成注册；1：完成注册；2：激活；3：锁定；4：禁用
                if(0 == userInfo.getStatus()){
                    userInfoShow.setStatus("未完成注册");
                }else if(1 == userInfo.getStatus()){
                    userInfoShow.setStatus("完成注册");
                }else if(2 == userInfo.getStatus()){
                    userInfoShow.setStatus("激活");
                }else if(3 == userInfo.getStatus()){
                    userInfoShow.setStatus("锁定");
                }else if(4 == userInfo.getStatus()){
                    userInfoShow.setStatus("禁用");
                }
            }else{
                userInfoShow.setStatus("无状态");
            }
            if(userInfo.getVip() != null){
                userInfoShow.setVip(String.valueOf(userInfo.getVip()));
            }else{
                userInfoShow.setVip("无VIP");
            }
            userInfoShowPageList.add(userInfoShow);
        }
        QueryUserListResponse response = new QueryUserListResponse();
        response.setResultCode(0);
        response.setRows(userInfoShowPageList);
        response.setTotal(page.getTotalCount());
        return response;
    }

    /**
     * 根据手机号查询对应的用户信息
     * @param request
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "queryUserInfoByTelphone", method = RequestMethod.POST)
    public QueryUserListResponse queryUserInfoByTelphone(@ModelAttribute QueryUserListRequest request) {
        QueryUserListResponse response = null;
        try {
            response = queryUserListInfoByPage(request);
        } catch (Exception e) {
            response.setResultCode(1);
            log.error("query user detail info error.", e);
        }
        return response;
    }

    /**
     * redirect to fair user list page.  //申报用户
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "admin/fair/user/list", method = RequestMethod.GET)
    public ModelAndView redirectAdminFairUserList(HttpServletRequest request, Locale locale) {
        ModelAndView modelAndView = new ModelAndView();
        Integer projectId = (Integer)request.getSession().getAttribute("tFairId");
        TFairInfo tFairInfo = tFairInfoDao.query(projectId);
        modelAndView.addObject("tFairInfo", tFairInfo);
        modelAndView.setViewName("/user/expoxicec/admin/admin_fair_user_list");
        return modelAndView;
    }

    /**
     * redirect to fair user list page.  //展位信息
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "admin/fair/exhibition/list", method = RequestMethod.GET)
    public ModelAndView redirectAdminFairExhibitionList(HttpServletRequest request, Locale locale) {
        ModelAndView modelAndView = new ModelAndView();
        Integer projectId = (Integer)request.getSession().getAttribute("tFairId");
        TFairInfo tFairInfo = tFairInfoDao.query(projectId);
        modelAndView.addObject("tFairInfo", tFairInfo);
        modelAndView.setViewName("/user/expoxicec/admin/admin_fair_user_list");
        return modelAndView;
    }

    /**
     * redirect to exhibition audit list page.
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "admin/exhibition/audit/list/info", method = RequestMethod.GET)
    public ModelAndView redirectAdminExhibitionAuditListInfo(HttpServletRequest request, Locale locale) {
        ModelAndView modelAndView = new ModelAndView();
        Integer projectId = (Integer)request.getSession().getAttribute("tFairId");
        TFairInfo tFairInfo = tFairInfoDao.query(projectId);
        modelAndView.addObject("tFairInfo", tFairInfo);
        modelAndView.setViewName("/user/expoxicec/admin/admin_fair_exhibition_audit_list");
        return modelAndView;
    }

    /**
     * 分页查询展位信息列表
     * @param request
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "queryExhibitionListByPage", method = RequestMethod.POST)
    public QueryUserListResponse queryExhibitionListByPage(@ModelAttribute QueryExhibitionListRequest request) {
        QueryUserListResponse response = null;
        try {
            response = queryExhibitionListInfoByPage(request);
        } catch (Exception e) {
            response.setResultCode(1);
            log.error("query user list error.", e);
        }
        return response;
    }

    /**
     * 分页获取用户列表
     * @param request
     * @return
     * @throws UnsupportedEncodingException
     */
    @Transactional
    public QueryUserListResponse queryExhibitionListInfoByPage(QueryExhibitionListRequest request) throws UnsupportedEncodingException {
        List<String> conditions = new ArrayList<String>();

        //展位号
        if (StringUtils.isNotEmpty(request.getExhibitionNum())) {
            conditions.add(" (b.booth_number like '%" + request.getExhibitionNum() + "%' OR b.booth_number like '%" + new String(request.getExhibitionNum().getBytes("ISO-8859-1"),"GBK") + "%' OR b.booth_number like '%" + new String(request.getExhibitionNum().getBytes("ISO-8859-1"),"utf-8") + "%') ");
        }
        //公司
        if (StringUtils.isNotEmpty(request.getExhibitionCompany())) {
            conditions.add(" (i.company like '%" + request.getExhibitionCompany() + "%' OR i.company like '%" + new String(request.getExhibitionCompany().getBytes("ISO-8859-1"),"GBK") + "%' OR i.company like '%" + new String(request.getExhibitionCompany().getBytes("ISO-8859-1"),"utf-8") + "%') ");
        }
        //展位面积
        if (StringUtils.isNotEmpty(request.getExhibitionArea())) {
            conditions.add(" (t.exhibition_area like '%" + request.getExhibitionArea() + "%' OR t.exhibition_area like '%" + new String(request.getExhibitionArea().getBytes("ISO-8859-1"),"GBK") + "%' OR t.exhibition_area like '%" + new String(request.getExhibitionArea().getBytes("ISO-8859-1"),"utf-8") + "%') ");
        }
        String conditionsSql = StringUtils.join(conditions, " and ");

        Page page = new Page();
        page.setPageSize(request.getRows());
        if(request.getPageIndex() != null){
            page.setPageIndex(request.getPageIndex());
        }else{
            page.setPageIndex(request.getPage());
        }

        QueryUserListResponse response = new QueryUserListResponse();
        tExpoBuildExhibitionBoothInfoShowList = new ArrayList<TExpoBuildInfoShow>();
        tExpoBuildExhibitionBoothInfoShowList.clear();
        tExpoBuildExhibitionBoothInfoShowList = getExhibitorListByFairType(conditionsSql, request.getFairType());
        for(TExpoBuildInfoShow tExpoBuildInfoShow:tExpoBuildExhibitionBoothInfoShowList){
            TExpoBuildInfo tExpoBuildInfo = tExpoBuildInfoervice.loadTExpoXicecListByFairIdAndBoothNum(request.getFairType(), tExpoBuildInfoShow.getBooth_Number());
            if(tExpoBuildInfo != null){
                tExpoBuildInfoShow.setCurrent_Status(tExpoBuildInfo.getCurrent_Audit_Status());
                TExpoXicec tExpoXicec = tExpoXicecService.loadTExpoXicec(tExpoBuildInfo.getUserid());
                if(tExpoXicec != null){
                    tExpoBuildInfoShow.setLogin_telphone(tExpoXicec.getMobilephone());
                }
            }
        }
        int stepGap = (page.getPageIndex()-1)*page.getPageSize();
        int beginIndex = 0 + stepGap;
        int endIndex = 20 + stepGap;
        if(endIndex > tExpoBuildExhibitionBoothInfoShowList.size()){
            endIndex = tExpoBuildExhibitionBoothInfoShowList.size();
        }
        List<TExpoBuildInfoShow> tExpoBuildExhibitionBoothInfoShowListTemp = new ArrayList<TExpoBuildInfoShow>();
        for(int i=beginIndex; i<endIndex; i++){
            TExpoBuildInfoShow tExpoBuildInfoShow = tExpoBuildExhibitionBoothInfoShowList.get(i);
            tExpoBuildExhibitionBoothInfoShowListTemp.add(tExpoBuildInfoShow);
        }
        response.setResultCode(0);
        response.setRows(tExpoBuildExhibitionBoothInfoShowListTemp);
        response.setTotal(tExpoBuildExhibitionBoothInfoShowList.size());
        return response;
    }

    /**
     * type：表示展会类型
     *
     * @param tFairId 1：石材展   type=2：佛事展    type=3：茶业展
     * @return
     */
    public static List<TExpoBuildInfoShow> getExhibitorListByFairType(String param, Integer tFairId){
        JdbcUtils_C3P0 jdbcUtils_c3P0 = new JdbcUtils_C3P0();
        String url = "";
        if(1 == tFairId){
            url = "jdbc:jtds:sqlserver://10.33.0.224:1433;DatabaseName=xmut";
        }else if(2 == tFairId){
            url = "jdbc:jtds:sqlserver://10.33.0.224:1433;DatabaseName=foshi";
        }else if(3 == tFairId){
            url = "jdbc:jtds:sqlserver://10.33.0.224:1433;DatabaseName=tea";
        }
        return jdbcUtils_c3P0.executeDataBaseByFairType("net.sourceforge.jtds.jdbc.Driver", url, "Jhx03SA", "gogo03Jhx", param, tFairId);
    }

    /**
     * delete expoBuildInfoId
     *
     * @paramboothId
     * @return
     */
    @RequestMapping(value = "admin/exhibition/booth/delete", method = RequestMethod.POST)
    public ModelAndView deleteExhibitionBoothByAdmin(DeleteExhibitionNumberInfoRequest deleteExhibitionNumberInfoRequest, HttpServletRequest request) throws IOException {
        ModelAndView modelAndView = new ModelAndView();
        try{
            TExpoBuildInfo tExpoBuildInfo = tExpoBuildInfoervice.loadTExpoBuildInfo(deleteExhibitionNumberInfoRequest.getExpoBuildInfoId());
            if(tExpoBuildInfo != null){
                tExpoBuildInfoervice.deleteTExpoBuildInfo(tExpoBuildInfo);
                Integer projectId = (Integer)request.getSession().getAttribute("tFairId");
                TFairInfo tFairInfo = tFairInfoDao.query(projectId);
                modelAndView.addObject("tFairInfo", tFairInfo);
                modelAndView.addObject("alert", "操作成功");
                modelAndView.addObject("redirect", "../../../admin/exhibition/list");
                modelAndView.setViewName("/user/expoxicec/admin/admin_fair_exhibition_list");
            }else{
                request.getSession().removeAttribute("tExpoXicec");
                request.getSession().removeAttribute("tFairId");
                request.getSession().removeAttribute(Principle.PRINCIPLE_SESSION_ATTRIBUTE);
                modelAndView.addObject("alert", "找不到对应的展会，操作失败");
                modelAndView.addObject("redirect", "/");
                modelAndView.setViewName("/public/login");
            }
        }catch (Exception e){
            log.error("create project info error.", e);
        }
        //在这里进行保存操作
        return modelAndView;
    }

    /**
     * redirect to exhibition booth list page.
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "admin/exhibition/list", method = RequestMethod.GET)
    public ModelAndView redirectAdminExhibitionList(HttpServletRequest request, Locale locale) {
        ModelAndView modelAndView = new ModelAndView();
        Integer projectId = (Integer)request.getSession().getAttribute("tFairId");
        TFairInfo tFairInfo = tFairInfoDao.query(projectId);
        modelAndView.addObject("tFairInfo", tFairInfo);
        modelAndView.setViewName("/user/expoxicec/admin/admin_fair_exhibition_list");
        return modelAndView;
    }

    /**
     * redirect to exhibition booth audit list page.
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "admin/exhibition/audit/list", method = RequestMethod.GET)
    public ModelAndView redirectAdminExhibitionAuditList(HttpServletRequest request, Locale locale) {
        ModelAndView modelAndView = new ModelAndView();
        Integer projectId = (Integer)request.getSession().getAttribute("tFairId");
        TFairInfo tFairInfo = tFairInfoDao.query(projectId);
        modelAndView.addObject("tFairInfo", tFairInfo);
        modelAndView.setViewName("/user/expoxicec/admin/admin_fair_exhibition_list");
        return modelAndView;
    }

    /**
     * 分页查询资料审核列表
     * @param request
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "queryExhibitionAuditListByPage", method = RequestMethod.POST)
    public QueryExhibitionAuditListResponse queryExhibitionAuditListByPage(@ModelAttribute QueryExhibitionAuditListRequest request) {
        QueryExhibitionAuditListResponse response = null;
        try {
            response = queryExhibitionAuditListInfoByPage(request);
        } catch (Exception e) {
            response.setResultCode(1);
            log.error("query user list error.", e);
        }
        return response;
    }

    /**
     * 分页获取用户列表
     * @param request
     * @return
     * @throws UnsupportedEncodingException
     */
    @Transactional
    public QueryExhibitionAuditListResponse queryExhibitionAuditListInfoByPage(QueryExhibitionAuditListRequest request) throws UnsupportedEncodingException {
        List<String> conditions = new ArrayList<String>();
        //状态
        if (request.getBoothAuditStatus() != null && -1 != request.getBoothAuditStatus()) {
            conditions.add(" b.current_Audit_Status = " + request.getBoothAuditStatus() + " ");
        }
        //展位号
        if (StringUtils.isNotEmpty(request.getExhibitionNum())) {
            conditions.add(" (b.booth_Number like '%" + request.getExhibitionNum() + "%' OR b.booth_Number like '%" + new String(request.getExhibitionNum().getBytes("ISO-8859-1"),"GBK") + "%' OR b.booth_Number like '%" + new String(request.getExhibitionNum().getBytes("ISO-8859-1"),"utf-8") + "%') ");
        }
        //区域
        if (StringUtils.isNotEmpty(request.getExhibitionRegion())) {
            conditions.add(" (b.exhibition_area like '%" + request.getExhibitionRegion() + "%' OR b.exhibition_area like '%" + new String(request.getExhibitionRegion().getBytes("ISO-8859-1"),"GBK") + "%' OR b.exhibition_area like '%" + new String(request.getExhibitionRegion().getBytes("ISO-8859-1"),"utf-8") + "%') ");
        }
        //参展企业
        if (StringUtils.isNotEmpty(request.getExhibitionCompany())) {
            conditions.add(" (b.exhibitor_Company like '%" + request.getExhibitionCompany() + "%' OR b.exhibitor_Company like '%" + new String(request.getExhibitionCompany().getBytes("ISO-8859-1"),"GBK") + "%' OR b.exhibitor_Company like '%" + new String(request.getExhibitionCompany().getBytes("ISO-8859-1"),"utf-8") + "%') ");
        }
        //展位搭建
        if (StringUtils.isNotEmpty(request.getExhibitionBuild())) {
            conditions.add(" (e.company like '%" + request.getExhibitionBuild() + "%' OR e.company like '%" + new String(request.getExhibitionBuild().getBytes("ISO-8859-1"),"GBK") + "%' OR e.company like '%" + new String(request.getExhibitionBuild().getBytes("ISO-8859-1"),"utf-8") + "%') ");
        }
        conditions.add(" (b.userid=e.id) ");
        conditions.add(" b.fairid = " + request.getFairType() + " ");

        String conditionsSql = StringUtils.join(conditions, " and ");
        String conditionsSqlNoOrder = "";
        String conditionsSqlOrder = "";
        if(StringUtils.isNotEmpty(conditionsSql)){
            conditionsSqlNoOrder = " where " + conditionsSql;
            conditionsSqlOrder = " where " + conditionsSql + " order by b.update_time desc ";
        }

        Page page = new Page();
        page.setPageSize(request.getRows());
        if(request.getPageIndex() != null){
            page.setPageIndex(request.getPageIndex());
        }else{
            page.setPageIndex(request.getPage());
        }

        List<QueryUserInfo> exhibitionAuditInfoList = new ArrayList<QueryUserInfo>();
        exhibitionAuditInfoList = texpoXicecDao.queryPageByHQL("select count(*) from TExpoBuildInfo b, TExpoXicec e " + conditionsSqlNoOrder,
                "select new com.zhenhappy.ems.dto.admin.QueryExhibitionAuditInfo(b.id, b.current_Audit_Status, b.booth_Number," +
                        " b.exhibition_area, b.exhibitor_Company, e.company, e.mobilephone) from TExpoBuildInfo b, TExpoXicec e"
                        + conditionsSqlOrder, new Object[]{}, page);

        QueryExhibitionAuditListResponse response = new QueryExhibitionAuditListResponse();
        response.setResultCode(0);
        response.setRows(exhibitionAuditInfoList);
        response.setTotal(page.getTotalCount());
        return response;
    }

    /**
     * 导出资料审核信息列表到Excel
     * @return
     */
    @RequestMapping(value = "exportExhibitionAuditListToZip", method = RequestMethod.POST)
    public ModelAndView exportExhibitionAuditListToZip(@RequestParam(value = "fairid") Integer fairid) {
        Map model = new HashMap();
        List<TExpoBuildInfo> tExpoBuildInfoList = tExpoBuildInfoervice.loadAllExhibitionAuditList(fairid);

        List<ExportExhibitionAuditInfo> queryExhibitorInfos = exportExhibitionAuditList(tExpoBuildInfoList);
        model.put("list", queryExhibitorInfos);
        String[] titles = new String[] { "审核状态", "展位号", "展位类型", "参展单位", "面积", "区域", "展位联系方式", "用户姓名", "用户单位", "用户联系方式" };
        model.put("titles", titles);
        String[] columns = new String[] { "auditStatus", "exhibitionNum", "exhibitionType", "exhibitionCompany", "exhibitionArea", "exhibitionRegion", "exhibitionContact", "buildName", "exhibitionBuild", "buildTelphone" };
        model.put("columns", columns);
        Integer[] columnWidths = new Integer[]{15,10,10,40,10,10,15,20,40,20};
        model.put("columnWidths", columnWidths);
        model.put("fileName", "资料审核数据.xls");
        model.put("sheetName", "资料审核数据");
        return new ModelAndView(new JXLExcelView(), model);
    }

    /**
     * 导出资料审核数据
     * @param tExpoBuildInfoList
     * @return
     */
    public List<ExportExhibitionAuditInfo> exportExhibitionAuditList(List<TExpoBuildInfo> tExpoBuildInfoList) {
        List<ExportExhibitionAuditInfo> queryExhibitorInfoList = new ArrayList<ExportExhibitionAuditInfo>();
        if(tExpoBuildInfoList != null){
            for(TExpoBuildInfo tExpoBuildInfo:tExpoBuildInfoList){
                TExpoXicec tExpoXicec = tExpoXicecService.loadTExpoXicec(tExpoBuildInfo.getUserid());
                TExhibitionType tExhibitionType = exhibitionTypeService.getExhibitionTypeByDocumentTypeId(tExpoBuildInfo.getExhibitor_Type());
                if(tExpoXicec != null){
                    ExportExhibitionAuditInfo exportExhibitionAuditInfo = new ExportExhibitionAuditInfo();
                    if(2 == tExpoBuildInfo.getCurrent_Audit_Status()){
                        exportExhibitionAuditInfo.setAuditStatus("提交审核");
                    }else if(3 == tExpoBuildInfo.getCurrent_Audit_Status()){
                        exportExhibitionAuditInfo.setAuditStatus("审核通过");
                    }else if(4 == tExpoBuildInfo.getCurrent_Audit_Status()){
                        exportExhibitionAuditInfo.setAuditStatus("审核不通过");
                    }else{
                        exportExhibitionAuditInfo.setAuditStatus("上传资料");
                    }
                    exportExhibitionAuditInfo.setExhibitionNum(tExpoBuildInfo.getBooth_Number());
                    if(tExhibitionType != null){
                        exportExhibitionAuditInfo.setExhibitionType(tExhibitionType.getExhibition_type_name());
                    }
                    exportExhibitionAuditInfo.setExhibitionCompany(tExpoBuildInfo.getExhibitor_Company());
                    exportExhibitionAuditInfo.setExhibitionArea(tExpoBuildInfo.getBooth_area());
                    exportExhibitionAuditInfo.setExhibitionRegion(tExpoBuildInfo.getExhibition_area());
                    exportExhibitionAuditInfo.setExhibitionContact(tExpoXicec.getMobilephone());
                    exportExhibitionAuditInfo.setBuildName(tExpoXicec.getUsername());
                    exportExhibitionAuditInfo.setExhibitionBuild(tExpoXicec.getCompany());
                    exportExhibitionAuditInfo.setBuildTelphone(tExpoXicec.getMobilephone());
                    queryExhibitorInfoList.add(exportExhibitionAuditInfo);
                }else{
                    ExportExhibitionAuditInfo exportExhibitionAuditInfo = new ExportExhibitionAuditInfo();
                    exportExhibitionAuditInfo.setExhibitionNum(tExpoBuildInfo.getBooth_Number());
                    if(tExhibitionType != null){
                        exportExhibitionAuditInfo.setExhibitionType(tExhibitionType.getExhibition_type_name());
                    }
                    exportExhibitionAuditInfo.setExhibitionCompany(tExpoBuildInfo.getExhibitor_Company());
                    exportExhibitionAuditInfo.setExhibitionArea(tExpoBuildInfo.getBooth_area());
                    exportExhibitionAuditInfo.setExhibitionRegion(tExpoBuildInfo.getExhibition_area());
                    queryExhibitorInfoList.add(exportExhibitionAuditInfo);
                }
            }
        }
        return queryExhibitorInfoList;
    }

    /**
     * redirect to exhibition set page.
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "admin/exhibition/set", method = RequestMethod.GET)
    public ModelAndView redirectAdminExhibitionSet(HttpServletRequest request, Locale locale) {
        ModelAndView modelAndView = new ModelAndView();
        Integer projectId = (Integer)request.getSession().getAttribute("tFairId");
        TFairInfo tFairInfo = tFairInfoDao.query(projectId);
        modelAndView.addObject("tFairInfo", tFairInfo);
        modelAndView.setViewName("/user/expoxicec/admin/admin_exhibition_set");
        return modelAndView;
    }

    /**
     * 显示展会下对应的所有展位类型数据
     *
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "load/admin/exhibition/type/list", method = RequestMethod.POST)
    public ExhibitionTypeListResponse loadExhibitionTypeList(HttpServletRequest request) {
        ExhibitionTypeListResponse exhibitionTypeListResponse = new ExhibitionTypeListResponse();
        List<TExhibitionType> tExhibitionTypeList = exhibitionTypeService.loadAllExhibitionType();
        net.sf.json.JSONArray jsonArrayEx = net.sf.json.JSONArray.fromObject(tExhibitionTypeList);
        exhibitionTypeListResponse.settExhibitionTypeList(jsonArrayEx.toString());
        return exhibitionTypeListResponse;
    }

    @ResponseBody
    @RequestMapping(value = "queryExhibitionType", method = RequestMethod.POST)
    public List<TExhibitionType> queryAllExhibitorType(HttpServletRequest request) {
        List<TExhibitionType> tExhibitionTypeList = new ArrayList<TExhibitionType>();
        try {
            tExhibitionTypeList = exhibitionTypeService.loadAllExhibitionType();
        } catch (Exception e) {
            log.error("query exhibition type error.", e);
        }
        return tExhibitionTypeList;
    }

    /**
     * load all document type data.
     *
     * @param documentTypeId
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "admin/document/type/data/list", method = RequestMethod.POST)
    public DocumentTypeDataListResponse getAllPorjectList(@RequestParam("documentTypeId") Integer documentTypeId,HttpServletRequest request, Locale locale) {
        DocumentTypeDataListResponse documentTypeDataListResponse = new DocumentTypeDataListResponse();
        Integer fairId = (Integer)request.getSession().getAttribute("tFairId");
        List<TDocumentInfo> tDocumentInfoList = documentInfoService.loadAllDocumentTypeByDocumentTypeId(fairId, documentTypeId);
        if(tDocumentInfoList != null && tDocumentInfoList.size()>0){
            net.sf.json.JSONArray jsonArrayEx = net.sf.json.JSONArray.fromObject(tDocumentInfoList);
            documentTypeDataListResponse.setDocumentTypeInfoList(jsonArrayEx.toString());
            documentTypeDataListResponse.setResultCode(0);
        }else {
            documentTypeDataListResponse.setResultCode(1);
        }
        return documentTypeDataListResponse;
    }

    /**
     * edit document type data.
     *
     * @param editDocumentTypeInfoRequest
     * @return
     */
    @RequestMapping(value = "admin/document/type/edit", method = RequestMethod.GET)
    public ModelAndView editDocumentTypeByDocumentId(EditDocumentTypeInfoRequest editDocumentTypeInfoRequest,
                                                     HttpServletRequest request) {
        ModelAndView modelAndView = new ModelAndView();
        Integer projectId = (Integer)request.getSession().getAttribute("tFairId");
        TFairInfo tFairInfo = tFairInfoDao.query(projectId);
        modelAndView.addObject("tFairInfo", tFairInfo);

        String[] value = editDocumentTypeInfoRequest.getDocumentid().split("-");
        if(value.length>1){
            TDocumentInfo tDocumentInfo = documentInfoService.getExhibitionTypeByDocumentId(Integer.parseInt(value[1]));
            if(tDocumentInfo != null){
                TExhibitionType tExhibitionType = exhibitionTypeService.getExhibitionTypeByDocumentTypeId(tDocumentInfo.getDocument_Type_Id());
                modelAndView.addObject("tExhibitionType", tExhibitionType);
                modelAndView.addObject("tDocumentInfo", tDocumentInfo);
                modelAndView.setViewName("/user/expoxicec/admin/admin_document_type_info_edit");
            }else{
                modelAndView.addObject("alert", "找不到对应的文档资料，请确认数据源是否存在");
                modelAndView.addObject("redirect", "../../../admin/exhibition/set");
                modelAndView.setViewName("/user/expoxicec/admin/admin_exhibition_set");
            }
        }else{
            modelAndView.addObject("alert", "找不到对应的文档资料，请确认数据源是否存在");
            modelAndView.addObject("redirect", "../../../admin/exhibition/set");
            modelAndView.setViewName("/user/expoxicec/admin/admin_exhibition_set");
        }
        return modelAndView;
    }

    /**
     * save document type info
     *
     * @param editDocumentTypeInfoRequest
     * @return
     */
    @RequestMapping(value = "admin/document/type/save", method = RequestMethod.POST)
    public ModelAndView saveDocumentTypeInfoByAdmin(EditDocumentTypeInfoRequest editDocumentTypeInfoRequest,
                                                    HttpServletRequest request, Locale locale) throws IOException {
        ModelAndView modelAndView = new ModelAndView();
        try{
            TDocumentInfo tDocumentInfo = documentInfoService.getExhibitionTypeByDocumentId(editDocumentTypeInfoRequest.getDocumentInfoTypeId());
            if(tDocumentInfo != null){
                tDocumentInfo.setDocument_Require(editDocumentTypeInfoRequest.isDocumentRequeired()?1:0);
                tDocumentInfo.setDocument_Template(editDocumentTypeInfoRequest.getDocumentTemplate());
                tDocumentInfo.setDocument_Sort(editDocumentTypeInfoRequest.getDocumentSort());
                tDocumentInfo.setDocument_Name(editDocumentTypeInfoRequest.getDocumentName());
                tDocumentInfo.setDocument_Type(editDocumentTypeInfoRequest.getDocumentType());
                tDocumentInfo.setDocument_Size(editDocumentTypeInfoRequest.getDocumentSize());
                tDocumentInfo.setDocument_Remark(editDocumentTypeInfoRequest.getDocumentRemark());
                tDocumentInfo.setDocument_Fair(editDocumentTypeInfoRequest.getDocumentFairId());
                tDocumentInfo.setDocument_Type_Id(editDocumentTypeInfoRequest.getDocumentTypeId());
                tDocumentInfo.setUpdate_time(new Date());
                documentInfoService.updateTDocumentInfo(tDocumentInfo);

                Integer fairId = (Integer)request.getSession().getAttribute("tFairId");
                TFairInfo tFairInfo = tFairInfoDao.query(fairId);
                modelAndView.addObject("tFairInfo", tFairInfo);
                modelAndView.addObject("alert", "操作成功");
                modelAndView.addObject("redirect", "../../../admin/exhibition/set");
                modelAndView.setViewName("/user/expoxicec/admin/admin_exhibition_set");
            }else{
                modelAndView.addObject("alert", "数据源发生变化,找不到对应的文档资料");
                modelAndView.addObject("redirect", "../../../admin/exhibition/set");
                modelAndView.setViewName("/user/expoxicec/admin/admin_exhibition_set");
            }
        }catch (Exception e){
            log.error("edit document info error.", e);
        }
        return modelAndView;
    }

    /*@RequestMapping(value = "admin/document/type/upload/template", method = RequestMethod.POST)
    public ModelAndView uploadDocumentInfoTemplateByAdmin(@RequestParam("fileTemplate") MultipartFile fileTemplate,
                                                          @RequestParam("documentInfoId") Integer documentInfoId,
                                                          @RequestParam("exhibitionTypeId") Integer exhibitionTypeId,
                                                          @RequestParam("fairId") Integer fairId,
                                                          HttpServletRequest request) {
        ModelAndView modelAndView = new ModelAndView();
        if(fairId != null){
            TFairInfo tFairInfo = tFairInfoDao.query(fairId);
            modelAndView.addObject("tFairInfo", tFairInfo);
        }else{
            fairId = (Integer)request.getSession().getAttribute("tFairId");
            TFairInfo tFairInfo = tFairInfoDao.query(fairId);
            modelAndView.addObject("tFairInfo", tFairInfo);
        }

        TExhibitionType tExhibitionType = exhibitionTypeService.getExhibitionTypeByDocumentTypeId(exhibitionTypeId);
        modelAndView.addObject("tExhibitionType", tExhibitionType);
        if(documentInfoId != null){
            TDocumentInfo tDocumentInfo = documentInfoService.getExhibitionTypeByDocumentId(documentInfoId);
            modelAndView.addObject("tDocumentInfo", tDocumentInfo);
            if(tDocumentInfo != null){
                if (fileTemplate != null && fileTemplate.getSize() != 0) {
                    if(StringUtils.isNotEmpty(tDocumentInfo.getDocument_Template())){
                        File oldTemplateFile = new File(tDocumentInfo.getDocument_Template());
                        FileUtils.deleteQuietly(oldTemplateFile);
                    }
                    String fileName = systemConfig.getVal(Constants.appendix_directory) + "\\\\" + new Date().getTime() + "." + FilenameUtils.getExtension(fileTemplate.getOriginalFilename());
                    try {
                        FileUtils.copyInputStreamToFile(fileTemplate.getInputStream(), new File(fileName));
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    tDocumentInfo.setDocument_Template(fileName);
                    documentInfoService.updateTDocumentInfo(tDocumentInfo);
                    //modelAndView.addObject("alert", "操作成功");
                    modelAndView.addObject("redirect", "../../../../admin/document/type/edit");
                    modelAndView.setViewName("/user/expoxicec/admin/admin_document_type_info_edit");
                }else{
                    modelAndView.addObject("alert", "上传文件为空文件，请重新上传");
                    modelAndView.addObject("redirect", "../../../../admin/document/type/edit");
                    modelAndView.setViewName("/user/expoxicec/admin/admin_document_type_info_edit");
                }
            }else{
                modelAndView.addObject("alert", "数据源发生变化,找不到对应的文档资料");
                modelAndView.addObject("redirect", "../../../../admin/exhibition/set");
                modelAndView.setViewName("/user/expoxicec/admin/admin_exhibition_set");
            }
        }else{
            TDocumentInfo tDocumentInfo = new TDocumentInfo();
            if (fileTemplate != null && fileTemplate.getSize() != 0) {
                String fileName = systemConfig.getVal(Constants.appendix_directory) + "\\\\" + new Date().getTime() + "." + FilenameUtils.getExtension(fileTemplate.getOriginalFilename());
                try {
                    FileUtils.copyInputStreamToFile(fileTemplate.getInputStream(), new File(fileName));
                } catch (IOException e) {
                    e.printStackTrace();
                }
                tDocumentInfo.setDocument_Type_Id(exhibitionTypeId);
                tDocumentInfo.setDocument_Fair(fairId);
                tDocumentInfo.setDocument_Template(fileName);
                documentInfoService.createTDocumentInfo(tDocumentInfo);
                modelAndView.addObject("tDocumentInfo", tDocumentInfo);
                modelAndView.addObject("redirect", "../../../../admin/document/type/create");
                modelAndView.setViewName("/user/expoxicec/admin/admin_document_type_info_create");
            }else{
                modelAndView.addObject("alert", "上传文件为空文件，请重新上传");
                modelAndView.addObject("redirect", "../../../../admin/document/type/create");
                modelAndView.setViewName("/user/expoxicec/admin/admin_document_type_info_create");
            }
        }
        return modelAndView;
    }*/

    @ResponseBody
    @RequestMapping(value = "admin/document/type/upload/template", method={RequestMethod.POST,RequestMethod.GET})
    public String uploadDocumentInfoTemplateByAdmin(@RequestParam("fileTemplate") MultipartFile fileTemplate) {
        //UploadDocumentTypeResponse response = new UploadDocumentTypeResponse();
        if (fileTemplate != null && fileTemplate.getSize() != 0) {
            String appendix_directory = systemConfig.getVal(Constants.appendix_directory).replaceAll("\\\\\\\\", "\\\\");
            String fileName = appendix_directory + "\\" + new Date().getTime() + "." + FilenameUtils.getExtension(fileTemplate.getOriginalFilename());
            try {
                FileUtils.copyInputStreamToFile(fileTemplate.getInputStream(), new File(fileName));
                return fileName;
            } catch (Exception e) {
                log.error("upload document type attchment error.", e);
                return "";
            }
        }
        return "";
    }

    /**
     * 显示文档类型的附件
     * @param response
     * @param filepath
     */
    @RequestMapping(value = "admin/document/type/show/attachment", method = RequestMethod.GET)
    public void showDocumentInfoAttachment(HttpServletResponse response, @RequestParam("filepath") String filepath) {
        try {
            if (StringUtils.isNotEmpty(filepath)) {
                OutputStream outputStream = response.getOutputStream();
                if(filepath.toLowerCase().contains(".pdf")){
					/*response.reset();// 清空输出流
					response.setContentType("application/pdf");
					response.setHeader( "Content-disposition", "attachment;filename=" + logoFileName);*/
                    response.setContentType("application/pdf");
                }
                //response.setContentType("application/pdf");
                File logo = new File(filepath);
                if (!logo.exists())
                    return;
                FileUtils.copyFile(logo, outputStream);
                outputStream.close();
                outputStream.flush();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * delete document type data.
     *
     * @param documentid
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "admin/document/type/delete", method = RequestMethod.POST)
    public BaseResponse deleteDocumentTypeByDocumentId(HttpServletRequest request, @RequestParam("documentid") Integer documentid) {
        BaseResponse response = new BaseResponse();
        TDocumentInfo tDocumentInfo = documentInfoService.getExhibitionTypeByDocumentId(documentid);
        if(tDocumentInfo != null){
            documentInfoService.deleteDocumentType(tDocumentInfo);
            response.setResultCode(0);
        }
        return response;
    }

    /**
     * redirect to add document type page.
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "admin/exhibition/type/create", method = RequestMethod.GET)
    public ModelAndView redirectAdminAddDocumentType(HttpServletRequest request, @RequestParam("exhibitionid") Integer exhibitionid) {
        ModelAndView modelAndView = new ModelAndView();
        Integer projectId = (Integer)request.getSession().getAttribute("tFairId");
        TFairInfo tFairInfo = tFairInfoDao.query(projectId);
        modelAndView.addObject("tFairInfo", tFairInfo);
        TExhibitionType tExhibitionType = exhibitionTypeService.getExhibitionTypeByDocumentTypeId(exhibitionid);
        modelAndView.addObject("tExhibitionType", tExhibitionType);
        modelAndView.setViewName("/user/expoxicec/admin/admin_document_type_info_create");
        return modelAndView;
    }

    /**
     * create document type data.
     *
     * @param createDocumentTypeInfoRequest
     * @return
     */
    @RequestMapping(value = "admin/document/type/create", method = RequestMethod.POST)
    public ModelAndView createDocumentTypeByDocumentId(CreateDocumentTypeInfoRequest createDocumentTypeInfoRequest,
                                                       HttpServletRequest request) {
        ModelAndView modelAndView = new ModelAndView();
        TDocumentInfo tDocumentInfo = new TDocumentInfo();
        tDocumentInfo.setDocument_Require(createDocumentTypeInfoRequest.isDocumentRequeired()?1:0);
        tDocumentInfo.setDocument_Template(createDocumentTypeInfoRequest.getDocumentTemplate());
        tDocumentInfo.setDocument_Sort(createDocumentTypeInfoRequest.getDocumentSort());
        tDocumentInfo.setDocument_Name(createDocumentTypeInfoRequest.getDocumentName());
        tDocumentInfo.setDocument_Type(createDocumentTypeInfoRequest.getDocumentType());
        tDocumentInfo.setDocument_Size(createDocumentTypeInfoRequest.getDocumentSize());
        tDocumentInfo.setDocument_Remark(createDocumentTypeInfoRequest.getDocumentRemark());
        tDocumentInfo.setDocument_Fair(createDocumentTypeInfoRequest.getDocumentFairId());
        tDocumentInfo.setCreate_time(new Date());
        tDocumentInfo.setUpdate_time(new Date());
        tDocumentInfo.setDocument_Type_Id(createDocumentTypeInfoRequest.getDocumentTypeId());
        documentInfoService.createTDocumentInfo(tDocumentInfo);

        modelAndView.addObject("alert", "操作成功");

        Integer fairId = (Integer)request.getSession().getAttribute("tFairId");
        TFairInfo tFairInfo = tFairInfoDao.query(fairId);
        modelAndView.addObject("tFairInfo", tFairInfo);
        modelAndView.addObject("redirect", "../../../admin/exhibition/set");
        modelAndView.setViewName("/user/expoxicec/admin/admin_exhibition_set");

        return modelAndView;
    }

    /**
     * delete document type data.
     *
     * @param exhibitionid
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "admin/exhibition/type/delete", method = RequestMethod.POST)
    public BaseResponse deleteExhibitionTypeByExhibitionTypeId(HttpServletRequest request, @RequestParam("exhibitionid") Integer exhibitionid) {
        BaseResponse response = new BaseResponse();
        TExhibitionType tExhibitionType = exhibitionTypeService.getExhibitionTypeByDocumentTypeId(exhibitionid);
        if(tExhibitionType != null){
            exhibitionTypeService.deleteExhibitionType(tExhibitionType);
            response.setResultCode(0);
        }
        return response;
    }

    /**
     * redirect to add exhibition type page.
     *
     * @param request
     * @return
     */
    @RequestMapping(value = "admin/exhibition/type/create/page", method = RequestMethod.GET)
    public ModelAndView redirectAdminAddExhibitionTypePage(HttpServletRequest request) {
        ModelAndView modelAndView = new ModelAndView();
        Integer projectId = (Integer)request.getSession().getAttribute("tFairId");
        TFairInfo tFairInfo = tFairInfoDao.query(projectId);
        modelAndView.addObject("tFairInfo", tFairInfo);
        modelAndView.setViewName("/user/expoxicec/admin/admin_exhibition_type_info_create");
        return modelAndView;
    }

    /**
     * create document type data.
     *
     * @param createExhibitionTypeInfoRequest
     * @return
     */
    @RequestMapping(value = "admin/exhibition/type/create", method = RequestMethod.POST)
    public ModelAndView createExhibitionType(CreateExhibitionTypeInfoRequest createExhibitionTypeInfoRequest, HttpServletRequest request) {
        ModelAndView modelAndView = new ModelAndView();
        TExhibitionType tExhibitionType = new TExhibitionType();
        tExhibitionType.setExhibition_type_name(createExhibitionTypeInfoRequest.getExhibitionName());
        tExhibitionType.setExhibition_sort(createExhibitionTypeInfoRequest.getExhibitionSort());
        tExhibitionType.setCreate_time(new Date());
        exhibitionTypeService.createTExhibitionTypeInfo(tExhibitionType);

        modelAndView.addObject("alert", "操作成功");
        Integer fairId = (Integer)request.getSession().getAttribute("tFairId");
        TFairInfo tFairInfo = tFairInfoDao.query(fairId);
        modelAndView.addObject("tFairInfo", tFairInfo);
        modelAndView.addObject("redirect", "../../../admin/exhibition/set");
        modelAndView.setViewName("/user/expoxicec/admin/admin_exhibition_set");

        return modelAndView;
    }

    public static void main(String[] args) {
        File file = new File("C:\\Program Files\\Apache Software Foundation\\appendix\\expoXicec\\2017-3-6\\stonefair\\大地\\C5038\\exhibition_liability_insurance\\佛事展.png");
        //将原文件更改为f:\a\b.xlsx，其中路径是必要的。注意
        try{
        if(file.renameTo(new File("C:\\Program Files\\Apache Software Foundation\\appendix\\expoXicec\\2017-3-6\\stonefair\\大地\\C5038\\exhibition_liability_insurance\\C5038_2017-02-27 09:38:54_佛事展.png"))) {
            System.out.println("修改成功");
        }else{
            System.out.println("修改失败");
        }}catch (Exception e){
            System.out.println(e);
        }

        /*//压缩文件
        String strImg = GetImageStr();
        System.out.println(strImg);
        GenerateImage(strImg);*/

        //getExhibitorInfoByExhibitorType(1);
        //getExhibitorInfoByExhibitorType(2);
        //getExhibitorInfoByExhibitorType(3);

        /*String path = "C:\\Program Files\\Apache Software Foundation\\appendix\\expoXicec\\2017-3-6\\stonefair\\大地\\A6331\\exhibition_liability_insurance";
        String [] fileName = getFileName(path);
        for(String name:fileName)
        {
            //getCreateTime(name, path + "\\" + name);
            String fileModifyDate = getModifiedTime(name, path + "\\" + name);
        }*/
        /*System.out.println("--------------------------------");
        ArrayList<String> listFileName = new ArrayList<String>();
        getAllFileName(path,listFileName);
        for(String name:listFileName)
        {
            System.out.println(name);
        }*/
    }
}
