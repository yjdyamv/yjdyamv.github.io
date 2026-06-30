+++
title = "Clangd Cmake Compile Commands Msvc Problem"
date = 2026-06-30T22:31:41+08:00
lastmod = 2026-06-30T22:31:41+08:00
draft = true

# SEO优化
description = ""
keywords = ["clangd","cmake","msvc"]
summary = "对于cmake生成的compile_commands.json对于没有加载vs环境变量的clangd无法对msvc项目提供正确的高亮，并给出了解决的方案"

# 分类和标签
tags = []
categories = []

# # 文章特色图（可选）
# featuredImage = "/images/featured-image.jpg"
# featuredImagePreview = "/images/featured-image-preview.jpg"

# # 作者信息（可选，会覆盖全局配置）
# author = "作者名"
# authorImage = "/images/author.jpg"

# # 社交分享图（可选）
# images = ["/images/social-share.jpg"]

# # 文章系列（可选）
# series = ["系列名称"]
# series_weight = 1

# # 隐藏文章（可选）
# hiddenFromHomePage = false
# hiddenFromSearch = false
+++

<!-- 文章内容从这里开始 -->

cmake生成的compile_commands.json的详细程度远不如xmake生成的（目前仅对比了msvc时）。

cmake生成的compile_commands.json里含有宏并依赖INCLUDE、LIB等环境变量，因此clangd在没有加载vs的环境变量时，高亮是错误的。而xmake生成的直接把vs环境变量加入了编译命令，因此clangd直接找到了对应的头文件，高亮正常。

解决方案：从Develop Powershell for VS里启动VS（其中一种方案）

我的选择是将加载vs环境变量的脚本启动写入pwsh的$profile里，这样就无需专门打开那个终端了

```pwsh
# ====================================================
# 自动加载 Visual Studio 环境变量
# ====================================================

function Invoke-Environment {
    param(
        [Parameter(Mandatory=$true)]
        [string] $Command
    )
    # 让 cmd 执行命令，捕获所有环境变量并应用到当前会话
    cmd /c "$Command > nul 2>&1 && set" | .{process{
        if ($_ -match '^([^=]+)=(.*)') {
            [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2])
        }
    }}
    if ($LASTEXITCODE) {
        throw "Command '$Command' failed with exit code: $LASTEXITCODE"
    }
}

# --- 自动查找并加载最新版 Visual Studio ---
# 1. 定义 vswhere.exe 的固定绝对路径（64位系统）
$vswhere = "${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe"

# 2. 如果上述路径不存在，尝试 32 位系统的路径
if (-not (Test-Path $vswhere)) {
    $vswhere = "${env:ProgramFiles}\Microsoft Visual Studio\Installer\vswhere.exe"
}

# 3. 如果找到了 vswhere，用它查询最新 VS 的安装路径
if (Test-Path $vswhere) {
    $vsPath = & $vswhere -latest -property installationPath
    if ($vsPath) {
        $vsDevCmd = Join-Path $vsPath "Common7\Tools\VsDevCmd.bat"
        if (Test-Path $vsDevCmd) {
            Write-Host "找到 Visual Studio: $vsPath" -ForegroundColor Green
            # 加载环境变量（默认加载 x64 架构，可自行修改）
            Invoke-Environment "call `"$vsDevCmd`" -arch=amd64 -host_arch=amd64"
            Write-Host "Visual Studio 环境变量已加载。" -ForegroundColor Green
        } else {
            Write-Warning "未找到 VsDevCmd.bat，路径: $vsDevCmd"
        }
    } else {
        Write-Warning "vswhere 未找到任何 Visual Studio 安装。"
    }
} else {
    Write-Warning "未找到 vswhere.exe，请确认 Visual Studio 已正确安装。"
}
```

另外的，我还对vscode新建内置终端添加了VS Dev Terminal的配置以自动加载vs环境变量，这样就类似Develop Powershell for VS了

```jsonc
"terminal.integrated.profiles.windows": {
    // 默认x64
    "VS Dev Terminal": {
      "source": "PowerShell",
      "icon": "terminal-powershell",
      "args": [
        "-NoExit",
        "-Command",
        "& { $vs = & 'C:\\Program Files (x86)\\Microsoft Visual Studio\\Installer\\vswhere.exe' -latest -products * -requires Microsoft.Component.MSBuild -property installationPath; Import-Module (Join-Path $vs 'Common7\\Tools\\Microsoft.VisualStudio.DevShell.dll'); Enter-VsDevShell -VsInstallPath $vs -DevCmdArguments '-arch=x64 -host_arch=x64' }"
      ],
    }
  },
```
