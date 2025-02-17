# Hk-python

使用python opencv接入海康多路摄像头, 思路有两种:

- GUI: 开多线程使用opencv拉rtsp流，读帧后创建tkinter显示。具体而言：1个则fullwindow，`2~4`个四宫格，`5~9`个使用九宫格。
- Flask: 原理同上，不过使用opencv写帧到`index.html`, 使用flask返回该`view`. 



问题:

- 多路摄像头同时播放时 ( 此处6路 ), 两者的cpu占用率高, `Amd Ryzen7 3700x 8core`占用率约为`30%`, GUI略低大概是`27%`, 内存占用`500~600M`
- 用`flask结合opencv`开`Python`的服务感觉不是很放心, 服务器端一直用`opencv`拉流容易有内存泄露导致程序崩溃的问题. (也许可以考虑只有在**有人访问时才拉流**这种做法)



repo结构

```
.
|-- RtspClient # tkinter
|-- RtspServer # flask
```

