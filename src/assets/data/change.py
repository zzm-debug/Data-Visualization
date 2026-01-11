import json

# 读取文件
with open('filtered_genre.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 定义映射规则
def map_genre(genres):
    mapped = set()
    for g in genres:
        if "流行" in g:
            mapped.add("流行")
        elif "说唱" in g:
            mapped.add("说唱")
        elif "古典" in g:
            mapped.add("古典")
        elif "电子" in g:
            mapped.add("电子")
    return list(mapped) if mapped else None  # 如果没有匹配则返回 None

# 应用映射
mapped_data = []
for song in data:
    genres = song.get("genre", [])
    mapped = map_genre(genres)
    if mapped:
        mapped_data.append({"genre": mapped})

# 保存新文件
with open('mapped_genre.json', 'w', encoding='utf-8') as f:
    json.dump(mapped_data, f, ensure_ascii=False, indent=4)

print("已完成 genre 映射，结果保存在 mapped_genre.json")
