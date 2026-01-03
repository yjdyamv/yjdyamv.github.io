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
    // // 1. CMake设置 适用于GCC/CLang/Clang-cl
    "cmake.configureSettings": {
        // 默认Debug模式
        "CMAKE_BUILD_TYPE": "Debug",
        // 生成编译命令数据库，供clangd使用
        "CMAKE_EXPORT_COMPILE_COMMANDS": "ON",
        // 为C/C++调试版本添加调试信息，使用DWARF-4格式
        // -g: 生成调试信息
        // -gdwarf-5是最新的
        "CMAKE_CXX_FLAGS_DEBUG": "${CMAKE_CXX_FLAGS_DEBUG} -g -gdwarf-5 -fdiagnostics-color=always -fno-omit-frame-pointer",
        "CMAKE_C_FLAGS_DEBUG": "${CMAKE_C_FLAGS_DEBUG} -g -gdwarf-5 -fdiagnostics-color=always -fno-omit-frame-pointer",
        // Release版本优化
        "CMAKE_CXX_FLAGS_RELEASE": "${CMAKE_CXX_FLAGS_RELEASE} -O3 -DNDEBUG",
        "CMAKE_C_FLAGS_RELEASE": "${CMAKE_C_FLAGS_RELEASE} -O3 -DNDEBUG",
        // RelWithDebInfo版本（推荐用于性能分析）
        "CMAKE_CXX_FLAGS_RELWITHDEBINFO": "${CMAKE_CXX_FLAGS_RELWITHDEBINFO} -O2 -g -gdwarf-5",
        "CMAKE_C_FLAGS_RELWITHDEBINFO": "${CMAKE_C_FLAGS_RELWITHDEBINFO} -O2 -g -gdwarf-5",
        // C/C++标准设置
        "CMAKE_CXX_STANDARD": "23", // 98 11 14 17 20 23 26
        "CMAKE_C_STANDARD": "23", // 90 99 11 17 23
        "CMAKE_CXX_STANDARD_REQUIRED": "ON", // 强制要求指定的C++标准，如果不支持则编译失败
        // 编译器警告设置 - 启用全面的代码质量检查
        // "CMAKE_CXX_FLAGS": "${CMAKE_CXX_FLAGS} -Wall -Wextra -Wpedantic",  // -Wall:常见警告 -Wextra:额外警告 -Wpedantic:严格标准合规警告
        // "CMAKE_C_FLAGS": "${CMAKE_C_FLAGS} -Wall -Wextra -Wpedantic",      // 同上，针对C语言代码
        // 显示详细的编译信息 - 用于调试构建过程
        "CMAKE_VERBOSE_MAKEFILE": "OFF", // 设为ON可以看到完整的编译命令，用于调试构建问题，一般设置为OFF即可
        // 生成位置无关代码 - 对于共享库和现代安全特性很重要
        "CMAKE_POSITION_INDEPENDENT_CODE": "ON",
        // 着色输出设置 - 让编译错误和警告信息更易读
        "CMAKE_COLOR_MAKEFILE": "ON", // 在Makefile生成器中启用彩色输出
        "CMAKE_COLOR_DIAGNOSTICS": "ON", // 在支持的编译器中启用彩色诊断信息
        // 并行编译设置 - 提高编译速度
        "CMAKE_BUILD_PARALLEL_LEVEL": "0", // 0表示使用所有可用CPU核心进行并行编译
        // 让CMake自动检测是否支持
        // "CMAKE_INTERPROCEDURAL_OPTIMIZATION": "ON",
        "CMAKE_INTERPROCEDURAL_OPTIMIZATION_DEBUG": "OFF", // Debug版本关闭LTO
        "CMAKE_INTERPROCEDURAL_OPTIMIZATION_RELEASE": "ON", // 仅Release版本启用
    },
    // // 2. CMake设置 适用于MSVC
    // "cmake.configureSettings": {
    //  // 默认Debug模式
    //  "CMAKE_BUILD_TYPE": "Debug",
    //  // 生成编译命令数据库，供clangd使用
    //  "CMAKE_EXPORT_COMPILE_COMMANDS": "ON",
    //  // Debug 调试信息 - 修正了语法错误
    //  "CMAKE_CXX_FLAGS_DEBUG": "/ZI /Od /MDd",
    //  "CMAKE_C_FLAGS_DEBUG": "/ZI /Od /MDd",
    //  "CMAKE_EXE_LINKER_FLAGS_DEBUG": "/DEBUG:FULL /INCREMENTAL",
    //  // Release版本优化
    //  "CMAKE_CXX_FLAGS_RELEASE": "/O2 /DNDEBUG /MD",
    //  "CMAKE_C_FLAGS_RELEASE": "/O2 /DNDEBUG /MD",
    //  "CMAKE_EXE_LINKER_FLAGS_RELEASE": "/INCREMENTAL:NO /OPT:REF /OPT:ICF",
    //  // RelWithDebInfo版本（推荐用于性能分析）
    //  "CMAKE_CXX_FLAGS_RELWITHDEBINFO": "/O2 /Zi /DNDEBUG /MD",
    //  "CMAKE_C_FLAGS_RELWITHDEBINFO": "/O2 /Zi /DNDEBUG /MD",
    //  "CMAKE_EXE_LINKER_FLAGS_RELWITHDEBINFO": "/DEBUG /INCREMENTAL:NO /OPT:REF",
    //  // C/C++标准设置
    //  "CMAKE_CXX_STANDARD": "20",
    //  "CMAKE_C_STANDARD": "17",  // C23在MSVC中支持有限，建议用C17
    //  "CMAKE_CXX_STANDARD_REQUIRED": "ON",
    //  "CMAKE_C_STANDARD_REQUIRED": "ON",
    //  // MSVC 编译器警告设置
    //  "CMAKE_CXX_FLAGS": "/W4 /WX- /permissive- /EHsc", // W4高级警告，permissive-严格标准
    //  "CMAKE_C_FLAGS": "/W4 /WX-",
    //  // 调试和开发相关设置
    //  "CMAKE_VERBOSE_MAKEFILE": "OFF",
    //  "CMAKE_COLOR_DIAGNOSTICS": "ON",
    //  // MSVC 特定优化
    //  "CMAKE_MSVC_RUNTIME_LIBRARY": "MultiThreadedDLL", // Release用MD，Debug会自动用MDd
    //  "CMAKE_VS_INCLUDE_INSTALL_TO_DEFAULT_BUILD": "ON",
    //  // 并行编译
    //  "CMAKE_BUILD_PARALLEL_LEVEL": "0"
    // // Windows 动态库导出全部符号（.dll, .lib等）对于使用动态库来说必不可少
    // "CMAKE_WINDOWS_EXPORT_ALL_SYMBOLS": "ON",
    // },
    "cmake.generator": "Ninja", // cmake的生成器为Ninja
    "cmake.preferredGenerators": [
        "Ninja", // 优先使用Ninja 快且跨平台
        "Unix Makefiles"
    ], 
    "cmake.configureOnOpen": false, // 打开文件夹不自动构建
    "cmake.buildBeforeRun": true, // 运行前自动构建
    "cmake.clearOutputBeforeBuild": true, // 构建前清除输出
    "cmake.launchBehavior": "reuseTerminal",
    "cmake.installPrefix": "bin",
    // // 1.适用于GCC/Clang/Clang-cl的调试
    // // 1.1 使用GDB
    // "cmake.debugConfig": {
    //  "stopAtEntry": true, // 在代码开头设置断点
    //  "type": "cppdbg",
    //  "MIMode": "gdb", // 据说可以用lldb，但还没找到配置
    //  "cwd": "${workspaceFolder}",
    //  "setupCommands": [
    //   {
    //    "description": "Enable pretty printing for better data structure display",
    //    "text": "-enable-pretty-printing",
    //    "ignoreFailures": true
    //   },
    //   {
    //    "description": "Set assembly code display to Intel syntax format",
    //    "text": "-gdb-set disassembly-flavor intel",
    //    "ignoreFailures": true
    //   },
    //   {
    //    "description": "Set maximum string display length to 512 characters",
    //    "text": "set print elements 512",
    //    "ignoreFailures": true
    //   },
    //   {
    //    "description": "Enable printing of object's actual type (for polymorphic objects)",
    //    "text": "set print object on",
    //    "ignoreFailures": true
    //   },
    //   {
    //    "description": "Enable pretty printing of arrays",
    //    "text": "set print array on",
    //    "ignoreFailures": true
    //   },
    //   {
    //    "description": "Disable pagination for continuous output",
    //    "text": "set pagination off",
    //    "ignoreFailures": true
    //   }
    //  ]
    // },
    // // 1.2 使用LLDB
    "cmake.debugConfig": {
    "type": "lldb",
    // "MIMode": "lldb", // 哥们，必不可少啊，不然默认是gdb(~~呜呜，有点玄幻)
    "cwd": "${workspaceFolder}",
    "stopOnEntry": true, // 在代码开头设置断点
    "environment": [],
    "console": "integratedTerminal",
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
    "lldb.launch.expressions": "simple", // 表达式求值模式
```

如上是对cmake的编译选项及调试的设置
