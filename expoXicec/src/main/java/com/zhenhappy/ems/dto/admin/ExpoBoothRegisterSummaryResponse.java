package com.zhenhappy.ems.dto.admin;

import com.zhenhappy.ems.dto.BaseResponse;

/**
 * Created by wangxd on 2017/4/14.
 */
public class ExpoBoothRegisterSummaryResponse extends BaseResponse {
    public String boothRegisterSummaryList;

    public ExpoBoothRegisterSummaryResponse() {
    }

    public ExpoBoothRegisterSummaryResponse(String boothRegisterSummaryList) {
        this.boothRegisterSummaryList = boothRegisterSummaryList;
    }

    public String getBoothRegisterSummaryList() {
        return boothRegisterSummaryList;
    }

    public void setBoothRegisterSummaryList(String boothRegisterSummaryList) {
        this.boothRegisterSummaryList = boothRegisterSummaryList;
    }
}
