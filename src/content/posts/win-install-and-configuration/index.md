---
title: win-install-and-configuration
published: 2025-08-01
description: ''
image: ''
tags: ['win', 'configuration']
category: 'Programming'
draft: false
lang: 'zh-CN'
---

# windows安装及配置

咳咳，为了方便我配置win上的环境与重装系统。故此写这篇博客。

## win重装系统

准备U盘，用[Ventoy](https://www.ventoy.net/en/index.html)制作成可启动U盘

**下载纯净的操作系统iso**: 去[微软官网](https://www.microsoft.com/zh-cn/software-download)下载（推荐）/[MSDN](https://next.itellyou.cn/)下载。并将iso文件放入U盘。（对于Debian的安装也差不多，将iso放入U盘即可）**少用第三方魔改的系统**

以防万一，准备PE系统（[优启通](https://www.itsk.com/)、[微pe](https://www.wepe.com.cn/)）的iso文件，放入U盘。这里放一个我的[分享下载链接](https://www.123865.com/s/9t1Evd-sy9V?pwd=hAkO#)提取码:hAkO。

重启电脑，不断按下你电脑的bios键，选择使用U盘启动，进入ventoy启动界面即可看到你U盘内的iso文件，点击win的iso，“normal boot”。

到联网界面后，shift + F10打开命令界面，断网安装

```
OOBE\BYPASSNRO
```



随后可能会经历多次重启，直到安装完成。

## 环境配置

在win上配置环境是件不太优雅的事情，若是有包管理器多好。嘿嘿，还真有，scoop

**注意以下的命令最好在管理员的powershell下进行，虽然不一定要**

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

```powershell
# 1. 设置 Scoop 的安装目录环境变量
$env:SCOOP='D:\Apps\Scoop'
# 2. 将这个环境变量永久写入用户配置 (下次打开 PowerShell 依然有效)
[Environment]::SetEnvironmentVariable('SCOOP', $env:SCOOP, 'User')
# 3. (可选) 设置全局安装路径 (如果需要全局安装软件)
$env:SCOOP_GLOBAL='D:\GlobalApps'
[Environment]::SetEnvironmentVariable('SCOOP_GLOBAL', $env:SCOOP_GLOBAL, 'Machine') # Machine 级别需要管理员权限
```

安装scoop

```powershell
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
```

```powershell
scoop install git
# 哈哈，scoop 依赖git管理bucket，得先安装这个
```

**需要使用代理**

```powershell
# setup-my-env.ps1
# 添加需要的 Buckets
scoop bucket add extras
scoop bucket add java
scoop bucket add nerd-fonts

# 安装常用工具
scoop install git python nodejs openjdk maven vscode 7zip everything powertoys curl wget grep sed bandizip # ... 添加你需要的其他软件

# 清理旧版本
scoop cleanup *

Write-Host "环境配置完成！"
```

**参考了此篇[帖子](https://linux.do/t/topic/566873/1)。**

哦，对了对于python请安装[miniforge](https://mirrors.nju.edu.cn/github-release/conda-forge/miniforge/),并用`conda init powershell`来初始化，换源参考[debian-configuration](https://blog.yamv.uk/posts/debian-configuration/)

