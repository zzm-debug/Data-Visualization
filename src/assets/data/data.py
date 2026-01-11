import json

# 读取原始 JSON 文件
with open('歌单_5151662311.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# 只保留 genre 字段
new_data = [{"genre": song["genre"]} for song in data]

# 保存到新文件
with open('filtered_genre.json', 'w', encoding='utf-8') as new_file:
    json.dump(new_data, new_file, ensure_ascii=False, indent=4)
