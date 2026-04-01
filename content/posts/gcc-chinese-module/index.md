---
title: GCC中文模块
date: 2026-03-25
tags: ['GCC','中文']
categories: '问题追踪'
---

近来使用gcc和cmake时遇到gcc无法处理中文路径的问题。报错如下。

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

经过试验，设置`cmake_minimum_required`为`3.27`以上并将`CMAKE_CXX_STANDARD`设置为`20`以上会开启对`module`的支持，这就是错误的原因，gcc scan module deps有问题：处理带中文路径失败。以下方法均可解决问题。

- 设置`cmake_minimum_required`为`3.27`及以下
- 设置`CMAKE_CXX_SCAN_FOR_MODULES`为`OFF`
- 使用`MSVC`或`clang`

其中前两种方法都是关闭`cmake`对`module`的支持，第三种方法是`MSVC`或`clang`没有这个问题。

另外的，近来`GCC`已经有人针对这个问题提了个[issue](https://gcc.gnu.org/bugzilla/show_bug.cgi?id=120458)，并有[patch](https://gcc.gnu.org/pipermail/gcc-patches/2026-February/709351.html)了，只能期待在版本号到`16`时会到`release`上。
