import requests

localpath = "http://127.0.0.1:5000"

def send_data(group, type, data):
    url = f"{localpath}/send"
    json_data = {
        "group": group,
        "type": type,
        "data": data}
    response = requests.post(url, json=json_data)
    return response.json()

def get_data(group, type):
    url = f"{localpath}/data"
    params = {
        "group": group,
        "type": type}
    response = requests.get(url, params=params)
    return response.json()

if __name__ == "__main__":
    # 示例数据发送
    response = send_data("group1", "typeA", {"value": 123, "info": "test data"})
    print("Send Response:", response)
    # 示例数据获取
    response = get_data("group1", "typeA")
    print("Get Response:", response)




    