---
title: debian-configuration
published: 2025-07-11
description: '配置debian环境'
image: './11-bullseye-wiki-banner-04.png'
tags: [configuration, debian]
category: 'Programming'
draft: false
lang: 'zh-CN'
---

# 我的debian环境+KDE的配置

debian是一个自由操作系统，又被称做Debian GNU/linux，官网是[这个](https://debian.org)。本贴持续更新哈。

## 换源

[换源](https://mirrors.ustc.edu.cn/help/debian.html)
记得将代号换为`trixie`

:::note
`sudo apt update && sudo apt upgrade`升级包
:::

## 常用下载

`sudo apt install wget curl vim`

## flatpak

- 安装：
    - `sudo apt install flatpak`
    - `sudo apt install plasma-discover-backend-flatpak`
    - `flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo`
- 换源：`sudo flatpak remote-modify flathub --url=https://mirrors.ustc.edu.cn/flathub`

:::note
下载firefox，`flatpak install flathub org.mozilla.firefox`
下载matrix客户端，`flatpak install flathub im.fluffychat.Fluffychat`
:::

## 终端美化

- zsh+oh-my-zsh
    - zsh: `sudo apt install zsh`
    - oh-my-zsh: [download](https://ohmyz.sh/#install)

## 开发环境

download [vscode](https://code.visualstudio.com/) or [codium](https://mirror.nju.edu.cn/download/VS%20Codium)

download code extension: clangd, ms-python, pylance, xmake，rust-analyzer，remote-ssh(code)/open remote-ssh(codium)



- c/cpp: `sudo apt install build-essential`
    - xmake: [download](https://xmake.io/guide/quick-start.html)
- python: [miniforge](https://conda-forge.org/) 使用conda
    - 下载并安装[miniforge](https://mirrors.nju.edu.cn/github-release/conda-forge/miniforge/)
    - `~/miniforge3/bin/conda init zsh`
    - conda换源：
    `conda config --set show_channel_urls yes`来生成`.condarc`,其内容修改为如下。
    ```
    channels:
        - defaults
    show_channel_urls: true
    default_channels:
        - https://mirrors.ustc.edu.cn/anaconda/pkgs/main
        - https://mirrors.ustc.edu.cn/anaconda/pkgs/r
        - https://mirrors.ustc.edu.cn/anaconda/pkgs/msys2
    custom_channels:
        conda-forge: https://mirrors.ustc.edu.cn/anaconda/cloud
        bioconda: https://mirrors.ustc.edu.cn/anaconda/cloud
    ```
    - pypi换源：
    ``` # 使用ustc镜像站来升级 pip
    pip install -i https://mirrors.ustc.edu.cn/pypi/simple pip -U
    pip config set global.index-url https://mirrors.ustc.edu.cn/pypi/simple
    ```
- rust: 
    1. `export RUSTUP_DIST_SERVER=https://mirrors.ustc.edu.cn/rust-static` 
    2. `export RUSTUP_UPDATE_ROOT=https://mirrors.ustc.edu.cn/rust-static/rustup`
    3. download [rustup-install.sh](https://mirrors.ustc.edu.cn/misc/rustup-install.sh)
    4. 把脚本中的 `RUSTUP_UPDATE_ROOT` 变量改为 `https://mirrors.ustc.edu.cn/rust-static/rustup`
    5. 运行rustup-install.sh: `zsh ./rustup-install.sh`

## 感谢

感谢[ustc源的帮助文档](https://github.com/ustclug/mirrorhelp)，此文档以CC BY-NC-SA 4.0开源，作者为[ustclug](https://github.com/ustclug)

感谢[ustc mirror](https://mirrors.ustc.edu.cn/)和[nju mirror](https://mirror.nju.edu.cn/)对于中国开源社区的贡献。

感谢LCPU的公开课程——[LCPU_Getting_Started](https://github.com/lcpu-club/getting-started),此课程对我帮助很大，使我受益良多。

