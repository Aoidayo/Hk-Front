# hk-front
使用海康插件+vue接入海康的硬盘录像机，连接多路摄像头

目录
```bash
- public
    - index.html # 引入hk插件及其余文件
    - hkws # 存放hk文件
- src 
    - components
        - HkCamera # 封装hk组件
        - TestHkLogin # 调用HkCamera
        - CameraTest # 连接多路摄像头，使用webctrlplugin分割窗口显示
    - NVRconfig.js
        # 引入硬盘录像机需要的配置
```

使用
```
cd hk-front
npm install
npm run serve
```