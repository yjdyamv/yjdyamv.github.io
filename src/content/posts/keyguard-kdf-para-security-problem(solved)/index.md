---
title: keyguard-kdf-para-security-problem(solved)
published: 2026-03-04
description: ''
image: ''
tags: []
category: ''
draft: false 
lang: 'zh-CN'
---

keyguard是一个bitwarden的兼容客户端，旨在提供更好的使用体验。我在我的安卓手机上使用这个软件，但我也知道这个软件是由个人维护的，安全性肯定比不上bitwarden官方的客户端，心里有点防备。使用一段时间后，也陆陆续续在仓库里提了些issue（bug和feature request相关），对这个项目渐渐熟悉了。

对于bitwarden，相比于1password有一点不同的是，在近年来[引入了argon2id的kdf算法](https://bitwarden.com/help/kdf-algorithms/)，用户可以在bitwarden后台选择kdf算法及其参数，而1password只有pbkdf2，话不偏题了，继续说。在bw的文档里说kdf算法参数过高可能会等待较长时间乃至卡死。kdf（key derivative function）密钥派生函数是指对主密钥进行一系列运算得到一个很长很长的类似随机的字符串替代我们的主密码来加密密码库的函数。由于我们的主密码一般较短，熵值较低，无法满足加密需求，所以要派生出熵值大的密钥进行加密。恰巧，kdf还有个特点就是会消耗“大量资源”，参数越大，时间越长，这也一定程度上预防了攻击者获得加密vault后暴力破解的时间（比如一次kdf消耗100ms，那暴力破解就几乎不可能了）。

知道了这点，我就去我的bw后台调节了kdf算法为argon2id 参数试着拉高，来看看会不会出现文档里描述的情况。默认参数是内存64MB 3迭代 4并行度，拉到了128MB、144MB、196MB（移动端bw官方client解锁密码库开始有点卡了，等待时间在1秒这个量级）。因此我选用了144MB 6迭代 4并行的参数。然而我在使用keyguard客户端时解锁密码库根本不卡，猜到可能是keyguard的本地密码库的kdf选用的是个固定参数（比如pbkdf2 600000次迭代），而bw客户端的本地密码库的kdf参数是和bw后台设定一样的。

因此我就去keyguard代码里搜索`pbkdf2`或`argon2`，找到对应的代码片段看，这一看吓一跳选用了pbkdf2 迭代次数是`10 000`次。要知道OWASP建议的迭代次数是`600 000`次以上（bw和1p均选用了大于此迭代次数的参数）。选用参数次数参的来源是2018年的nist的一个建议（来自注释的链接）。10 000次相对于最新的OWASP的建议600 000次还是太低了，就萌生了给作者提这件事的想法。反复确认这件事是真的后，在项目里找到了`SECURITY.md`，按照里面的要求和作者发邮件后很快得到了"Thanks, will fix very soon"的回复。最终在当前的最新版本`2.4.1`修复，使用argon2id的64MB 3次迭代 4并行度的参数配置。

事件告一段落，也忍不住开始胡思乱想。nist是美国的部门，它这标准（[2018年版本](https://pages.nist.gov/800-63-3/sp800-63b.html#sec5)）不会是故意埋坑吧。又看了看nist 2025年版本的建议，关于这个pbkdf2迭代次数的建议的话已然消失不见。还是社区维护的OWASP好啊。

另1：argon2id虽是当前最好的选择，但参数里的内存占用标太大的话可能就会被系统kill掉导致卡死（比如256MB，在桌面端可能还行，但在移动端就不太行了），而pbkdf2几乎不会被kill。
另2：在bw后台更改kdf及其参数有风险，因为更改后会登出所有联网设备。
