---
title: Cmake-some-caution
published: 2025-10-07
description: ''
image: ''
tags: []
category: ''
draft: false 
lang: 'zh-CN'
---

# 一些cmake值得注意的点

- 使用`cmake --build .`而非`make`
- 尽量使用包的文档推荐的方式安装，减少手动用cmake编译的次数，因为cmake本身不具备包管理的能力，所以可能会污染环境，使用包管理（apt、vcpkg等）或者更现代的工具xmake
