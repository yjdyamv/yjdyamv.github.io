---
title: Docker-install-and-config
published: 2025-08-20
description: 'Docker的安装与配置'
image: './docker.jpg'
tags: ['docker','configuration']
category: 'Programming'
draft: false 
lang: 'zh-CN'
---

# Docker的安装与配置

## 安装

```bash
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

## 去掉sudo权限

- 添加用户到docker组

```bash
sudo gpasswd -a ${USER} docker 
```

- 增加读写权限

```bash
sudo chmod a+rw /var/run/docker.sock
```

- 重启docker

```bash
sudo systemctl restart docker
```

## 配置代理

docker已经安装好了

[https://docs.docker.com/engine/daemon/proxy/#environment-variables](https://docs.docker.com/engine/daemon/proxy/#environment-variables)

编辑`/etc/systemd/system/docker.service.d/http-proxy.conf`和`~/.config/systemd/user/docker.service.d/http-proxy.conf`文件

```bash
sudo mkdir -p /etc/systemd/system/docker.service.d
touch /etc/systemd/system/docker.service.d/http-proxy.conf
mkdir -p ~/.config/systemd/user/docker.service.d
touch ~/.config/systemd/user/docker.service.d/http-proxy.conf
```

并往这些文件中输入以下相同的内容

```
# ~/.config/systemd/user/docker.service.d/http-proxy.conf
[Service]

Environment="HTTP_PROXY=http://127.0.0.1:7897"

Environment="HTTPS_PROXY=http://127.0.0.1:7897"

Environment="NO_PROXY=localhost,127.0.0.1"

```

```
# /etc/systemd/system/docker.service.d/http-proxy.conf
[Service]

Environment="HTTP_PROXY=http://127.0.0.1:7897"

Environment="HTTPS_PROXY=http://127.0.0.1:7897"

Environment="NO_PROXY=localhost,127.0.0.1"
```

## 致谢

本文整合了docker文档与知乎的一个文章

- 安装：[https://docs.docker.com/engine/install/debian/](https://docs.docker.com/engine/install/debian/)
- 去sudo权限：[https://zhuanlan.zhihu.com/p/484171630](https://zhuanlan.zhihu.com/p/484171630)
- 配置代理：[https://docs.docker.com/engine/daemon/proxy/#environment-variables](https://docs.docker.com/engine/daemon/proxy/#environment-variables)

感谢Linux do 社区佬友们的帮助！！！
