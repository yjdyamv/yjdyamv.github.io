---
title: privacy-protect
published: 2025-07-21
description: ''
image: ''
tags: ['casual']
category: 'privacy'
draft: false 
lang: 'zh-CN'
---

# 隐私保护与网络安全

隐私泄露一直以来都是个大问题，有些甚至是我们所不能防止的。但我们还可以做些预防措施来降低信息泄露的概率。

微信中的`允许陌生人查看十条朋友圈`和支付宝中的`向好友公开我的真实姓名`是默认开启的，强烈建议关闭，尤其在这两个账号都可以被手机号搜索到的情况下。（当然也可以在`添加我的方式`中把手机号等途径取消掉）。还有取消qq的手机号添加好友，并将QQ空间设为仅好友可查看。

密码使用强密码，并开启2FA，能用密钥登陆就用密钥登陆（说人话：使用密码管理器，推荐bitwarden，2FA推荐Ente Auth）。不同账户使用不同的用户名，防止账户信息收集被关联起来。注意在公开社群不要发出个人敏感信息。密码管理器记得也要开2FA哦。

防止钓鱼，识别域名真伪，包括网址与电子邮件。

使用代理（Proxy）。代理是流量的中转，可以隐藏使用者的ip地址，也可以隐藏服务器的ip。值得一提的是VPN（Virtual Private Network），通过一个集群服务器进行流量的跳转，一般认为5次跳转后就无法追踪源ip了。虽然使用了加密协议，但由于中间者的存在，依旧有着隐私泄露的风险。tor网络也值得一提，详情可见[wiki](https://zh.wikipedia.org/wiki/Tor)。

:::note
介绍一下2FA,常见的是使用短信验证码验证，但存在风险（日常下比较安全）。还有电子邮件验证码等。另一种是TTOP（Time-based One-Time Passwords）使用密钥加上时间再hash得到一串字符作为密码（常见的是6位数字）。以及安全密钥验证等。
:::

## 致谢

感谢[LCPU Getting Started 第八节](https://missing.lcpu.dev/basic/08-drive-your-computer-4)的内容做参考。