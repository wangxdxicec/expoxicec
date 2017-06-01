package com.zhenhappy.ems.dto;

/**
 * Created by wangxd on 2017-02-20.
 */
public class UpdateBoothImageInfoResponse extends BaseResponse{
	private String imagesrc;	//图片名称
	private boolean result;		//上传结果
	private String tempid;		//对应的文件类别
	private boolean preview;	//是否可以预览
	private String createTime;	//图片生成时间（默认为当前时间)
	private String imageId;		//图片ID
	private String boothid;		//展位号

	public String getBoothid() {
		return boothid;
	}

	public void setBoothid(String boothid) {
		this.boothid = boothid;
	}

	public String getImageId() {
		return imageId;
	}

	public void setImageId(String imageId) {
		this.imageId = imageId;
	}

	public String getCreateTime() {
		return createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	public String getImagesrc() {
		return imagesrc;
	}

	public void setImagesrc(String imagesrc) {
		this.imagesrc = imagesrc;
	}

	public boolean isResult() {
		return result;
	}

	public void setResult(boolean result) {
		this.result = result;
	}

	public String getTempid() {
		return tempid;
	}

	public void setTempid(String tempid) {
		this.tempid = tempid;
	}

	public boolean isPreview() {
		return preview;
	}

	public void setPreview(boolean preview) {
		this.preview = preview;
	}
}
