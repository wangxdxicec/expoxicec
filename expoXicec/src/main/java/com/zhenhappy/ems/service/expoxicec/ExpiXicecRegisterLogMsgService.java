package com.zhenhappy.ems.service.expoxicec;

import com.zhenhappy.ems.entity.TVisitorMsgLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate3.HibernateTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by wangxd on 2016-04-11.
 */
@Service
public class ExpiXicecRegisterLogMsgService {
    @Autowired
    private HibernateTemplate hibernateTemplate;

    @Transactional
    public void insertLogMsg(TVisitorMsgLog visitor_Log_Msg){
        hibernateTemplate.saveOrUpdate(visitor_Log_Msg);
    }
}
