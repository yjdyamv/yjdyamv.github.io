+++
title = "Smart Archive Vsc Ext"
date = 2026-05-06T17:53:20+08:00
lastmod = 2026-05-06T17:53:20+08:00
draft = true

# SEO优化
description = "文章描述，用于SEO和社交分享"
keywords = ["关键词1", "关键词2"]
summary = "文章摘要，显示在列表页"

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

Smart Archive是一个专注于提升vscode处理压缩包的插件

经过技术评定选取了使用`js7z-tools`来完成压缩包的压缩和解压，随后便给ds充钱，打开opencode开始vibe

功能渐渐完善后，我打开了一个上万文件、文件夹的压缩包，preview的界面直接卡住了，意识到该优化下前端显示了。遂去问ds，有没有合适的方案，给我推荐了虚拟滚动和懒加载的方案，使用`tanstack virtual`和`vue3`把以前的纯html css js页面重写了。效果不错。顺便让它把js 迁移到ts

经过这次开发实践，我认为一开始以最快的速度开发原型产品是最重要的，加功能等，然后可以去谈优化/优雅/美化/可维护等等了。
