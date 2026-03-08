---
title: cmake-locale-unix
published: 2026-03-08
description: ''
image: ''
tags: []
category: ''
draft: false 
lang: 'zh-CN'
---

近来使用cmake的时候在调整`cmake_minimum_required`的时候发现了些现象和一些当前cmake主线上还在处理的issue

首先是`cmake_minimum_required`的用法，一般放在`CMakeLists.txt`的开头来规定cmake的版本

```cmake
cmake_minimum_required(VERSION 3.15.0)
```

然而这个名字本身也挺有意思的，“最小版本”这个本身也挺耐人寻味的，那版本不同会引发什么呢？常用的`3.15`、`3.23`版本试了没什么，换成`4.1.0`时发现支持了`module`（构建输出的东西不同了）。以上是我在windows上试验的，而在linux上我试验的时候发现了点问题。

切到linux上时，`cmake_minimum_required`设置为了`4.1.0`，构建报错了

```log
[build] Starting build
[proc] Executing command: /usr/bin/cmake --build /home/dony/桌面/testc/build --config Debug --target all --
[build] [2/8  12% :: 0.102] Scanning '/home/dony/桌面/testc/main.cpp' for CXX dependencies
[build] FAILED: [code=1] CMakeFiles/testc.dir/Debug/main.cpp.o.ddi 
[build] /usr/bin/g++ -DCMAKE_INTDIR=\"Debug\"  -fstack-protector-strong -D_FORTIFY_SOURCE=2 -fstack-clash-protection -Wall -Wextra -Wpedantic -g -O1 -gdwarf-5 -fdiagnostics-color=always -fno-omit-frame-pointer -std=gnu++23 -fPIE -fdiagnostics-color=always -E -x c++ '/home/dony/桌面/testc/main.cpp' -MT CMakeFiles/testc.dir/Debug/main.cpp.o.ddi -MD -MF CMakeFiles/testc.dir/Debug/main.cpp.o.ddi.d -fmodules-ts -fdeps-file=CMakeFiles/testc.dir/Debug/main.cpp.o.ddi -fdeps-target=CMakeFiles/testc.dir/Debug/main.cpp.o -fdeps-format=p1689r5 -o CMakeFiles/testc.dir/Debug/main.cpp.o.ddi.i
[build] /home/dony/桌面/testc/main.cpp:3:10: error: cannot determine ‘#include’ translation of /home/dony/桌面/testc/hello.hpp: malformed string 'ERROR 'unrecognized \'INCLUDE-TRANSLATE \'/home/dony/桌面/testc/hello.hpp\'\'''
[build]     3 | #include "hello.hpp"
[build]       |          ^~~~~~~~~~~
[build] [2/8  25% :: 0.222] Scanning '/home/dony/桌面/testc/hello.cpp' for CXX dependencies
[build] ninja: build stopped: subcommand failed.
[proc] The command: /usr/bin/cmake --build /home/dony/桌面/testc/build --config Debug --target all -- exited with code: 1
[driver] Build completed: 00:00:00.294
[build] Build finished with exit code 1
```

而在我之前的`3.10`没有这个问题。经确认是中文路径的问题，`3.27`以下不会触发这个问题。那么有没有办法解决呢？直接的方法是将项目移动到其他位置，使路径不包含中文。经过搜索这是cmake还在解决的一个[issue](https://gitlab.kitware.com/cmake/cmake/-/issues/27562)，计划于`4.3.0`完成。
