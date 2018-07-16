# README

This project based on ant-design-pro project, with some modifications.

## Tips:

项目目前拆分为三个版本：all, graph, ml

* graph为图数据开发平台，主要包括图的设计与数据导入等。
* ml为机器学习平台，主要包括ETL,机器学习部分等。
* all为上述两个平台的综合打包版本

在开发前，需对本地环境进行设置，根据版本不同，可有如下选项

* 执行`npm run setup`，此步骤设置为综合打包版本，对应`all`的发行版，相关入口代码位于`src/app/all`目录下
* 执行`npm run setup:graph`，此步骤设置为图数据版本，对应`graph`的发行版，相关入口代码位于`src/app/graph`目录下
* 执行`npm run setup:ml`，此步骤设置为机器学习版本，对应`ml`的发行版，相关入口代码位于`src/app/ml`目录下

在开发完毕后，若需要打包发行版本，可在确认当前环境（即之前调用的`setup`命令）的前提下，直接执行`npm run build`，打包当前版本，输入文件位于`dist`目录下。

若需要打包全部版本的发行版，执行`npm run release`，输出目录同样见`dist`目录。
