package com.zhenhappy.ems.service.expoxicec;

import com.zhenhappy.ems.dao.expoxicec.TexpoBuildInfoDao;
import com.zhenhappy.ems.dao.expoxicec.TexpoReviewInfoDao;
import com.zhenhappy.ems.entity.*;
import com.zhenhappy.ems.service.ExhibitorService;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by wangxd on 2017-01-19.
 */
@Service
public class ExpoXicecManagerService extends ExhibitorService {
	private static Logger log = Logger.getLogger(ExpoXicecManagerService.class);
    @Autowired
    private TexpoBuildInfoDao texpoBuildInfoDao;
    @Autowired
    private TexpoReviewInfoDao texpoReviewfoDao;

    /**
     * 根据展位号查询展位信息
     * @param boothNum
     * @return
     */
    @Transactional
    public List<TExpoExhibitorInfo> queryBoothByBoothNum(String boothNum) {
        List<TExpoExhibitorInfo> tExpoExhibitorInfoList = new ArrayList<TExpoExhibitorInfo>();
        List<TExhibitorBooth> tExhibitorBoothList = getHibernateTemplate().find("from TExhibitorBooth where boothNumber like '%" + boothNum + "%') ");
        if(tExhibitorBoothList != null && tExhibitorBoothList.size()>0){
            int i=1;
            for(TExhibitorBooth booth:tExhibitorBoothList){
                TExhibitor tExhibitor = loadExhibitorByEid(booth.getEid());
                if(tExhibitor != null && tExhibitor.getIsLogout() == 0){
                    TExhibitorInfo tExhibitorInfo = loadExhibitorInfoByEid(tExhibitor.getEid());
                    TExpoExhibitorInfo tExpoExhibitorInfo = new TExpoExhibitorInfo();
                    tExpoExhibitorInfo.setId(i++);
                    tExpoExhibitorInfo.setEid(tExhibitor.getEid());
                    tExpoExhibitorInfo.setBoothnumber(booth.getBoothNumber());
                    tExpoExhibitorInfo.setCompany(tExhibitorInfo.getCompany());
                    tExpoExhibitorInfo.setAreanumber(tExhibitor.getExhibitionArea());
                    tExpoExhibitorInfoList.add(tExpoExhibitorInfo);
                }
            }
        }
        return tExpoExhibitorInfoList;
    }

    @Transactional
    public TExpoBuildInfo loadExpoBuildInfoByBoothNum(String boothNum, Integer userId) {
        if(boothNum != null){
            List<TExpoBuildInfo> expoBuildInfoList = texpoBuildInfoDao.queryByHql("from TExpoBuildInfo where booth_Number=? and userid=? ", new Object[]{ boothNum, userId });
            return expoBuildInfoList.size() > 0 ? expoBuildInfoList.get(0) : null;
        }else {
            return null;
        }
    }

    @Transactional
    public TExpoReviewInfo loadExpoBuildInfoByExpoBuildId(Integer id) {
        TExpoReviewInfo tExpoReviewInfo = texpoReviewfoDao.query(id);
        return tExpoReviewInfo;
    }

    @Transactional
    public void deleteExpoBuildInfo(TExpoReviewInfo tExpoReviewInfo) {
        try {
            texpoReviewfoDao.delete(tExpoReviewInfo);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Transactional
    public List<TExpoReviewInfo> loadExpoReviewInfoByBoothNum(String boothNum) {
        if(boothNum != null){
            List<TExpoReviewInfo> expoReviewInfoList = texpoReviewfoDao.queryByHql("from TExpoReviewInfo where booth_Number=? order by review_time desc", new Object[]{ boothNum });
            return expoReviewInfoList;
        }else {
            return null;
        }
    }

    @Transactional
    public List<TExpoReviewInfo> loadExpoReviewInfoByFairIdAndBoothNum(Integer fairId, String boothNum) {
        if(boothNum != null){
            List<TExpoReviewInfo> expoReviewInfoList = texpoReviewfoDao.queryByHql("from TExpoReviewInfo where fair_id = ? and booth_Number=? order by review_time desc", new Object[]{ fairId, boothNum });
            return expoReviewInfoList;
        }else {
            return null;
        }
    }
}
