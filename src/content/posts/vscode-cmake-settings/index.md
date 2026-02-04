---
title: vscode-cmake-settings
published: 2026-01-01
description: ''
image: ''
tags: []
category: ''
draft: false 
lang: 'zh-CN'
---

cmake是一个C/C++的跨平台的构建工具，也是现在的事实标准，QT6、KDE、ROS2及其他知名库均开始采用cmake构建。

cmake是构建工具的构建工具。cmake可以生成 VS工程文件、makefile、ninja及其他构建工具。而这些构建工具又会将它们自己的配置文件转换成编译器和链接器的参数供其调用。而cmake本身是没有什么预配置的，我们最好做些cmake构建的预配置才能让我们使用的方便，比如针对特定编译器的编译选项和调试选项等。

```jsonc
// settings.json
    // // 1. CMake设置 主要适用于[GCC/CLang](linux+win(ucrt64)) Clang(msvc)有点诡异
    "cmake.configureSettings": {
        // 不指定构建模式，在插件界面选择
        // "CMAKE_BUILD_TYPE": "Debug", // "Release" , "RelWithDebInfo" , 
        // 库默认生成静态库，除非指定为`add_library(mylib SHARED test.c)` 或以下的选项打开
        // "BUILD_SHARED_LIBS": "ON",
        // 生成编译命令数据库，供clangd使用
        "CMAKE_EXPORT_COMPILE_COMMANDS": "ON",
        // 各构建类型均有的安全设置
        // -fstack-protector-strong: 强化的栈溢出保护
        // -D_FORTIFY_SOURCE=2: 编译时检测缓冲区溢出和其他常见的内存安全问题，
        // -fstack-clash-protection: 防止栈冲突攻击
        "CMAKE_CXX_FLAGS": "-fstack-protector-strong -D_FORTIFY_SOURCE=2 -fstack-clash-protection",
        "CMAKE_C_FLAGS": "-fstack-protector-strong -D_FORTIFY_SOURCE=2 -fstack-clash-protection",
        // 1. Debug版本
        // 为C/C++调试版本添加调试信息，使用DWARF-5格式
        // -g: 生成调试信息
        // -gdwarf-5是最新的
        // -fdiagnostics-color=always: 编译器输出彩色诊断信息
        // -fno-omit-frame-pointer: 保留帧指针，便于堆栈跟踪和性能分析工具（如perf）获取完整的调用栈
        "CMAKE_CXX_FLAGS_DEBUG": "-g -O1 -gdwarf-5 -fdiagnostics-color=always -fno-omit-frame-pointer",
        "CMAKE_C_FLAGS_DEBUG": "-g -O1 -gdwarf-5 -fdiagnostics-color=always -fno-omit-frame-pointer",
        // 2. Release版本优化
        // -O3: 启用最高级别的优化（内联、循环展开、向量化等），显著提升性能但编译时间增长
        // -DNDEBUG: 禁用assert宏，减少运行时开销（assert在Release版本应该被禁用）
        "CMAKE_CXX_FLAGS_RELEASE": "-O3 -DNDEBUG",
        "CMAKE_C_FLAGS_RELEASE": "-O3 -DNDEBUG",
        // 3. RelWithDebInfo版本（推荐用于性能分析）
        "CMAKE_CXX_FLAGS_RELWITHDEBINFO": "-O2 -g -gdwarf-5",
        "CMAKE_C_FLAGS_RELWITHDEBINFO": "-O2 -g -gdwarf-5",
        // C/C++标准设置
        "CMAKE_CXX_STANDARD": "23", // 98 11 14 17 20 23 26
        "CMAKE_C_STANDARD": "23", // 90 99 11 17 23
        "CMAKE_CXX_STANDARD_REQUIRED": "ON", // 强制要求指定的C++标准，如果不支持则编译失败
        "CMAKE_C_STANDARD_REQUIRED": "ON", // 同上
        // 编译器警告设置 - 启用全面的代码质量检查
        // "CMAKE_CXX_FLAGS": "${CMAKE_CXX_FLAGS} -Wall -Wextra -Wpedantic -Wconversion -Wshadow",  // -Wall:常见警告 -Wextra:额外警告 -Wpedantic:严格标准合规警告 -Wconversion 隐式转换警告 -Wshadow 变量遮蔽警告
        // "CMAKE_C_FLAGS": "${CMAKE_C_FLAGS} -Wall -Wextra -Wpedantic -Wconversion -Wshadow",      // 同上，针对C语言代码
        // 显示详细的编译信息 - 用于调试构建过程
        "CMAKE_VERBOSE_MAKEFILE": "OFF", // 设为ON可以看到完整的编译命令，用于调试构建问题，一般设置为OFF即可
        // 着色输出设置 - 让编译错误和警告信息更易读
        "CMAKE_COLOR_MAKEFILE": "ON", // 在Makefile生成器中启用彩色输出
        "CMAKE_COLOR_DIAGNOSTICS": "ON", // 在支持的编译器中启用彩色诊断信息
        // 生成位置无关代码 - 对于共享库和现代安全特性很重要
        "CMAKE_POSITION_INDEPENDENT_CODE": "ON",
        // 并行编译设置 - 提高编译速度
        "CMAKE_BUILD_PARALLEL_LEVEL": "0", // 0表示使用所有可用CPU核心进行并行编译
        // 过程间优化(ITO)设置 - 跨文件优化以提升性能
        "CMAKE_INTERPROCEDURAL_OPTIMIZATION": "ON",  
        "CMAKE_INTERPROCEDURAL_OPTIMIZATION_DEBUG": "OFF",     
        "CMAKE_INTERPROCEDURAL_OPTIMIZATION_RELEASE": "ON",    // 只在 Release 开启
        "CMAKE_INTERPROCEDURAL_OPTIMIZATION_RELWITHDEBINFO": "OFF",
        // RPATH设置 - 确保运行时能找到共享库
        "CMAKE_WINDOWS_EXPORT_ALL_SYMBOLS": "ON",
        "CMAKE_MACOSX_RPATH": "ON",                // macOS RPATH设置
        "CMAKE_SKIP_BUILD_RPATH": "OFF",           // 构建时保留RPATH
        "CMAKE_BUILD_WITH_INSTALL_RPATH": "OFF",   // 构建时不使用安装RPATH
        "CMAKE_INSTALL_RPATH_USE_LINK_PATH": "ON", // 安装时使用链接路径
    },
    // // 2. CMake设置 适用于MSVC/clang-cl(msvc) clang-cl可以接受大部分MSVC选项，及部分gcc/clang
    // "cmake.configureSettings": {
    //     // 不指定构建模式，在插件界面选择
    //     // "CMAKE_BUILD_TYPE": "Debug", // "Release" , "RelWithDebInfo" 
    //     // 生成编译命令数据库，供clangd使用
    //     "CMAKE_EXPORT_COMPILE_COMMANDS": "ON",
    //     // Debug 调试信息 
    //     // /Zi: 生成完整的调试信息（PDB格式）
    //     // /Od: 禁用优化，确保代码按原始逻辑执行
    //     // /MDd: 使用多线程调试版DLL运行时库
    //     // /RTC1: 运行时错误检查（栈帧和未初始化变量）
    //     // /D_DEBUG: 定义_DEBUG宏
    //     // /fp:precise: 精确浮点模型，确保调试时浮点运算一致性
    //     // /Oy-: 禁用帧指针省略，保证完整的调用栈信息
    //     // /DEBUG:FULL: 生成完整的调试信息
    //     // /INCREMENTAL: 启用增量链接，加快链接速度
    //     "CMAKE_CXX_FLAGS_DEBUG": "/Zi /Od /MDd /RTC1 /D_DEBUG /fp:precise /Oy-",
    //     "CMAKE_C_FLAGS_DEBUG": "/Zi /Od /MDd /RTC1 /D_DEBUG /fp:precise /Oy-",
    //     "CMAKE_EXE_LINKER_FLAGS_DEBUG": "/DEBUG:FULL /INCREMENTAL",
    //     // Release版本优化
    //     // /Ox: 最大速度优化（等同于 /Og /Oi /Ot /Oy /Ob2 /Gs /GF /Gy）
    //     // /DNDEBUG: 禁用assert宏，移除调试代码
    //     // /MD: 使用多线程发布版DLL运行时库
    //     // /GL: 启用全程序优化（需要配合链接时代码生成）,这个和/LTCG配合使用会有问题。关掉了
    //     // /Gw: 优化全局数据，移除未引用的全局数据
    //     // /LTCG: 启用链接时代码生成，允许跨模块优化
    //     // /INCREMENTAL:NO: 禁用增量链接，生成优化的可执行文件
    //     // /OPT:REF: 移除未引用的函数和数据
    //     // /OPT:ICF: 启用相同代码折叠，减少可执行文件大小
    //     "CMAKE_CXX_FLAGS_RELEASE": "/Ox /DNDEBUG /MD /Gw",
    //     "CMAKE_C_FLAGS_RELEASE": "/Ox /DNDEBUG /MD /Gw",
    //     "CMAKE_EXE_LINKER_FLAGS_RELEASE": "/INCREMENTAL:NO /OPT:REF /OPT:ICF /LTCG",
    //     // RelWithDebInfo版本（推荐用于性能分析）
    //     "CMAKE_CXX_FLAGS_RELWITHDEBINFO": "/O2 /Zi /DNDEBUG /MD /Oy- /fp:precise",
    //     "CMAKE_C_FLAGS_RELWITHDEBINFO": "/O2 /Zi /DNDEBUG /MD /Oy- /fp:precise",
    //     "CMAKE_EXE_LINKER_FLAGS_RELWITHDEBINFO": "/DEBUG:FULL /INCREMENTAL:NO /OPT:REF",
    //     // C/C++标准设置
    //     "CMAKE_CXX_STANDARD": "23", // 98 11 14 17 20 23 26
    //     "CMAKE_C_STANDARD": "23",  // 90 99 11 17 23
    //     "CMAKE_CXX_STANDARD_REQUIRED": "ON",
    //     "CMAKE_C_STANDARD_REQUIRED": "ON",
    //     // 各构建类型均有的安全及其他设置
    //     // /W4: 启用4级警告（高级警告，推荐用于代码质量检查）
    //     // /WX-: 警告不视为错误（设为/WX则警告当错误处理）
    //     // /permissive-: 严格C++标准合规模式，禁用Microsoft扩展
    //     // /EHsc: C++异常处理模型（同步异常，extern "C"函数不抛异常）
    //     // /utf-8: 源代码和执行字符集都使用UTF-8编码
    //     // /Zc:__cplusplus: 正确设置__cplusplus宏值
    //     // /Zc:__STDC__: 在C模式下正确定义__STDC__宏
    //     // /Gs: 启用堆栈保护，防止栈溢出攻击
    //     // /guard:cf: 启用控制流保护，防止代码执行被篡改
    //     // /NXCOMPAT /DYNAMICBASE /GUARD:CF: 链接器选项，启用数据执行保护和地址空间布局随机化等安全特性
    //     "CMAKE_CXX_FLAGS": "/W4 /WX- /permissive- /EHsc /utf-8 /GS /guard:cf", // W4高级警告，permissive-严格标准
    //     "CMAKE_C_FLAGS": "/W4 /WX- /utf-8 /GS /guard:cf",
    //     "CMAKE_EXE_LINKER_FLAGS": "/NXCOMPAT /DYNAMICBASE /GUARD:CF",
    //     // 生成位置无关代码
    //     "CMAKE_POSITION_INDEPENDENT_CODE": "ON",
    //     // 调试和开发相关设置
    //     "CMAKE_VERBOSE_MAKEFILE": "OFF",
    //     "CMAKE_COLOR_DIAGNOSTICS": "ON",
    //     // LTO这个优化在MSVC下有问题，关掉
    //     // MSVC 特定优化
    //     "CMAKE_MSVC_RUNTIME_LIBRARY": "MultiThreadedDLL", // Release用MD，Debug会自动用MDd
    //     "CMAKE_VS_INCLUDE_INSTALL_TO_DEFAULT_BUILD": "ON", // 在Visual Studio中包含安装目标
    //     // 并行编译
    //     "CMAKE_BUILD_PARALLEL_LEVEL": "0",
    //     // Windows 动态库导出全部符号（.dll, .lib等）对于使用动态库来说必不可少
    //     "CMAKE_WINDOWS_EXPORT_ALL_SYMBOLS": "ON",
    // },
    "cmake.buildDirectory": "${workspaceFolder}/build",
    "cmake.generator": "Ninja", // cmake的生成器为Ninja
    "cmake.preferredGenerators": [
        "Ninja", // 优先使用Ninja 快且跨平台
        "Unix Makefiles",
    ],
    "cmake.configureOnOpen": false, // 打开文件夹不自动构建
    "cmake.buildBeforeRun": true, // 运行前自动构建
    "cmake.clearOutputBeforeBuild": true, // 构建前清除输出
    "cmake.launchBehavior": "reuseTerminal",
    "cmake.installPrefix": "./bin",
    // // 1.适用于GCC/Clang的调试
    // // 1.1.1 使用GDB(MS C/C++ Extension)
    // "cmake.debugConfig": {
    //     "stopAtEntry": true, // 在代码开头设置断点
    //     "type": "cppdbg",
    //     "MIMode": "gdb", // 据说可以用lldb，但还没找到配置
    //     "cwd": "${workspaceFolder}",
    //     "setupCommands": [
    //         {
    //         "description": "Enable pretty printing for better data structure display",
    //         "text": "-enable-pretty-printing",
    //         "ignoreFailures": true
    //         },
    //         {
    //         "description": "Set assembly code display to Intel syntax format",
    //         "text": "-gdb-set disassembly-flavor intel",
    //         "ignoreFailures": true
    //         },
    //         {
    //         "description": "Set maximum string display length to 512 characters",
    //         "text": "set print elements 512",
    //         "ignoreFailures": true
    //         },
    //         {
    //         "description": "Enable printing of object's actual type (for polymorphic objects)",
    //         "text": "set print object on",
    //         "ignoreFailures": true
    //         },
    //         {
    //         "description": "Enable pretty printing of arrays",
    //         "text": "set print array on",
    //         "ignoreFailures": true
    //         },
    //         {
    //         "description": "Disable pagination for continuous output",
    //         "text": "set pagination off",
    //         "ignoreFailures": true
    //         }
    //     ]
    // },
    // 1.1.2 GDB(Native Debug)
    // "cmake.debugConfig": {
    //     "type": "gdb",
    //     "request": "launch",
    //     "cwd": "${workspaceRoot}",
    //     "target": "${command:cmake.launchTargetPath}", // 可执行文件路径。对于codelldb和MS C/C++则无须设置，会自动传到"program"里。
    //     "valuesFormatting": "prettyPrinters",
    //     "stopAtEntry": true,
    // },
    // // 1.2 使用LLDB
    "cmake.debugConfig": {
        "type": "lldb",
        // "MIMode": "lldb", // 哥们，必不可少啊，不然默认是gdb(~~呜呜，有点玄幻)
        "cwd": "${workspaceFolder}",
        "environment": [],
        "console": "integratedTerminal",
        "stopAtEntry": true, // 在代码开头设置断点
        "setupCommands": [
            {
            "description": "Set assembly code display to Intel syntax format",
            "text": "settings set target.x86-disassembly-flavor intel",
            "ignoreFailures": true
            },
            {
            "description": "Customize stack frame format to include function name, arguments, and file location",
            "text": "settings set frame-format \"frame #${frame.index}: ${frame.pc}{ ${module.file.basename}{`${function.name-with-args}{${frame.no-debug}${function.pc-offset}}}}{ at ${line.file.basename}:${line.number}}{${function.is-optimized} [opt]}\\n\"",
            "ignoreFailures": true
            },
            {
            "description": "Set thread format to display thread ID, name, and current execution position",
            "text": "settings set thread-format \"thread #${thread.index}: tid = ${thread.id%tid}{, ${frame.pc}}{ ${module.file.basename}{`${function.name-with-args}{${frame.no-debug}${function.pc-offset}}}}{ at ${line.file.basename}:${line.number}}{, name = '${thread.name}'}\\n\"",
            "ignoreFailures": true
            },
            {
            "description": "Enable detailed type information display for dynamic objects",
            "text": "settings set target.prefer-dynamic-value run-target",
            "ignoreFailures": true
            },
            {
            "description": "Set maximum string display length to 512 characters",
            "text": "settings set target.max-string-summary-length 512",
            "ignoreFailures": true
            }
        ]
    },
    // // 2. 适用于MSVC的调试
    // // 使用MSVC的调试器
    // "cmake.debugConfig": {
    //  "type": "cppvsdbg", // 使用VS的调试器
    //  "cwd": "${workspaceFolder}",
    //  "environment": [],
    //  "console": "integratedTerminal",
    // },


    // lldb插件相关设置
    // 启动时执行的初始化命令（在目标程序启动前执行）
    "lldb.launch.initCommands": [],
    // 运行前执行的命令（在目标程序启动后、断点命中前执行）
    "lldb.launch.preRunCommands": [],
    // 自动解引用指针，显示指针指向的实际值而不是地址
    "lldb.dereferencePointers": true,
    // 抑制缺失源文件的警告信息，避免调试时的干扰
    "lldb.suppressMissingSourceFiles": true,
    // 反汇编显示模式：never=从不显示，auto=自动，always=总是显示
    "lldb.showDisassembly": "never",
    // 启用详细日志记录，便于调试LLDB本身的问题
    "lldb.verboseLogging": true,
    // 启用命令自动补全功能，提高调试效率
    "lldb.commandCompletions": true,
    // 控制台模式：split=分割模式，可以直接在Debug Console中输入变量名查看值
    // 其他选项：commands=仅命令模式，evaluate=仅求值模式
    "lldb.consoleMode": "split",
    "lldb.displayFormat": "auto", // 变量显示格式
    "lldb.launch.expressions": "native", // 表达式求值模式
 
```

如上是对cmake的编译选项及调试的设置
