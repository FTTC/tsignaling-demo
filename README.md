# 腾讯云信令管理示例 Demo
这个 Demo 注意展示如何集成使用[腾讯云信令 SDK](https://cloud.tencent.com/document/product/269/86893) 。

主要展示信令管理管理的基本功能，包含以下部分

- 登录和登出 [login](https://web.sdk.qcloud.com/component/tsignaling/doc/zh-cn/TSignaling.html#login) 、[logout](https://web.sdk.qcloud.com/component/tsignaling/doc/zh-cn/TSignaling.html#logout)
- 加入退出群组 [joinGroup](https://web.sdk.qcloud.com/component/tsignaling/doc/zh-cn/TSignaling.html#joinGroup) 、 [quitGroup](https://web.sdk.qcloud.com/component/tsignaling/doc/zh-cn/TSignaling.html#quitGroup)
- 发送邀请、取消邀请、接受对方邀请和拒绝对方邀请 [invite](https://web.sdk.qcloud.com/component/tsignaling/doc/zh-cn/TSignaling.html#invite) 、[cancel](https://web.sdk.qcloud.com/component/tsignaling/doc/zh-cn/TSignaling.html#cancel) 、[accept](https://web.sdk.qcloud.com/component/tsignaling/doc/zh-cn/TSignaling.html#accept) 和 [reject](https://web.sdk.qcloud.com/component/tsignaling/doc/zh-cn/TSignaling.html#reject)
- 订阅对端发起邀请、对端取消邀请、对端接受邀请、对端拒绝邀请和对端邀请超时事件 [NEW_INVITATION_RECEIVED](https://web.sdk.qcloud.com/component/tsignaling/doc/zh-cn/module-EVENT.html#.NEW_INVITATION_RECEIVED)、 [INVITATION_CANCELLED](https://web.sdk.qcloud.com/component/tsignaling/doc/zh-cn/module-EVENT.html#.INVITATION_CANCELLED) 、 [INVITEE_ACCEPTED](https://web.sdk.qcloud.com/component/tsignaling/doc/zh-cn/module-EVENT.html#.INVITEE_ACCEPTED)) 、 [INVITEE_REJECTED](https://web.sdk.qcloud.com/component/tsignaling/doc/zh-cn/module-EVENT.html#.INVITEE_REJECTED)) 和 [INVITATION_TIMEOUT](https://web.sdk.qcloud.com/component/tsignaling/doc/zh-cn/module-EVENT.html#.INVITATION_TIMEOUT)

## 环境准备

- nodejs
- Web 浏览器

## 运行示例
1. 打开 js/index.js 填入 SDKAppID 以及 SECRETKEY

您必须拥有正确的 SDKAppID，才能进行初始化。
SDKAppID 是腾讯云 IM 服务区分客户帐号的唯一标识。我们建议每一个独立的 App 都申请一个新的 SDKAppID。不同 SDKAppID 之间的消息是天然隔离的，不能互通。
您可以在 [即时通信 IM 控制台](https://console.cloud.tencent.com/im) 查看所有的 SDKAppID，单击 **创建新应用** ，可以创建新的 SDKAppID。

![](https://qcloudimg.tencent-cloud.cn/raw/4d140a9e0dc831a7e78fee8efa870d52.png)

获取密钥 SECRETKEY, 可参考[官网步骤](https://cloud.tencent.com/document/product/269/32688#.E8.8E.B7.E5.8F.96.E5.AF.86.E9.92.A5)
![](https://qcloudimg.tencent-cloud.cn/raw/fcd2bcbaa99e17543ea725a258910b8e.png)

2. 浏览器两个 tab 分别打开 index.html 文件, 模拟两个独立用户 userA 和 userB, 分别进行登录
   ![](https://qcloudimg.tencent-cloud.cn/raw/ef392f008742d97675a46cde6a476f71.png)

3. 模拟 userA 向 userB 发送信令邀请
   ![](https://qcloudimg.tencent-cloud.cn/raw/aa3b3976087ff92c4ccfec368bd28779.png)

4. userB 接受 userA 发送的信令邀请
   ![](https://qcloudimg.tencent-cloud.cn/raw/66cc13b8ee69cca0092a3d9f34548a13.png)

5. userB 拒绝 userA 发送的信令邀请
   ![](https://qcloudimg.tencent-cloud.cn/raw/9be2b9a4e2ba1c0e1c85e92aceeecf33.png)

6. userB 不处理 userA 发送的信令邀请, userA 和 userB 分别收到信令超时
   ![](https://qcloudimg.tencent-cloud.cn/raw/c4623326da3ae64cf0c939da95ec173a.png)