from flask import Flask, render_template, Response, jsonify
import cv2

app = Flask(__name__)

# 摄像头 RTSP 地址
RTSP_STREAMS = {
    "cam1": "rtsp://admin:cumtb617@192.168.0.104:554/Streaming/Channels/1",
    "cam2": "rtsp://admin:cumtb617@192.168.0.104:554/Streaming/Channels/1",
    "cam3": "rtsp://admin:cumtb617@192.168.0.104:554/Streaming/Channels/1",
    "cam4": "rtsp://admin:cumtb617@192.168.0.104:554/Streaming/Channels/1",
    # "cam5": "rtsp://admin:cumtb617@192.168.0.104:554/Streaming/Channels/1",
    # "cam6": "rtsp://admin:cumtb617@192.168.0.104:554/Streaming/Channels/1",
    # "cam7": "rtsp://admin:cumtb617@192.168.0.104:554/Streaming/Channels/1",
    # "cam8": "rtsp://admin:cumtb617@192.168.0.104:554/Streaming/Channels/1",
    # "cam9": "rtsp://admin:cumtb617@192.168.0.104:554/Streaming/Channels/1",
}

# 创建摄像头实例
cameras = {key: cv2.VideoCapture(url, cv2.CAP_FFMPEG) for key, url in RTSP_STREAMS.items()}


def generate_frames(camera):
    """ 读取摄像头帧，并转换为 MJPEG """
    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            if not ret:
                continue

            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


@app.route('/video_feed/<cam_id>')
def video_feed(cam_id):
    """ 提供视频流 """
    if cam_id in cameras:
        return Response(generate_frames(cameras[cam_id]), mimetype='multipart/x-mixed-replace; boundary=frame')
    return "Invalid camera ID", 404


@app.route('/get_cameras')
def get_cameras():
    """ 发送摄像头列表给前端 """
    return jsonify(list(RTSP_STREAMS.keys()))


@app.route('/')
def index():
    """ 渲染 HTML 页面 """
    return render_template('index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)
