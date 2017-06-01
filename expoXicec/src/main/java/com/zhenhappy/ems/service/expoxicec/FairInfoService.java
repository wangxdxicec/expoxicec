package com.zhenhappy.ems.service.expoxicec;

import com.zhenhappy.ems.dao.expoxicec.FairTypeDao;
import com.zhenhappy.ems.entity.TFairInfo;
import com.zhenhappy.ems.entity.WCountry;
import com.zhenhappy.ems.entity.WProvince;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate3.HibernateTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by wangxd on 2017-01-24.
 */
@Service
public class FairInfoService {
    @Autowired
    private HibernateTemplate hibernateTemplate;

    /**
     * 查询所有激活的展会  0：停用；1：可上传资料；2：已截止上传
     * @return
     */
    @Transactional
    public List<TFairInfo> loadAllEnableFair(){
        List fairInfoList = hibernateTemplate.find("from TFairInfo where fair_enable !=0", null);
        if(fairInfoList.size()==0){
            return null;
        }else{
            return fairInfoList;
        }
    }

    /**
     * 根据fairid查询对应的展会信息
     * @return
     */
    @Transactional
    public TFairInfo loadFairInfoByFairId(Integer fairId){
        List<TFairInfo> fairInfoList = hibernateTemplate.find("from TFairInfo where id=? ", new Object[]{fairId});
        if(fairInfoList.size()==0){
            return null;
        }else{
            return fairInfoList.get(0);
        }
    }
}
