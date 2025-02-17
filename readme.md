# 常见转流

- **RTSP**（实时流协议，Real-Time Streaming Protocol）是一个用于控制流媒体服务器的协议。RTSP 主要用于视频监控和媒体播放的实时流传输。

  - 浏览器不能直接播放, 需要第三方转码( 转码成浏览器可以直接播放的m3u8/rtmp/mse/hls等格式[^1], 通过websocket等方式传输给前端播放, 或者直接通过webrtc进行数据的传输)

- **WebRTC**（Web Real-Time Communication）是一个支持浏览器之间进行直接视频、语音通信的技术。WebRTC 允许直接的 P2P（点对点）数据流传输，包括视频和音频流。它的一个主要优势是可以在没有额外插件的情况下，通过浏览器进行高质量的实时通信。

  - Go2Rtc, 结合websocket和webrtc的实时视频流传输

  - **WebRTC 信令阶段（使用 WebSocket）**：

    - 在浏览器和服务器之间通过 WebSocket 协议传递信令消息（如：交换 ICE 候选、SDP 信息等）。
    - WebSocket 用于信令传输，而 WebRTC 用于建立连接和传输数据流。

    **WebRTC 实际数据流（不通过 WebSocket）**：

    - 一旦建立了 WebRTC 连接，实际的音视频流或数据流将通过 WebRTC 的 RTP（音视频流）和 SCTP（任意数据流）传输，而 **WebSocket 不再参与音视频流的传输**。





# Go2Rtc

**Go2RTC** 是一个基于 **WebRTC** 协议的流媒体转发服务器，能够将 RTSP、RTMP、HLS 等流转换为 WebRTC 流，并通过 WebRTC 协议将流实时推送到浏览器中进行播放。Go2RTC 采用 **WebSocket** 协议作为客户端与服务器之间的信令通道，而并非直接使用 WebRTC 的 RTP 协议进行传输。这是因为 WebSocket 在 WebRTC 的应用中主要承担了以下几个重要的角色：

## 如何使用



1. [oldweipro/go2rtc-vue: 基于AlexxIT/go2rtc实现的mse取流vue版本](https://github.com/oldweipro/go2rtc-vue)
   **原理**: 传递json参数(包含type: mse, webrtc等) 建立websocket连接, 使用video播放websocket中的二进制视频流. 
   **缺点**: 这种直接使用video播放的方法疑似初始化webrtc有点慢. 

1. 官方repo示例
   **原理:** 也是将ws的二进制流(WebRTC、MSE (Media Source Extensions)、HLS 等)传输到video标签上, 不过代码写的非常好, 详情可以参见:[go2rtc/www/video-rtc.js at master · AlexxIT/go2rtc](https://github.com/AlexxIT/go2rtc/blob/master/www/video-rtc.js#L240), 可以看这段代码的240行. 

   - **如果是WebRtc**, 使用 `RTCPeerConnection` 来处理 WebRTC 视频流。
   - **MSE 播放：** 如果浏览器支持 MSE，它会使用 `MediaSource` API 来处理视频流。
   - **HLS 播放：** 如果浏览器支持 HLS，它会使用 `video` 标签播放 HLS 流。

   **缺点同上**: 这种直接使用video播放的方法疑似初始化webrtc有点慢. 



> 以下内容为AI生成:
>
> ## 为什么 Go2RTC 使用 WebSocket 协议播放流？
>
> 1. **信令通道的作用**： WebRTC 协议本身是一个点对点的通信协议，它需要通过信令交换来建立连接。信令过程通常包括以下几个步骤：
>
>    - 交换 **SDP**（会话描述协议）信息：这是一种描述多媒体会话的格式，WebRTC 用它来交换音视频流的编码格式、传输方式等信息。
>    - 交换 **ICE**（Interactive Connectivity Establishment）候选：用于帮助浏览器建立直接的点对点连接。
>
>    **WebSocket** 协议可以非常方便地用作 **信令通道**，因为 WebSocket 提供了低延迟、双向、持久的连接，适合传输这种实时的信令数据。
>
>    **Go2RTC** 使用 WebSocket 来交换这些信令信息，通过 WebSocket 来通知客户端如何连接到流的源头。这部分的工作在 WebRTC 中被称为 "信令"。
>
> 1. **WebRTC 中的流传输与信令分离**： WebRTC 协议的设计是将信令和数据流传输分离的。也就是说，**WebSocket** 仅仅负责信令部分，帮助建立连接；而实际的音视频流则通过 **WebRTC 的 RTP (Real-time Transport Protocol)** 或 **SCTP (Stream Control Transmission Protocol)** 进行传输。
>
>    在 Go2RTC 中，WebRTC 通过其 **RTCPeerConnection** 来接收 RTSP 或其他流格式的媒体，并将媒体流封装成 RTP 包，通过点对点连接将其传输给客户端。
>
> 1. **WebSocket 用于建立与客户端的 WebRTC 连接**：
>
>    - WebSocket 在 Go2RTC 中的作用是在浏览器和服务器之间建立和管理 WebRTC 连接，帮助传递信令。
>    - WebSocket 提供的是持久连接，因此它非常适合用于 WebRTC 的信令交换，它允许浏览器与 Go2RTC 服务器之间实时地发送和接收信令消息。
>
> 1. **方便的浏览器兼容性**： WebSocket 是一种被所有现代浏览器广泛支持的协议，能够轻松处理跨平台的实时通信。在大多数 WebRTC 实现中，信令部分通常会使用 WebSocket，因为它能提供简单且高效的双向通信通道。
>
> 1. **简化了架构设计**： 使用 WebSocket 来进行信令交换，Go2RTC 可以避免复杂的 HTTP 请求和响应机制，而且 WebSocket 可以让服务器在没有任何请求的情况下主动推送信息到客户端，这使得客户端能够实时接收到媒体流的控制信息（例如媒体流开始/停止的信号）。
>
> 1. **低延迟、实时传输**： 由于 WebSocket 是基于 TCP 的全双工连接，可以提供低延迟的消息传递，适合 WebRTC 对时效性的要求。它使得信令交换几乎是实时的，帮助 WebRTC 在点对点连接的建立过程中高效交换信息。
>
> ## 总结
>
> 在 **Go2RTC** 中使用 **WebSocket** 协议播放流，实际上是通过 WebSocket 来处理 **WebRTC 信令**。WebSocket 提供了一个低延迟、持久、全双工的通道，用于在客户端（浏览器）和服务器（Go2RTC）之间交换信令信息，如 SDP、ICE 候选等，用以建立和维护 WebRTC 连接。而真正的音视频流数据是通过 WebRTC 的 RTP 协议进行传输的。
>
> **简单来说**，WebSocket 在 Go2RTC 中的主要作用是为 WebRTC 提供信令服务，而 WebRTC 本身则负责通过 RTP 协议进行音视频数据的实时传输。

# WebRtcStreamer

在Vue中播放通过webrtcStreamer转码后的RTSP流, 具体步骤如下:

1. **安装并启动webrtc-streamer**：

   - 从GitHub下载webrtc-streamer的适合操作系统的版本：[webrtc-streamer GitHub](https://github.com/mpromonet/webrtc-streamer/releases)。

   - 解压下载的webrtc-streamer包，进入解压后的目录，使用命令行启动服务。使用 `./webrtc-streamer -C config.json -o` 启动服务。

   - ```bash
     {
       "streams": [
         {
           "name": "camera1",
           "url": "rtsp://username:password@camera_ip:554/stream1"
         }
       ]
     }
     ```

   - 启动命令参数

     - `-o`: 表示使用“null codec”，即不进行任何编码转换，直接将原始流传递给WebRTC连接. 需要确保原始视频流可以直接被前端播放, 比如流需要是浏览器广泛支持的H.264视频编码和AAC音频编码, H265不能直接播放. 

1. **在Vue项目中引入必要的JS文件**：

   - 将webrtc-streamer包中的 `webrtcstreamer.js` 和 `adapter.min.js` 文件复制到Vue项目的 `public` 目录下。

   - 在 `index.html` 中引入这两个JS文件：

     ```html
     <script src="/webrtcstreamer.js"></script>
     <script src="/adapter.min.js"></script>
     ```

   - 确保这两个文件的路径正确，并且能够被Vue项目正确引用。

1. **创建Vue组件用于播放视频流**：

   - 在Vue项目中创建一个新的组件，比如 `VideoPlayer.vue`，并在其中使用 `WebRtcStreamer`：

     ```vue
     <template>
       <div>
         <video id="video" autoplay width="600" height="400"></video>
       </div>
     </template>
     <script>
     import "./js/webrtcstreamer.js" //此处两个js也可全局引用
     import "./js/adapter.min.js"
     export default {
       name: "HomeView",
       data() {
         return {
           webRtcServer: null,
         };
       },
       mounted() {
         this.webRtcServer = new WebRtcStreamer(
           "video",
           'http://127.0.0.1:8000' // 本机ip+端口8000
         );
         this.webRtcServer.connect(
           "rtsp://your-rtsp-url" // 这是填自己的rtsp流地址
         );
       },
       beforeDestroy() {
         // 销毁
         this.webRtcServer.disconnect();
         this.webRtcServer = null;
       }
     };
     </script>
     ```

   - 替换 `"rtsp://your-rtsp-url"` 为你的RTSP流地址。

1. **在Vue应用中使用该组件**：

   - 在你的Vue应用的主组件中引入并使用 `VideoPlayer` 组件，这样就可以在页面上播放RTSP流了。

部署到生产环境，需要将 `http://127.0.0.1:8000` 替换为服务器的IP地址和端口。

[^1]: 这里不是很清楚