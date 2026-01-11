// 运行命令：node extractTimelineData.js
// 功能：从 music_genres_full_with_scraped_info.json 中提取时间轴所需的关键信息
// 输出：timelineData.js 文件，包含 const musicData = [...] 结构

import fs from "fs";

// 1️⃣ 目标流派
const targetGenres = ["Folk", "Pop", "Rock", "Rap", "Electronic", "Classical", "Jazz"];

// 2️⃣ 读取原始 JSON
const raw = fs.readFileSync("E:/数据可视化/zzm1 - 副本/src/assets/music_genres_full_with_scraped_info.json", "utf-8");

const allGenres = JSON.parse(raw);

// 3️⃣ 提取目标流派数据
const extracted = [];

for (const genre of allGenres) {
  if (!targetGenres.includes(genre.name)) continue;

  // 尝试从文本中提取时间信息（年份）和起源字段
  const startMatch = genre.info.match(/\b(1[0-9]{3}|20[0-2][0-9])\b/); // 第一个年份
  const endMatch = genre.info.match(/\bto\s+(1[0-9]{3}|20[0-2][0-9])\b/i); // “to XXXX” 模式

  const start = startMatch ? parseInt(startMatch[1]) : null;
  const end = endMatch ? parseInt(endMatch[1]) : 2025;

  // 尝试提取起源信息
  const originMatch = genre.info.match(/origin(?:ated)?(?: in)? ([A-Z][a-z]+(?:,? [A-Z][a-z]+)?)/i);
  const origin = originMatch ? originMatch[1] : "Unknown";

  extracted.push({
    genre: genre.name,
    start: start || 1900,
    end,
    origin
  });
}

// 4️⃣ 输出为 timelineData.js
const jsContent = `// 自动生成的音乐时间轴数据
export const musicData = ${JSON.stringify(extracted, null, 2)};`;

fs.writeFileSync("timelineData.js", jsContent, "utf-8");

console.log("✅ 已生成 timelineData.js，共提取", extracted.length, "种音乐类型。");
