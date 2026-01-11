// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"QqXA":[function(require,module,exports) {
module.exports = {
  "summary": {
    "total_playlists": 6,
    "total_genre_types": 170,
    "total_songs": 2171,
    "total_songs_with_genre": 2156,
    "total_songs_without_genre": 15
  },
  "all_genres": {
    "流行": 1281,
    "华语流行": 487,
    "欧美流行": 410,
    "嘻哈说唱": 258,
    "原声带": 244,
    "电子": 238,
    "摇滚": 135,
    "R&B": 118,
    "电影原声": 107,
    "民谣": 91,
    "流行说唱": 81,
    "中文说唱": 75,
    "粤语流行": 73,
    "流行摇滚": 70,
    "国风": 56,
    "电子流行": 49,
    "电视剧原声": 48,
    "另类/独立": 48,
    "当代R&B": 47,
    "KPop": 45,
    "国风流行": 44,
    "轻音乐": 44,
    "华语民谣": 42,
    "流行舞曲": 41,
    "日本流行": 38,
    "综艺原声": 36,
    "未来贝斯": 27,
    "二次元": 27,
    "古典": 25,
    "陷阱说唱": 21,
    "浩室舞曲": 21,
    "独立流行": 20,
    "前卫浩室": 20,
    "流行民谣": 18,
    "旋律说唱": 17,
    "乡村": 17,
    "中速节奏": 16,
    "史诗音乐": 16,
    "深浩室舞曲": 16,
    "世界音乐": 15,
    "新世纪": 15,
    "放克": 13,
    "动画片原声": 12,
    "热带浩室舞曲": 12,
    "弛放嘻哈": 12,
    "民谣摇滚": 11,
    "陷阱舞曲": 11,
    "流行轻音乐": 11,
    "游戏原声": 10,
    "动漫原声": 10,
    "灵魂乐": 10,
    "电气浩室舞曲": 10,
    "成人当代音乐": 10,
    "模糊说唱": 9,
    "Disney": 9,
    "另类摇滚": 7,
    "乡村流行": 7,
    "情绪说唱": 7,
    "另类R&B": 7,
    "中国传统特色": 7,
    "巴西贝斯": 7,
    "另类流行": 6,
    "动漫主题曲": 6,
    "意识说唱": 6,
    "Afrobeats": 6,
    "硬核说唱": 6,
    "未来弹跳": 6,
    "合成器浪潮": 6,
    "电影配乐": 6,
    "国风戏腔": 5,
    "独立摇滚": 5,
    "Electronica": 5,
    "Disco": 5,
    "巴洛克时期": 5,
    "古典主义时期": 5,
    "未来浩室": 5,
    "低保真嘻哈": 5,
    "配乐": 5,
    "Phonk": 5,
    "游戏音乐": 4,
    "英伦摇滚": 4,
    "歌声合成": 4,
    "日本说唱": 4,
    "雷击顿": 4,
    "缓拍": 4,
    "华丽摇滚": 4,
    "说唱伴奏": 4,
    "俄语流行": 4,
    "古典跨界": 4,
    "古风": 3,
    "国风摇滚": 3,
    "独立民谣": 3,
    "Afro Trap": 3,
    "爵士": 3,
    "快嘴说唱": 3,
    "日系摇滚": 3,
    "法国流行": 3,
    "软摇滚": 3,
    "正能量": 3,
    "硬摇滚": 3,
    "慢摇DJ": 3,
    "当代古典音乐": 3,
    "City Pop": 3,
    "蓝调摇滚": 2,
    "手游原声": 2,
    "广播剧原声": 2,
    "钻头说唱": 2,
    "孟菲斯说唱": 2,
    "说唱摇滚": 2,
    "拉丁音乐": 2,
    "法国香颂": 2,
    "新灵魂乐": 2,
    "流行灵魂乐": 2,
    "另类嘻哈": 2,
    "朋克": 2,
    "旋律回响贝斯": 2,
    "青少年流行": 2,
    "乡村说唱": 2,
    "回响贝斯": 2,
    "脉冲流行": 2,
    "红色经典": 2,
    "室内流行": 2,
    "美式乡村": 2,
    "世界乐器体裁": 2,
    "钢琴": 2,
    "城市民谣": 2,
    "乡村摇滚": 2,
    "自然新世纪": 2,
    "时代曲": 2,
    "二十世纪古典": 2,
    "南方摇滚": 2,
    "弛放低音": 2,
    "国风电子": 2,
    "前卫摇滚": 1,
    "韩语说唱": 1,
    "Jersey Club": 1,
    "非洲传统与特色": 1,
    "国风嘻哈": 1,
    "西岸说唱": 1,
    "英国车库舞曲": 1,
    "匪帮说唱": 1,
    "人声爵士": 1,
    "都市流行": 1,
    "流行朋克": 1,
    "唱见": 1,
    "地域说唱": 1,
    "非洲流行": 1,
    "电子摇滚": 1,
    "贝斯浩室舞曲": 1,
    "主机游戏配乐": 1,
    "巴萨诺瓦": 1,
    "后朋克": 1,
    "歌谣曲": 1,
    "嘟喔普": 1,
    "欧洲传统与特色": 1,
    "地中海传统与特色": 1,
    "世界民谣": 1,
    "新迷幻": 1,
    "后摇": 1,
    "俄罗斯传统与特色": 1,
    "探戈": 1,
    "梦幻流行": 1,
    "旋律科技舞曲": 1,
    "简约科技舞曲": 1,
    "合成器流行": 1,
    "金属": 1,
    "新金属": 1,
    "浪漫主义时期": 1,
    "渐进浩室": 1,
    "柔顺爵士": 1
  },
  "playlist_details": {
    "new_playlists_data": {
      "total_songs": 296,
      "songs_with_genre": 296,
      "songs_without_genre": 0,
      "genre_count": 35,
      "genre_distribution": {
        "流行": 232,
        "华语流行": 209,
        "国风": 37,
        "原声带": 36,
        "民谣": 35,
        "国风流行": 31,
        "华语民谣": 21,
        "电影原声": 11,
        "电视剧原声": 11,
        "嘻哈说唱": 8,
        "综艺原声": 7,
        "摇滚": 7,
        "R&B": 7,
        "流行民谣": 6,
        "游戏原声": 5,
        "中文说唱": 5,
        "流行说唱": 5,
        "国风戏腔": 4,
        "古风": 3,
        "流行摇滚": 3,
        "当代R&B": 3,
        "粤语流行": 3,
        "旋律说唱": 2,
        "民谣摇滚": 2,
        "模糊说唱": 1,
        "轻音乐": 1,
        "蓝调摇滚": 1,
        "手游原声": 1,
        "未来贝斯": 1,
        "电子流行": 1,
        "电子": 1,
        "广播剧原声": 1,
        "国风摇滚": 1,
        "前卫摇滚": 1,
        "独立民谣": 1
      }
    },
    "歌单_17562030729": {
      "total_songs": 80,
      "songs_with_genre": 79,
      "songs_without_genre": 1,
      "genre_count": 35,
      "genre_distribution": {
        "流行": 54,
        "粤语流行": 18,
        "华语流行": 11,
        "欧美流行": 10,
        "二次元": 9,
        "摇滚": 9,
        "KPop": 5,
        "R&B": 5,
        "游戏音乐": 4,
        "原声带": 4,
        "另类/独立": 4,
        "电视剧原声": 3,
        "嘻哈说唱": 3,
        "另类摇滚": 3,
        "英伦摇滚": 3,
        "日本流行": 3,
        "当代R&B": 3,
        "电子": 2,
        "独立摇滚": 2,
        "歌声合成": 2,
        "民谣": 2,
        "电子流行": 1,
        "流行说唱": 1,
        "流行摇滚": 1,
        "动漫原声": 1,
        "Electronica": 1,
        "另类流行": 1,
        "动漫主题曲": 1,
        "华语民谣": 1,
        "日本说唱": 1,
        "韩语说唱": 1,
        "流行舞曲": 1,
        "乡村": 1,
        "乡村流行": 1,
        "电影原声": 1
      }
    },
    "歌单_17573004389": {
      "total_songs": 16,
      "songs_with_genre": 16,
      "songs_without_genre": 0,
      "genre_count": 8,
      "genre_distribution": {
        "流行": 15,
        "华语流行": 10,
        "粤语流行": 3,
        "原声带": 3,
        "电视剧原声": 2,
        "电影原声": 1,
        "流行摇滚": 1,
        "摇滚": 1
      }
    },
    "歌单_2314343014": {
      "total_songs": 827,
      "songs_with_genre": 821,
      "songs_without_genre": 6,
      "genre_count": 116,
      "genre_distribution": {
        "流行": 465,
        "欧美流行": 232,
        "嘻哈说唱": 173,
        "电子": 113,
        "原声带": 74,
        "华语流行": 65,
        "中文说唱": 57,
        "R&B": 52,
        "流行说唱": 48,
        "摇滚": 45,
        "KPop": 35,
        "流行舞曲": 31,
        "电子流行": 28,
        "流行摇滚": 26,
        "电影原声": 25,
        "综艺原声": 24,
        "另类/独立": 23,
        "日本流行": 20,
        "未来贝斯": 19,
        "当代R&B": 18,
        "陷阱说唱": 16,
        "电视剧原声": 15,
        "二次元": 12,
        "独立流行": 10,
        "前卫浩室": 10,
        "浩室舞曲": 9,
        "模糊说唱": 8,
        "放克": 8,
        "陷阱舞曲": 8,
        "世界音乐": 7,
        "意识说唱": 6,
        "Disney": 6,
        "Afrobeats": 6,
        "旋律说唱": 6,
        "动画片原声": 6,
        "古典": 6,
        "乡村": 6,
        "热带浩室舞曲": 6,
        "电气浩室舞曲": 6,
        "灵魂乐": 5,
        "轻音乐": 5,
        "中速节奏": 5,
        "民谣": 5,
        "硬核说唱": 4,
        "未来弹跳": 4,
        "动漫原声": 4,
        "动漫主题曲": 4,
        "情绪说唱": 3,
        "日本说唱": 3,
        "Afro Trap": 3,
        "国风": 3,
        "巴洛克时期": 3,
        "游戏原声": 3,
        "雷击顿": 3,
        "日系摇滚": 3,
        "成人当代音乐": 3,
        "中国传统特色": 3,
        "深浩室舞曲": 3,
        "钻头说唱": 2,
        "孟菲斯说唱": 2,
        "Disco": 2,
        "国风流行": 2,
        "另类R&B": 2,
        "粤语流行": 2,
        "快嘴说唱": 2,
        "另类嘻哈": 2,
        "缓拍": 2,
        "Electronica": 2,
        "软摇滚": 2,
        "华丽摇滚": 2,
        "歌声合成": 2,
        "独立摇滚": 2,
        "另类流行": 2,
        "流行民谣": 2,
        "乡村说唱": 2,
        "红色经典": 2,
        "弛放嘻哈": 2,
        "硬摇滚": 2,
        "Jersey Club": 1,
        "非洲传统与特色": 1,
        "国风嘻哈": 1,
        "西岸说唱": 1,
        "英国车库舞曲": 1,
        "匪帮说唱": 1,
        "说唱摇滚": 1,
        "拉丁音乐": 1,
        "流行轻音乐": 1,
        "人声爵士": 1,
        "爵士": 1,
        "法国香颂": 1,
        "新灵魂乐": 1,
        "乡村流行": 1,
        "广播剧原声": 1,
        "流行灵魂乐": 1,
        "古典主义时期": 1,
        "都市流行": 1,
        "法国流行": 1,
        "未来浩室": 1,
        "流行朋克": 1,
        "朋克": 1,
        "唱见": 1,
        "地域说唱": 1,
        "旋律回响贝斯": 1,
        "另类摇滚": 1,
        "青少年流行": 1,
        "低保真嘻哈": 1,
        "非洲流行": 1,
        "电子摇滚": 1,
        "正能量": 1,
        "回响贝斯": 1,
        "脉冲流行": 1,
        "史诗音乐": 1,
        "室内流行": 1,
        "贝斯浩室舞曲": 1,
        "慢摇DJ": 1,
        "美式乡村": 1
      }
    },
    "歌单_4928935213": {
      "total_songs": 225,
      "songs_with_genre": 225,
      "songs_without_genre": 0,
      "genre_count": 62,
      "genre_distribution": {
        "流行": 141,
        "华语流行": 112,
        "嘻哈说唱": 30,
        "原声带": 25,
        "R&B": 23,
        "民谣": 19,
        "电子": 14,
        "流行说唱": 13,
        "华语民谣": 12,
        "中文说唱": 11,
        "欧美流行": 11,
        "国风": 10,
        "电影原声": 10,
        "电视剧原声": 10,
        "国风流行": 9,
        "当代R&B": 9,
        "摇滚": 9,
        "旋律说唱": 6,
        "流行摇滚": 6,
        "轻音乐": 6,
        "乡村": 4,
        "浩室舞曲": 3,
        "KPop": 3,
        "情绪说唱": 3,
        "前卫浩室": 3,
        "深浩室舞曲": 3,
        "弛放嘻哈": 3,
        "陷阱说唱": 3,
        "乡村流行": 3,
        "综艺原声": 2,
        "中速节奏": 2,
        "电子流行": 2,
        "古典": 2,
        "另类R&B": 2,
        "流行舞曲": 2,
        "流行民谣": 2,
        "民谣摇滚": 2,
        "手游原声": 1,
        "新灵魂乐": 1,
        "国风摇滚": 1,
        "世界乐器体裁": 1,
        "钢琴": 1,
        "巴洛克时期": 1,
        "城市民谣": 1,
        "游戏原声": 1,
        "巴西贝斯": 1,
        "陷阱舞曲": 1,
        "说唱伴奏": 1,
        "中国传统特色": 1,
        "正能量": 1,
        "动画片原声": 1,
        "日本流行": 1,
        "硬核说唱": 1,
        "独立摇滚": 1,
        "古典主义时期": 1,
        "流行轻音乐": 1,
        "乡村摇滚": 1,
        "灵魂乐": 1,
        "未来弹跳": 1,
        "成人当代音乐": 1,
        "热带浩室舞曲": 1,
        "放克": 1
      }
    },
    "歌单_5151662311": {
      "total_songs": 727,
      "songs_with_genre": 719,
      "songs_without_genre": 8,
      "genre_count": 136,
      "genre_distribution": {
        "流行": 374,
        "欧美流行": 157,
        "电子": 108,
        "原声带": 102,
        "华语流行": 80,
        "摇滚": 64,
        "电影原声": 59,
        "粤语流行": 47,
        "嘻哈说唱": 44,
        "流行摇滚": 33,
        "轻音乐": 32,
        "R&B": 31,
        "民谣": 30,
        "另类/独立": 21,
        "古典": 17,
        "电子流行": 17,
        "史诗音乐": 15,
        "新世纪": 15,
        "日本流行": 14,
        "当代R&B": 14,
        "流行说唱": 14,
        "深浩室舞曲": 10,
        "独立流行": 10,
        "浩室舞曲": 9,
        "中速节奏": 9,
        "流行轻音乐": 9,
        "流行民谣": 8,
        "世界音乐": 8,
        "华语民谣": 8,
        "电视剧原声": 7,
        "未来贝斯": 7,
        "弛放嘻哈": 7,
        "民谣摇滚": 7,
        "前卫浩室": 7,
        "流行舞曲": 7,
        "成人当代音乐": 6,
        "合成器浪潮": 6,
        "国风": 6,
        "二次元": 6,
        "电影配乐": 6,
        "巴西贝斯": 6,
        "乡村": 6,
        "配乐": 5,
        "动漫原声": 5,
        "热带浩室舞曲": 5,
        "动画片原声": 5,
        "Phonk": 5,
        "灵魂乐": 4,
        "未来浩室": 4,
        "俄语流行": 4,
        "低保真嘻哈": 4,
        "放克": 4,
        "古典跨界": 4,
        "电气浩室舞曲": 4,
        "Disney": 3,
        "古典主义时期": 3,
        "说唱伴奏": 3,
        "当代古典音乐": 3,
        "旋律说唱": 3,
        "另类摇滚": 3,
        "中国传统特色": 3,
        "另类流行": 3,
        "另类R&B": 3,
        "City Pop": 3,
        "Disco": 3,
        "综艺原声": 3,
        "自然新世纪": 2,
        "独立民谣": 2,
        "陷阱说唱": 2,
        "爵士": 2,
        "中文说唱": 2,
        "KPop": 2,
        "时代曲": 2,
        "二十世纪古典": 2,
        "法国流行": 2,
        "乡村流行": 2,
        "华丽摇滚": 2,
        "国风流行": 2,
        "南方摇滚": 2,
        "弛放低音": 2,
        "陷阱舞曲": 2,
        "慢摇DJ": 2,
        "缓拍": 2,
        "Electronica": 2,
        "国风电子": 2,
        "主机游戏配乐": 1,
        "情绪说唱": 1,
        "巴萨诺瓦": 1,
        "朋克": 1,
        "后朋克": 1,
        "歌谣曲": 1,
        "室内流行": 1,
        "嘟喔普": 1,
        "欧洲传统与特色": 1,
        "蓝调摇滚": 1,
        "雷击顿": 1,
        "未来弹跳": 1,
        "动漫主题曲": 1,
        "英伦摇滚": 1,
        "硬摇滚": 1,
        "法国香颂": 1,
        "地中海传统与特色": 1,
        "世界民谣": 1,
        "新迷幻": 1,
        "后摇": 1,
        "俄罗斯传统与特色": 1,
        "说唱摇滚": 1,
        "拉丁音乐": 1,
        "探戈": 1,
        "钢琴": 1,
        "世界乐器体裁": 1,
        "巴洛克时期": 1,
        "城市民谣": 1,
        "流行灵魂乐": 1,
        "国风摇滚": 1,
        "国风戏腔": 1,
        "正能量": 1,
        "旋律回响贝斯": 1,
        "梦幻流行": 1,
        "旋律科技舞曲": 1,
        "游戏原声": 1,
        "简约科技舞曲": 1,
        "软摇滚": 1,
        "美式乡村": 1,
        "合成器流行": 1,
        "快嘴说唱": 1,
        "硬核说唱": 1,
        "金属": 1,
        "新金属": 1,
        "浪漫主义时期": 1,
        "乡村摇滚": 1,
        "青少年流行": 1,
        "渐进浩室": 1,
        "脉冲流行": 1,
        "回响贝斯": 1,
        "柔顺爵士": 1
      }
    }
  }
};
},{}],"QYep":[function(require,module,exports) {
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// genre-bar-chart.js - Cyber style genre bar chart (SVG)
// v2: 将单列 TopN 改为左右双面布局（左 15 + 右 15），避免标签/文字拥挤重叠
// 目标：避免 fetch 静态资源在 Parcel build 后丢失/路径变化导致的“数据加载失败”
// 做法：优先使用 Parcel 的 require 将 JSON 打进 bundle；失败时再 fallback 到 fetch 多路径尝试。

(function () {
  'use strict';

  var SVG_ID = 'genre-bar-svg';

  // 1) 优先：Parcel 在构建时处理 require，把 JSON 内容打包进 JS
  /** @type {any|null} */
  var bundledData = null;
  try {
    // 注意：这里的相对路径以本文件所在目录为基准（src/）
    bundledData = require('./assets/所有歌单_风格统计.json');
    console.log('✅ genre-bar-chart: 通过 require 成功导入 JSON 数据');
  } catch (e) {
    console.warn('⚠️ genre-bar-chart: require 导入失败，将尝试 fetch：', e && e.message ? e.message : e);
    bundledData = null;
  }

  // 2) fetch 兜底：兼容不同部署路径（根目录/子目录/直接访问 src）
  var DATA_URLS = ['./assets/所有歌单_风格统计.json', 'assets/所有歌单_风格统计.json', '/assets/所有歌单_风格统计.json', '/src/assets/所有歌单_风格统计.json'];
  function cssVar(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name);
    return (v || '').trim() || fallback;
  }
  function rgba(hex, a) {
    var h = (hex || '').replace('#', '');
    if (h.length !== 6) return "rgba(255,255,255,".concat(a, ")");
    var r = parseInt(h.slice(0, 2), 16);
    var g = parseInt(h.slice(2, 4), 16);
    var b = parseInt(h.slice(4, 6), 16);
    return "rgba(".concat(r, ",").concat(g, ",").concat(b, ",").concat(a, ")");
  }
  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }
  function ellipsize(str, maxLen) {
    var s = (str !== null && str !== void 0 ? str : '').toString();
    if (!maxLen || maxLen <= 0) return s;
    if (s.length <= maxLen) return s;
    return s.slice(0, Math.max(0, maxLen - 1)) + '…';
  }
  function fetchFirstOk(_x) {
    return _fetchFirstOk.apply(this, arguments);
  }
  function _fetchFirstOk() {
    _fetchFirstOk = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(urls) {
      var lastErr, _iterator, _step, u, url, res, _t, _t2;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            lastErr = null;
            _iterator = _createForOfIteratorHelper(urls);
            _context.p = 1;
            _iterator.s();
          case 2:
            if ((_step = _iterator.n()).done) {
              _context.n = 9;
              break;
            }
            u = _step.value;
            _context.p = 3;
            url = encodeURI(u);
            _context.n = 4;
            return fetch(url, {
              cache: 'no-cache'
            });
          case 4:
            res = _context.v;
            if (res.ok) {
              _context.n = 5;
              break;
            }
            throw new Error("".concat(res.status, " ").concat(res.statusText));
          case 5:
            _context.n = 6;
            return res.json();
          case 6:
            return _context.a(2, _context.v);
          case 7:
            _context.p = 7;
            _t = _context.v;
            lastErr = _t;
          case 8:
            _context.n = 2;
            break;
          case 9:
            _context.n = 11;
            break;
          case 10:
            _context.p = 10;
            _t2 = _context.v;
            _iterator.e(_t2);
          case 11:
            _context.p = 11;
            _iterator.f();
            return _context.f(11);
          case 12:
            throw lastErr || new Error('fetch failed');
          case 13:
            return _context.a(2);
        }
      }, _callee, null, [[3, 7], [1, 10, 11, 12]]);
    }));
    return _fetchFirstOk.apply(this, arguments);
  }
  function loadData() {
    return _loadData.apply(this, arguments);
  }
  function _loadData() {
    _loadData = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            if (!bundledData) {
              _context2.n = 1;
              break;
            }
            return _context2.a(2, bundledData);
          case 1:
            _context2.n = 2;
            return fetchFirstOk(DATA_URLS);
          case 2:
            return _context2.a(2, _context2.v);
        }
      }, _callee2);
    }));
    return _loadData.apply(this, arguments);
  }
  function getSize(svgNode) {
    var container = svgNode.closest('.chart-content') || svgNode.parentElement;
    var w = container && container.clientWidth || 800;
    var h = container && container.clientHeight || 420;
    return {
      w: Math.max(320, w),
      h: Math.max(220, h)
    };
  }
  function render(data) {
    var svgSel = d3.select("#".concat(SVG_ID));
    var svgNode = svgSel.node();
    if (!svgNode) return;
    var _getSize = getSize(svgNode),
      cw = _getSize.w,
      ch = _getSize.h;
    svgSel.selectAll('*').remove();
    var accentViolet = cssVar('--accent-violet', '#7c3aed');
    var accentPink = cssVar('--accent-pink', '#ff3bd4');
    var accentBlue = cssVar('--accent-blue', '#32a7ff');
    var axisText = cssVar('--axis-text-strong', 'rgba(226, 232, 240, 0.88)');
    var axisLine = cssVar('--axis-line', 'rgba(50, 167, 255, 0.28)');
    var grid = cssVar('--axis-grid', 'rgba(50, 167, 255, 0.12)');
    var entriesAll = Object.entries(data && data.all_genres || {}).map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        k = _ref2[0],
        v = _ref2[1];
      return {
        name: k,
        value: +v
      };
    }).filter(function (d) {
      return d.name && Number.isFinite(d.value);
    }).sort(function (a, b) {
      return b.value - a.value;
    }).slice(0, 30);
    if (entriesAll.length === 0) {
      svgSel.append('text').attr('x', 16).attr('y', 28).attr('fill', axisText).style('font', '14px system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif').text('数据为空：无法渲染柱状图');
      return;
    }

    // Layout: 两面并排（每面 15 条），各自 y 轴，统一 x 尺度
    var width = cw;
    var height = ch;
    // 小图模式：尽量减少四周留白，让图表“整体大一圈”
    var outer = {
      top: 10,
      right: 10,
      bottom: 26,
      left: 10
    };
    var gutter = clamp(Math.floor(width * 0.04), 12, 24); // 两面之间留白（缩小一点）
    var innerW = Math.max(10, width - outer.left - outer.right);
    var innerH = Math.max(10, height - outer.top - outer.bottom);
    var panelW = Math.max(10, (innerW - gutter) / 2);
    svgSel.attr('width', '100%').attr('height', '100%').attr('viewBox', "0 0 ".concat(width, " ").concat(height)).attr('preserveAspectRatio', 'xMidYMid meet').style('background', 'transparent');

    // defs: glow + gradient
    var defs = svgSel.append('defs');
    var glow = defs.append('filter').attr('id', 'barGlow');
    glow.append('feGaussianBlur').attr('stdDeviation', '2.2').attr('result', 'blur');
    var m = glow.append('feMerge');
    m.append('feMergeNode').attr('in', 'blur');
    m.append('feMergeNode').attr('in', 'SourceGraphic');
    var grad = defs.append('linearGradient').attr('id', 'barGrad').attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '0%');
    grad.append('stop').attr('offset', '0%').attr('stop-color', accentViolet).attr('stop-opacity', 0.90);
    grad.append('stop').attr('offset', '55%').attr('stop-color', accentBlue).attr('stop-opacity', 0.86);
    grad.append('stop').attr('offset', '100%').attr('stop-color', accentPink).attr('stop-opacity', 0.78);

    // subtle background hint (very low opacity)
    svgSel.append('rect').attr('x', 8).attr('y', 8).attr('width', width - 16).attr('height', height - 16).attr('rx', 12).attr('ry', 12).attr('fill', 'rgba(7, 3, 18, 0.10)').attr('stroke', rgba(accentBlue, 0.14));
    var entriesLeft = entriesAll.slice(0, 15);
    var entriesRight = entriesAll.slice(15, 30);
    var xMax = d3.max(entriesAll, function (d) {
      return d.value;
    }) || 1;
    var x = d3.scaleLinear().domain([0, xMax * 1.08]).range([0, 1]) // placeholder，下面按 panelInnerW 重新 set range
    .nice();

    // 字体：缩小类别名与数字（x 轴刻度 + 条形数值）
    var axisFontSize = 12; // x 轴刻度数字
    var categoryFontSize = 10; // y 轴类别名（流派名）
    var valueFontSize = 11; // 条形末端数值
    var titleFontSize = 12; // 面板小标题（前 1–15 / 前 16–30）
    var axisStrokeWidth = 2.4; // 坐标轴/刻度线更粗
    var tickSize = 12; // 刻度线更长
    var xTicks = clamp(Math.round(panelW / 120), 3, 6);
    var xAxisFactory = function xAxisFactory(xScale) {
      return d3.axisBottom(xScale).ticks(xTicks).tickSizeInner(tickSize).tickSizeOuter(0).tickFormat(d3.format('~s'));
    };
    function applyAxisStyle(sel, fontSizePx) {
      sel.selectAll('path, line').attr('stroke', axisLine).attr('stroke-width', axisStrokeWidth);
      sel.selectAll('text').attr('fill', axisText).style('font', "".concat(fontSizePx, "px system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif")).style('paint-order', 'stroke').style('stroke', 'rgba(7, 3, 18, 0.72)').style('stroke-width', '2px').style('stroke-linejoin', 'round');
    }
    function drawPanel(panelRoot, entries, titleText) {
      var labelMax = clamp(Math.floor(panelW / 16), 6, 10); // 控制 y 轴标签长度，避免挤压
      var margin = {
        top: 10,
        right: 10,
        bottom: 22,
        left: clamp(Math.floor(panelW * 0.38), 100, 160)
      };
      var w = panelW;
      var h = innerH;
      var panelInnerW = Math.max(10, w - margin.left - margin.right);
      var panelInnerH = Math.max(10, h - margin.top - margin.bottom);
      var gx = x.copy().range([0, panelInnerW]);
      var y = d3.scaleBand().domain(entries.map(function (d) {
        return d.name;
      })).range([0, panelInnerH]).padding(0.22);

      // 标题（可选，不影响交互）
      panelRoot.append('text').attr('x', 0).attr('y', 0).attr('fill', cssVar('--axis-text', 'rgba(226, 232, 240, 0.78)')).style('font', "".concat(titleFontSize, "px system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif")).style('opacity', 0.85).text(titleText);
      var g = panelRoot.append('g').attr('transform', "translate(".concat(margin.left, ",").concat(margin.top, ")"));

      // grid
      g.append('g').attr('class', 'grid').call(d3.axisBottom(gx).ticks(xTicks).tickSize(panelInnerH).tickFormat('')).selectAll('line').attr('stroke', grid).attr('stroke-width', 1);
      g.select('.grid').select('path').attr('stroke', 'none');

      // axes
      var xAxis = xAxisFactory(gx);
      var yAxis = d3.axisLeft(y).tickSizeInner(tickSize).tickSizeOuter(0).tickFormat(function (d) {
        return ellipsize(d, labelMax);
      });
      var xAxisG = g.append('g').attr('class', 'x-axis').attr('transform', "translate(0,".concat(panelInnerH, ")")).call(xAxis);
      var yAxisG = g.append('g').attr('class', 'y-axis').call(yAxis);
      applyAxisStyle(xAxisG, axisFontSize);
      applyAxisStyle(yAxisG, categoryFontSize);

      // bars
      var barH = Math.max(10, y.bandwidth());
      var row = g.selectAll('.row').data(entries, function (d) {
        return d.name;
      }).enter().append('g').attr('class', 'row').attr('transform', function (d) {
        return "translate(0,".concat(y(d.name), ")");
      });
      row.append('rect').attr('x', 0).attr('y', 0).attr('height', barH).attr('width', function (d) {
        return gx(d.value);
      }).attr('rx', 10).attr('ry', 10).attr('fill', 'url(#barGrad)').attr('opacity', 0.90).attr('filter', 'url(#barGlow)');

      // end-cap highlight
      row.append('rect').attr('x', function (d) {
        return Math.max(0, gx(d.value) - 10);
      }).attr('y', 0).attr('height', barH).attr('width', 10).attr('rx', 10).attr('ry', 10).attr('fill', rgba(accentPink, 0.22));

      // values
      row.append('text').attr('x', function (d) {
        return clamp(gx(d.value) + 8, 6, panelInnerW - 6);
      }).attr('y', barH / 2 + 1).attr('dominant-baseline', 'middle').attr('fill', cssVar('--axis-text', 'rgba(226, 232, 240, 0.78)')).style('font', "".concat(valueFontSize, "px system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif")).style('paint-order', 'stroke').style('stroke', 'rgba(7, 3, 18, 0.68)').style('stroke-width', '2px').style('stroke-linejoin', 'round').text(function (d) {
        return d3.format(',')(d.value);
      });

      // hover (subtle)
      row.on('mouseenter', function () {
        d3.select(this).select('rect').transition().duration(120).attr('opacity', 1);
      }).on('mouseleave', function () {
        d3.select(this).select('rect').transition().duration(160).attr('opacity', 0.90);
      });
    }

    // 仅移动柱状图整体位置（向左/向下）：按需微调这两个值
    var BAR_SHIFT_X = -10; // <0 向左
    var BAR_SHIFT_Y = 12; // >0 向下

    var panels = svgSel.append('g').attr('transform', "translate(".concat(outer.left + BAR_SHIFT_X, ",").concat(outer.top + BAR_SHIFT_Y, ")"));
    var leftRoot = panels.append('g').attr('transform', "translate(0,0)");
    var rightRoot = panels.append('g').attr('transform', "translate(".concat(panelW + gutter, ",0)"));
    drawPanel(leftRoot, entriesLeft, '前 1–15');
    if (entriesRight.length > 0) {
      drawPanel(rightRoot, entriesRight, '前 16–30');
    } else {
      rightRoot.append('text').attr('x', 0).attr('y', 14).attr('fill', axisText).style('font', '12px system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif').style('opacity', 0.85).text('前 16–30（数据不足）');
    }
  }
  var timer = 0;
  function scheduleRender(data) {
    clearTimeout(timer);
    timer = setTimeout(function () {
      return render(data);
    }, 80);
  }
  function init() {
    return _init.apply(this, arguments);
  }
  function _init() {
    _init = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
      var svgNode, data, _t3;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            svgNode = document.getElementById(SVG_ID);
            if (svgNode) {
              _context3.n = 1;
              break;
            }
            return _context3.a(2);
          case 1:
            _context3.p = 1;
            _context3.n = 2;
            return loadData();
          case 2:
            data = _context3.v;
            render(data);
            window.addEventListener('resize', function () {
              return scheduleRender(data);
            }, {
              passive: true
            });
            _context3.n = 4;
            break;
          case 3:
            _context3.p = 3;
            _t3 = _context3.v;
            console.error('❌ genre-bar-chart 加载失败:', _t3);
            d3.select("#".concat(SVG_ID)).selectAll('*').remove();
            d3.select("#".concat(SVG_ID)).append('text').attr('x', 16).attr('y', 28).attr('fill', cssVar('--axis-text-strong', 'rgba(226, 232, 240, 0.88)')).style('font', '14px system-ui, -apple-system, Segoe UI, Microsoft YaHei, sans-serif').text('柱状图数据加载失败（请确认 assets/所有歌单_风格统计.json 可访问）');
          case 4:
            return _context3.a(2);
        }
      }, _callee3, null, [[1, 3]]);
    }));
    return _init.apply(this, arguments);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
},{"./assets/所有歌单_风格统计.json":"QqXA"}]},{},["QYep"], null)
//# sourceMappingURL=/genre-bar-chart.b9f31ffd.js.map