var SDKAppID = 0;
var SECRETKEY = '';
/**
 * 签名过期时间，建议不要设置的过短
 * <p>
 * 时间单位：秒
 * 默认时间：7 x 24 x 60 x 60 = 604800 = 7 天
 */
var EXPIRETIME = 604800;

var generator = new LibGenerateTestUserSig(SDKAppID, SECRETKEY, EXPIRETIME);
var tsignaling = new TSignaling({
    SDKAppID: SDKAppID
});

var userID = '';
var remoteUserID = '';
var signalData;
var loginBtnEle;
var logoutBtnEle;
var userIDEle;
var remoteUserIDEle;
var userStatusEle;
var receiveSectionEle;
var inviteBtnEle;
var inviteInGroupBtnEle;
var signalDataEle;
var isLoginSuccess = false;
var isSDKReady = false;

function init() {
    loginBtnEle = document.querySelector('#loginBtn');
    logoutBtnEle = document.querySelector('#logoutBtn');
    userIDEle = document.querySelector('#userIDInput');
    remoteUserIDEle = document.querySelector('#remoteUserIDInput');
    userStatusEle = document.querySelector('#userStatus');
    receiveSectionEle = document.querySelector('.receive-section');
    inviteBtnEle = document.querySelector('#inviteBtn');
    inviteInGroupBtnEle = document.querySelector('#inviteInGroupBtn');
    signalDataEle = document.querySelector('#signalData');
}

function disableInput(ele, isDisable) {
    if (ele) {
        ele.disabled = isDisable;
    }
}

function setText(ele, text) {
    if (ele) {
        ele.textContent = text;
    }
}

function appendReceiveItem(inviteID, text, isShowBtn) {
    var wrapperDiv = document.createElement('div');
    var receiveItemDiv = '';
    if (isShowBtn) {
        receiveItemDiv = `
            <div class="receive-item" data-inviteid=${inviteID}>
                <div class="receive-text">
                    ${text}
                </div>
                <div class="receive-btn">
                    <button class="accept-btn">接受</button>
                    <button class="reject-btn">拒绝</button>
                </div>
            </div>
        `;
    } else {
        receiveItemDiv = `
            <div class="receive-item">
                <div class="receive-text">
                    ${text}
                </div>
            </div>
        `;
    }
    wrapperDiv.innerHTML = receiveItemDiv;
    receiveSectionEle.appendChild(wrapperDiv);
}

function bindBtnClickEvent() {
    loginBtnEle.addEventListener('click', function(){
        userID = userIDEle.value.trim();
        if (SDKAppID === 0) {
            alert('无效 SDKAppID');
            return;
        }
        if (!SECRETKEY) {
            alert('无效 SECRETKEY');
            return;
        }
        if (!userID) {
            alert('无效 userID');
            return;
        }

        var userSig = generator.genTestUserSig(userID);
        tsignaling.login({userID: userID, userSig: userSig}).then(function(imResponse) {
            isLoginSuccess = true;
            disableInput(userIDEle, true);
            setText(userStatusEle, '已登录');
            console.log('login success')
            if (imResponse.data.repeatLogin === true) {
                // 标识账号已登录，本次登录操作为重复登录
            }
        }).catch(function(imError) {
            console.warn('login error:', imError); // 登录失败的相关信息
        });;
    });
    logoutBtnEle.addEventListener('click', function(){
        if (!isLoginSuccess) {
            alert('请先登录');
            return;
        }
        isLoginSuccess = false;
        setText(userStatusEle, '');
        disableInput(userIDEle, false);
        tsignaling.logout();
    });
    inviteBtnEle.addEventListener('click', function() {
        remoteUserID = remoteUserIDEle.value.trim();
        signalData = signalDataEle.value.trim();
        if (!isLoginSuccess) {
            alert('请先登录');
            return;
        }
        if (!remoteUserID) {
            alert('无效远端 userID');
            return;
        }
        if (!signalData) {
            alert('无效信令消息内容');
            return;
        }
        tsignaling.invite({
            userID: remoteUserID,
            data: JSON.stringify({content: signalData, version: '1.0'}),
            timeout: 30
        }).then(function(res) {
            console.log('demo invite OK', res);
        }).catch(function(error) {
            console.log('demo invite failed', error.code, error.message);
        });
    });

    document.addEventListener('click', function(e){
        var acceptBtnEle = e.target.closest('.accept-btn');
        var rejectBtnEle = e.target.closest('.reject-btn');
        if (acceptBtnEle) {
            var receiveItemEle = acceptBtnEle.closest('.receive-item');
            if (receiveItemEle && receiveItemEle.dataset && receiveItemEle.dataset.inviteid) {
                var inviteID = receiveItemEle.dataset.inviteid;
                tsignaling.accept({
                    inviteID: inviteID
                }).then(function(res) {
                    console.log('demo accept OK', res);
                }).catch(function(error) {
                    console.log('demo accept failed', error.code, error.message);
                    if (error.code === 8010) {
                        alert('请求已处理，请勿重复接受');
                    }
                });
            }
        }
        if (rejectBtnEle) {
            var receiveItemEle = rejectBtnEle.closest('.receive-item');
            if (receiveItemEle && receiveItemEle.dataset && receiveItemEle.dataset.inviteid) {
                var inviteID = receiveItemEle.dataset.inviteid;
                tsignaling.reject({
                    inviteID: inviteID
                }).then(function(res) {
                    console.log('demo reject OK', res);
                }).catch(function(error) {
                    console.log('demo reject failed', error.code, error.message);
                    if (error.code === 8010) {
                        alert('请求已处理，请勿重复拒绝');
                    }
                });
            }
        }
    });
}

function bindTsignalEvent() {
    tsignaling.on(TSignaling.EVENT.NEW_INVITATION_RECEIVED, function (event) {
        console.log('demo | onNewInvitationReceived', `inviteID:${event.data.inviteID} inviter:${event.data.inviter} inviteeList:${event.data.inviteeList} data:${event.data.data}`);
        var displayText;
        if (event.data.groupID) {
            // 群组邀请
        } else {
            // 1 v 1 邀请
            var content = '';
            try {
                var remoteData = JSON.parse(event.data.data);
                content = remoteData.content;
            } catch (e) {
            }
            displayText = '收到远端: ' + event.data.inviter + ' 的邀请, 邀请 ID: ' + event.data.inviteID + ' 邀请内容: ' + content;
        }
        appendReceiveItem(event.data.inviteID, displayText, true);
    });

    tsignaling.on(TSignaling.EVENT.INVITEE_ACCEPTED, function (event) {
        console.log('demo | onInviteeAccepted', `inviteID:${event.data.inviteID} invitee:${event.data.invitee} data:${event.data.data}`);
        var displayText = '远端: ' + event.data.invitee + ' 接受邀请, 邀请 ID: ' + event.data.inviteID;
        appendReceiveItem(event.data.inviteID, displayText, false);
    });

    tsignaling.on(TSignaling.EVENT.INVITEE_REJECTED, function (event) {
        console.log('demo | onInviteeRejected', `inviteID:${event.data.inviteID} invitee:${event.data.invitee} data:${event.data.data}`);
        var displayText = '远端: ' + event.data.invitee + ' 拒绝邀请, 邀请 ID: ' + event.data.inviteID;
        appendReceiveItem(event.data.inviteID, displayText, false);
    });

    tsignaling.on(TSignaling.EVENT.INVITATION_TIMEOUT, function (event) {
        console.log('demo | onInvitationTimeout', `inviteID:${event.data.inviteID} inviteeList:${event.data.inviteeList} isSelfTimeout:${event.data.isSelfTimeout}`);
        var displayText = '邀请超时, 邀请 ID: ' + event.data.inviteID;
        appendReceiveItem(event.data.inviteID, displayText, false);
    });

    tsignaling.on(TSignaling.EVENT.SDK_READY, function() {
        isSDKReady = true;
    });
}

function main() {
    init();
    bindBtnClickEvent();
    bindTsignalEvent();
}

document.addEventListener('DOMContentLoaded', function(event) {
    main();
});