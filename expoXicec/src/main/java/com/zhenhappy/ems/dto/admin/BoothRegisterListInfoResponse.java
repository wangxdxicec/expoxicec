package com.zhenhappy.ems.dto.admin;

import com.zhenhappy.ems.dto.BaseResponse;

/**
 * Created by wangxd on 2016/4/18.
 */
public class BoothRegisterListInfoResponse extends BaseResponse {
    private String boothRegisterListInfo;
    private String matchValue;
    private Float totalArea;

    public BoothRegisterListInfoResponse() {
    }

    public BoothRegisterListInfoResponse(String boothRegisterListInfo) {
        this.boothRegisterListInfo = boothRegisterListInfo;
    }

    public String getBoothRegisterListInfo() {
        return boothRegisterListInfo;
    }

    public void setBoothRegisterListInfo(String boothRegisterListInfo) {
        this.boothRegisterListInfo = boothRegisterListInfo;
    }

    public String getMatchValue() {
        return matchValue;
    }

    public void setMatchValue(String matchValue) {
        this.matchValue = matchValue;
    }

    public Float getTotalArea() {
        return totalArea;
    }

    public void setTotalArea(Float totalArea) {
        this.totalArea = totalArea;
    }
}
