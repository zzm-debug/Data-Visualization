#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
词云生成脚本
从歌单JSON文件中提取lyrics和comments，生成词云图
"""

import json
import re
import os
from collections import Counter

# 安装依赖：pip install jieba wordcloud matplotlib --break-system-packages

import jieba
from wordcloud import WordCloud
import matplotlib.pyplot as plt

# ==================== 配置区 ====================

# JSON文件路径列表
JSON_FILES = [
    '/mnt/user-data/uploads/new_playlists_data.json',
    '/mnt/user-data/uploads/歌单_2314343014.json',
    '/mnt/user-data/uploads/歌单_4928935213.json',
    '/mnt/user-data/uploads/歌单_5151662311.json',
    '/mnt/user-data/uploads/歌单_17562030729.json',
]

# 输出文件路径
OUTPUT_PATH = '/mnt/user-data/outputs/词云图.png'

# 中文字体路径（词云需要中文字体）
FONT_PATH = '/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc'

# 停用词列表（可根据需要扩展）
STOP_WORDS = set([
    # 常见停用词
    '的', '了', '是', '我', '你', '他', '她', '它', '们', '这', '那', '就',
    '在', '有', '和', '与', '或', '但', '而', '也', '都', '会', '能', '可以',
    '不', '没', '没有', '很', '太', '更', '最', '把', '被', '让', '给', '到',
    '去', '来', '上', '下', '中', '里', '外', '前', '后', '左', '右', '个',
    '什么', '怎么', '为什么', '哪', '哪里', '谁', '多少', '几', '如何',
    '这个', '那个', '这些', '那些', '自己', '什么', '一个', '一些', '一样',
    '因为', '所以', '如果', '虽然', '但是', '然后', '还是', '或者', '而且',
    '不是', '就是', '只是', '还有', '已经', '一直', '一定', '一起', '一下',
    '啊', '吧', '呢', '吗', '哦', '哈', '嗯', '呀', '哎', '唉', '嘿', '喂',
    '真的', '真是', '确实', '其实', '可能', '应该', '需要', '想要', '知道',
    '觉得', '感觉', '看到', '听到', '说', '想', '看', '听', '做', '走', '跑',
    # 歌词中常见无意义词
    '作词', '作曲', '编曲', '制作人', '混音', '母带', '演唱', '原唱',
    'feat', 'prod', 'remix', 'live', 'cover', 'version',
    # 英文常见词
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'can', 'need', 'shall',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
    'my', 'your', 'his', 'her', 'its', 'our', 'their', 'mine', 'yours', 'ours',
    'this', 'that', 'these', 'those', 'what', 'which', 'who', 'whom', 'whose',
    'and', 'or', 'but', 'if', 'because', 'as', 'when', 'while', 'although',
    'to', 'of', 'in', 'on', 'at', 'by', 'for', 'with', 'about', 'from',
    'into', 'through', 'during', 'before', 'after', 'above', 'below',
    'up', 'down', 'out', 'off', 'over', 'under', 'again', 'further', 'then',
    'so', 'than', 'too', 'very', 'just', 'only', 'now', 'here', 'there',
    'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some',
    'such', 'no', 'not', 'any', 'same', 'different', 'own',
    'yeah', 'oh', 'ah', 'uh', 'um', 'hmm', 'hey', 'yo', 'ya', 'yea', 'na',
    'la', 'da', 'di', 'do', 'de', 'le', 'lo', 'baby', 'babe', 'boy', 'girl',
    'like', 'dont', 'wanna', 'gonna', 'gotta', 'aint', 'cant', 'wont',
    'know', 'got', 'get', 'let', 'come', 'go', 'make', 'take', 'see', 'say',
    # 特殊符号和数字
    '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百', '千', '万',
])

# ==================== 函数定义 ====================

def load_json_files(file_paths):
    """加载所有JSON文件"""
    all_data = []
    for path in file_paths:
        try:
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                all_data.extend(data)
                print(f"✅ 加载成功: {os.path.basename(path)} ({len(data)} 首歌)")
        except Exception as e:
            print(f"❌ 加载失败: {path} - {e}")
    return all_data


def extract_text(data):
    """从数据中提取lyrics和comments文本"""
    texts = []
    
    for song in data:
        # 提取歌词
        lyric = song.get('lyric', '')
        if lyric:
            texts.append(lyric)
        
        # 提取评论
        comments = song.get('comments', [])
        if comments:
            texts.extend(comments)
    
    return '\n'.join(texts)


def clean_text(text):
    """清理文本"""
    # 移除特殊字符，保留中英文和基本标点
    text = re.sub(r'[^\u4e00-\u9fa5a-zA-Z\s]', ' ', text)
    # 移除多余空格
    text = re.sub(r'\s+', ' ', text)
    # 转小写（英文）
    text = text.lower()
    return text


def segment_text(text):
    """使用jieba分词"""
    words = jieba.cut(text)
    return list(words)


def filter_words(words, min_length=2):
    """过滤停用词和短词"""
    filtered = []
    for word in words:
        word = word.strip()
        # 过滤条件：长度>=min_length，不在停用词列表中
        if len(word) >= min_length and word.lower() not in STOP_WORDS:
            filtered.append(word)
    return filtered


def generate_wordcloud(word_freq, output_path, font_path):
    """生成词云图"""
    wc = WordCloud(
        font_path=font_path,
        width=1600,
        height=1000,
        background_color='white',
        max_words=300,
        max_font_size=200,
        min_font_size=10,
        random_state=42,
        colormap='viridis',  # 配色方案，可选：'plasma', 'magma', 'inferno', 'cividis', 'Set2'
        prefer_horizontal=0.7,
    )
    
    wc.generate_from_frequencies(word_freq)
    
    # 保存图片
    wc.to_file(output_path)
    print(f"✅ 词云已保存至: {output_path}")
    
    # 显示词云（可选）
    plt.figure(figsize=(16, 10))
    plt.imshow(wc, interpolation='bilinear')
    plt.axis('off')
    plt.tight_layout()
    plt.savefig(output_path, dpi=150, bbox_inches='tight')
    plt.close()


def main():
    print("=" * 50)
    print("🎵 歌单词云生成器")
    print("=" * 50)
    
    # 1. 加载数据
    print("\n📂 正在加载JSON文件...")
    data = load_json_files(JSON_FILES)
    print(f"📊 共加载 {len(data)} 首歌曲")
    
    # 2. 提取文本
    print("\n📝 正在提取歌词和评论...")
    raw_text = extract_text(data)
    print(f"📊 提取文本长度: {len(raw_text)} 字符")
    
    # 3. 清理文本
    print("\n🧹 正在清理文本...")
    clean = clean_text(raw_text)
    
    # 4. 分词
    print("\n✂️ 正在分词...")
    words = segment_text(clean)
    print(f"📊 分词结果: {len(words)} 个词")
    
    # 5. 过滤停用词
    print("\n🔍 正在过滤停用词...")
    filtered_words = filter_words(words)
    print(f"📊 过滤后: {len(filtered_words)} 个词")
    
    # 6. 统计词频
    print("\n📈 正在统计词频...")
    word_freq = Counter(filtered_words)
    print(f"📊 不同词汇数: {len(word_freq)}")
    print("\n🔝 词频 Top 20:")
    for word, count in word_freq.most_common(20):
        print(f"   {word}: {count}")
    
    # 7. 生成词云
    print("\n🎨 正在生成词云...")
    generate_wordcloud(dict(word_freq), OUTPUT_PATH, FONT_PATH)
    
    print("\n" + "=" * 50)
    print("✅ 完成！")
    print("=" * 50)


if __name__ == '__main__':
    main()
