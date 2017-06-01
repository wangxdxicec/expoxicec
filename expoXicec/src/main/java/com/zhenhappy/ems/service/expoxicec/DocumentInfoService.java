package com.zhenhappy.ems.service.expoxicec;

import com.zhenhappy.ems.dao.expoxicec.DocumentInfoDao;
import com.zhenhappy.ems.entity.TDocumentInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate3.HibernateTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by wangxd on 2017-05-09.
 */
@Service
public class DocumentInfoService {
    @Autowired
    private DocumentInfoDao documentInfoDao;

    /**
     *
     * @return
     */
    @Transactional
    public List<TDocumentInfo> loadAllDocumentTypeByDocumentTypeId(Integer fairId, Integer documentId){
        List<TDocumentInfo> documentInfoList = documentInfoDao.queryByHql("from TDocumentInfo where document_Fair=? and document_type_id=? order by document_Sort asc", new Object[]{fairId, documentId});
        return (documentInfoList != null && documentInfoList.size()>0)?documentInfoList:null;
    }

    @Transactional
    public TDocumentInfo getExhibitionTypeByDocumentId(Integer documentId){
        List<TDocumentInfo> documentInfoList = documentInfoDao.queryByHql("from TDocumentInfo where id=? ", new Object[]{documentId});
        return (documentInfoList != null && documentInfoList.size()>0)?documentInfoList.get(0):null;
    }

    @Transactional
    public void deleteDocumentType(TDocumentInfo tDocumentInfo) {
        try {
            documentInfoDao.delete(tDocumentInfo);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Transactional
    public void updateTDocumentInfo(TDocumentInfo tDocumentInfo){
        documentInfoDao.update(tDocumentInfo);
    }

    @Transactional
    public void createTDocumentInfo(TDocumentInfo tDocumentInfo){
        documentInfoDao.create(tDocumentInfo);
    }

    /**
     *
     * @return
     */
    @Transactional
    public List<TDocumentInfo> loadAllDocumentTypeByDocumentFairId(Integer fairId){
        List<TDocumentInfo> documentInfoList = documentInfoDao.queryByHql("from TDocumentInfo where document_Fair=? order by document_Sort asc", new Object[]{fairId});
        return (documentInfoList != null && documentInfoList.size()>0)?documentInfoList:null;
    }
}
