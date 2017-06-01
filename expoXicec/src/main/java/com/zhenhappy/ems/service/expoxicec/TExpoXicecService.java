package com.zhenhappy.ems.service.expoxicec;

import com.zhenhappy.ems.dao.expoxicec.TexpoXicecDao;
import com.zhenhappy.ems.entity.TExpoXicec;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate3.HibernateTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.constraints.Null;
import java.util.List;

/**
 * Created by wangxd on 2017-01-16.
 */
@Service
public class TExpoXicecService {
    @Autowired
    private HibernateTemplate hibernateTemplate;
    @Autowired
    private TexpoXicecDao texpoXicecDao;

    public List<TExpoXicec> loadAll(){
        return hibernateTemplate.find("from TExpoXicec");
    }

    @Transactional
    public TExpoXicec loadTExpoXicec(Integer id){
        return hibernateTemplate.get(TExpoXicec.class,id);
    }

    @Transactional
    public void saveTExpoXicec(TExpoXicec tExpoXicec){
        texpoXicecDao.create(tExpoXicec);
    }

    @Transactional
    public void updateTExpoXicec(TExpoXicec tExpoXicec){
        texpoXicecDao.update(tExpoXicec);
    }

    @Transactional
    public List<TExpoXicec> loadTExpoXicecByPhone(String phone){
        List<TExpoXicec> tExpoXicecList = texpoXicecDao.queryByHql("from TExpoXicec where mobilephone = ? ", new Object[]{phone});
        return tExpoXicecList;
    }

    @Transactional
    public List<TExpoXicec> loadTExpoXicecByPhoneAndFairId(String phone, Integer fairType){
        List<TExpoXicec> tExpoXicecList = texpoXicecDao.queryByHql("from TExpoXicec where mobilephone = ? and fair_type = ? ", new Object[]{phone, fairType});
        return tExpoXicecList;
    }

    @Transactional
    public TExpoXicec loadTExpoXicecByPhoneForAdmin(String phone){
        List<TExpoXicec> tExpoXicecList = texpoXicecDao.queryByHql("from TExpoXicec where mobilephone = ? ", new Object[]{phone});
        return tExpoXicecList.size() > 0 ? tExpoXicecList.get(0) : null;
    }

    @Transactional
    public TExpoXicec loadTExpoXicecByFairId(Integer fairId){
        List<TExpoXicec> tExpoXicecList = texpoXicecDao.queryByHql("from TExpoXicec where fair_type = ? ", new Object[]{fairId});
        return tExpoXicecList == null?null:tExpoXicecList.get(0);
    }

    /*@Transactional
    public TExpoXicec loadTExpoXicecByPhoneAndPassword(String phone, String password, Integer fair_type){
        List<TExpoXicec> tExpoXicecList = texpoXicecDao.queryByHql("from TExpoXicec where mobilephone = ? and password = ? and fair_type = ? ",
                new Object[]{phone, password, fair_type});
        return tExpoXicecList.size() > 0 ? tExpoXicecList.get(0) : null;
    }*/

    @Transactional
    public TExpoXicec loadTExpoXicecByPhoneAndPassword(String phone, String password){
        List<TExpoXicec> tExpoXicecList = texpoXicecDao.queryByHql("from TExpoXicec where mobilephone = ? and password = ? and status<3",
                new Object[]{phone, password});
        return tExpoXicecList.size() > 0 ? tExpoXicecList.get(0) : null;
    }
}
