---
title: Powershell-config
published: 2025-11-08
description: ''
image: ''
tags: []
category: ''
draft: false 
lang: 'zh-CN'
---

对于Win上的powershell有关配置值得说明一下

- 现在推荐使用微软维护的最新版[Powershell](https://github.com/PowerShell/PowerShell/releases/)。win自带的powershell是个老旧版本。也可使用`winget`下载 `winget install Microsoft.PowerShell`。
- 且终端推荐使用[WindowsTerminal](https://github.com/microsoft/terminal/)
- 使用[ohmyposh](https://ohmyposh.dev/) 安装 
```pwsh
winget install JanDeDobbeleer.OhMyPosh --source winget
# 没有winget 就手动下载
# Set-ExecutionPolicy Bypass -Scope Process -Force; Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://ohmyposh.dev/install.ps1'))
```
- 设置powershell的配置文件
```
# 记录当前位置
Push-Location
# 切换到目标目录并执行脚本(使得MSVC的编译器链接器能在终端里使用)
Set-Location "C:\Program Files\Microsoft Visual Studio\2022\Enterprise\Common7\Tools\"
.\Launch-VsDevShell.ps1
# 返回到原来的路径
Pop-Location

# ohmyposh 以某一主题启动
oh-my-posh init pwsh --config "powerlevel10k_classic" | Invoke-Expression
```
- 设置Powershell的终端字体，比如为Maple Momo CN NF，并将Windows Terminal的默认终端设置为之前下载的pwsh

