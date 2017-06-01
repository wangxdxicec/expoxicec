package com.zhenhappy.ems.service.expoxicec;

import com.zhenhappy.ems.dao.expoxicec.TexpoReviewInfoDao;
import com.zhenhappy.ems.entity.*;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by wangxd on 2017-01-19.
 */
@Service
public class ExpoReviewInfoService {
	private static Logger log = Logger.getLogger(ExpoReviewInfoService.class);
    @Autowired
    private TexpoReviewInfoDao texpoReviewInfoDao;

    @Transactional
    public void saveExpoReviewInfo(TExpoReviewInfo tExpoReviewInfo) {
        try {
            texpoReviewInfoDao.create(tExpoReviewInfo);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
