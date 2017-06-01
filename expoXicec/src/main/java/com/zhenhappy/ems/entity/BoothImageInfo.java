package com.zhenhappy.ems.entity;

/**
 * Created by wangxd on 2017-01-19.
 */
public class BoothImageInfo {
    private String modifyDate;
    private String fileName;
    private boolean preview;	        //是否可以预览
    private Integer curReviewStatus;    //当前的审核状态，用于控件删除按钮是否可见
    private String tempid;              //当前提交的图片类型
    private String curBoothid;          //当前展位号

    public BoothImageInfo() {
		super();
	}

    public BoothImageInfo(String modifyDate, String fileName) {
        this.modifyDate = modifyDate;
        this.fileName = fileName;
    }

    public String getModifyDate() {
        return modifyDate;
    }

    public void setModifyDate(String modifyDate) {
        this.modifyDate = modifyDate;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public boolean isPreview() {
        return preview;
    }

    public void setPreview(boolean preview) {
        this.preview = preview;
    }

    public Integer getCurReviewStatus() {
        return curReviewStatus;
    }

    public void setCurReviewStatus(Integer curReviewStatus) {
        this.curReviewStatus = curReviewStatus;
    }

    public String getTempid() {
        return tempid;
    }

    public void setTempid(String tempid) {
        this.tempid = tempid;
    }

    public String getCurBoothid() {
        return curBoothid;
    }

    public void setCurBoothid(String curBoothid) {
        this.curBoothid = curBoothid;
    }
}
