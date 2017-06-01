package com.zhenhappy.ems.service.expoxicec;

import com.zhenhappy.ems.dao.expoxicec.ExhibitionTypeDao;
import com.zhenhappy.ems.entity.TExhibitionType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate3.HibernateTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by wangxd on 2017-05-09.
 */
@Service
public class ExhibitionTypeService {
    @Autowired
    private HibernateTemplate hibernateTemplate;
    @Autowired
    private ExhibitionTypeDao exhibitionTypeDao;

    /**
     *
     * @return
     */
    @Transactional
    public List<TExhibitionType> loadAllExhibitionType(){
        List<TExhibitionType> exhibitionTypeList = hibernateTemplate.find("from TExhibitionType order by exhibition_sort asc", null);
        return (exhibitionTypeList != null && exhibitionTypeList.size()>0)?exhibitionTypeList:null;
    }

    @Transactional
    public TExhibitionType getExhibitionTypeByDocumentTypeId(Integer documentTypeId){
        List<TExhibitionType> exhibitionTypeList = hibernateTemplate.find("from TExhibitionType where id=? ", new Object[]{documentTypeId});
        return (exhibitionTypeList != null && exhibitionTypeList.size()>0)?exhibitionTypeList.get(0):null;
    }

    @Transactional
    public void deleteExhibitionType(TExhibitionType tExhibitionType) {
        try {
            exhibitionTypeDao.delete(tExhibitionType);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Transactional
    public void createTExhibitionTypeInfo(TExhibitionType tExhibitionType){
        exhibitionTypeDao.create(tExhibitionType);
    }
}
