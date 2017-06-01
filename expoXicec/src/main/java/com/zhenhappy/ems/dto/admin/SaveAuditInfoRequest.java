package com.zhenhappy.ems.dto.admin;

import com.zhenhappy.ems.dto.EasyuiRequest;

/**
 * Created by wangxd on 2017-03-29.
 */
public class SaveAuditInfoRequest extends EasyuiRequest {
	private Integer userId;					//报图人员id
	private Integer fairId;					//展会id
	private String boothNumber;				//展位号
	private Integer boothReviewStatus;		//审核状态	3：审核通过；4：审核不通过
	private String auditMsg;				//审核信息
	private boolean sendAuditSMS;			//是否发送审核短信
	private String fairName;				//当前展位名称
	private String sendSmsMobilePhone;		//发送短信的手机号

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public Integer getFairId() {
		return fairId;
	}

	public void setFairId(Integer fairId) {
		this.fairId = fairId;
	}

	public String getBoothNumber() {
		return boothNumber;
	}

	public void setBoothNumber(String boothNumber) {
		this.boothNumber = boothNumber;
	}

	public Integer getBoothReviewStatus() {
		return boothReviewStatus;
	}

	public void setBoothReviewStatus(Integer boothReviewStatus) {
		this.boothReviewStatus = boothReviewStatus;
	}

	public String getAuditMsg() {
		return auditMsg;
	}

	public void setAuditMsg(String auditMsg) {
		this.auditMsg = auditMsg;
	}

	public boolean isSendAuditSMS() {
		return sendAuditSMS;
	}

	public void setSendAuditSMS(boolean sendAuditSMS) {
		this.sendAuditSMS = sendAuditSMS;
	}

	public String getFairName() {
		return fairName;
	}

	public void setFairName(String fairName) {
		this.fairName = fairName;
	}

	public String getSendSmsMobilePhone() {
		return sendSmsMobilePhone;
	}

	public void setSendSmsMobilePhone(String sendSmsMobilePhone) {
		this.sendSmsMobilePhone = sendSmsMobilePhone;
	}
}
