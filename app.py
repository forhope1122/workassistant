from flask import Flask, request, jsonify
from flask_cors import CORS


# 创建flask应用，并且启用CORS 允许跨区访问
app = Flask(__name__)
CORS(app)

# 内存数据中转区
memory_store = {}

@app.route('/send', methods=['POST'])
def send_date():
    # 获取JSON数据
    json_data = request.get_json()
    print("Received JSON data:", json_data)

     # 参数校验
    group = json_data.get("group")
    type = json_data.get("type")
    data = json_data.get("data")
    print("Data:", data)
    if not  group or not type or not data:
        return jsonify({'status': 'error','message': '缺少参数'}), 400
    
    # 初始化嵌套字典
    if group not in memory_store:
        memory_store[group] = {}
    memory_store[group][type] = data
    
    # 预埋后端处理函数

    return jsonify({'status': 'ok', 'message': '数据接收成功', 'data': data}), 200

@app.route('/data', methods=['GET'])
def get_data():
    group = request.args.get('group')
    type = request.args.get('type')
    
    if not group or not type:
        return jsonify({'status': 'error','message': '缺少group或type参数'}), 400
    
    # 检查数据是否存在
    if group not in memory_store or type not in memory_store[group]:
        return jsonify({'status': 'error','message': '数据不存在'}), 404
    
    data = memory_store[group][type]
    return jsonify({'status': 'ok', 'data': data})

@app.route('/')
def index():
    return '<h1>服务启动了，但是前端还没想好写什么，先就这样吧</h1>'

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)