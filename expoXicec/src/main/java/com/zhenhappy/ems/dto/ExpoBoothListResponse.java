package com.zhenhappy.ems.dto;

/**
 * Created by wangxd on 2017/4/18.
 */
public class ExpoBoothListResponse extends BaseResponse {
    public String tExpoBuildInfoList;

    public ExpoBoothListResponse() {
    }

    public ExpoBoothListResponse(String tExpoBuildInfoList) {
        this.tExpoBuildInfoList = tExpoBuildInfoList;
    }

    public String gettExpoBuildInfoList() {
        return tExpoBuildInfoList;
    }

    public void settExpoBuildInfoList(String tExpoBuildInfoList) {
        this.tExpoBuildInfoList = tExpoBuildInfoList;
    }
}
