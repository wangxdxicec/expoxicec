package com.zhenhappy.ems.dto;

/**
 * Created by wangxd on 2016/4/18.
 */
public class ExpoFairListResponse extends BaseResponse {
    public String tFairInfoList;

    public ExpoFairListResponse() {
    }

    public ExpoFairListResponse(String tFairInfoList) {
        this.tFairInfoList = tFairInfoList;
    }

    public String gettFairInfoList() {
        return tFairInfoList;
    }

    public void settFairInfoList(String tFairInfoList) {
        this.tFairInfoList = tFairInfoList;
    }
}
