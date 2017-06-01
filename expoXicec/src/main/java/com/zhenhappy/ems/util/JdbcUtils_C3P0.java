package com.zhenhappy.ems.util;

import com.mchange.v2.c3p0.ComboPooledDataSource;
import com.zhenhappy.ems.dto.admin.BoothAuditInfo;
import com.zhenhappy.ems.dto.admin.BoothRegisterInfo;
import com.zhenhappy.ems.entity.TExpoBuildInfoShow;
import com.zhenhappy.ems.entity.TExpoXicecExhibitorInfo;
import org.apache.commons.lang.StringUtils;

import java.beans.PropertyVetoException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by wangxd on 2017/1/24.
 */
public class JdbcUtils_C3P0 {
    private String getIsExistBoothNumberBuffer(Integer userId,Integer tFairId) {
        StringBuffer isExistBoothNumberBuffer = new StringBuffer();
        ComboPooledDataSource ds = new ComboPooledDataSource();
        if(tFairId != null){
            try{
                ds.setDriverClass("net.sourceforge.jtds.jdbc.Driver");
                ds.setJdbcUrl("jdbc:jtds:sqlserver://10.33.0.224:1433;DatabaseName=boothApproval");
                ds.setUser("Jhx03SA");
                ds.setPassword("gogo03Jhx");
                ds.setMaxPoolSize(400);
                ds.setInitialPoolSize(50);
                ds.setMaxIdleTime(2000);

                Connection cn = ds.getConnection();
                Statement st = cn.createStatement();

                String isExistBoothNumberSql = "select * from t_expoBuildInfo where userid=" + userId + " and fairid=" + tFairId;
                ResultSet isExistBoothNumberSqlSet = st.executeQuery(isExistBoothNumberSql);
                while(isExistBoothNumberSqlSet.next()) {
                    isExistBoothNumberBuffer.append(isExistBoothNumberSqlSet.getString(4) + "||");
                }
            }catch (Exception e){

            }
        }
        return  isExistBoothNumberBuffer.toString();
    }

    public List<TExpoXicecExhibitorInfo> executeDataBaseByType(String driverClass, String jdbcUrl, String username, String password,
                                                               String table, Integer tFairId, Integer userId, String param){
        ComboPooledDataSource ds = new ComboPooledDataSource();
        List<TExpoXicecExhibitorInfo> tExpoXicecExhibitorInfoListResult = new ArrayList<TExpoXicecExhibitorInfo>();
        List<TExpoXicecExhibitorInfo> tExpoXicecExhibitorInfoListTemp = new ArrayList<TExpoXicecExhibitorInfo>();
        try {
            ds.setDriverClass(driverClass);
            ds.setJdbcUrl(jdbcUrl);
            ds.setUser(username);
            ds.setPassword(password);
            ds.setMaxPoolSize(400);
            ds.setInitialPoolSize(50);
            ds.setMaxIdleTime(2000);

            Connection cn = ds.getConnection();
            Statement st = cn.createStatement();

            String isExistBoothNumberString = getIsExistBoothNumberBuffer(userId, tFairId);
            //根据界面传入的值，先获取t_exhibitor_booth表里所需的字段值
            String sql = "select * from " + table + " where booth_number like '%" + param + "%'";
            ResultSet exhibitorBooth = st.executeQuery(sql);
            while(exhibitorBooth.next()) {
                String boothValueTemp = exhibitorBooth.getString(3);
                if(isExistBoothNumberString.indexOf(boothValueTemp) < 0){
                    Integer id = exhibitorBooth.getInt(1);          //id值
                    String eidValue = exhibitorBooth.getString(2);  //eid值
                    TExpoXicecExhibitorInfo tExpoXicecExhibitorInfo = new TExpoXicecExhibitorInfo();
                    tExpoXicecExhibitorInfo.setId(Integer.parseInt(eidValue));
                    tExpoXicecExhibitorInfo.setEid(Integer.parseInt(eidValue));
                    tExpoXicecExhibitorInfo.setBooth_number(boothValueTemp);
                    tExpoXicecExhibitorInfo.setExhibition_area(exhibitorBooth.getString(4));    //对应哪个厅
                    tExpoXicecExhibitorInfoListTemp.add(tExpoXicecExhibitorInfo);
                }
            }

            //再根据booth表过滤出来的eid，查询t_exhibitor表里所需的字段值
            for(TExpoXicecExhibitorInfo tExpoXicecExhibitorInfo: tExpoXicecExhibitorInfoListTemp){
                sql = "select * from t_exhibitor where is_logout=0 and eid=" + tExpoXicecExhibitorInfo.getEid();
                ResultSet exhibitor = st.executeQuery(sql);
                while(exhibitor.next()) {
                    //String eidValue = exhibitor.getString(1);
                    //tExpoXicecExhibitorInfo.setId(Integer.parseInt(eidValue));
                    //tExpoXicecExhibitorInfo.setEid(Integer.parseInt(eidValue));
                    int isLogoutValue = exhibitor.getInt(12);
                    if(0 == isLogoutValue){
                        tExpoXicecExhibitorInfo.setUsername(exhibitor.getString(2));
                        tExpoXicecExhibitorInfo.setPassword(exhibitor.getString(3));
                        tExpoXicecExhibitorInfo.setCountry(exhibitor.getString(19));
                        if(StringUtils.isNotEmpty(exhibitor.getString(22))){
                            tExpoXicecExhibitorInfo.setExhibitor_area(exhibitor.getString(22));
                        }else{
                            tExpoXicecExhibitorInfo.setExhibitor_area("0");
                        }
                        tExpoXicecExhibitorInfoListResult.add(tExpoXicecExhibitorInfo);
                    }
                }
            }

            for(TExpoXicecExhibitorInfo tExpoXicecExhibitorInfo: tExpoXicecExhibitorInfoListResult){
                sql = "select * from t_exhibitor_info where eid=" + tExpoXicecExhibitorInfo.getEid();
                ResultSet exhibitorInfo = st.executeQuery(sql);
                while(exhibitorInfo.next()){
                    if(tExpoXicecExhibitorInfo.getCountry() == null || (StringUtils.isNotEmpty(tExpoXicecExhibitorInfo.getCountry()) && tExpoXicecExhibitorInfo.getCountry().equalsIgnoreCase("44"))){
                        tExpoXicecExhibitorInfo.setCompany(exhibitorInfo.getString(4));
                    }else{
                        tExpoXicecExhibitorInfo.setCompany(exhibitorInfo.getString(5));
                    }
                }
            }

            /*cn = ds.getConnection();
            st = cn.createStatement();*/

            /*for(TExpoXicecExhibitorInfo tExpoXicecExhibitorInfo: tExpoXicecExhibitorInfoListTemp1){
                System.out.println(tExpoXicecExhibitorInfo.getBooth_number() + " " + tExpoXicecExhibitorInfo.getCompany() + "(" + tExpoXicecExhibitorInfo.getExhibitor_area() +"㎡)");
            }*/
        } catch (PropertyVetoException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return tExpoXicecExhibitorInfoListResult;
    }

    public List<BoothRegisterInfo> executeDataBaseToGetBoothRegisterInfoByType(String driverClass, String jdbcUrl, String username, String password,
                                                                               String table, Integer tFairId){
        ComboPooledDataSource ds = new ComboPooledDataSource();
        List<BoothRegisterInfo> boothRegisterInfoList = new ArrayList<BoothRegisterInfo>();
        try {
            ds.setDriverClass(driverClass);
            ds.setJdbcUrl(jdbcUrl);
            ds.setUser(username);
            ds.setPassword(password);
            ds.setMaxPoolSize(400);
            ds.setInitialPoolSize(50);
            ds.setMaxIdleTime(2000);

            Connection cn = ds.getConnection();
            Statement st = cn.createStatement();

            boothRegisterInfoList = getBoothNumberRegisterInfoBuffer(tFairId, driverClass, jdbcUrl, username, password);
            //根据界面传入的值，先获取t_exhibitor_booth表里所需的字段值

            /*cn = ds.getConnection();
            st = cn.createStatement();*/

            /*for(TExpoXicecExhibitorInfo tExpoXicecExhibitorInfo: tExpoXicecExhibitorInfoListTemp1){
                System.out.println(tExpoXicecExhibitorInfo.getBooth_number() + " " + tExpoXicecExhibitorInfo.getCompany() + "(" + tExpoXicecExhibitorInfo.getExhibitor_area() +"㎡)");
            }*/
        } catch (PropertyVetoException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return boothRegisterInfoList;
    }

    private List<BoothRegisterInfo> getBoothRegisterNumberList(Integer tFairId, List<BoothRegisterInfo> boothRegisterInfoList) {
        ComboPooledDataSource ds = new ComboPooledDataSource();
        if(tFairId != null){
            try{
                ds.setDriverClass("net.sourceforge.jtds.jdbc.Driver");
                ds.setJdbcUrl("jdbc:jtds:sqlserver://10.33.0.224:1433;DatabaseName=boothApproval");
                ds.setUser("Jhx03SA");
                ds.setPassword("gogo03Jhx");
                ds.setMaxPoolSize(400);
                ds.setInitialPoolSize(50);
                ds.setMaxIdleTime(2000);

                Connection cn = ds.getConnection();
                Statement st = cn.createStatement();

                String isBoothRegisterEnsureSql = "select exhibition_area,COUNT(*) from t_expoBuildInfo where fairid=" + tFairId + " and current_Audit_Status=3 group by exhibition_area";
                ResultSet isEnsureBoothNumberSqlSet = st.executeQuery(isBoothRegisterEnsureSql);
                while(isEnsureBoothNumberSqlSet.next()) {
                    String exhibition_area_name = isEnsureBoothNumberSqlSet.getString(1);
                    String exhibition_area_number = isEnsureBoothNumberSqlSet.getString(2);
                    for(BoothRegisterInfo boothRegisterInfo: boothRegisterInfoList){
                        if(StringUtils.isNotEmpty(boothRegisterInfo.getRegion())
                                && (boothRegisterInfo.getRegion().equalsIgnoreCase(exhibition_area_name)
                                || boothRegisterInfo.getRegion().contains(exhibition_area_name))){
                            boothRegisterInfo.setChecked(exhibition_area_number);
                            break;
                        }
                    }
                }
            }catch (Exception e){

            }
        }
        return boothRegisterInfoList;
    }

    private List<BoothRegisterInfo> getBoothNumberRegisterInfoBuffer(Integer tFairId, String driverClass, String url, String username, String password) {
        List<BoothRegisterInfo> boothRegisterInfoList = new ArrayList<BoothRegisterInfo>();
        ComboPooledDataSource ds = new ComboPooledDataSource();
        try{
            ds.setDriverClass(driverClass);
            ds.setJdbcUrl(url);
            ds.setUser(username);
            ds.setPassword(password);
            ds.setMaxPoolSize(400);
            ds.setInitialPoolSize(50);
            ds.setMaxIdleTime(2000);

            Connection cn = ds.getConnection();
            Statement st = cn.createStatement();

            //String isExistBoothNumberSql = "select * from t_expoBuildInfo where userid=" + userId + " and fairid=" + tFairId;
            String isBoothRegisterSql = "select area,COUNT(*) as areasum,SUM(areavalue) as areavaluesum from (" +
                    "select b.exhibition_area as area, t.exhibition_area as areavalue from t_exhibitor_booth b, t_exhibitor t " +
                    "where b.eid =t.eid and t.is_logout=0 and t.tag is not null and b.booth_number != '' and b.exhibition_area is not null) as tt group by area";
            ResultSet isExistBoothNumberSqlSet = st.executeQuery(isBoothRegisterSql);
            while(isExistBoothNumberSqlSet.next()) {
                BoothRegisterInfo boothRegisterInfo = new BoothRegisterInfo();
                String areaName = isExistBoothNumberSqlSet.getString(1);
                String boothSum = isExistBoothNumberSqlSet.getString(2);
                String areaSum = isExistBoothNumberSqlSet.getString(3);
                boothRegisterInfo.setRegion(areaName);
                boothRegisterInfo.setArea(areaSum);
                boothRegisterInfo.setCount(Integer.parseInt(boothSum));
                boothRegisterInfo.setChecked("0");
                boothRegisterInfoList.add(boothRegisterInfo);
            }
            boothRegisterInfoList = getBoothRegisterNumberList(tFairId, boothRegisterInfoList);

        }catch (Exception e){

        }
        return boothRegisterInfoList;
    }

    public List<TExpoBuildInfoShow> executeDataBaseByFairType(String driverClass, String jdbcUrl, String username,
                                                              String password, String param, Integer tFairId){
        ComboPooledDataSource ds = new ComboPooledDataSource();
        List<TExpoBuildInfoShow> tExpoXicecExhibitorInfoListResult = new ArrayList<TExpoBuildInfoShow>();
        try {
            ds.setDriverClass(driverClass);
            ds.setJdbcUrl(jdbcUrl);
            ds.setUser(username);
            ds.setPassword(password);
            ds.setMaxPoolSize(400);
            ds.setInitialPoolSize(50);
            ds.setMaxIdleTime(2000);

            Connection cn = ds.getConnection();
            Statement st = cn.createStatement();

            String isExistBoothNumberString = getExhibitorInfoList(tFairId);
            //根据界面传入的值，先获取t_exhibitor_booth表里所需的字段值
            String sql;
            if(StringUtils.isNotEmpty(param)){
                sql = "select b.booth_number,i.company,t.exhibition_area,b.exhibition_area " +
                        "from t_exhibitor t, t_exhibitor_info i, t_exhibitor_booth b  " +
                        "where t.is_logout=0 and t.eid=i.eid and t.eid=b.eid and i.eid=b.eid and t.tag is not null " +
                        "and b.booth_number != '' and b.exhibition_area is not null and " + param;
            }else {
                sql = "select b.booth_number,i.company,t.exhibition_area,b.exhibition_area " +
                        "from t_exhibitor t, t_exhibitor_info i, t_exhibitor_booth b  " +
                        "where t.is_logout=0 and t.eid=i.eid and t.eid=b.eid and i.eid=b.eid and t.tag is not null " +
                        "and b.booth_number != '' and b.exhibition_area is not null";
            }

            ResultSet exhibitorSet = st.executeQuery(sql);
            while(exhibitorSet.next()) {
                TExpoBuildInfoShow tExpoBuildInfoShow = new TExpoBuildInfoShow();
                tExpoBuildInfoShow.setBooth_Number(exhibitorSet.getString(1));
                tExpoBuildInfoShow.setExhibitor_Company(exhibitorSet.getString(2));
                String exhibitionArea = exhibitorSet.getString(3);
                if(StringUtils.isNotEmpty(exhibitionArea) && Integer.parseInt(exhibitionArea)>8){
                    tExpoBuildInfoShow.setExhibitor_Type("2");  //大于8平米表示特装
                }else{
                    tExpoBuildInfoShow.setExhibitor_Type("1");
                }
                tExpoBuildInfoShow.setBooth_area(exhibitorSet.getString(3));
                tExpoBuildInfoShow.setExhibition_area(exhibitorSet.getString(4));
                tExpoXicecExhibitorInfoListResult.add(tExpoBuildInfoShow);
            }

        } catch (PropertyVetoException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return tExpoXicecExhibitorInfoListResult;
    }

    private String getExhibitorInfoList(Integer tFairId) {
        StringBuffer isExistBoothNumberBuffer = new StringBuffer();
        ComboPooledDataSource ds = new ComboPooledDataSource();
        if(tFairId != null){
            try{
                ds.setDriverClass("net.sourceforge.jtds.jdbc.Driver");
                ds.setJdbcUrl("jdbc:jtds:sqlserver://10.33.0.224:1433;DatabaseName=boothApproval");
                ds.setUser("Jhx03SA");
                ds.setPassword("gogo03Jhx");
                ds.setMaxPoolSize(400);
                ds.setInitialPoolSize(50);
                ds.setMaxIdleTime(2000);

                Connection cn = ds.getConnection();
                Statement st = cn.createStatement();

                String isExistBoothNumberSql = "select * from t_expoBuildInfo where fairid=" + tFairId;
                ResultSet isExistBoothNumberSqlSet = st.executeQuery(isExistBoothNumberSql);
                while(isExistBoothNumberSqlSet.next()) {
                    isExistBoothNumberBuffer.append(isExistBoothNumberSqlSet.getString(4) + "||");
                }
            }catch (Exception e){

            }
        }
        return  isExistBoothNumberBuffer.toString();
    }
}
