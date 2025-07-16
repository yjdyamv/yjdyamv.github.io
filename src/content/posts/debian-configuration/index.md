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

~~有时简直想告诉读者，快点使用搜索引擎吧，这不比我的破教程香~~

## 换源

[换源](https://mirrors.ustc.edu.cn/help/debian.html)
记得将代号换为你想要的版本代号，这里使用`trixie`

`/etc/apt/sources.list`
```
# 默认注释了源码仓库，如有需要可自行取消注释
deb http://mirrors.ustc.edu.cn/debian trixie main contrib non-free non-free-firmware
# deb-src http://mirrors.ustc.edu.cn/debian trixie main contrib non-free non-free-firmware
deb http://mirrors.ustc.edu.cn/debian trixie-updates main contrib non-free non-free-firmware
# deb-src http://mirrors.ustc.edu.cn/debian trixie-updates main contrib non-free non-free-firmware
# backports 软件源，请按需启用
deb http://mirrors.ustc.edu.cn/debian trixie-backports main contrib non-free non-free-firmware
# deb-src http://mirrors.ustc.edu.cn/debian trixie-backports main contrib non-free non-free-firmware
```

`/etc/apt/sources.list.d/debian.sources`
```
Types: deb
URIs: http://mirrors.ustc.edu.cn/debian
Suites: trixie trixie-updates
Components: main contrib non-free non-free-firmware
Signed-By: /usr/share/keyrings/debian-archive-keyring.gpg

Types: deb
URIs: http://mirrors.ustc.edu.cn/debian-security
Suites: trixie-security
Components: main contrib non-free non-free-firmware
Signed-By: /usr/share/keyrings/debian-archive-keyring.gpg
```

:::note
`sudo apt update && sudo apt upgrade`升级包
:::

:::note
1. 换源至测试版
2. 最小更新`sudo apt upgrade --without-new-pkgs`
3. 全面更新`sudo apt full-upgrade`
4. 重启，`sudo apt update && sudo apt upgrade`
:::

## 常用下载

`sudo apt install wget curl vim htop tldr`

下载[snipaste截图工具](https://zh.snipaste.com/)

## 输入法

`sudo apt install fcitx5 fcitx5-chinese-addons`

环境设置,在位置`/etc/environment`输入以下内容
```
GTK_IM_MODULE=fcitx
QT_IM_MODULE=fcitx
XMODIFIERS=@im=fcitx
SDL_IM_MODULE=fcitx
GLFW_IM_MODULE=fcitx
```

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
    - 安装zsh主题[powerlevel10k](https://github.com/romkatv/powerlevel10k)
    ```bash
    git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
    ```
    - 安装插件zsh-autosuggestions和zsh-syntax-highlighting
    ```bash
    git clone https://github.com/zsh-users/zsh-autosuggestions.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
    git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
    ```

在~/.zshrc里将plugins项改为如下
```
plugins=(git zsh-autosuggestions zsh-syntax-highlighting z extract web-search)
```


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
- nodejs:
    - `sudo apt install nodejs npm`
    - 使用[官方脚本](https://nodejs.org/zh-cn/download)
    - 使用[`volta`](https://volta.sh/)：`curl https://get.volta.sh | zsh` 然后`volta install node` 还挺方便的。
        - 后 `npm i -g pnpm`

## git global

### ssh密钥

我保存在bitwarden里了哈。直接复制到`~/.ssh/id_25519`和`~/.ssh/id_25519.pub`就行。

:::note
提一嘴哈，也可以使用`ssh-keygen`命令。默认使用ed25519算法，以前默认使用rsa算法。ed25519的好处是公钥短，计算快，强度也不低，大致相当于rsa3072位的强度，并且大多的git仓库服务基本都支持此算法，如[github](https://github.com)、[gitea](https://gitea.com)、[gitlab](https://gitlab.com)等。如果想换用rsaa算法可以使用此命令`ssh-keygen -t rsa`加上`-b 4096`可以指定4096位数，ed25519就不用指定位数了。
:::


### username & email

```bash
git config --global user.name "your-username"
git config --global user.email "your-email-address"
```

### 代理

这段之后再写,haha

## 感谢

感谢[ustc源的帮助文档](https://github.com/ustclug/mirrorhelp)，此文档以CC BY-NC-SA 4.0开源，作者为[ustclug](https://github.com/ustclug)

感谢[ustc mirror](https://mirrors.ustc.edu.cn/)和[nju mirror](https://mirror.nju.edu.cn/)对于中国开源社区的贡献。

感谢LCPU的公开课程——[LCPU_Getting_Started](https://github.com/lcpu-club/getting-started),此课程对我帮助很大，使我受益良多。

