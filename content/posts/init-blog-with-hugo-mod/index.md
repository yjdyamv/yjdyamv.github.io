+++
date = '2026-04-05T21:27:49+08:00'
draft = false
title = 'Init Blog With Hugo Mod'
+++

近来我的博客迁移到了[hugo](https://gohugo.io)框架下，并使用[blowfish](https://blowfish.page)作为主题，以下是我探索的过程。

1. 创建站点

    ```bash
    hugo new site mywebsite
    ```

2. 使用主题（共有三种方法）
    - git submodule：

        ```bash
        git init
        git submodule add -b main https://github.com/nunocoracao/blowfish.git themes/blowfish
        ```

        并解注释（或手动添加）`config/_default/hugo.toml`里的`theme = blowfish`

    - hugo mod（使用go 下载包）

        ```bash
        # If you're managing your project on GitHub
        hugo mod init github.com/<username>/<repo-name>

        # If you're managing your project locally
        hugo mod init my-project
        ```

        并编辑`config/_default/module.toml`

        ```bash
        [[imports]]
        disable = false
        path = "github.com/nunocoracao/blowfish/v2"
        ```

        随后`hugo server`就可以自动下载包了

    - 手动复制主题到对应文件夹下

## hugo mod的好处

由于国内网络不太好，使用`git submodule update --init --recursive`比较吃亏。另外由于`go mod`国内有源可以换，所以更快？（存疑）
