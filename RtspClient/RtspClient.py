import cv2
import numpy as np
import threading
import tkinter as tk
from tkinter import messagebox
from multiprocessing import Process
from PIL import Image, ImageTk
from utils import get_logger
import win32api
from typing import Tuple


class RtspClient:
    def __init__(self, rtsp_urls, position='lt', logger=None):
        self.rtsp_urls = rtsp_urls
        self.num_streams = len(rtsp_urls)
        self.caps = []
        self.threads = []
        self.frames = [None] * self.num_streams
        self.running = True
        self._logger = logger
        self.position = position

        # 获取屏幕分辨率
        self.screen_width = win32api.GetSystemMetrics(0)
        self.screen_height = win32api.GetSystemMetrics(1)

        # window_width
        self.window_width = self.screen_width // 2
        self.window_height = self.screen_height // 2

        # 确定宫格布局
        if self.num_streams == 1:
            self.grid_rows, self.grid_cols = 1, 1
        elif 2 <= self.num_streams <= 4:
            self.grid_rows, self.grid_cols = 2, 2
        else:
            self.grid_rows, self.grid_cols = 3, 3

        self.cell_width = self.window_width // self.grid_cols
        self.cell_height = self.window_height // self.grid_rows

    def __enter__(self):
        self.start_streams()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.stop_streams()

    def start_streams(self):
        """启动多线程拉取RTSP流"""
        for i, url in enumerate(self.rtsp_urls):
            event = threading.Event()  # 用于控制超时
            thread = threading.Thread(target=self.open_rtsp_stream, args=(i, url, event))
            thread.start()
            thread.join(timeout=5)  # 设定 10s 超时
            if not event.is_set():
                self._logger.info(f"RTSP 流连接超时: {url}")

    def open_rtsp_stream(self, index, url, event):
        """尝试打开 RTSP 流"""
        try:
            cap = cv2.VideoCapture(url)
            cap.set(cv2.CAP_PROP_OPEN_TIMEOUT_MSEC, 5000)  # 连接超时 5 秒 (若 OpenCV 支持)
            self._logger.info(f"超时时间 5s")
            if cap.isOpened():
                event.set()  # 标记成功连接
                self._logger.info(f"成功打开 RTSP 流: {url}")
                self.caps.append(cap)
                thread = threading.Thread(target=self.capture_stream, args=(index, cap))
                thread.start()
                self.threads.append(thread)
            else:
                self._logger.info(f"无法打开 RTSP 流: {url}")
        except Exception as e:
            self._logger.error(f"RTSP 流 {url} 打开失败，错误: {e}")

    def capture_stream(self, index, cap):
        """拉取RTSP流帧数据"""
        while self.running:
            try:
                ret, frame = cap.read()
                if ret:
                    self.frames[index] = cv2.resize(frame, (self.cell_width, self.cell_height))
            except Exception as e:
                self._logger.error(f"capture_stream 读取 RTSP 流帧时出错:")
                break

    def stop_streams(self):
        """释放资源"""
        self._logger.info("正在释放opencv资源...")
        self.running = False
        for cap in self.caps:
            cap.release()
        for thread in self.threads:
            thread.join()
        cv2.destroyAllWindows()

    def show_place(self) -> Tuple:
        '''根据 self.position 计算窗口位置'''
        position = self.position.lower()
        if position == 'lt':
            x, y = 0, 0
        elif position == 'rt':
            x, y = self.screen_width - self.window_width, 0
        elif position == 'lb':
            x, y = 0, self.screen_height - self.window_height
        elif position == 'rb':
            x, y = self.screen_width - self.window_width, self.screen_height - self.window_height
        else:
            raise ValueError("Invalid position. Please use 'lt', 'rt', 'lb', or 'rb'.")
        return x, y

    def display_streams(self, root):
        """显示所有RTSP流"""
        canvas = tk.Canvas(root, width=self.window_width, height=self.window_height)
        canvas.pack()

        self._logger.info(f"cell_width: {self.cell_width}, window_width : {self.window_width}, screen_width : {self.screen_width}")

        while self.running:
            output_frame = np.zeros((self.window_height, self.window_width, 3), dtype=np.uint8)

            for i, frame in enumerate(self.frames):
                if frame is not None:
                    row, col = divmod(i, self.grid_cols)
                    y1, y2 = row * self.cell_height, (row + 1) * self.cell_height
                    x1, x2 = col * self.cell_width, (col + 1) * self.cell_width
                    output_frame[y1:y2, x1:x2] = frame

            # Convert to ImageTk format for displaying on tkinter canvas
            image = Image.fromarray(output_frame)
            imgtk = ImageTk.PhotoImage(image=image)

            canvas.create_image(0, 0, anchor=tk.NW, image=imgtk)

            root.update_idletasks()
            root.update()

        self.stop_streams()


def set_tkinter_root(root, client, position='lt', logger=None):
    root.title("RTSP Viewer")

    # 获取屏幕的宽度和高度
    screen_width = root.winfo_screenwidth()
    screen_height = root.winfo_screenheight()

    # 设置窗口宽度为屏幕宽度的一半，高度为屏幕高度的一半
    window_width = screen_width // 2
    window_height = screen_height // 2

    # 根据传入的位置参数计算窗口的位置
    if position == 'lt':  # 左上角
        x_position, y_position = 0, 0
    elif position == 'rt':  # 右上角
        x_position, y_position = screen_width - window_width, 0
    elif position == 'lb':  # 左下角
        x_position, y_position = 0, screen_height - window_height
    elif position == 'rb':  # 右下角
        x_position, y_position = screen_width - window_width, screen_height - window_height
    elif position == 'lm':  # 屏幕左边中间
        x_position, y_position = 0, (screen_height - window_height) // 2
    elif position == 'rm':  # 屏幕右边中间
        x_position, y_position = screen_width - window_width, (screen_height - window_height) // 2
    elif position == 'mm':  # 屏幕中央
        x_position, y_position = (screen_width - window_width) // 2, (screen_height - window_height) // 2
    else:
        raise ValueError("Invalid position. Choose from 'lt', 'rt', 'lb', 'rb', 'lm', 'rm'.")

    # 设置窗口大小和位置
    root.geometry(f"{window_width}x{window_height}+{x_position}+{y_position}")

    # 禁止窗口大小调整
    root.resizable(False, False)

    # 将窗口置于顶层
    root.attributes("-topmost", True)

    # 监听窗口关闭事件
    root.protocol("WM_DELETE_WINDOW", lambda: on_close(client, root, logger))

def on_close(client, root, logger):
    # 这里可以添加自定义退出前的逻辑，例如保存数据、清理资源等
    # 创建一个标签显示正在释放资源
    label = tk.Label(root, text="正在释放资源...", font=("Arial", 50), fg="red")
    label.place(relx=0.5, rely=0.5, anchor=tk.CENTER)  # 居中显示标签

    # 确保 GUI 更新
    root.update_idletasks()
    root.update()

    client.stop_streams()
    logger.info("窗口关闭")
    root.destroy()  # 销毁窗口，退出应用程序

# 示例使用
if __name__ == "__main__":
    rtsp_urls = [
        'rtsp://admin:cumtb617@192.168.0.104:554/Streaming/Channels/1',
        'rtsp://admin:cumtb617@192.168.0.104:554/Streaming/Channels/1',
        'rtsp://admin:cumtb617@192.168.0.104:554/Streaming/Channels/1',
        'rtsp://admin:cumtb617@192.168.0.104:554/Streaming/Channels/1',
        'rtsp://admin:cumtb617@192.168.0.104:554/Streaming/Channels/1',
        'rtsp://admin:cumtb617@192.168.0.104:554/Streaming/Channels/1',
        'rtsp://admin:cumtb617@192.168.0.104:554/Streaming/Channels/1',
        'rtsp://admin:cumtb617@192.168.0.104:554/Streaming/Channels/1',
        'rtsp://admin:cumtb617@192.168.0.104:554/Streaming/Channels/1',
    ]

    # Initialize tkinter window
    logger = get_logger()

    with RtspClient(rtsp_urls, position='mm', logger=logger) as client:
        root = tk.Tk()
        set_tkinter_root(root,client, 'mm', logger)
        client.display_streams(root)
