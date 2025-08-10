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

debian是一个自由操作系统，又被称做Debian GNU/linux，官网是[https://debian.org](https://debian.org)。本贴持续更新哈。

~~有时简直想告诉读者，快点使用搜索引擎吧，这不比我的破教程香~~

## 换源

[换源](https://help.mirrors.cernet.edu.cn/debian/)
记得将代号换为你想要的版本代号，这里使用`trixie`

传统格式
```
# /etc/apt/sources.list
# 默认注释了源码仓库，如有需要可自行取消注释
deb http://mirror.nju.edu.cn/debian/ trixie main contrib non-free non-free-firmware
# deb-src http://mirror.nju.edu.cn/debian/ trixie main contrib non-free non-free-firmware
deb http://mirror.nju.edu.cn/debian/ trixie-updates main contrib non-free non-free-firmware
# deb-src http://mirror.nju.edu.cn/debian/ trixie-updates main contrib non-free non-free-firmware
# backports 软件源，请按需启用
deb http://mirror.nju.edu.cn/debian/ trixie-backports main contrib non-free non-free-firmware
# deb-src http://mirror.nju.edu.cn/debian/ trixie-backports main contrib non-free non-free-firmware
```

`DEB882格式`：适用于debian12及以上
```
# /etc/apt/sources.list.d/debian.sources
Types: deb
URIs: http://mirror.nju.edu.cn/debian/
Suites: trixie trixie-updates
Components: main contrib non-free non-free-firmware
Signed-By: /usr/share/keyrings/debian-archive-keyring.gpg

Types: deb
URIs: http://mirror.nju.edu.cn/debian/-security
Suites: trixie-security
Components: main contrib non-free non-free-firmware
Signed-By: /usr/share/keyrings/debian-archive-keyring.gpg
```

:::note
换源后记得升级包哦

`sudo apt update && sudo apt upgrade`升级包
:::

:::note
**升级系统版本到测试版的方法**

1. 换源至测试版
2. 最小更新 `sudo apt upgrade --without-new-pkgs`
3. 重启（似乎需要）
4. 中等更新 `sudo apt upgrade`
5. 重启，进入x11桌面
6. 全面更新 `sudo apt full-upgrade`
7. 重启， `sudo apt update && sudo apt upgrade`
:::

## 常用下载

```bash
sudo apt install wget curl vim htop font-manager tlp tlp-rdw 
# tlp 电池优化
# ThinkPad 需要一些附加软件包。
# sudo apt install tp-smapi-dkms acpi-call-dkms
```

下载截图工具:[snipaste](https://zh.snipaste.com/)

## 输入法

`sudo apt install fcitx5 fcitx5-chinese-addons fcitx5-rime`

词库使用[雾凇拼音](https://github.com/iDvel/rime-ice)，下载仓库解压到`~/.local/share/fcitx5/rime`下，即可使用。

:::note 
**防止在vscode里用不了中文**

环境设置,在位置`/etc/environment`输入以下内容，参考了此[网址](https://fcitx-im.org/wiki/Using_Fcitx_5_on_Wayland#KDE_Plasma)
```
# /etc/environment
XMODIFIERS=@im=fcitx
GLFW_IM_MODULE=fcitx
```
:::

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
    `~/.zshrc`里`ZSH_THEME="..."`修改为：`ZSH_THEME="powerlevel10k/powerlevel10k"`
    - 安装插件zsh-autosuggestions和zsh-syntax-highlighting
    ```bash
    git clone https://github.com/zsh-users/zsh-autosuggestions.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
    git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
    ```

在`~/.zshrc`里将plugins项改为如下以启用扩展。`z`、`extract`、`web-search`均为内置插件。
```
plugins=(git zsh-autosuggestions zsh-syntax-highlighting z extract web-search)
```

- `extract`：`x asdf.tar.gz`可以方便解压，无需了解后缀。
- `z`：`z dir`即可到达曾经去过的dir文件夹下
- `web-search`：`bing zsh是什么`可在终端中直接搜索

## 开发环境

下载 [vscode](https://code.visualstudio.com/)

**不要添加vscode仓库**到`/etc/apt/sources.list.d/vscode.list`，国内网络用此仓库更新下载会很慢。

下载插件: clangd, ms-python, pylance, xmake，rust-analyzer，remote-ssh(code)/open remote-ssh(codium)等。

:::note
可以登陆github账户以同步`setting.json`及插件。
:::

- c/cpp: `sudo apt install build-essential clang cmake`
    - xmake: [download](https://xmake.io/guide/quick-start.html)
    :::note
    `xmake`在`trixie（debian13）`及以后可以直接`sudo apt install xmake`安装
    :::
- python: [miniforge](https://conda-forge.org/) 使用conda
    - 下载并安装[miniforge](https://mirrors.nju.edu.cn/github-release/conda-forge/miniforge/)
    - `~/miniforge3/bin/conda init zsh`
    - conda换源：
    `conda config --set show_channel_urls yes`来生成`.condarc`,其内容修改为如下。
    ```
    # ~/.condarc
    channels:
        - defaults
    show_channel_urls: true
    default_channels:
        - https://mirror.nju.edu.cn/anaconda/pkgs/main
        - https://mirror.nju.edu.cn/anaconda/pkgs/r
        - https://mirror.nju.edu.cn/anaconda/pkgs/msys2
    custom_channels:
        conda-forge: https://mirror.nju.edu.cn/anaconda/cloud
        pytorch: https://mirror.nju.edu.cn/anaconda/cloud
    ```
    - pypi换源：
    ```bash
    python -m pip install -i https://mirror.nju.edu.cn/pypi/web/simple --upgrade pip
    pip config set global.index-url https://mirror.nju.edu.cn/pypi/web/simple
    ```
- rust: 
    1. 将以下内容加入`.zshrc`，随后自行执行`source ~/.zshrc`
    ```bash
    export RUSTUP_DIST_SERVER=https://mirror.nju.edu.cn/rustup
    export RUSTUP_UPDATE_ROOT=https://mirror.nju.edu.cn/rustup/rustup
    ```
    2. download [rustup-install.sh](https://mirrors.ustc.edu.cn/misc/rustup-install.sh)
    3. 运行rustup-install.sh: `zsh ./rustup-install.sh`
- nodejs:
    三选一即可
    - `sudo apt install nodejs npm`
    - 使用[官方脚本](https://nodejs.org/zh-cn/download)
    - 使用[`volta`](https://volta.sh/)(推荐,速度快)：
        - 安装volta `curl https://get.volta.sh | bash` 
        - volta换源：修改`~/.volta/hooks.json`
        ```
        # ~/.volta/hooks.json
        {
            "node": {
                "index": {
                    "template": "https://mirror.nju.edu.cn/nodejs-release/index.json"
                },
                "distro": {
                    "template": "https://mirror.nju.edu.cn/nodejs-release/v{{version}}/{{filename}}"
                }
            }
        }
        ```
        - 安装node `volta install node` 
        - 安装pnpm `npm i --g pnpm`

## git global

### ssh密钥

我保存在bitwarden里了哈。直接复制到`~/.ssh/id_25519`和`~/.ssh/id_25519.pub`就行。

:::note
提一嘴哈，也可以使用`ssh-keygen -t ed25519`命令。ed25519的好处是公钥短，计算快，强度也不低，大致相当于rsa3072位的强度，并且大多的git仓库服务基本都支持此算法，如[github](https://github.com)、[gitea](https://gitea.com)、[gitlab](https://gitlab.com)等。如果想换用RSA算法可以使用此命令`ssh-keygen -t rsa`加上`-b 4096`可以指定4096位数，ed25519就不用指定位数了（其实也指定不了，因为定死了）。

ed25519算法在OpenSSH 6.5 时引入，在 9.5 时成为默认算法，此前RSA为默认算法。有些机器系统可能很老，OpenSSH版本低则可能不支持ed25519，这时就得用RSA密钥了。RSA可以调整密钥位数，ed25519不能。RSA已经有对应的量子算法破解（不过这得等待量子计算机建设的发展了，现在的量子计算机还没有多少量子比特）。RSA的好处是兼容性好、灵活性好，但安全性有所降低。
:::


### username & email

```bash
git config --global user.name "your-username"
git config --global user.email "your-email-address"
```

### 代理(ssh)

`sudo apt install corkscrew`

编辑此文件`~/.ssh/config`

```
Host github.com
    User git
    ProxyCommand corkscrew 127.0.0.1 7897 %h %p
```

此方式来自于[stackoverflow](https://stackoverflow.com)的一个[问答](https://stackoverflow.com/questions/19161960/connect-with-ssh-through-a-proxy)


## 服务器安全配置

:::important
公网上的环境并不太平，每时每刻都有着无数肉鸡使用脚本扫描机器公开的端口（如SSH、VNC、RDP等服务），试图获取机器的权限。SSH请务必开启密钥登陆关闭密码登陆，若是一定要用密码登陆则需使用强密码并设置`fail2ban`。
:::

## 感谢

感谢[ustc源的帮助文档](https://github.com/ustclug/mirrorhelp)，此文档以CC BY-NC-SA 4.0开源，作者为[ustclug](https://github.com/ustclug)

感谢[ustc mirror](https://mirrors.ustc.edu.cn/)、[nju mirror](https://mirror.nju.edu.cn/)及[校园网联合镜像站](https://help.mirrors.cernet.edu.cn/)对于中国开源社区的贡献。

感谢LCPU的公开课程——[LCPU_Getting_Started](https://github.com/lcpu-club/getting-started),此课程对我帮助很大，使我受益良多。

