package com.zhenhappy.ems.service.expoxicec;

import com.zhenhappy.ems.dao.expoxicec.UserFairDao;
import com.zhenhappy.ems.entity.TUserFair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate3.HibernateTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by wangxd on 2017-01-24.
 */
@Service
public class UserFairService {
    @Autowired
    private HibernateTemplate hibernateTemplate;
    @Autowired
    private UserFairDao userFairDao;

    /**
     * 查询所有激活的展会  0：停用；1：可上传资料；2：已截止上传
     * @return
     */
    @Transactional
    public TUserFair loadAllUserFairByUserIdAndFairType(Integer userId, Integer fairId){
        List<TUserFair> userFairList = hibernateTemplate.find("from TUserFair where user_id=? and fair_id=? ", new Object[]{userId, fairId});
        if(userFairList.size()==0){
            return null;
        }else{
            return userFairList.get(0);
        }
    }

    /**
     * 查询所有激活的展会  0：停用；1：可上传资料；2：已截止上传
     * @return
     */
    @Transactional
    public List<TUserFair> loadAllUserFairByUserId(Integer userId){
        List userFairList = hibernateTemplate.find("from TUserFair where user_id=? ", new Object[]{userId});
        if(userFairList.size()==0){
            return null;
        }else{
            return userFairList;
        }
    }

    /**
     * 查询所有激活的展会  0：停用；1：可上传资料；2：已截止上传
     * @return
     */
    @Transactional
    public TUserFair loadAllUserFairByFairId(Integer fairId){
        List<TUserFair> userFairList = hibernateTemplate.find("from TUserFair where fair_id=? ", new Object[]{fairId});
        if(userFairList.size()==0){
            return null;
        }else{
            return userFairList.get(0);
        }
    }

    /**
     * 保存对象
     * @return
     */
    @Transactional
    public void saveTUserFair(TUserFair tUserFair){
        userFairDao.create(tUserFair);
    }

    /**
     * 更新对象
     * @return
     */
    @Transactional
    public void updateTUserFair(TUserFair tUserFair){
        userFairDao.update(tUserFair);
    }
}
