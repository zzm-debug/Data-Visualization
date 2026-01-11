import json
from collections import Counter
import math

# 读取文件
with open(r"E:\数据可视化\zzm1 - 副本\src\assets\data\mapped_genre.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# 按顺序分成 25 份
n = len(data)
chunk_size = math.ceil(n / 25)

results = []

for i in range(25):
    chunk = data[i * chunk_size:(i + 1) * chunk_size]
    if not chunk:
        break
    counter = Counter()
    for item in chunk:
        for g in item["genre"]:
            counter[g] += 1
    most_common = counter.most_common(1)[0] if counter else ("无", 0)
    results.append({"part": i + 1, "top_genre": most_common[0], "count": most_common[1]})

import pandas as pd


df = pd.DataFrame(results)
print("每份出现次数最高的种类",df)

