package com.zhenhappy.ems.service.expoxicec;

import com.zhenhappy.ems.dao.expoxicec.TexpoBuildInfoDao;
import com.zhenhappy.ems.entity.TExpoBuildInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate3.HibernateTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by wangxd on 2017-01-16.
 */
@Service
public class TExpoBuildInfoService {
    @Autowired
    private HibernateTemplate hibernateTemplate;
    @Autowired
    private TexpoBuildInfoDao texpoBuildInfoDao;

    public List<TExpoBuildInfo> loadAllExpoBuildInfoList(){
        return hibernateTemplate.find("from TExpoBuildInfo");
    }

    @Transactional
    public void deleteTExpoBuildInfo(TExpoBuildInfo tExpoBuildInfo){
        try {
            texpoBuildInfoDao.delete(tExpoBuildInfo);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Transactional
    public TExpoBuildInfo loadTExpoBuildInfo(Integer id){
        return hibernateTemplate.get(TExpoBuildInfo.class,id);
    }

    @Transactional
    public void saveTExpoBuildInfo(TExpoBuildInfo tExpoBuildInfo){
        texpoBuildInfoDao.create(tExpoBuildInfo);
    }

    @Transactional
    public void updateTExpoBuildInfo(TExpoBuildInfo tExpoBuildInfo){
        texpoBuildInfoDao.update(tExpoBuildInfo);
    }

    @Transactional
    public List<TExpoBuildInfo> loadTExpoXicecListByFairId(Integer fairId){
        List<TExpoBuildInfo> tExpoBuildInfoList = texpoBuildInfoDao.queryByHql("from TExpoBuildInfo where fairid = ? ", new Object[]{fairId});
        return tExpoBuildInfoList;
    }

    @Transactional
    public List<TExpoBuildInfo> loadTExpoXicecListByUserId(Integer userId){
        List<TExpoBuildInfo> tExpoBuildInfoList = texpoBuildInfoDao.queryByHql("from TExpoBuildInfo where userid = ? ", new Object[]{userId});
        return tExpoBuildInfoList;
    }

    @Transactional
    public List<TExpoBuildInfo> loadTExpoXicecListByUserIdAndFairId(Integer userId, Integer fairId){
        List<TExpoBuildInfo> tExpoBuildInfoList = texpoBuildInfoDao.queryByHql("from TExpoBuildInfo where userid = ? and fairid = ? ", new Object[]{userId, fairId});
        return tExpoBuildInfoList;
    }

    @Transactional
    public List<TExpoBuildInfo> loadTExpoXicecListByUserIdAndFairIdAndBoothnum(Integer userId, Integer fairId, String boothNum){
        List<TExpoBuildInfo> tExpoBuildInfoList = texpoBuildInfoDao.queryByHql("from TExpoBuildInfo where userid = ? and fairid = ? and booth_Number=? ", new Object[]{userId, fairId, boothNum});
        return tExpoBuildInfoList;
    }

    @Transactional
    public TExpoBuildInfo loadExpoReviewInfoByUserIdAndFairIdAndBoothNum(Integer userId, Integer fairId, String boothNum) {
        List<TExpoBuildInfo> tExpoBuildInfoList = texpoBuildInfoDao.queryByHql("from TExpoBuildInfo where userid = ? and fairid = ? and booth_Number=? ", new Object[]{ userId, fairId, boothNum });
        return tExpoBuildInfoList != null?tExpoBuildInfoList.get(0):null;
    }

    @Transactional
    public TExpoBuildInfo loadTExpoXicecListByFairIdAndBoothNum(Integer fairId, String boothNum){
        List<TExpoBuildInfo> tExpoBuildInfoList = texpoBuildInfoDao.queryByHql("from TExpoBuildInfo where fairid = ? and booth_Number=? ", new Object[]{fairId, boothNum});
        return (tExpoBuildInfoList != null && tExpoBuildInfoList.size()>0)?tExpoBuildInfoList.get(0):null;
    }

    @Transactional
    public List<TExpoBuildInfo> loadAllExhibitionAuditList(Integer fairId) {
        List<TExpoBuildInfo> tExpoBuildInfoList = texpoBuildInfoDao.queryByHql("from TExpoBuildInfo where fairid = ?", new Object[]{fairId});
        return tExpoBuildInfoList.size() > 0 ? tExpoBuildInfoList : null;
    }

    @Transactional
    public List<TExpoBuildInfo> loadTExpoXicecListBoothNum(String boothNum){
        List<TExpoBuildInfo> tExpoBuildInfoList = texpoBuildInfoDao.queryByHql("from TExpoBuildInfo where booth_Number=? ", new Object[]{boothNum});
        return tExpoBuildInfoList;
    }
}
