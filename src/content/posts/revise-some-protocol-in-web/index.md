---
title: revise-some-protocol-in-web
published: 2025-10-17
description: ''
image: ''
tags: []
category: ''
draft: true 
lang: 'zh-CN'
---

## OSI模型

先回顾下OSI模型，一般我们可能仅考虑四层

|    |           |            |     |
|----|-----------|------------|-----|
|7|**应用层**    | HTTP HTTPS |     |
|6|表示层        |            |     |
|5|会话层        |            |     |
|4|**传输层**    | TCP UDP    | 端口 |
|3|**网络层**    |            | IP地址 |
|2|**数据链路层**|            |     |
|1|物理层        |            |     |

## DHCP

DHCP（Dynamic Host Configuration Procotol）是一种动态分配主机网络配置（IP地址、DNS、网关、子网掩码、租期与续租时间）的协议。

DHCP是应用层协议，使用了UDP协议（传输层），客户端是68端口，服务端是67端口。网络层使用IP地址，客户端广播（源IP：0.0.0.0，目标：255.255.255.255）。数据链路层使用MAC地址，客户端广播（目标：ff:ff:ff:ff:ff:ff，源地址主机知道）。

过程：
1. DHCP Discover：Client广播发送数据，找到DHCP Server
2. DHCP Offer：Sever 返回（广播）IP地址、DNS、网关、子网掩码、租期与续租时间。
3. DHCP Request：Client广播数据IP地址（我要的）
4. DHCP Ack：Server告诉client可以使用这个IP

## DNS域名解析

DNS（Domain Name System）是棵树 域名结构树。根域名（.root）、顶级域名（.com、.net、.org  ...）、一级域名（.baidu、.bing、.google ...）、二级域名（.www、.mail ...）构成了域名结构树。

DNS域名解析过程：以mail.google.com为例

1. 查询本地DNS解析记录（目的是找到这个域名（主机）对应的IP地址），如有就返回，如无进入第二步
2. 请求DNS解析器，DNS解析器发送请求到DNS服务器（一般是本地ISP）
3. DNS服务器向根域名服务器发送请求到.com域名服务器的IP地址
4. .com域名服务器发送请求到.google.com域名服务器的IP地址
5. .google.com域名服务器返回.mail.google.com域名服务器的IP地址到.com、.root、DNS服务器、DNS解析器（递归的）

## CDN

CDN（Content Delivery Network）是内容分发网络。

源服务器将数据push到CDN网络上，用户请求CDN服务器这些资源，CDN服务器返回这些资源。

数据主要是一些**静态资源以及time等动态资源**。

作用：
1. 加快了数据的获取（下载某些资源的网速）
2. 隔离了源服务器与用户

CDN有负载均衡（原理是DNS里用到的广播啦）距离最近的CDN服务器来反应，如果超载就转为另一台服务器。

## TCP

TCP 是传输层的协议 提供端口。



## UDP

UDP 是传输层的协议 提供端口。

## HTTP 1.1/2.0/3.0及其区别



## HTTPS
