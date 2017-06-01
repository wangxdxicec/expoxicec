package com.zhenhappy.ems.dto.admin;

import com.zhenhappy.ems.dto.BaseResponse;

/**
 * query customers by page.
 * <p/>
 * Created by wangxd on 2017-05-11.
 */
public class UploadDocumentTypeResponse extends BaseResponse {
    private String filePath;

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }
}
