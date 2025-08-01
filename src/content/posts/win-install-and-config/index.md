---
title: win-install-and-config
published: 2025-08-01
description: ''
image: ''
tags: []
category: ''
draft: true
lang: 'zh-CN'
---

# windows安装及配置

咳咳，为了方便我配置win上的环境与重装系统。故此写这篇博客。

## win重装系统

准备U盘，用[Ventoy](https://www.ventoy.net/en/index.html)制作成可启动U盘

**下载纯净的操作系统iso**: 去[微软官网](https://www.microsoft.com/zh-cn/software-download)下载（推荐）/[MSDN](https://next.itellyou.cn/)下载。并将iso文件放入U盘。（对于Debian的安装也差不多，将iso放入U盘即可）**少用第三方魔改的系统**

以防万一，准备PE系统（[优启通](https://www.itsk.com/)、[微pe](https://www.wepe.com.cn/)）的iso文件，放入U盘。

重启电脑，不断按下你a电脑的bios键，选择使用U盘启动，进入ventoy启动界面即可看到你U盘内的iso文件，点击win的iso，“normal boot”。

到联网界面后，shift + F10打开命令界面，断网安装

```
OOBE\BYPASSNRO
```

随后可能会经历多次重启，直到安装完成。



## 环境配置


