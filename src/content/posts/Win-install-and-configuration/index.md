---
title: Win-install-and-configuration
published: 2025-08-01
description: ''
image: './win11.jpg'
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

到选择系统语言的界面后，shift + F10打开命令界面，使用以下命令断网安装（第一个不行就换第二个）

```
# 第一个
oobe\bypassnro
# 第二个
start ms-cxh:localonly
```

**再不行就网络换成飞行模式**

随后可能会经历多次重启，直到安装完成。

:::note
激活win：[HEU_KMS_Activator](https://github.com/zbezj/HEU_KMS_Activator/releases)

解压缩用[7zip](https://7-zip.org)吧（不知道为啥win11的文件管理器解压不了rar文件 你还能有微软聪明.jpg）

**记得关闭windows安全中心**
:::

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

## 常用软件下载

- 截图贴图工具：[snipaste](https://zh.snipaste.com/) 
- 局域网文件传输：[localsend](https://localsend.org/) 有些玩意比较私密，不想走微信
- 火绒：[官网](https://www.huorong.cn/) ~~作用是关闭`windows defender`~~
- 文本编辑器：[vscode](https://code.visualstudio.com/) 一个code写天下

_有时候那些下载的破解软件的补丁软件可能会被windows defender删去，关闭它，防止它乱删软件_

## 编程环境

### python

哦，对了对于python请安装[miniforge](https://mirrors.nju.edu.cn/github-release/conda-forge/miniforge/),并用`conda init powershell`来初始化，换源参考[debian-configuration](https://blog.yamv.uk/posts/debian-configuration/)

### c/c++

#### MSVC
安装[vs](https://visualstudio.microsoft.com/zh-hans/)，安装勾选`c/c++开发`即可下载`MSVC`。

:::note
我也不想下载MSVC，但rust在win上默认依赖MSVC。~~毕竟是win的地盘~~
:::

#### MSYS2

先等等，之后再写。

## 尾声

windows相比于linux的环境配置还是麻烦些的，在win上奇妙小问题可能很多，不过却是最常见的系统，拥有最广泛的支持。

