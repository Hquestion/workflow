# workflow

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## 代码说明

### 组件目录结构

#### 路由组件

src/views目录下，存放三个路由组件：

- Home.vue 任务工作流设计工具
- About.vue 任务详情展示页面
- Demo.vue 组织架构展示示例

#### 通用组件

src/components 目录下，存放三个通用组件：

- context-menu 右键菜单组件，用于创建右键菜单，支持通过Vue.use的方式注册，支持this.$contextMenu方式调用
- tooltip 轻量提示组件，用户创建提示，支持通过Vue.use的方式注册，支持this.$tooltip方式调用
- workflow 工作流组件，支持双向绑定，需要提供树状结构的数据

#### 业务组件

src/components 目录下，存放两组业务组件：

- actions 设计用来放任务动态相关业务组件，目前只有人员信息的tooltip组件
- task 任务创建相关组件，分简要弹框/详细弹框/人员选择框等

## 第三方库说明

```
    "d3": "^5.16.0",                      // d3.js，详见官网
    "d3-flextree": "^2.1.1",              // d3树结构布局插件，详见github
    "dayjs": "^1.8.26",                   // 时间处理库，API与moment.js一致
    "popper.js": "^1.16.1",               // 弹窗插件
    "splitpanes": "^2.2.1",               // 可伸缩窗口插件
    "vue-drag-drop": "^1.1.4",            // 拖拽/放置插件，用来实现大部分拖拽功能
    "vue-draggable-resizable": "^2.1.2",  // 可拖拽可缩放容器插件，用来实现人员选择框的拖拽/缩放效果
    "vue-wysiwyg": "^1.7.2",              // 富文本编辑器
```
    

## 注意事项

为实现弹窗的流程控制，与传统的弹框展示方式有些区别，与流程相关的弹框都是通过
手动创建实例的方式创建并展示，返回一个Promise。同时通过弹框内的两个按钮点击回调来控制
promise的状态。

当前的流程控制用promise嵌套来解决，可以用async/await来优化代码

其他关于d3的操作和SVG的图形绘制，可参考官方文档。如有问题可以联系我。
