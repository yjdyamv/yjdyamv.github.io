+++
date = '2026-04-02T12:32:33+08:00'
draft = false
title = 'uv for Python develop'
tags = ['uv', 'python', 'astral']
+++

uv的使用，官方文档：[https://docs.astral.sh/uv/](https://docs.astral.sh/uv/)

## uv 下载

- Windows：
  `winget install astral-sh.uv`
- 类Unix：
  `curl -LsSf https://astral.sh/uv/install.sh | sh`

版本更新：`uv self update`

## uv使用

+ 创建工程
  - `uv init hello`：这会在当前目录下创建hello文件夹，里面有着示例文件与代码
  - `uv init --name hello`：这回在当前目录下建立hello工程
+ 项目依赖管理
  - `uv venv`创建虚拟环境
  - `uv python pin 3.12`固定python版本
  - `uv pip install numpy`下载包到虚拟环境中，但不会计入`uv.lock`
  - `uv add numpy`下载包到虚拟环境，并计入`uv.lock`锁定
+ 项目运行
  - `uv sync`即可恢复一个uv工程的环境
  - `uv run main.py`使用当前的项目环境运行main.py

## 其他注意

> [!tip]
> uv的pypi换源：
>
> - Windows：在 `%AppData%\uv\uv.toml` 或者 `%ProgramData%\uv\uv.toml`
> - 类Unix：在 `~/.config/uv/uv.toml` 或者 `/etc/uv/uv.toml`
>
> ```toml
> [[index]]
> url = "https://mirrors.ustc.edu.cn/pypi/web/simple/"
> default = true
> ```
