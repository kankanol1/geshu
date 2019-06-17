# 项目概览

## 初始化
注意：设置环境时需要进行两次初始化。

首先，打开`package.json`文件，查找如下两行，并删除
```
    "gl-simplemde": "^2.0.0",
    "gl-stomp-broker-js": "^1.3.0",
```

删除完毕后，执行`npm install`。此步骤初始化所有公共可访问的npm包。

安装完毕后，将上述两行重新放回原文件。然后，在项目根目录创建`.npmrc`,内容如下:

```
registry=http://repo.gl-data.com:8088/repository/npm-gldata-main/
_auth=<authcode>
email=<youremail>
```

其中，`<youremail>`填入你的邮件地址，执行`echo -n 'yourusername:yourpassword' | openssl base64`，将输出字符串填入`<authcode>`。

若系统提示相应命令无法找到，请先安装相应软件。通常windows环境下可在git bash环境里执行如上命令。

文件创建完毕后，重新执行`npm install`安装缺少的以`gl-`开头的包。

完毕后，执行`npm run setup:xxx`命令设置开发环境，然后执行`npm run start`。若浏览器成功打开且命令行没有错误，即说明环境初始化成功。

## 总体结构

项目整体采用ant-design pro结构。使用umi作为脚手架工具,整体遵循其文件夹结构。总体目录划分如下：

```
- config: 不同发行版本的工程配置
- mock: http请求前端mock配置
- mock-socket: websocket前端mock配置
- public: 公开文件，将会打包至所有发行版本中
- scripts: npm构建过程中执行的node脚本
- src: 工程主要源文件目录
- tests: 测试文件夹，目前未使用。
```

 ## 发行版配置目录:configs

 根据功能不同，划分出如下发行版：
 ```
 - datapro: 格数，数据处理流程构建版本
 - datapro-client: 格数，客户端版本，仅能根据模板创建并执行任务。
 - datapro-all: 格数，包含上述两个版本。
 - graph: 图项目编辑，老版本，目前无开发。
 - ml: 机器学习版本，老版本，目前无开发。
 - all: 包含所有模板的完整版，老版本，目前无开发。
 - includes: 部分功能的路由配置，被多个不同发行版本引用。
 ```

在开发之前，通常需要设置当前开发的版本环境。对应命令为: `npm setup:$env`，其中`$env`为想要设置的环境。具体执行脚本参考`package.json`中的相应定义。脚本的具体执行内容位于`/scripts/setup.js`中

## 脚本简介

脚本文件夹中包含辅助脚本，使用nodejs编写，简介如下：
```
- setup.js 环境初始化脚本，将指定发行版的配置拷贝至默认配置，以初始化开发环境。
- build.js 构建脚本，可通过参数配置需要构建的发行版本，使用`npm run`相应命令调用。
- util.js 通用工具类。
```

## 主体源文件

主体源文件位于`src`目录下，采用`es6`语法。相应文件夹简介如下：

```
- assets 资源文件等。
- common 一些通用文件
- components 组件模块，通常可以直接使用，无须连接状态。通常与具体业务无关，仅提供展示逻辑。
- config 通用配置，目前仅存储一些映射关系。
- e2e 用于端到端的测试，未使用。
- layouts 定义一些基础布局。
- locales 本地化翻译。
- models 一些全局的redux模型定义
- obj 方便业务的对象定义，目前仅用于画布的定义
- pages 具体的展示页面。
- services 和后台交流的ajax请求定义
- utils 工具类
- app.js 主入口
- defaultSettings.js 设置，由setup初始化
- global.js 全局js
- global.less 全局less
- manifest.json
- service-worker.js service worker的相关脚本，未启用，未测试。
```

其中，当前使用的布局文件和具体业务可参考不同发行版本的具体路由配置。当前活跃的开发版本主要关注如下文件夹(位于`/src/pages`)。

```
- DataPro 格数项目的主体工程文件
- DClient 格数客户端的主体工程文件
- Self 基础用户管理功能
- Storage 文件管理部分
- Teams 用户组管理部分(未完善)
- User 用户登录等
- Users 用户管理部分
```

其他文件夹中为老版本相应代码，目前暂无法正常使用，未来可能会重新修正。

