package com.zhenhappy.ems.dto.admin;

import com.zhenhappy.ems.dto.BaseResponse;

/**
 * Created by wangxd on 2017/4/14.
 */
public class ExpoBoothAuditSummaryResponse extends BaseResponse {
    public String boothAuditSummaryList;

    public ExpoBoothAuditSummaryResponse() {
    }

    public ExpoBoothAuditSummaryResponse(String boothAuditSummaryList) {
        this.boothAuditSummaryList = boothAuditSummaryList;
    }

    public String getBoothAuditSummaryList() {
        return boothAuditSummaryList;
    }

    public void setBoothAuditSummaryList(String boothAuditSummaryList) {
        this.boothAuditSummaryList = boothAuditSummaryList;
    }
}
