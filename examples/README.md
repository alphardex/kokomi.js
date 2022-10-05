# Kokomi试验地

powered by kokomi.js

食用方法：

1. `npm i`安装依赖，方便用ts自动补全

2. 以`template`目录作为模板

3. 编写`sketch.js`

4. 用`http-server`或[vscode的Live Preview插件](https://marketplace.visualstudio.com/items?itemName=ms-vscode.live-server)即可预览效果

5. 按空格键可开始录制gif，再按一次则停止录制

## 目录文件说明

1. index.html: 总页面，不需要动
2. sketch.js: 挥洒创意的地方 :)
3. tmpl.html: 额外的HTML片段（例如引入img图片等）
4. prepare.js: 额外的JS片段（例如引入更多的GLSL Shader等）
5. *.glsl: GLSL Shader文件

## 目录同步更新

entries/index.html 是所有作品的目录页

如需同步更新，运行以下命令即可

```sh
node getFilesData.mjs
```