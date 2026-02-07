# workassistant

工作助手 - 一个基于Flask的数据中转服务，用于在不同应用或模块之间传递数据。

## 功能特性

- 基于内存的数据存储和检索（注意：数据在服务重启后会丢失）
- 支持按组（group）和类型（type）组织数据
- RESTful API接口
- 跨域资源共享（CORS）支持
- JavaScript工具函数库（toast提示、日志管理、拖拽等）

## 环境要求

- Python 3.7+
- pip包管理器

## 安装和运行

### Windows系统

1. 克隆仓库或下载源代码
2. 运行启动脚本：
```bash
start_flask.bat
```

### Linux/Mac系统

1. 克隆仓库或下载源代码
2. 运行启动脚本：
```bash
./start_flask.sh
```

### 手动安装

1. 创建虚拟环境（推荐）：
```bash
python -m venv .venv
```

2. 激活虚拟环境：
   - Windows: `.venv\Scripts\activate`
   - Linux/Mac: `source .venv/bin/activate`

3. 安装依赖：
```bash
pip install -r requirements.txt
```

4. 运行应用：
```bash
python app.py
```

服务将在 `http://127.0.0.1:5000` 启动。

## API接口文档

### 1. 发送数据

**接口**: `POST /send`

**请求体**:
```json
{
  "group": "group1",
  "type": "typeA",
  "data": {"value": 123, "info": "test data"}
}
```

**响应**:
```json
{
  "status": "ok",
  "message": "数据接收成功",
  "data": {"value": 123, "info": "test data"}
}
```

### 2. 获取数据

**接口**: `GET /data?group=group1&type=typeA`

**参数**:
- `group`: 数据组名称
- `type`: 数据类型

**响应**:
```json
{
  "status": "ok",
  "data": {"value": 123, "info": "test data"}
}
```

### 3. 首页

**接口**: `GET /`

返回简单的HTML页面。

## 使用示例

查看 `test.py` 文件获取Python客户端使用示例：

```python
import requests

# 发送数据
response = requests.post("http://127.0.0.1:5000/send", json={
    "group": "group1",
    "type": "typeA",
    "data": {"value": 123, "info": "test data"}
})
print(response.json())

# 获取数据
response = requests.get("http://127.0.0.1:5000/data", params={
    "group": "group1",
    "type": "typeA"
})
print(response.json())
```

## JavaScript工具库

`util.js` 提供了一组实用的前端工具函数：

- **showToast**: 显示消息提示框
- **log**: 日志记录到localStorage
- **createLogButtonGroup**: 创建日志管理按钮组
- **addButton**: 动态添加按钮
- **makeDraggable**: 使元素可拖动
- **bindCopy**: 绑定复制功能
- **request**: 通用HTTP请求函数

## 项目结构

```
workassistant/
├── app.py              # Flask后端服务
├── test.py             # 测试客户端示例
├── util.js             # JavaScript工具函数库
├── requirements.txt    # Python依赖
├── start_flask.bat     # Windows启动脚本
├── start_flask.sh      # Linux/Mac启动脚本
├── .gitignore         # Git忽略文件配置
└── README.md          # 项目文档
```

## 注意事项

- 数据存储在内存中，服务重启后数据会丢失
- 适用于临时数据中转和开发测试场景
- 生产环境建议使用持久化存储方案（如数据库）

## 开发调试

应用运行在调试模式下，代码修改会自动重载。如需关闭调试模式，修改 `app.py` 中的：
```python
app.run(host='127.0.0.1', port=5000, debug=False)
```

## 许可证

本项目为开源项目，可自由使用和修改。