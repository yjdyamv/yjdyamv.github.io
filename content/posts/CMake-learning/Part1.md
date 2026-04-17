+++
title = "CMake基础入门1"
date = 2026-04-13T19:02:28+08:00
lastmod = 2026-04-13T19:02:28+08:00
draft = false

# SEO优化
description = "CMake学习Part1"
keywords = ["CMake", "学习"]
summary = "包含基础命令、变量、函数、构建及安装"

# 分类和标签
tags = ["CMake"]
categories = ["技术教程"]

# # 文章特色图（可选）
# featuredImage = "/images/featured-image.jpg"
# featuredImagePreview = "/images/featured-image-preview.jpg"

# # 作者信息（可选，会覆盖全局配置）
# author = "作者名"
# authorImage = "/images/author.jpg"

# # 社交分享图（可选）
# images = ["/images/social-share.jpg"]

# # 文章系列（可选）
series = ["CMake教程"]
series_weight = 1

# # 隐藏文章（可选）
# hiddenFromHomePage = false
# hiddenFromSearch = false
+++

<!-- 文章内容从这里开始 -->

## CMake的地位与作用

当今C系构建的事实标准，用于构建大型（跨平台）项目的工具

## 基本函数

- `cmake_minimum_required`：声明使用的cmake的 **版本要求** / **使用时标准**
  eg：

  ```cmake
  cmake_minimum_required(VERSION 3.10.0)
  # 设置了cmake最低版本为3.10.0
  # 如果版本为3.32，则cmake的行为会表现为3.10.0
  ```

- `project`：声明当前工程的 **名字** 、 **版本** 、**所使用的语言**
  
  ```cmake
  project(testc VERSION 0.1.0 LANGUAGES C CXX)
  # 此工程名为testc，版本号是0.1.0，使用的编程语言包括C和C++
  ```

- `add_executable`：将某些源码编译为一个 **可执行文件**

  ```cmake
  add_executable(Hello_CMake main.cpp test.cpp)
  # 将main.cpp、test.cpp编译成一个可执行文件Hello_CMake
  ```

- `add_library`：将某些源码编译为一个 **静态库/动态库**

  ```cmake
  add_library(hello STATIC hello.cpp others.cpp)
  # 将hello.cpp、others.cpp编译为一个名为hello的静态库
  add_library(hello SHARED hello.cpp others.cpp)
  # 将hello.cpp、others.cpp编译为一个名为hello的动态库
  ```

- `target_link_libraries`：将某些 **库链接** 到一个可执行文件

  ```cmake
  target_link_libraries(testc hello)
  # 将hello链接到testc
  ```

- `set`：设置变量的值

  ```cmake
  set(CMAKE_WINDOWS_EXPORT_ALL_SYMBOLS ON)
  # 将 `CMAKE_WINDOWS_EXPORT_ALL_SYMBOLS` 的值设置为 `ON`
  ```

- `include_directories`：添加头文件搜索路径

  ```cmake
  include_directories(${CMAKE_SOURCE_DIR}/include)
  # 将项目根目录下的include文件夹添加到头文件搜索路径中
  include_directories(/usr/local/include ${PROJECT_SOURCE_DIR}/thirdparty)
  # 可以同时添加多个路径
  ```

  这个命令会影响**之后**所有`add_executable`和`add_library`创建的目标。在大型项目中，建议使用更现代的`target_include_directories`命令，它可以精确控制每个目标的头文件路径。

- `target_include_directories`：为目标添加头文件搜索路径

  ```cmake
  target_include_directories(Hello_CMake PUBLIC ${CMAKE_SOURCE_DIR}/include)
  # 为Hello_CMake目标添加include目录
  target_include_directories(hello PRIVATE ${CMAKE_SOURCE_DIR}/src)
  # 为hello库添加src目录，PRIVATE表示仅该库内部使用
  ```

  > [!info]
  >
  > - `PUBLIC`：该目录对目标本身和链接该目标的其他目标都可见
  > - `PRIVATE`：仅对该目标本身可见
  > - `INTERFACE`：对链接该目标的其他目标可见，但目标本身不使用

- `message`：打印信息，用于调试和输出

  ```cmake
  message(STATUS "Current source dir: ${CMAKE_SOURCE_DIR}")
  # 输出状态信息
  message(WARNING "This is a warning message")
  # 输出警告信息
  message(FATAL_ERROR "Configuration failed")
  # 输出错误信息并停止配置
  ```

- `add_subdirectory`：包含子目录中的CMakeLists.txt

  ```cmake
  add_subdirectory(src)           # 包含src目录
  add_subdirectory(lib)           # 包含lib目录  
  add_subdirectory(thirdparty)    # 包含thirdparty目录
  ```

  > [!info]
  >
  > - 子目录中必须有CMakeLists.txt文件
  > - 子目录中的目标（可执行文件、库）会自动添加到父目录的作用域
  > - 可以使用相对路径或绝对路径
  > - 是组织大型项目结构的主要方式

- `include`：包含CMake脚本文件（.cmake文件）

  ```cmake
  include(${CMAKE_SOURCE_DIR}/cmake/Utils.cmake)  # 包含工具脚本
  include(FindPackage.cmake)      # 包含查找包的脚本
  ```

  > [!tip]
  >
  > **与`add_subdirectory`的区别**：
  >
  > - `include`：主要用于包含.cmake脚本，不会创建新作用域
  > - `add_subdirectory`：用于组织项目结构，会创建新作用域

- `install`： **安装** targets或其他文件、资源等

  ```cmake
  install(TARGETS "Hello_CMake" "hello"
    RUNTIME DESTINATION bin
    LIBRARY DESTINATION lib
    ARCHIVE DESTINATION lib
  )
  ```

## CMAKE缓存变量

CMake预设了一些变量，通过设置这些变量可以操控CMake的行为。以下仅列举一些，具体可查询CMake文档使用。

- `CMAKE_CXX_STANDARD` / `CMAKE_C_STANDARD`：设置使用的C++/C的标准
  
  ```cmake
  set(CMAKE_CXX_STANDARD 23) // 98 11 14 17 20 23 26
  set(CMAKE_C_STANDARD 23) // 90  99 11 17 23
  ```

- `CMAKE_CXX_STANDARD_REQUIRED` / `CMAKE_C_STANDARD_REQUIRED`：设置C++/C需要设置标准
  
  ```cmake
  set(CMAKE_CXX_STANDARD_REQUIRED ON)
  set(CMAKE_C_STANDARD_REQUIRED ON)
  ```

- `CMAKE_POSITION_INDEPENDENT_CODE`：生成与位置无关的代码（对于生成动态库必不可少）

  ```cmake
  set(CMAKE_POSITION_INDEPENDENT_CODE ON)
  ```

- `CMAKE_WINDOWS_EXPORT_ALL_SYMBOLS`：Windows上的动态库符号导出设置
  
  ```cmake
  set(CMAKE_WINDOWS_EXPORT_ALL_SYMBOLS ON)
  ```

- `CMAKE_EXPORT_COMPILE_COMMANDS`：生成`compile_commands.json`供clangd使用

- `CMAKE_CXX_FLAGS_DEBUG`等：设置编译器选项

  ```cmake
  set(CMAKE_CXX_FLAGS_DEBUG "-g -O0 -gdwarf-5")
  ```

## 构建流程

典型的CMake项目构建分为两个阶段：

### 1. 配置阶段（Configure）

```bash
cmake -S . -B build -G "Ninja"
# 使用当前目录`.`下的CMakeLists.txt
# 使用`build`目录作为生成文件的地方
# 构建系统为Ninja
```

这个阶段会：

- 读取CMakeLists.txt
- 检查系统环境
- 生成构建系统文件（如Makefile、Ninja文件等）

### 2. 构建阶段（Build）

```bash
cmake --build build -DCMAKE_BUILD_TYPE=Debug
# cmake调用对应构建工具，执行build目录下的生成的构建文件
```

### 3. 安装阶段（可选）

```bash
cmake --build build --target install
# 执行构建，并将CMakeLists里声明的targets安装install目录下
```

### 4. 打包阶段（可选）

需使用`cpack`，CMakeLists.txt里需引入cpack

```cmake
include(cpack)
```

```bash
cpack -G 7Z
```
