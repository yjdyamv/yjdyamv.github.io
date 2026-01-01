---
title: clangd-clang-format-global
published: 2026-01-01
description: ''
image: ''
tags: []
category: ''
draft: false 
lang: 'zh-CN'
---

我们使用`clangd`插件来替代`Microsoft C/C++`插件，那么我们应当学会如何配置其来符合我们的使用。我的clangd插件配置如下。

```jsonc
    // clangd 及 微软C/C++扩展设置
    "C_Cpp.intelliSenseEngine": "disabled", // 禁用微软的IntelliSense
    "C_Cpp.errorSquiggles": "disabled",
    "clangd.enable": true,
    "clangd.detectExtensionConflicts": false,
    "clangd.checkUpdates": false,
    "clangd.onConfigChanged": "prompt",
    "clangd.arguments": [
        // 让 Clangd 生成精简的日志 详细是verbose
        "--log=info",
        // 输出的 JSON 文件更美观
        "--pretty",
        // 全局补全
        "--all-scopes-completion",
        // 建议风格：打包(重载函数只会给出一个建议）
        // 相反可以设置为detailed
        "--completion-style=bundled",
        // 跨文件重命名变量
        "--cross-file-rename",
        // 允许补充头文件
        "--header-insertion=iwyu",
        // 输入建议中，已包含头文件的项与还未包含头文件的项会以圆点加以区分
        "--header-insertion-decorators",
        // 在后台自动分析文件(基于 complie_commands，我们用CMake生成)
        "--background-index",
        // 启用 Clang-Tidy 以提供「静态检查」
        "--clang-tidy",
        // Clang-Tidy 静态检查的参数，指出按照哪些规则进行静态检查
        // 参数后部分的*表示通配符
        // 在参数前加入-，如-modernize-use-trailing-return-type，将会禁用某一规则
        "--clang-tidy-checks=cppcoreguidelines-*,performance-*,bugprone-*,portability-*,modernize-*,google-*",
        // 同时开启的任务数量
        "-j=8",
        // pch优化的位置(memory 或 disk，选择memory会增加内存开销，但会提升性能) 推荐在板子上使用disk
        "--pch-storage=disk",
        // 启用这项时，补全函数时，将会给参数提供占位符，键入后按 Tab 可以切换到下一占位符，乃至函数末
        // 我选择禁用
        "--function-arg-placeholders=false",
        // compelie_commands.json 文件的目录位置
        "--compile-commands-dir=${workspaceRoot}/build",
        // 启用.clangd配置文件
        "--enable-config",
        // 设置格式化style
        "--fallback-style=google",
        "--pch-storage=memory",
        "--ranking-model=heuristics",
        "--suggest-missing-includes"
    ],
```

其中有点坑人的是`format`不起作用，除非设置`.clang-format`文件来描述格式化的样式。但这个在clangd插件里是设置不了的。虽说我们可以每个文件夹下设置`.clang-format`，这对于工程来说也是良好实践，但我想全局设置来降低工作量（对于无须和别人合作的项目之类的）。**解决方案是：在家目录下放置一个`.clang-format`文件，即可作为全局。**对于`.clangd`也是一样的，有项目设置和全局设置。**在vscode的设置里是完成不了全局clang-format的设置的**

```yaml
# ~/.clang-format
BasedOnStyle: Webkit
# 设置 tab 长度和缩进
IndentWidth: 4
TabWidth: 4
UseTab: Never  # 或者 Always, ForIndentation, ForContinuationAndIndentation

# 大括号换行设置
BreakBeforeBraces: Custom
BraceWrapping:
  AfterClass: true
  AfterControlStatement: Always  # if, for, while 等后的大括号换行
  AfterEnum: true
  AfterFunction: true
  AfterNamespace: true
  AfterStruct: true
  AfterUnion: true
  BeforeCatch: true
  BeforeElse: true
  BeforeLambdaBody: true
  BeforeWhile: false
  SplitEmptyFunction: false
  SplitEmptyRecord: false
  SplitEmptyNamespace: false
```

以下是在win上的设置，设置了这个后就能正确提示msys2 ucrt 的gcc的头文件了，如其专有的`<bits/stdc++.h>`等，对应的把`x86_64-pc-windows-gnu`换成`x86_64-pc-windows-msvc`即可提示MSVC的头文件

```yaml
# ~/.clangd
CompileFlags:
  Add: 
    - --target=x86_64-pc-windows-gnu
```
