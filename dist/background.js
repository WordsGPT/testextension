// node_modules/fflate/esm/browser.js
var u8 = Uint8Array;
var u16 = Uint16Array;
var i32 = Int32Array;
var fleb = new u8([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  /* unused */
  0,
  0,
  /* impossible */
  0
]);
var fdeb = new u8([
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  /* unused */
  0,
  0
]);
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
var freb = function(eb, start) {
  var b = new u16(31);
  for (var i = 0; i < 31; ++i) {
    b[i] = start += 1 << eb[i - 1];
  }
  var r = new i32(b[30]);
  for (var i = 1; i < 30; ++i) {
    for (var j = b[i]; j < b[i + 1]; ++j) {
      r[j] = j - b[i] << 5 | i;
    }
  }
  return { b, r };
};
var _a = freb(fleb, 2);
var fl = _a.b;
var revfl = _a.r;
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0);
var fd = _b.b;
var revfd = _b.r;
var rev = new u16(32768);
for (i = 0; i < 32768; ++i) {
  x = (i & 43690) >> 1 | (i & 21845) << 1;
  x = (x & 52428) >> 2 | (x & 13107) << 2;
  x = (x & 61680) >> 4 | (x & 3855) << 4;
  rev[i] = ((x & 65280) >> 8 | (x & 255) << 8) >> 1;
}
var x;
var i;
var hMap = function(cd, mb, r) {
  var s = cd.length;
  var i = 0;
  var l = new u16(mb);
  for (; i < s; ++i) {
    if (cd[i])
      ++l[cd[i] - 1];
  }
  var le = new u16(mb);
  for (i = 1; i < mb; ++i) {
    le[i] = le[i - 1] + l[i - 1] << 1;
  }
  var co;
  if (r) {
    co = new u16(1 << mb);
    var rvb = 15 - mb;
    for (i = 0; i < s; ++i) {
      if (cd[i]) {
        var sv = i << 4 | cd[i];
        var r_1 = mb - cd[i];
        var v = le[cd[i] - 1]++ << r_1;
        for (var m = v | (1 << r_1) - 1; v <= m; ++v) {
          co[rev[v] >> rvb] = sv;
        }
      }
    }
  } else {
    co = new u16(s);
    for (i = 0; i < s; ++i) {
      if (cd[i]) {
        co[i] = rev[le[cd[i] - 1]++] >> 15 - cd[i];
      }
    }
  }
  return co;
};
var flt = new u8(288);
for (i = 0; i < 144; ++i)
  flt[i] = 8;
var i;
for (i = 144; i < 256; ++i)
  flt[i] = 9;
var i;
for (i = 256; i < 280; ++i)
  flt[i] = 7;
var i;
for (i = 280; i < 288; ++i)
  flt[i] = 8;
var i;
var fdt = new u8(32);
for (i = 0; i < 32; ++i)
  fdt[i] = 5;
var i;
var flrm = /* @__PURE__ */ hMap(flt, 9, 1);
var fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
var max = function(a) {
  var m = a[0];
  for (var i = 1; i < a.length; ++i) {
    if (a[i] > m)
      m = a[i];
  }
  return m;
};
var bits = function(d, p, m) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8) >> (p & 7) & m;
};
var bits16 = function(d, p) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8 | d[o + 2] << 16) >> (p & 7);
};
var shft = function(p) {
  return (p + 7) / 8 | 0;
};
var slc = function(v, s, e) {
  if (s == null || s < 0)
    s = 0;
  if (e == null || e > v.length)
    e = v.length;
  return new u8(v.subarray(s, e));
};
var ec = [
  "unexpected EOF",
  "invalid block type",
  "invalid length/literal",
  "invalid distance",
  "stream finished",
  "no stream handler",
  ,
  // determined by compression function
  "no callback",
  "invalid UTF-8 data",
  "extra field too long",
  "date not in range 1980-2099",
  "filename too long",
  "stream finishing",
  "invalid zip data"
  // determined by unknown compression method
];
var err = function(ind, msg, nt) {
  var e = new Error(msg || ec[ind]);
  e.code = ind;
  if (Error.captureStackTrace)
    Error.captureStackTrace(e, err);
  if (!nt)
    throw e;
  return e;
};
var inflt = function(dat, st, buf, dict) {
  var sl = dat.length, dl = dict ? dict.length : 0;
  if (!sl || st.f && !st.l)
    return buf || new u8(0);
  var noBuf = !buf;
  var resize = noBuf || st.i != 2;
  var noSt = st.i;
  if (noBuf)
    buf = new u8(sl * 3);
  var cbuf = function(l2) {
    var bl = buf.length;
    if (l2 > bl) {
      var nbuf = new u8(Math.max(bl * 2, l2));
      nbuf.set(buf);
      buf = nbuf;
    }
  };
  var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
  var tbts = sl * 8;
  do {
    if (!lm) {
      final = bits(dat, pos, 1);
      var type = bits(dat, pos + 1, 3);
      pos += 3;
      if (!type) {
        var s = shft(pos) + 4, l = dat[s - 4] | dat[s - 3] << 8, t = s + l;
        if (t > sl) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + l);
        buf.set(dat.subarray(s, t), bt);
        st.b = bt += l, st.p = pos = t * 8, st.f = final;
        continue;
      } else if (type == 1)
        lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
      else if (type == 2) {
        var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
        var tl = hLit + bits(dat, pos + 5, 31) + 1;
        pos += 14;
        var ldt = new u8(tl);
        var clt = new u8(19);
        for (var i = 0; i < hcLen; ++i) {
          clt[clim[i]] = bits(dat, pos + i * 3, 7);
        }
        pos += hcLen * 3;
        var clb = max(clt), clbmsk = (1 << clb) - 1;
        var clm = hMap(clt, clb, 1);
        for (var i = 0; i < tl; ) {
          var r = clm[bits(dat, pos, clbmsk)];
          pos += r & 15;
          var s = r >> 4;
          if (s < 16) {
            ldt[i++] = s;
          } else {
            var c = 0, n = 0;
            if (s == 16)
              n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];
            else if (s == 17)
              n = 3 + bits(dat, pos, 7), pos += 3;
            else if (s == 18)
              n = 11 + bits(dat, pos, 127), pos += 7;
            while (n--)
              ldt[i++] = c;
          }
        }
        var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
        lbt = max(lt);
        dbt = max(dt);
        lm = hMap(lt, lbt, 1);
        dm = hMap(dt, dbt, 1);
      } else
        err(1);
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
    }
    if (resize)
      cbuf(bt + 131072);
    var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
    var lpos = pos;
    for (; ; lpos = pos) {
      var c = lm[bits16(dat, pos) & lms], sym = c >> 4;
      pos += c & 15;
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
      if (!c)
        err(2);
      if (sym < 256)
        buf[bt++] = sym;
      else if (sym == 256) {
        lpos = pos, lm = null;
        break;
      } else {
        var add = sym - 254;
        if (sym > 264) {
          var i = sym - 257, b = fleb[i];
          add = bits(dat, pos, (1 << b) - 1) + fl[i];
          pos += b;
        }
        var d = dm[bits16(dat, pos) & dms], dsym = d >> 4;
        if (!d)
          err(3);
        pos += d & 15;
        var dt = fd[dsym];
        if (dsym > 3) {
          var b = fdeb[dsym];
          dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
        }
        if (pos > tbts) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + 131072);
        var end = bt + add;
        if (bt < dt) {
          var shift = dl - dt, dend = Math.min(dt, end);
          if (shift + bt < 0)
            err(3);
          for (; bt < dend; ++bt)
            buf[bt] = dict[shift + bt];
        }
        for (; bt < end; ++bt)
          buf[bt] = buf[bt - dt];
      }
    }
    st.l = lm, st.p = lpos, st.b = bt, st.f = final;
    if (lm)
      final = 1, st.m = lbt, st.d = dm, st.n = dbt;
  } while (!final);
  return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
};
var et = /* @__PURE__ */ new u8(0);
var b2 = function(d, b) {
  return d[b] | d[b + 1] << 8;
};
var b4 = function(d, b) {
  return (d[b] | d[b + 1] << 8 | d[b + 2] << 16 | d[b + 3] << 24) >>> 0;
};
var b8 = function(d, b) {
  return b4(d, b) + b4(d, b + 4) * 4294967296;
};
function inflateSync(data, opts) {
  return inflt(data, { i: 2 }, opts && opts.out, opts && opts.dictionary);
}
var td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
var tds = 0;
try {
  td.decode(et, { stream: true });
  tds = 1;
} catch (e) {
}
var dutf8 = function(d) {
  for (var r = "", i = 0; ; ) {
    var c = d[i++];
    var eb = (c > 127) + (c > 223) + (c > 239);
    if (i + eb > d.length)
      return { s: r, r: slc(d, i - 1) };
    if (!eb)
      r += String.fromCharCode(c);
    else if (eb == 3) {
      c = ((c & 15) << 18 | (d[i++] & 63) << 12 | (d[i++] & 63) << 6 | d[i++] & 63) - 65536, r += String.fromCharCode(55296 | c >> 10, 56320 | c & 1023);
    } else if (eb & 1)
      r += String.fromCharCode((c & 31) << 6 | d[i++] & 63);
    else
      r += String.fromCharCode((c & 15) << 12 | (d[i++] & 63) << 6 | d[i++] & 63);
  }
};
function strFromU8(dat, latin1) {
  if (latin1) {
    var r = "";
    for (var i = 0; i < dat.length; i += 16384)
      r += String.fromCharCode.apply(null, dat.subarray(i, i + 16384));
    return r;
  } else if (td) {
    return td.decode(dat);
  } else {
    var _a2 = dutf8(dat), s = _a2.s, r = _a2.r;
    if (r.length)
      err(8);
    return s;
  }
}
var slzh = function(d, b) {
  return b + 30 + b2(d, b + 26) + b2(d, b + 28);
};
var zh = function(d, b, z) {
  var fnl = b2(d, b + 28), efl = b2(d, b + 30), fn = strFromU8(d.subarray(b + 46, b + 46 + fnl), !(b2(d, b + 8) & 2048)), es = b + 46 + fnl;
  var _a2 = z64hs(d, es, efl, z, b4(d, b + 20), b4(d, b + 24), b4(d, b + 42)), sc = _a2[0], su = _a2[1], off = _a2[2];
  return [b2(d, b + 10), sc, su, fn, es + efl + b2(d, b + 32), off];
};
var z64hs = function(d, b, l, z, sc, su, off) {
  var nsc = sc == 4294967295, nsu = su == 4294967295, noff = off == 4294967295, e = b + l;
  var nf = nsc + nsu + noff;
  if (z && nf) {
    for (; b + 4 < e; b += 4 + b2(d, b + 2)) {
      if (b2(d, b) == 1) {
        return [
          nsc ? b8(d, b + 4 + 8 * nsu) : sc,
          nsu ? b8(d, b + 4) : su,
          noff ? b8(d, b + 4 + 8 * (nsu + nsc)) : off,
          1
        ];
      }
    }
    if (z < 2)
      err(13);
  }
  return [sc, su, off, 0];
};
function unzipSync(data, opts) {
  var files = {};
  var e = data.length - 22;
  for (; b4(data, e) != 101010256; --e) {
    if (!e || data.length - e > 65558)
      err(13);
  }
  ;
  var c = b2(data, e + 8);
  if (!c)
    return {};
  var o = b4(data, e + 16);
  var z = b4(data, e - 20) == 117853008;
  if (z) {
    var ze = b4(data, e - 12);
    z = b4(data, ze) == 101075792;
    if (z) {
      c = b4(data, ze + 32);
      o = b4(data, ze + 48);
    }
  }
  var fltr = opts && opts.filter;
  for (var i = 0; i < c; ++i) {
    var _a2 = zh(data, o, z), c_2 = _a2[0], sc = _a2[1], su = _a2[2], fn = _a2[3], no = _a2[4], off = _a2[5], b = slzh(data, off);
    o = no;
    if (!fltr || fltr({
      name: fn,
      size: sc,
      originalSize: su,
      compression: c_2
    })) {
      if (!c_2)
        files[fn] = slc(data, b, b + sc);
      else if (c_2 == 8)
        files[fn] = inflateSync(data.subarray(b, b + sc), { out: new u8(su) });
      else
        err(14, "unknown compression type " + c_2);
    }
  }
  return files;
}

// src/shared/languages.ts
var LANGUAGES = [
  {
    code: "zh",
    name: "Chinese",
    nativeName: "\u4E2D\u6587",
    spaceless: true,
    cjk: true,
    notations: [
      { id: "pinyin", label: "Pinyin (h\xE0ny\u01D4 p\u012Bny\u012Bn)" },
      { id: "zhuyin", label: "Zhuyin / Bopomofo (\u6CE8\u97F3)" }
    ],
    defaultDictLinks: [
      { name: "MDBG", urlTemplate: "https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=0&wdqb={word}" },
      { name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Chinese" },
      { name: "Reverso", urlTemplate: "https://context.reverso.net/translation/chinese-english/{word}" }
    ],
    speechLocale: "zh-CN"
  },
  {
    code: "yue",
    name: "Cantonese",
    nativeName: "\u5EE3\u6771\u8A71",
    spaceless: true,
    cjk: true,
    notations: [
      { id: "jyutping", label: "Jyutping (\u7CB5\u62FC)" },
      { id: "yale", label: "Yale Romanization" }
    ],
    defaultDictLinks: [
      { name: "words.hk", urlTemplate: "https://words.hk/zidin/{word}" },
      { name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Chinese" }
    ],
    speechLocale: "zh-HK"
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "\u65E5\u672C\u8A9E",
    spaceless: true,
    cjk: true,
    notations: [
      { id: "hiragana", label: "Hiragana (furigana over kanji)" },
      { id: "katakana", label: "Katakana (over kanji)" },
      { id: "romaji", label: "Romaji (over every word)" }
    ],
    defaultDictLinks: [
      { name: "Jisho", urlTemplate: "https://jisho.org/search/{word}" },
      { name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Japanese" },
      { name: "Weblio", urlTemplate: "https://ejje.weblio.jp/content/{word}" }
    ],
    speechLocale: "ja-JP"
  },
  {
    code: "ko",
    name: "Korean",
    nativeName: "\uD55C\uAD6D\uC5B4",
    notations: [{ id: "revised", label: "Revised Romanization (phonetic)" }],
    defaultDictLinks: [
      { name: "Naver Dict", urlTemplate: "https://korean.dict.naver.com/koendict/#/search?query={word}" },
      { name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Korean" }
    ],
    speechLocale: "ko-KR"
  },
  {
    code: "it",
    name: "Italian",
    nativeName: "Italiano",
    defaultDictLinks: [
      { name: "WordReference", urlTemplate: "https://www.wordreference.com/iten/{word}" },
      { name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Italian" },
      { name: "Treccani", urlTemplate: "https://www.treccani.it/vocabolario/ricerca/{word}/" }
    ],
    speechLocale: "it-IT"
  },
  {
    code: "en",
    name: "English",
    nativeName: "English",
    defaultDictLinks: [
      { name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#English" },
      { name: "Cambridge", urlTemplate: "https://dictionary.cambridge.org/dictionary/english/{word}" }
    ],
    speechLocale: "en-US"
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Fran\xE7ais",
    defaultDictLinks: [
      { name: "WordReference", urlTemplate: "https://www.wordreference.com/fren/{word}" },
      { name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#French" }
    ],
    speechLocale: "fr-FR"
  },
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    defaultDictLinks: [
      { name: "DWDS", urlTemplate: "https://www.dwds.de/wb/{word}" },
      { name: "dict.cc", urlTemplate: "https://www.dict.cc/?s={word}" },
      { name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#German" }
    ],
    speechLocale: "de-DE"
  },
  {
    code: "nl",
    name: "Dutch",
    nativeName: "Nederlands",
    defaultDictLinks: [{ name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Dutch" }],
    speechLocale: "nl-NL"
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Espa\xF1ol",
    defaultDictLinks: [
      { name: "SpanishDict", urlTemplate: "https://www.spanishdict.com/translate/{word}" },
      { name: "WordReference", urlTemplate: "https://www.wordreference.com/esen/{word}" }
    ],
    speechLocale: "es-ES"
  },
  {
    code: "pt",
    name: "Portuguese",
    nativeName: "Portugu\xEAs",
    defaultDictLinks: [
      { name: "WordReference", urlTemplate: "https://www.wordreference.com/pten/{word}" },
      { name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Portuguese" }
    ],
    speechLocale: "pt-BR"
  },
  {
    code: "sv",
    name: "Swedish",
    nativeName: "Svenska",
    defaultDictLinks: [
      { name: "svenska.se", urlTemplate: "https://svenska.se/tre/?sok={word}" },
      { name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Swedish" }
    ],
    speechLocale: "sv-SE"
  },
  {
    code: "da",
    name: "Danish",
    nativeName: "Dansk",
    defaultDictLinks: [{ name: "Ordnet", urlTemplate: "https://ordnet.dk/ddo/ordbog?query={word}" }],
    speechLocale: "da-DK"
  },
  {
    code: "no",
    name: "Norwegian",
    nativeName: "Norsk",
    defaultDictLinks: [{ name: "Ordb\xF8kene", urlTemplate: "https://ordbokene.no/bm/search?q={word}" }],
    speechLocale: "nb-NO"
  },
  {
    code: "fi",
    name: "Finnish",
    nativeName: "Suomi",
    defaultDictLinks: [{ name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Finnish" }],
    speechLocale: "fi-FI"
  },
  {
    code: "pl",
    name: "Polish",
    nativeName: "Polski",
    defaultDictLinks: [{ name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Polish" }],
    speechLocale: "pl-PL"
  },
  {
    code: "ru",
    name: "Russian",
    nativeName: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439",
    defaultDictLinks: [
      { name: "OpenRussian", urlTemplate: "https://en.openrussian.org/ru/{word}" },
      { name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Russian" }
    ],
    speechLocale: "ru-RU"
  },
  {
    code: "uk",
    name: "Ukrainian",
    nativeName: "\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430",
    defaultDictLinks: [{ name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Ukrainian" }],
    speechLocale: "uk-UA"
  },
  {
    code: "el",
    name: "Greek",
    nativeName: "\u0395\u03BB\u03BB\u03B7\u03BD\u03B9\u03BA\u03AC",
    defaultDictLinks: [{ name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Greek" }],
    speechLocale: "el-GR"
  },
  {
    code: "tr",
    name: "Turkish",
    nativeName: "T\xFCrk\xE7e",
    defaultDictLinks: [{ name: "Tureng", urlTemplate: "https://tureng.com/en/turkish-english/{word}" }],
    speechLocale: "tr-TR"
  },
  {
    code: "vi",
    name: "Vietnamese",
    nativeName: "Ti\u1EBFng Vi\u1EC7t",
    compoundSpaced: true,
    defaultDictLinks: [{ name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Vietnamese" }],
    speechLocale: "vi-VN"
  },
  {
    code: "id",
    name: "Indonesian",
    nativeName: "Bahasa Indonesia",
    defaultDictLinks: [{ name: "KBBI", urlTemplate: "https://kbbi.kemdikbud.go.id/entri/{word}" }],
    speechLocale: "id-ID"
  },
  {
    code: "th",
    name: "Thai",
    nativeName: "\u0E44\u0E17\u0E22",
    spaceless: true,
    notations: [{ id: "paiboon", label: "Paiboon+ Romanization" }],
    defaultDictLinks: [{ name: "Thai-Language", urlTemplate: "http://www.thai-language.com/dict/{word}" }],
    speechLocale: "th-TH"
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629",
    rtl: true,
    notations: [{ id: "translit", label: "Vocalized Latin Transliteration" }],
    defaultDictLinks: [{ name: "Wiktionary", urlTemplate: "https://en.wiktionary.org/wiki/{word}#Arabic" }],
    speechLocale: "ar-SA"
  }
];
var LANG_MAP = Object.fromEntries(
  LANGUAGES.map((l) => [l.code, l])
);
function getDefaultLangOptions(code) {
  const meta = LANG_MAP[code];
  const defaultNotation = meta?.notations?.[0]?.id || "pinyin";
  return {
    countingMode: "lemma",
    unifyScripts: true,
    onlyHighlightTargetText: !meta?.spaceless && code !== "ko" && code !== "ar" && code !== "el" && code !== "ru" && code !== "uk",
    readingsEnabled: false,
    readingNotation: defaultNotation,
    readingScope: "new_learning",
    pitchAccent: code === "ja",
    definitionLang: "en",
    translateIntoLang: "en",
    whoTranslates: "google",
    customDictPlacement: "above",
    dictionaryLinks: [...meta?.defaultDictLinks || []],
    fontFamily: "original",
    ankiAutoDeck: `Verba::${meta?.name || code}`,
    ankiPickedDeck: `Verba::${meta?.name || code}`,
    ankiNoteType: "Verba"
  };
}
var STOPWORDS = {
  it: ["il", "la", "di", "che", "non", "un", "una", "per", "con", "del", "della", "sono", "era", "questo", "questa", "nella", "anche", "come"],
  en: ["the", "and", "that", "have", "for", "not", "with", "you", "this", "but", "his", "from", "they", "would", "there"],
  fr: ["le", "la", "les", "de", "des", "est", "une", "dans", "pour", "que", "qui", "pas", "sur", "avec", "plus", "sont"],
  de: ["der", "die", "das", "und", "in", "den", "von", "zu", "mit", "sich", "auf", "f\xFCr", "ist", "im", "nicht", "ein", "eine"],
  es: ["el", "la", "los", "las", "de", "que", "en", "un", "una", "por", "con", "no", "para", "es", "del", "como", "m\xE1s"],
  pt: ["o", "a", "os", "as", "de", "que", "em", "um", "uma", "para", "com", "n\xE3o", "por", "mais", "dos", "como"],
  nl: ["de", "het", "een", "en", "van", "in", "is", "dat", "op", "te", "voor", "met", "zijn", "niet"],
  sv: ["och", "att", "det", "som", "en", "p\xE5", "\xE4r", "f\xF6r", "med", "till", "den", "har", "inte"],
  da: ["og", "i", "at", "det", "en", "til", "er", "af", "p\xE5", "for", "med", "som", "ikke"],
  no: ["og", "i", "\xE5", "det", "en", "til", "er", "av", "p\xE5", "for", "med", "som", "ikke"],
  fi: ["ja", "on", "ei", "se", "ett\xE4", "oli", "mutta", "niin", "kuin", "vain", "tai"],
  pl: ["i", "w", "nie", "na", "do", "to", "\u017Ce", "si\u0119", "z", "jest", "jak", "ale"],
  tr: ["ve", "bir", "bu", "i\xE7in", "ile", "de", "da", "ne", "\xE7ok", "daha", "gibi"],
  id: ["dan", "yang", "di", "ini", "itu", "untuk", "dengan", "tidak", "dari", "pada", "dalam"],
  vi: ["c\u1EE7a", "v\xE0", "l\xE0", "c\xF3", "trong", "\u0111\u01B0\u1EE3c", "cho", "kh\xF4ng", "ng\u01B0\u1EDDi", "nh\u1EEFng", "m\u1ED9t"]
};
function detectTextLanguage(text, htmlLangAttr) {
  if (htmlLangAttr) {
    const clean = htmlLangAttr.toLowerCase().trim();
    if (clean.startsWith("yue") || clean === "zh-hk") return "yue";
    const base = clean.split(/[-_]/)[0];
    if (base === "nb" || base === "nn") return "no";
    if (LANG_MAP[base]) return base;
  }
  const sample = text.slice(0, 3e3);
  if (!sample.trim()) return null;
  const kanaCount = (sample.match(/[\u3040-\u30ff]/g) || []).length;
  const hangulCount = (sample.match(/[\uac00-\ud7af]/g) || []).length;
  const hanCount = (sample.match(/[\u4e00-\u9fff]/g) || []).length;
  const arabicCount = (sample.match(/[\u0600-\u06ff]/g) || []).length;
  const thaiCount = (sample.match(/[\u0e00-\u0e7f]/g) || []).length;
  const greekCount = (sample.match(/[\u0370-\u03ff]/g) || []).length;
  const cyrillicCount = (sample.match(/[\u0400-\u04ff]/g) || []).length;
  if (kanaCount >= 3) return "ja";
  if (hangulCount >= 3) return "ko";
  if (hanCount >= 4) {
    if (/[嘅喺唔冇佢哋睇講]/.test(sample)) return "yue";
    return "zh";
  }
  if (arabicCount >= 4) return "ar";
  if (thaiCount >= 4) return "th";
  if (greekCount >= 4) return "el";
  if (cyrillicCount >= 4) {
    if (/[іїєґІЇЄҐ]/.test(sample)) return "uk";
    return "ru";
  }
  const tokens = sample.toLowerCase().split(/[^a-zà-žăâđêôơư]+/i).filter((w) => w.length >= 1);
  if (tokens.length < 3) return null;
  if (/[ăâđêôơưảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/i.test(sample)) {
    return "vi";
  }
  let bestLang = null;
  let bestScore = 0;
  for (const [lang, stops] of Object.entries(STOPWORDS)) {
    const stopSet = new Set(stops);
    let hits = 0;
    for (const tok of tokens) {
      if (stopSet.has(tok)) hits++;
    }
    const ratio = hits / tokens.length;
    if (hits >= 2 && ratio > bestScore) {
      bestScore = ratio;
      bestLang = lang;
    }
  }
  return bestLang;
}

// src/shared/constants.ts
var DEFAULT_READING_KEYMAP = {
  grade1: "1",
  grade2: "2",
  grade3: "3",
  grade4: "4",
  known: "k",
  ignore: "x",
  resetNew: "0",
  aiCheck: "a",
  speakWord: "v",
  speakSentence: "Shift+V",
  customMeaning: "m",
  googleTranslate: "g",
  dictLink: "t",
  charactersTab: "b",
  nextEntry: "n",
  prevEntry: "Shift+N",
  listEntries: "l",
  ankiAdd: "p",
  ankiPick: "Shift+P",
  askAiChat: "Shift+I",
  nextWord: "ArrowRight",
  prevWord: "ArrowLeft",
  openKnownUp: "ArrowUp",
  closeDown: "ArrowDown",
  markPageKnown: "Shift+K",
  toggleHighlights: "Shift+H",
  readAloud: "Shift+R",
  openReaderView: "Shift+L",
  sentenceMode: "Shift+S",
  nextFreqSentence: "Shift+D",
  prevFreqSentence: "Shift+A",
  nextUnknownSentence: "Shift+E",
  prevUnknownSentence: "Shift+Q",
  toggleDiglot: "Shift+W"
};
var DEFAULT_VIDEO_KEYMAP = {
  toggleCaptions: "c",
  prevLine: "a",
  replayLine: "s",
  nextLine: "d",
  autoPause: "q",
  peekForward: "e",
  peekBackward: "z",
  hideKnownLines: "h",
  cycleBandFilter: "r",
  wordsInVideo: "w",
  subEarlier: ",",
  subLater: ".",
  nextFreqLine: "Shift+D",
  prevFreqLine: "Shift+A",
  hopCommonDown: "Shift+Alt+D",
  hopCommonUp: "Shift+Alt+A",
  nextUnknownLine: "Shift+E",
  prevUnknownLine: "Shift+Q",
  markLineKnown: "Shift+K"
};
var DEFAULT_ASK_AI_PROMPT = `I am reading in {language} ({title}).
Please explain this sentence naturally and break down any idiomatic or grammatical nuances:

"{sentence}"

Context around it:
{context}`;
function generatePairingCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  if (!/[A-Z]/.test(code)) code = "V" + code.slice(1);
  if (!/[2-9]/.test(code)) code = code.slice(0, 7) + "7";
  return code;
}
function createDefaultSettings() {
  const deviceId = "dev_" + Math.random().toString(36).slice(2, 10);
  return {
    deviceId,
    onboarded: false,
    profileName: "Reader",
    activeLang: "it",
    learningLangs: ["it", "zh", "ja", "es", "de", "fr"],
    polyglotOrder: ["it", "zh", "ja", "es", "de", "fr"],
    autoSwitchPageLang: true,
    selectLookupEnabled: true,
    perLang: {
      it: getDefaultLangOptions("it"),
      zh: getDefaultLangOptions("zh"),
      ja: getDefaultLangOptions("ja"),
      es: getDefaultLangOptions("es"),
      de: getDefaultLangOptions("de"),
      fr: getDefaultLangOptions("fr")
    },
    runOnWebPages: true,
    inlineReplacementEnabled: true,
    inlineReplacementDensityPct: 15,
    inlineReplacementPool: "learning_and_new",
    inlineReplacementMaxRank: 3e3,
    inlineReplacementShowHint: true,
    pausedTabIds: [],
    forceEnabledUrls: [],
    neverRunDomains: ["mail.google.com", "docs.google.com", "outlook.live.com"],
    showPageCounter: true,
    languageSwitcherOnPage: true,
    gradeByHovering: true,
    hoverDelayMs: 140,
    clickNewStartsLearning: true,
    linksStayClickable: true,
    contextMeaningFirst: true,
    entriesOneAtATime: true,
    translateMissingWords: true,
    countWordsReadWhere: "everywhere",
    pdfDefaultMode: "fit_phones",
    readerFont: "serif",
    customFontName: "",
    readerTheme: "dark",
    readerFontSize: 19,
    dailyReadingGoalWords: 500,
    dailyListeningGoalMin: 10,
    dayEndsAtHour: 0,
    readingKeymap: { ...DEFAULT_READING_KEYMAP },
    videoKeymap: { ...DEFAULT_VIDEO_KEYMAP },
    theme: "dark",
    uiLanguage: "en",
    highlightWords: true,
    specialWordsHighlight: false,
    underlineInsteadOfFill: false,
    highlightStrength: 1,
    colors: {
      newWord: "#38bdf8",
      learning: "#f59e0b",
      crossScript: "#10b981",
      selectedPhrase: "#f97316",
      specialWord: "#a855f7"
    },
    wordPanel: {
      size: "M",
      showReading: true,
      dictLinksInline: false,
      compactSpacing: false,
      showGradeButtons: true
    },
    voiceBackend: "device",
    cloudVoiceProvider: "gemini",
    cloudVoiceApiKey: "",
    localVoiceServerUrl: "http://localhost:8880",
    voiceSpeed: 1,
    voiceVolume: 1,
    sayWordOnOpen: false,
    sayWordOnArrow: false,
    smartListeningTracking: true,
    showTabCountedChip: true,
    askUnsureTrackLang: true,
    youtubeThumbnailCounts: true,
    ignoredListeningDomains: [],
    captionsEnabled: true,
    subtitleMode: "show",
    translationMode: "blur",
    inlineWordMeanings: "off",
    sharpWordsWithMeaning: true,
    colorsThroughBlur: true,
    hideKnownLines: false,
    vocabBandFilter: "all",
    autoPauseEachLine: false,
    autoPauseOnlyNewWords: false,
    autoResumeOnKnown: true,
    pauseOnLookup: false,
    pauseOnLookupDelayMs: 400,
    googleTranslateMissingSubs: true,
    subtitleSize: "M",
    translationSize: "M",
    subtitleFont: "sans",
    subtitleBgOpacity: 75,
    karaokeMode: false,
    showActionNotes: true,
    subtitleVerticalPct: 82,
    gamepadEnabled: true,
    swapABXY: false,
    pageScrollPx: 320,
    aiCheckEnabled: false,
    aiIncludeSentence: true,
    aiProvider: "gemini",
    aiApiKey: "",
    aiModel: "gemini-2.5-flash",
    aiWorkspaceId: "",
    aiCustomRequest: "",
    askAiChatProvider: "chatgpt",
    askAiChatCustomUrl: "",
    askAiChatPromptTemplate: DEFAULT_ASK_AI_PROMPT,
    ankiConnectPort: 8765,
    ankiSendAllLearning: false,
    ankiLevelsToSend: [1, 2, 3, 4],
    ankiShowButtonInPanel: true,
    ankiTags: "verba",
    ankiMarkKnownOnMature: false,
    ankiMatureDays: 21,
    ankiSuspendWhenKnown: true,
    ankiVideoMedia: "audio_clip",
    ankiIncludeSurroundingLines: false,
    ankiVoiceWord: false,
    ankiVoiceSentence: false,
    ankiCardLayout: {
      word: "front",
      reading: "back",
      pitch: "off",
      meaning: "back",
      sentence: "back",
      sentenceTranslation: "off",
      picture: "back",
      wordAudio: "back",
      sentenceAudio: "back"
    },
    syncPairingCode: generatePairingCode(),
    syncPeerUrl: "",
    syncSendBookFiles: true,
    syncMaxBookSizeMb: 100,
    pairedDevices: [],
    autoBackupEnabled: false,
    backupKeyLockedHash: "",
    lastBackupAt: 0,
    updatedAt: Date.now()
  };
}

// src/shared/webext.ts
function getExtApi() {
  const g = globalThis;
  return g.browser || g.chrome || null;
}
function getExtensionUrl(relPath) {
  const api = getExtApi();
  if (api?.runtime?.getURL) {
    return api.runtime.getURL(relPath);
  }
  return relPath;
}
function onRuntimeMessage(handler) {
  const g = globalThis;
  const browserApi = g.browser;
  if (browserApi?.runtime?.onMessage?.addListener) {
    browserApi.runtime.onMessage.addListener((rawMsg, sender) => {
      return handler(rawMsg, sender).catch((err2) => ({
        ok: false,
        error: err2 instanceof Error ? err2.message : String(err2)
      }));
    });
    return;
  }
  const chromeApi = g.chrome;
  if (chromeApi?.runtime?.onMessage?.addListener) {
    chromeApi.runtime.onMessage.addListener(
      (rawMsg, sender, sendResponse) => {
        handler(rawMsg, sender).then(sendResponse).catch((err2) => {
          sendResponse({ ok: false, error: err2 instanceof Error ? err2.message : String(err2) });
        });
        return true;
      }
    );
  }
}
async function queryTabs(queryInfo) {
  const api = getExtApi();
  if (!api?.tabs?.query) return [];
  return await api.tabs.query(queryInfo);
}
async function createTab(props) {
  const api = getExtApi();
  if (!api?.tabs?.create) return null;
  return await api.tabs.create(props);
}
async function sendTabMessage(tabId, msg) {
  const api = getExtApi();
  if (!api?.tabs?.sendMessage) return null;
  return api.tabs.sendMessage(tabId, msg);
}
async function storageLocalGet(key) {
  const api = getExtApi();
  if (api?.storage?.local?.get) {
    return await api.storage.local.get(key) || {};
  }
  return {};
}
async function storageLocalSet(items) {
  const api = getExtApi();
  if (api?.storage?.local?.set) {
    await api.storage.local.set(items);
  }
}

// src/shared/db.ts
var DB_NAME = "verba_db_v1";
var DB_VERSION = 1;
var dbPromise = null;
function openVerbaDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("words")) {
        const ws = db.createObjectStore("words", { keyPath: "id" });
        ws.createIndex("by_lang", "lang", { unique: false });
      }
      if (!db.objectStoreNames.contains("books")) {
        const bs = db.createObjectStore("books", { keyPath: "id" });
        bs.createIndex("by_lang", "lang", { unique: false });
      }
      if (!db.objectStoreNames.contains("bookFiles")) {
        db.createObjectStore("bookFiles", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("folders")) {
        const fsStore = db.createObjectStore("folders", { keyPath: "id" });
        fsStore.createIndex("by_lang", "lang", { unique: false });
      }
      if (!db.objectStoreNames.contains("bookmarks")) {
        const bms = db.createObjectStore("bookmarks", { keyPath: "id" });
        bms.createIndex("by_book", "bookId", { unique: false });
      }
      if (!db.objectStoreNames.contains("videos")) {
        const vs = db.createObjectStore("videos", { keyPath: "id" });
        vs.createIndex("by_lang", "lang", { unique: false });
      }
      if (!db.objectStoreNames.contains("dailyStats")) {
        const ds = db.createObjectStore("dailyStats", { keyPath: "id" });
        ds.createIndex("by_lang", "lang", { unique: false });
      }
      if (!db.objectStoreNames.contains("listeningHistory")) {
        const ls = db.createObjectStore("listeningHistory", { keyPath: "id" });
        ls.createIndex("by_lang", "lang", { unique: false });
      }
      if (!db.objectStoreNames.contains("customDicts")) {
        const cs = db.createObjectStore("customDicts", { keyPath: "id" });
        cs.createIndex("by_lang", "lang", { unique: false });
      }
      if (!db.objectStoreNames.contains("assessments")) {
        const asStore = db.createObjectStore("assessments", { keyPath: "id" });
        asStore.createIndex("by_lang", "lang", { unique: false });
      }
      if (!db.objectStoreNames.contains("notes")) {
        const ns = db.createObjectStore("notes", { keyPath: "id" });
        ns.createIndex("by_lang", "lang", { unique: false });
      }
      if (!db.objectStoreNames.contains("readArticles")) {
        db.createObjectStore("readArticles", { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}
function txGet(storeName, key) {
  return openVerbaDB().then(
    (db) => new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const req = tx.objectStore(storeName).get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    })
  );
}
function txPut(storeName, value) {
  return openVerbaDB().then(
    (db) => new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      tx.objectStore(storeName).put(value);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    })
  );
}
function txPutBatch(storeName, values) {
  if (values.length === 0) return Promise.resolve();
  return openVerbaDB().then(
    (db) => new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      for (const v of values) store.put(v);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    })
  );
}
function txGetAll(storeName, indexName, query) {
  return openVerbaDB().then(
    (db) => new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const target = indexName ? store.index(indexName) : store;
      const req = query !== void 0 ? target.getAll(query) : target.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    })
  );
}
var SETTINGS_KEY = "verba_prefs_v1";
async function getSettings() {
  const defaults = createDefaultSettings();
  const ext = getExtApi();
  if (ext?.storage?.local) {
    const res = await storageLocalGet(SETTINGS_KEY);
    const saved = res[SETTINGS_KEY];
    if (!saved) {
      await storageLocalSet({ [SETTINGS_KEY]: defaults });
      return defaults;
    }
    return mergeSettingsWithDefaults(defaults, saved);
  }
  const raw = typeof localStorage !== "undefined" ? localStorage.getItem(SETTINGS_KEY) : null;
  if (!raw) return defaults;
  return mergeSettingsWithDefaults(defaults, JSON.parse(raw));
}
function mergeSettingsWithDefaults(defaults, saved) {
  return {
    ...defaults,
    ...saved,
    colors: { ...defaults.colors, ...saved.colors || {} },
    wordPanel: { ...defaults.wordPanel, ...saved.wordPanel || {} },
    readingKeymap: { ...defaults.readingKeymap, ...saved.readingKeymap || {} },
    videoKeymap: { ...defaults.videoKeymap, ...saved.videoKeymap || {} },
    ankiCardLayout: { ...defaults.ankiCardLayout, ...saved.ankiCardLayout || {} },
    perLang: { ...defaults.perLang, ...saved.perLang || {} }
  };
}
async function saveSettings(patch) {
  const current = await getSettings();
  const next = mergeSettingsWithDefaults(current, {
    ...patch,
    updatedAt: Date.now()
  });
  const ext = getExtApi();
  if (ext?.storage?.local) {
    await storageLocalSet({ [SETTINGS_KEY]: next });
  } else if (typeof localStorage !== "undefined") {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  }
  return next;
}
function getLangOptionsFromSettings(settings, lang) {
  return {
    ...getDefaultLangOptions(lang),
    ...settings.perLang[lang] || {}
  };
}
async function getWordsByLang(lang) {
  const all = await txGetAll("words", "by_lang", lang);
  return all.filter((w) => !w.deleted);
}
async function getAllWordsRaw() {
  return txGetAll("words");
}
async function getWordRecord(lang, word) {
  const rec = await txGet("words", `${lang}:${word}`);
  return rec && !rec.deleted ? rec : void 0;
}
async function putWordRecord(record) {
  await txPut("words", record);
}
async function putWordRecordsBatch(records) {
  await txPutBatch("words", records);
}
function getLogicalDateString(timestampMs, dayEndsAtHour = 0) {
  const adjusted = new Date(timestampMs - dayEndsAtHour * 3600 * 1e3);
  const y = adjusted.getFullYear();
  const m = String(adjusted.getMonth() + 1).padStart(2, "0");
  const d = String(adjusted.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
async function incrementDailyStat(lang, deviceId, dayEndsAtHour, delta) {
  const date = getLogicalDateString(Date.now(), dayEndsAtHour);
  const id = `${lang}:${date}:${deviceId}`;
  const existing = await txGet("dailyStats", id) || {
    id,
    lang,
    date,
    deviceId,
    wordsRead: 0,
    secondsListened: 0,
    wordsMarkedKnown: 0,
    wordsMarkedLearning: 0,
    frequentMarkedKnown: 0,
    updatedAt: Date.now()
  };
  const updated = {
    ...existing,
    wordsRead: Math.max(0, existing.wordsRead + (delta.wordsRead || 0)),
    secondsListened: Math.max(0, existing.secondsListened + (delta.secondsListened || 0)),
    wordsMarkedKnown: Math.max(0, existing.wordsMarkedKnown + (delta.wordsMarkedKnown || 0)),
    wordsMarkedLearning: Math.max(0, existing.wordsMarkedLearning + (delta.wordsMarkedLearning || 0)),
    frequentMarkedKnown: Math.max(0, existing.frequentMarkedKnown + (delta.frequentMarkedKnown || 0)),
    updatedAt: Date.now()
  };
  await txPut("dailyStats", updated);
  return updated;
}
async function getDailyStatsByLang(lang) {
  return txGetAll("dailyStats", "by_lang", lang);
}
async function checkAndRecordArticleParagraphRead(key) {
  const existing = await txGet("readArticles", key);
  if (existing) return false;
  await txPut("readArticles", { id: key, at: Date.now() });
  return true;
}
async function getBookById(id) {
  const b = await txGet("books", id);
  return b && !b.deleted ? b : void 0;
}
async function putBook(book, rawBytes) {
  await txPut("books", book);
  if (rawBytes) {
    await txPut("bookFiles", { id: book.id, bytes: rawBytes, updatedAt: Date.now() });
  }
}
async function getVideoById(id) {
  return txGet("videos", id);
}
async function putVideoHistory(v) {
  await txPut("videos", v);
}
async function putListeningLog(log) {
  await txPut("listeningHistory", log);
}
async function getCustomDictsByLang(lang) {
  const all = await txGetAll("customDicts", "by_lang", lang);
  return all.sort((a, b) => a.order - b.order);
}

// src/shared/segmenter.ts
var KO_PARTICLES = [
  ["\uC5D0\uC11C\uB294", "from/at (topic)"],
  ["\uC73C\uB85C\uBD80\uD130", "from (source)"],
  ["\uC5D0\uAC8C\uC11C", "from (person)"],
  ["\uC774\uB77C\uB3C4", "even if"],
  ["\uC73C\uB85C", "toward / by means of"],
  ["\uC5D0\uC11C", "at / in / from"],
  ["\uC5D0\uAC8C", "to (a person)"],
  ["\uD55C\uD14C", "to (colloquial)"],
  ["\uAED8\uC11C", "honorific subject"],
  ["\uAE4C\uC9C0", "until / up to"],
  ["\uBD80\uD130", "from / since"],
  ["\uCC98\uB7FC", "like / as"],
  ["\uBCF4\uB2E4", "than"],
  ["\uB9C8\uB2E4", "every / each"],
  ["\uD558\uACE0", "and / with"],
  ["\uC740", "topic marker"],
  ["\uB294", "topic marker"],
  ["\uC774", "subject marker"],
  ["\uAC00", "subject marker"],
  ["\uC744", "object marker"],
  ["\uB97C", "object marker"],
  ["\uC758", "possessive (of)"],
  ["\uC5D0", "at / to / in"],
  ["\uB85C", "by / toward"],
  ["\uB3C4", "also / too"],
  ["\uB9CC", "only / just"],
  ["\uC640", "and / with"],
  ["\uACFC", "and / with"]
];
var JA_INFLECTIONS = [
  ["\u307E\u305B\u3093\u3067\u3057\u305F", "\u308B", "polite past negative"],
  ["\u307E\u3057\u305F", "\u308B", "polite past (-mashita)"],
  ["\u307E\u305B\u3093", "\u308B", "polite negative (-masen)"],
  ["\u307E\u3059", "\u308B", "polite (-masu)"],
  ["\u306A\u304B\u3063\u305F", "\u308B", "past negative"],
  ["\u306A\u3044", "\u308B", "negative (-nai)"],
  ["\u305F\u3044", "\u308B", "desiderative (want to)"],
  ["\u3066\u3044\u308B", "\u308B", "progressive / resultant state"],
  ["\u3066", "\u308B", "te-form (conjunctive)"],
  ["\u305F", "\u308B", "past (-ta)"],
  ["\u304D\u307E\u3059", "\u304F", "polite (-masu)"],
  ["\u3044\u305F", "\u304F", "past (-ta)"],
  ["\u3044\u3066", "\u304F", "te-form"],
  ["\u304B\u306A\u3044", "\u304F", "negative (-nai)"],
  ["\u307F\u307E\u305B\u3093", "\u3080", "polite negative"],
  ["\u307F\u307E\u3059", "\u3080", "polite (-masu)"],
  ["\u3093\u3060", "\u3080", "past (-nda)"],
  ["\u3093\u3067", "\u3080", "te-form"],
  ["\u307E\u306A\u3044", "\u3080", "negative (-nai)"],
  ["\u3081\u308B", "\u3080", "potential (can do)"],
  ["\u3057\u307E\u3059", "\u3059\u308B", "polite (-masu)"],
  ["\u3057\u305F", "\u3059\u308B", "past"],
  ["\u3057\u3066", "\u3059\u308B", "te-form"],
  ["\u3057\u306A\u3044", "\u3059\u308B", "negative"]
];
var DE_SEPARABLE_VERBS = {
  sieht: { aus: "aussehen", an: "ansehen", vor: "vorsehen", zu: "zusehen" },
  sehe: { aus: "aussehen", an: "ansehen" },
  sah: { aus: "aussehen", an: "ansehen" },
  f\u00E4ngt: { an: "anfangen" },
  fange: { an: "anfangen" },
  fing: { an: "anfangen" },
  steht: { auf: "aufstehen", fest: "feststehen" },
  kommt: { an: "ankommen", mit: "mitkommen", zur\u00FCck: "zur\xFCckkommen" },
  h\u00F6rt: { auf: "aufh\xF6ren", zu: "zuh\xF6ren" },
  macht: { auf: "aufmachen", zu: "zumachen", mit: "mitmachen" }
};
function normalizeWord(word, lang) {
  const trimmed = word.trim();
  if (!trimmed) return "";
  if (lang === "zh" || lang === "yue" || lang === "ja" || lang === "ko" || lang === "th") {
    return trimmed;
  }
  if (lang === "de") {
    return trimmed;
  }
  if (lang === "ar") {
    return trimmed.replace(/[\u064B-\u065F\u0670]/g, "");
  }
  return trimmed.toLowerCase();
}
function analyzeKoreanParts(surface, knownSet) {
  if (surface.length < 2 || !/[\uac00-\ud7af]/.test(surface)) return null;
  for (const [particle, role] of KO_PARTICLES) {
    if (surface.endsWith(particle) && surface.length > particle.length) {
      const stem = surface.slice(0, surface.length - particle.length);
      if (!knownSet || knownSet.has(stem) || stem.length >= 1) {
        return {
          stem,
          parts: [
            { part: stem, role: "word stem" },
            { part: particle, role }
          ]
        };
      }
    }
  }
  if (surface.endsWith("\uD574\uC694") && surface.length > 2) {
    const noun = surface.slice(0, -2);
    return {
      stem: `${noun}\uD558\uB2E4`,
      parts: [
        { part: noun, role: "verbal noun" },
        { part: "\uD574\uC694", role: "polite present of \uD558\uB2E4 (to do)" }
      ]
    };
  }
  return null;
}
function analyzeJapaneseParts(surface, dictLemmas) {
  for (const [ending, rep, role] of JA_INFLECTIONS) {
    if (surface.endsWith(ending) && surface.length > ending.length) {
      const prefix = surface.slice(0, surface.length - ending.length);
      const candidate = prefix + rep;
      if (!dictLemmas || dictLemmas.has(candidate)) {
        return {
          lemma: candidate,
          parts: [
            { part: candidate, role: "dictionary form" },
            { part: ending, role }
          ]
        };
      }
    }
  }
  return null;
}
var segmenterCache = /* @__PURE__ */ new Map();
function getIntlSegmenter(lang) {
  if (typeof Intl === "undefined" || typeof Intl.Segmenter === "undefined") return null;
  let seg = segmenterCache.get(lang);
  if (!seg) {
    try {
      const locale = lang === "yue" ? "zh-Hant-HK" : lang;
      seg = new Intl.Segmenter(locale, { granularity: "word" });
      segmenterCache.set(lang, seg);
    } catch {
      return null;
    }
  }
  return seg;
}
var WORD_CHAR_RE = /[\p{L}\p{M}]/u;
function segmentText(text, lang, lexiconSet = /* @__PURE__ */ new Set(), phrasesSet = /* @__PURE__ */ new Set()) {
  if (!text) return [];
  const meta = LANG_MAP[lang];
  if (meta?.spaceless) {
    const out = [];
    const maxLen = 8;
    let i = 0;
    while (i < text.length) {
      const ch = text[i];
      if (!WORD_CHAR_RE.test(ch) || /\d/.test(ch)) {
        let j = i + 1;
        while (j < text.length && (!WORD_CHAR_RE.test(text[j]) || /\d/.test(text[j]))) j++;
        out.push({ text: text.slice(i, j), isWord: false, normalized: "" });
        i = j;
        continue;
      }
      let matched = "";
      const limit = Math.min(maxLen, text.length - i);
      for (let len = limit; len >= 2; len--) {
        const sub = text.slice(i, i + len);
        if (phrasesSet.has(sub) || lexiconSet.has(sub)) {
          matched = sub;
          break;
        }
        if (lang === "ja") {
          const jaParts = analyzeJapaneseParts(sub, lexiconSet);
          if (jaParts) {
            matched = sub;
            out.push({
              text: sub,
              isWord: true,
              normalized: sub,
              lemmaHint: jaParts.lemma
            });
            i += len;
            break;
          }
        }
      }
      if (matched && out[out.length - 1]?.text !== matched) {
        out.push({ text: matched, isWord: true, normalized: matched });
        i += matched.length;
        continue;
      }
      if (matched) continue;
      let runEnd = i + 1;
      while (runEnd < text.length && WORD_CHAR_RE.test(text[runEnd]) && !/\d/.test(text[runEnd])) {
        let dictAhead = false;
        for (let len = Math.min(maxLen, text.length - runEnd); len >= 2; len--) {
          const cand = text.slice(runEnd, runEnd + len);
          if (phrasesSet.has(cand) || lexiconSet.has(cand)) {
            dictAhead = true;
            break;
          }
        }
        if (dictAhead) break;
        runEnd++;
      }
      const slice = text.slice(i, runEnd);
      const seg = getIntlSegmenter(lang);
      if (seg) {
        for (const part of seg.segment(slice)) {
          const isW = Boolean(part.isWordLike && WORD_CHAR_RE.test(part.segment));
          const jaInf = lang === "ja" && isW ? analyzeJapaneseParts(part.segment, lexiconSet) : null;
          out.push({
            text: part.segment,
            isWord: isW,
            normalized: isW ? part.segment : "",
            ...jaInf ? { lemmaHint: jaInf.lemma } : {}
          });
        }
      } else {
        for (const c of Array.from(slice)) {
          out.push({ text: c, isWord: true, normalized: c });
        }
      }
      i = runEnd;
    }
    return out;
  }
  const rawParts = text.match(/[\p{L}\p{M}]+(?:['’\-][\p{L}\p{M}]+)*|[^\p{L}\p{M}]+/gu) || [text];
  const baseTokens = rawParts.map((part) => {
    const isWord = WORD_CHAR_RE.test(part[0]);
    if (!isWord) return { text: part, isWord: false, normalized: "" };
    return {
      text: part,
      isWord: true,
      normalized: normalizeWord(part, lang)
    };
  });
  const expanded = [];
  for (const tok of baseTokens) {
    if (tok.isWord && (lang === "it" || lang === "fr") && /['’]/.test(tok.text)) {
      const idx = tok.text.search(/['’]/);
      const left = tok.text.slice(0, idx);
      const apos = tok.text[idx];
      const right = tok.text.slice(idx + 1);
      if (left && right) {
        expanded.push({ text: left, isWord: true, normalized: normalizeWord(left, lang) });
        expanded.push({ text: apos, isWord: false, normalized: "" });
        expanded.push({ text: right, isWord: true, normalized: normalizeWord(right, lang) });
        continue;
      }
    }
    if (tok.isWord && lang === "ko") {
      const ko = analyzeKoreanParts(tok.text, lexiconSet);
      if (ko) {
        expanded.push({ ...tok, lemmaHint: ko.stem });
        continue;
      }
    }
    expanded.push(tok);
  }
  if (phrasesSet.size > 0 || lang === "vi") {
    const merged = [];
    let idx = 0;
    while (idx < expanded.length) {
      if (!expanded[idx].isWord) {
        merged.push(expanded[idx]);
        idx++;
        continue;
      }
      let bestEndIdx = -1;
      let bestText = "";
      let bestNorm = "";
      let wordCount = 1;
      let accumText = expanded[idx].text;
      for (let j = idx + 1; j < expanded.length && wordCount < 12; j++) {
        const t = expanded[j];
        if (!t.isWord && !/^\s+$/.test(t.text)) break;
        accumText += t.text;
        if (t.isWord) {
          wordCount++;
          const normCandidate = normalizeWord(accumText.replace(/\s+/g, " "), lang);
          const rawCandidate = accumText.replace(/\s+/g, " ");
          if (phrasesSet.has(normCandidate) || phrasesSet.has(rawCandidate) || lang === "vi" && (lexiconSet.has(normCandidate) || lexiconSet.has(rawCandidate))) {
            bestEndIdx = j;
            bestText = accumText;
            bestNorm = lexiconSet.has(rawCandidate) ? rawCandidate : normCandidate;
          }
        }
      }
      if (bestEndIdx !== -1) {
        merged.push({ text: bestText, isWord: true, normalized: bestNorm });
        idx = bestEndIdx + 1;
      } else {
        merged.push(expanded[idx]);
        idx++;
      }
    }
    applyGermanSeparableVerbs(merged, lang);
    return merged;
  }
  applyGermanSeparableVerbs(expanded, lang);
  return expanded;
}
function applyGermanSeparableVerbs(tokens, lang) {
  if (lang !== "de") return;
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (!t.isWord) continue;
    const lower = t.text.toLowerCase();
    const map = DE_SEPARABLE_VERBS[lower];
    if (!map) continue;
    for (let j = i + 1; j < Math.min(tokens.length, i + 28); j++) {
      const tj = tokens[j];
      if (!tj.isWord && /[.!?;:]/.test(tj.text)) break;
      if (tj.isWord) {
        const candLemma = map[tj.text.toLowerCase()];
        if (candLemma) {
          t.lemmaHint = candLemma;
          tj.lemmaHint = candLemma;
          t.separablePartnerIdx = j;
          tj.separablePartnerIdx = i;
          break;
        }
      }
    }
  }
}

// src/shared/diglot.ts
var FUNCTION_POS = /* @__PURE__ */ new Set(["art.", "prep.", "conj.", "part.", "pron.", "prop."]);
var AMBIGUOUS_ENGLISH_GLOSSES = /* @__PURE__ */ new Set([
  "the",
  "a",
  "an",
  "to",
  "of",
  "in",
  "into",
  "on",
  "upon",
  "at",
  "by",
  "for",
  "with",
  "from",
  "about",
  "and",
  "or",
  "but",
  "not",
  "no",
  "yes",
  "that",
  "this",
  "these",
  "those",
  "which",
  "who",
  "what",
  "be",
  "is",
  "am",
  "are",
  "was",
  "were",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "make",
  "go",
  "come",
  "get",
  "take",
  "put",
  "give",
  "say",
  "tell",
  "see",
  "know",
  "can",
  "will",
  "would",
  "should",
  "may",
  "might",
  "all",
  "whole",
  "other",
  "another",
  "else",
  "same",
  "self",
  "very",
  "much",
  "lot",
  "more",
  "most",
  "some",
  "any",
  "one",
  "two",
  "still",
  "yet",
  "again",
  "well",
  "then",
  "way",
  "manner",
  "part",
  "case",
  "point",
  "state",
  "fact",
  "thing"
]);
function posPriority(pos) {
  if (!pos) return 3;
  if (pos.startsWith("n")) return 1;
  if (pos.startsWith("adj")) return 2;
  if (pos.startsWith("adv")) return 3;
  if (pos.startsWith("v")) return 4;
  return 5;
}
function buildEnglishGlossIndex(entries) {
  const byGloss = /* @__PURE__ */ new Map();
  for (const entry of entries) {
    if (!entry.w || !entry.m || entry.m.length === 0) continue;
    if (entry.special === "name" || entry.special === "place") continue;
    if (entry.pos && FUNCTION_POS.has(entry.pos)) continue;
    if (/vocabulary item #\d+/i.test(entry.m[0] || "")) continue;
    for (const rawM of entry.m) {
      const stripped = rawM.replace(/\([^)]*\)/g, " ");
      const parts = stripped.split(/[;,/]/);
      for (const part of parts) {
        let cleaned = part.trim().toLowerCase();
        if (cleaned.startsWith("to ") && entry.pos?.startsWith("v")) {
          cleaned = cleaned.slice(3).trim();
        } else if (cleaned.startsWith("the ")) {
          cleaned = cleaned.slice(4).trim();
        } else if (cleaned.startsWith("a ") || cleaned.startsWith("an ")) {
          cleaned = cleaned.replace(/^an?\s+/, "").trim();
        }
        if (!/^[a-z]{3,24}$/.test(cleaned)) continue;
        if (AMBIGUOUS_ENGLISH_GLOSSES.has(cleaned)) continue;
        if (entry.pos?.startsWith("v") && cleaned.length < 4) continue;
        const list = byGloss.get(cleaned);
        if (list) {
          if (!list.includes(entry)) list.push(entry);
        } else {
          byGloss.set(cleaned, [entry]);
        }
      }
    }
  }
  for (const [gloss, list] of byGloss.entries()) {
    list.sort((a, b) => {
      const posDiff = posPriority(a.pos) - posPriority(b.pos);
      if (posDiff !== 0) return posDiff;
      return (a.rank ?? 999999) - (b.rank ?? 999999);
    });
    byGloss.set(gloss, list);
  }
  return byGloss;
}

// src/shared/dictionary.ts
var indexCache = /* @__PURE__ */ new Map();
function buildLangIndex(dict) {
  const byHeadword = /* @__PURE__ */ new Map();
  const byForm = /* @__PURE__ */ new Map();
  const byAltScript = /* @__PURE__ */ new Map();
  const lexiconSet = /* @__PURE__ */ new Set();
  const addMap = (map, key, entry) => {
    if (!key) return;
    const arr = map.get(key);
    if (arr) {
      if (!arr.includes(entry)) arr.push(entry);
    } else {
      map.set(key, [entry]);
    }
  };
  for (const entry of dict.entries) {
    const normW = normalizeWord(entry.w, dict.lang);
    lexiconSet.add(entry.w);
    lexiconSet.add(normW);
    addMap(byHeadword, entry.w, entry);
    addMap(byHeadword, normW, entry);
    addMap(byHeadword, entry.w.toLowerCase(), entry);
    if (entry.alt && entry.alt !== entry.w) {
      lexiconSet.add(entry.alt);
      addMap(byAltScript, entry.alt, entry);
      addMap(byAltScript, entry.w, entry);
    }
    if (entry.forms) {
      for (const f of entry.forms) {
        const nf = normalizeWord(f, dict.lang);
        lexiconSet.add(f);
        lexiconSet.add(nf);
        addMap(byForm, f, entry);
        addMap(byForm, nf, entry);
        addMap(byForm, f.toLowerCase(), entry);
      }
    }
  }
  const byRank = [...dict.entries].sort((a, b) => (a.rank ?? 999999) - (b.rank ?? 999999));
  const byEnglishGloss = buildEnglishGlossIndex(dict.entries);
  const loaded = {
    lang: dict.lang,
    entries: dict.entries,
    byHeadword,
    byForm,
    byAltScript,
    byEnglishGloss,
    byRank,
    lexiconSet,
    chars: dict.chars || {}
  };
  indexCache.set(dict.lang, loaded);
  return loaded;
}
async function loadBundledDictionary(lang, customFetcher) {
  const cached = indexCache.get(lang);
  if (cached) return cached;
  let data;
  if (customFetcher) {
    data = await customFetcher(lang);
  } else {
    const url = getExtensionUrl(`dictionaries/${lang}.json`);
    const resp = await fetch(url);
    data = await resp.json();
  }
  return buildLangIndex(data);
}
function resolveTrackingKey(surface, lang, idx, countingMode, lemmaHint, lemmaOverrides) {
  const norm = normalizeWord(surface, lang);
  const override = lemmaOverrides?.get(norm) || lemmaOverrides?.get(surface);
  if (override) {
    const ovEntries = idx.byHeadword.get(override) || idx.byHeadword.get(override.toLowerCase());
    return {
      key: countingMode === "surface" ? norm : override,
      lemma: override,
      primaryEntry: ovEntries?.[0]
    };
  }
  if (lemmaHint) {
    const hintEntries = idx.byHeadword.get(lemmaHint) || idx.byHeadword.get(lemmaHint.toLowerCase());
    if (hintEntries?.length) {
      return {
        key: countingMode === "surface" ? norm : hintEntries[0].w,
        lemma: hintEntries[0].w,
        primaryEntry: hintEntries[0]
      };
    }
  }
  const direct = idx.byHeadword.get(surface) || idx.byHeadword.get(norm) || idx.byHeadword.get(surface.toLowerCase());
  const altMatch = idx.byAltScript.get(surface);
  const formMatch = idx.byForm.get(surface) || idx.byForm.get(norm) || idx.byForm.get(surface.toLowerCase());
  if (direct?.length) {
    return {
      key: countingMode === "surface" ? norm : direct[0].w,
      lemma: direct[0].w,
      primaryEntry: direct[0]
    };
  }
  if (altMatch?.length) {
    return {
      key: surface,
      lemma: surface,
      primaryEntry: altMatch[0]
    };
  }
  if (formMatch?.length) {
    return {
      key: countingMode === "surface" ? norm : formMatch[0].w,
      lemma: formMatch[0].w,
      primaryEntry: formMatch[0]
    };
  }
  if (lang === "ko") {
    const ko = analyzeKoreanParts(surface, idx.lexiconSet);
    if (ko) {
      const stemEntries = idx.byHeadword.get(ko.stem);
      return {
        key: countingMode === "surface" ? norm : ko.stem,
        lemma: ko.stem,
        primaryEntry: stemEntries?.[0]
      };
    }
  }
  if (lang === "ja") {
    const ja = analyzeJapaneseParts(surface, idx.lexiconSet);
    if (ja) {
      const stemEntries = idx.byHeadword.get(ja.lemma);
      return {
        key: countingMode === "surface" ? norm : ja.lemma,
        lemma: ja.lemma,
        primaryEntry: stemEntries?.[0]
      };
    }
  }
  return { key: norm || surface, lemma: norm || surface };
}
function lookupWordDetailed(query, lang, idx, options, wordRecords, customDicts = [], contextSentence, lemmaHint) {
  const norm = normalizeWord(query, lang);
  const overrides = /* @__PURE__ */ new Map();
  for (const rec of wordRecords.values()) {
    if (rec.lemmaOverride) overrides.set(rec.word, rec.lemmaOverride);
  }
  const resolved = resolveTrackingKey(query, lang, idx, options.countingMode, lemmaHint, overrides);
  const bundledSet = /* @__PURE__ */ new Set();
  for (const list of [
    idx.byHeadword.get(resolved.lemma),
    idx.byHeadword.get(query),
    idx.byHeadword.get(norm),
    idx.byHeadword.get(query.toLowerCase()),
    idx.byAltScript.get(query),
    idx.byForm.get(query),
    idx.byForm.get(norm),
    idx.byForm.get(query.toLowerCase())
  ]) {
    if (list) for (const e of list) bundledSet.add(e);
  }
  const bundledEntries = Array.from(bundledSet);
  const customEntries = [];
  for (const cd of customDicts.filter((d) => d.enabled && d.lang === lang).sort((a, b) => a.order - b.order)) {
    for (const ce of cd.entries) {
      if (ce.w === query || ce.w === resolved.lemma || ce.w.toLowerCase() === norm.toLowerCase()) {
        customEntries.push({ ...ce, dictName: cd.name });
      }
    }
  }
  let finalEntries = [];
  if (customEntries.length > 0) {
    if (options.customDictPlacement === "replace") finalEntries = customEntries;
    else if (options.customDictPlacement === "above") finalEntries = [...customEntries, ...bundledEntries];
    else finalEntries = [...bundledEntries, ...customEntries];
  } else {
    finalEntries = bundledEntries;
  }
  if (contextSentence && finalEntries.length > 0) {
    finalEntries = finalEntries.map((entry) => {
      if (entry.m.length <= 1) return entry;
      const lowerSent = contextSentence.toLowerCase();
      const sortedM = [...entry.m].sort((a, b) => {
        const scoreA = a.toLowerCase().split(/\W+/).filter((w) => w.length > 3 && lowerSent.includes(w)).length;
        const scoreB = b.toLowerCase().split(/\W+/).filter((w) => w.length > 3 && lowerSent.includes(w)).length;
        return scoreB - scoreA;
      });
      return { ...entry, m: sortedM };
    });
  }
  const couldAlsoBe = [];
  for (const e of bundledEntries) {
    if (e.w !== resolved.lemma) {
      couldAlsoBe.push({ lemma: e.w, gloss: e.m[0] || "" });
    }
  }
  let partsOf;
  if (lang === "ko") {
    const ko = analyzeKoreanParts(query, idx.lexiconSet);
    if (ko) {
      partsOf = ko.parts;
      if (ko.stem !== resolved.lemma && !couldAlsoBe.some((c) => c.lemma === ko.stem)) {
        const se = idx.byHeadword.get(ko.stem)?.[0];
        couldAlsoBe.push({ lemma: ko.stem, gloss: se?.m[0] || `${ko.stem} + ${ko.parts[1]?.part || ""}` });
      }
    }
  } else if (lang === "ja") {
    const ja = analyzeJapaneseParts(query, idx.lexiconSet);
    if (ja) partsOf = ja.parts;
  }
  let characters;
  let charByCharGloss;
  if (lang === "zh" || lang === "yue" || lang === "ja") {
    const hanChars = Array.from(query).filter((c) => /[\u4e00-\u9fff]/.test(c));
    if (hanChars.length > 0) {
      characters = hanChars.map((ch) => {
        const info = idx.chars[ch];
        const singleEntry = idx.byHeadword.get(ch)?.[0] || idx.byAltScript.get(ch)?.[0];
        return {
          char: ch,
          reading: info?.r || singleEntry?.r || "",
          meaning: info?.m || singleEntry?.m?.[0] || "CJK character",
          components: info?.comp || [[ch, "character"]]
        };
      });
      if (hanChars.length >= 2) {
        charByCharGloss = characters.map((c) => ({
          char: c.char,
          reading: c.reading,
          meaning: c.meaning
        }));
      }
    }
  }
  const record = wordRecords.get(resolved.key) || wordRecords.get(query) || null;
  let crossScriptKnown = false;
  if ((lang === "zh" || lang === "yue") && options.unifyScripts && (!record || record.status === 0)) {
    const primary = finalEntries[0];
    if (primary) {
      const otherScript = primary.w === query ? primary.alt : primary.w;
      if (otherScript && otherScript !== query) {
        const otherRec = wordRecords.get(otherScript);
        if (otherRec && otherRec.status === 5) {
          crossScriptKnown = true;
        }
      }
    }
  }
  const rank = finalEntries.find((e) => e.rank)?.rank;
  return {
    query,
    normalized: norm,
    lemma: resolved.lemma,
    entries: finalEntries,
    couldAlsoBe,
    partsOf,
    characters,
    charByCharGloss,
    record,
    crossScriptKnown,
    rank
  };
}

// src/shared/translate.ts
var translationCache = /* @__PURE__ */ new Map();
async function translateText(text, sourceLang, targetLang = "en", mode = "google") {
  const clean = text.trim();
  if (!clean) return { translation: "", source: mode };
  const cacheKey = `${mode}:${sourceLang}:${targetLang}:${clean}`;
  const cached = translationCache.get(cacheKey);
  if (cached) return { translation: cached, source: mode };
  if (mode === "google") {
    try {
      const sl = sourceLang === "yue" ? "zh-TW" : sourceLang;
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(
        sl
      )}&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(clean)}`;
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 3500);
      const res = await fetch(url, { signal: ctrl.signal });
      clearTimeout(timer);
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json?.[0])) {
          const joined = json[0].map((seg) => String(seg?.[0] || "")).join("").trim();
          if (joined) {
            translationCache.set(cacheKey, joined);
            return { translation: joined, source: "google" };
          }
        }
      }
    } catch {
    }
  }
  if (sourceLang !== "auto") {
    try {
      const idx = await loadBundledDictionary(sourceLang);
      const direct = idx.byHeadword.get(clean) || idx.byForm.get(clean) || idx.byHeadword.get(clean.toLowerCase());
      if (direct?.length) {
        const out = direct[0].m[0];
        translationCache.set(cacheKey, out);
        return { translation: out, source: "offline" };
      }
      const tokens = segmentText(clean, sourceLang, idx.lexiconSet, /* @__PURE__ */ new Set());
      const parts = [];
      for (const tok of tokens) {
        if (!tok.isWord) continue;
        const e = idx.byHeadword.get(tok.text)?.[0] || idx.byHeadword.get(tok.normalized)?.[0] || idx.byForm.get(tok.text)?.[0] || idx.byForm.get(tok.normalized)?.[0];
        if (e) {
          parts.push(e.m[0].split(";")[0].trim());
        } else {
          parts.push(tok.text);
        }
      }
      const gloss = parts.join(" ");
      if (gloss) {
        translationCache.set(cacheKey, gloss);
        return { translation: gloss, source: "offline" };
      }
    } catch {
    }
  }
  return { translation: `[${targetLang.toUpperCase()}] ${clean}`, source: "offline" };
}

// src/shared/ai.ts
function buildSystemPrompt(langName, targetDefLang, customRequest) {
  return `You are Verba's lexical AI verifier for learners reading ${langName}.
Analyze whether the queried word/compound is a real word in ${langName} (given optional sentence context).
Respond ONLY with valid JSON matching this schema:
{
  "verdict": "real" | "narrow" | "not_a_word" | "uncertain",
  "confidence": "high" | "medium" | "low",
  "shortMeaning": "concise gloss in ${targetDefLang} (2-5 words)",
  "meaning": "clear explanation in ${targetDefLang}",
  "reading": "pronunciation/reading if applicable",
  "registerNote": "if narrow: slang / coinage / journalese / proper noun / dialect",
  "exampleSentence": "natural example sentence in ${langName}",
  "exampleTranslation": "translation in ${targetDefLang}",
  "reasoning": "brief linguistic explanation"${customRequest ? `,
  "customAnswer": "answer to the user's extra question"` : ""}
}`;
}
async function runAiWordCheck(word, lang, sentence, settings, targetDefLang = "English") {
  const langName = LANG_MAP[lang]?.name || lang;
  const apiKey = settings.aiApiKey || (settings.aiProvider === "gemini" ? settings.cloudVoiceApiKey : "");
  if (!apiKey) {
    throw new Error("No API key configured. Add a key under Settings \u2192 AI check.");
  }
  const sys = buildSystemPrompt(langName, targetDefLang, settings.aiCustomRequest);
  const userContent = [
    `Word: "${word}"`,
    settings.aiIncludeSentence && sentence ? `Surrounding sentence: "${sentence}"` : "",
    settings.aiCustomRequest ? `User extra request: ${settings.aiCustomRequest.slice(0, 1e3)}` : ""
  ].filter(Boolean).join("\n");
  let rawJsonText = "";
  if (settings.aiProvider === "gemini") {
    const model = settings.aiModel || "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      model
    )}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: sys }] },
        contents: [{ role: "user", parts: [{ text: userContent }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });
    if (!res.ok) throw new Error(`Gemini error (${res.status}): ${await res.text()}`);
    const data = await res.json();
    rawJsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } else if (settings.aiProvider === "claude") {
    const headers = {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    };
    if (settings.aiWorkspaceId) headers["anthropic-workspace-id"] = settings.aiWorkspaceId;
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: settings.aiModel || "claude-3-5-sonnet-latest",
        max_tokens: 700,
        system: sys,
        messages: [{ role: "user", content: userContent }]
      })
    });
    if (!res.ok) throw new Error(`Claude error (${res.status}): ${await res.text()}`);
    const data = await res.json();
    rawJsonText = data?.content?.[0]?.text || "";
  } else {
    const endpoint = settings.aiProvider === "deepseek" ? "https://api.deepseek.com/chat/completions" : "https://api.openai.com/v1/chat/completions";
    const model = settings.aiModel || (settings.aiProvider === "deepseek" ? "deepseek-chat" : "gpt-4o-mini");
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: sys },
          { role: "user", content: userContent }
        ]
      })
    });
    if (!res.ok) throw new Error(`${settings.aiProvider} error (${res.status}): ${await res.text()}`);
    const data = await res.json();
    rawJsonText = data?.choices?.[0]?.message?.content || "";
  }
  const cleaned = rawJsonText.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
  const parsed = JSON.parse(cleaned);
  return {
    verdict: ["real", "narrow", "not_a_word", "uncertain"].includes(parsed.verdict) ? parsed.verdict : "uncertain",
    confidence: ["high", "medium", "low"].includes(parsed.confidence) ? parsed.confidence : "medium",
    shortMeaning: String(parsed.shortMeaning || ""),
    meaning: String(parsed.meaning || ""),
    reading: parsed.reading ? String(parsed.reading) : void 0,
    registerNote: parsed.registerNote ? String(parsed.registerNote) : void 0,
    exampleSentence: parsed.exampleSentence ? String(parsed.exampleSentence) : void 0,
    exampleTranslation: parsed.exampleTranslation ? String(parsed.exampleTranslation) : void 0,
    reasoning: String(parsed.reasoning || ""),
    customAnswer: parsed.customAnswer ? String(parsed.customAnswer) : void 0,
    provider: settings.aiProvider,
    checkedAt: Date.now()
  };
}

// src/shared/anki.ts
async function ankiInvoke(action, params = {}, port = 8765) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 3500);
  try {
    const res = await fetch(`http://127.0.0.1:${port}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, version: 6, params }),
      signal: ctrl.signal
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`AnkiConnect returned HTTP ${res.status}`);
    const json = await res.json();
    if (json.error) throw new Error(json.error);
    return json.result;
  } catch (err2) {
    clearTimeout(timer);
    throw err2;
  }
}
async function testAnkiConnection(port = 8765) {
  try {
    const version = await ankiInvoke("version", {}, port);
    const decks = await ankiInvoke("deckNames", {}, port);
    const models = await ankiInvoke("modelNames", {}, port);
    return { ok: true, version, decks, models };
  } catch (err2) {
    return {
      ok: false,
      error: err2 instanceof Error ? err2.message : "AnkiConnect not reachable. Make sure Anki is open with add-on 2055492159."
    };
  }
}
var VERBA_FIELDS = [
  "Word",
  "Reading",
  "PitchAccent",
  "Meaning",
  "Sentence",
  "SentenceTranslation",
  "Picture",
  "WordAudio",
  "SentenceAudio"
];
function buildTemplatesFromLayout(layout) {
  const mapping = [
    ["word", '<div class="verba-word">{{Word}}</div>'],
    ["reading", '{{#Reading}}<div class="verba-reading">{{Reading}}</div>{{/Reading}}'],
    ["pitch", '{{#PitchAccent}}<div class="verba-pitch">{{PitchAccent}}</div>{{/PitchAccent}}'],
    ["meaning", '{{#Meaning}}<div class="verba-meaning">{{Meaning}}</div>{{/Meaning}}'],
    ["sentence", '{{#Sentence}}<div class="verba-sentence">{{Sentence}}</div>{{/Sentence}}'],
    [
      "sentenceTranslation",
      '{{#SentenceTranslation}}<div class="verba-trans">{{SentenceTranslation}}</div>{{/SentenceTranslation}}'
    ],
    ["picture", '{{#Picture}}<div class="verba-pic">{{Picture}}</div>{{/Picture}}'],
    ["wordAudio", "{{WordAudio}}"],
    ["sentenceAudio", "{{SentenceAudio}}"]
  ];
  const frontParts = mapping.filter(([k]) => layout[k] === "front").map(([, tpl]) => tpl);
  const backParts = mapping.filter(([k]) => layout[k] === "back").map(([, tpl]) => tpl);
  return {
    Front: frontParts.join("\n") || '<div class="verba-word">{{Word}}</div>',
    Back: `{{FrontSide}}<hr id="answer">
` + backParts.join("\n")
  };
}
async function ensureVerbaModelAndDeck(deckName, settings) {
  const port = settings.ankiConnectPort;
  await ankiInvoke("createDeck", { deck: deckName }, port);
  const models = await ankiInvoke("modelNames", {}, port);
  const tpl = buildTemplatesFromLayout(settings.ankiCardLayout);
  if (!models.includes("Verba")) {
    await ankiInvoke(
      "createModel",
      {
        modelName: "Verba",
        inOrderFields: VERBA_FIELDS,
        css: `.card { font-family: Inter, system-ui, -apple-system, sans-serif; font-size: 20px; text-align: center; color: #f1f5f9; background-color: #0f172a; padding: 24px; }
.verba-word { font-size: 34px; font-weight: 600; margin-bottom: 8px; }
.verba-reading { color: #94a3b8; font-size: 18px; margin-bottom: 10px; }
.verba-meaning { font-size: 20px; margin: 12px 0; }
.verba-sentence { font-size: 18px; color: #cbd5e1; margin-top: 14px; }
.verba-trans { font-size: 15px; color: #64748b; margin-top: 6px; }`,
        cardTemplates: [{ Name: "Verba Card", Front: tpl.Front, Back: tpl.Back }]
      },
      port
    );
  } else {
    await ankiInvoke(
      "updateModelTemplates",
      {
        model: {
          name: "Verba",
          templates: { "Verba Card": { Front: tpl.Front, Back: tpl.Back } }
        }
      },
      port
    );
  }
}
async function sendWordToAnki(payload, existingRecord, settings) {
  const port = settings.ankiConnectPort;
  const langOpts = getLangOptionsFromSettings(settings, payload.lang);
  const langName = LANG_MAP[payload.lang]?.name || payload.lang;
  const autoDeck = langOpts.ankiAutoDeck || `Verba::${langName}`;
  const pickedDeck = langOpts.ankiPickedDeck || autoDeck;
  const targetDeck = payload.pickedByHand ? pickedDeck : autoDeck;
  await ensureVerbaModelAndDeck(targetDeck, settings);
  let formattedSentence = payload.sentence || "";
  if (formattedSentence && payload.word) {
    const escaped = payload.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    formattedSentence = formattedSentence.replace(new RegExp(escaped, "gi"), (m) => `<b>${m}</b>`);
  }
  const layout = settings.ankiCardLayout;
  const fields = {
    Word: payload.word,
    Reading: layout.reading !== "off" ? payload.reading || "" : "",
    PitchAccent: layout.pitch !== "off" ? payload.pitch || "" : "",
    Meaning: layout.meaning !== "off" ? payload.meanings.join("<br>") : "",
    Sentence: layout.sentence !== "off" ? formattedSentence : "",
    SentenceTranslation: layout.sentenceTranslation !== "off" ? payload.sentenceTranslation || "" : "",
    Picture: "",
    WordAudio: "",
    SentenceAudio: ""
  };
  if (existingRecord?.ankiNoteId) {
    const notesInfo = await ankiInvoke(
      "notesInfo",
      { notes: [existingRecord.ankiNoteId] },
      port
    );
    if (notesInfo?.[0]?.noteId) {
      if (existingRecord.ankiSuspendedByVerba && notesInfo[0].cards?.length) {
        await ankiInvoke("unsuspend", { cards: notesInfo[0].cards }, port);
      }
      if (payload.pickedByHand && existingRecord.ankiDeck !== pickedDeck && notesInfo[0].cards?.length) {
        await ankiInvoke("changeDeck", { cards: notesInfo[0].cards, deck: pickedDeck }, port);
        return { noteId: existingRecord.ankiNoteId, deck: pickedDeck, action: "moved" };
      }
      await ankiInvoke("updateNoteFields", { note: { id: existingRecord.ankiNoteId, fields } }, port);
      return { noteId: existingRecord.ankiNoteId, deck: targetDeck, action: "updated" };
    }
  }
  const tags = [...settings.ankiTags.split(/\s+/).filter(Boolean), `verba::${payload.lang}`];
  const noteId = await ankiInvoke(
    "addNote",
    {
      note: {
        deckName: targetDeck,
        modelName: langOpts.ankiNoteType || "Verba",
        fields,
        options: { allowDuplicate: false, duplicateScope: "deck" },
        tags
      }
    },
    port
  );
  return { noteId, deck: targetDeck, action: "created" };
}
async function syncWithAnki(words, settings) {
  const port = settings.ankiConnectPort;
  const changed = [];
  const withNotes = words.filter((w) => w.ankiNoteId);
  if (withNotes.length === 0) return changed;
  const notesInfo = await ankiInvoke(
    "notesInfo",
    { notes: withNotes.map((w) => w.ankiNoteId) },
    port
  );
  const allCardIds = notesInfo.flatMap((n) => n.cards || []);
  const cardsInfo = allCardIds.length ? await ankiInvoke(
    "cardsInfo",
    { cards: allCardIds },
    port
  ) : [];
  const cardsByNote = /* @__PURE__ */ new Map();
  for (const c of cardsInfo) {
    const arr = cardsByNote.get(c.note) || [];
    arr.push(c);
    cardsByNote.set(c.note, arr);
  }
  for (const w of withNotes) {
    const cards = cardsByNote.get(w.ankiNoteId) || [];
    if (cards.length === 0) continue;
    if (settings.ankiSuspendWhenKnown && (w.status === 5 || w.status === -1) && !w.ankiSuspendedByVerba) {
      const activeIds = cards.filter((c) => c.queue !== -1).map((c) => c.cardId);
      if (activeIds.length > 0) {
        await ankiInvoke("suspend", { cards: activeIds }, port);
        const next = { ...w, ankiSuspendedByVerba: true, updatedAt: Date.now() };
        changed.push(next);
        continue;
      }
    }
    if (w.status >= 1 && w.status <= 4 && w.ankiSuspendedByVerba) {
      await ankiInvoke("unsuspend", { cards: cards.map((c) => c.cardId) }, port);
      const next = { ...w, ankiSuspendedByVerba: false, updatedAt: Date.now() };
      changed.push(next);
      continue;
    }
    if (settings.ankiMarkKnownOnMature && w.status >= 1 && w.status <= 4) {
      const maxInterval = Math.max(...cards.map((c) => c.interval || 0));
      if (maxInterval >= settings.ankiMatureDays) {
        const next = { ...w, status: 5, updatedAt: Date.now() };
        changed.push(next);
      }
    }
  }
  return changed;
}

// src/shared/sync-crypto.ts
async function sha256Hex(data) {
  const bytes = typeof data === "string" ? new TextEncoder().encode(data) : data;
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// src/background/index.ts
async function fetchExtensionDict(lang) {
  const url = getExtensionUrl(`dictionaries/${lang}.json`);
  const res = await fetch(url);
  return await res.json();
}
async function seedSampleBooksIfEmpty() {
  try {
    const epubUrl = getExtensionUrl("samples/pinocchio-it.epub");
    const epubRes = await fetch(epubUrl);
    if (epubRes.ok) {
      const bytes = new Uint8Array(await epubRes.arrayBuffer());
      const id = await sha256Hex(bytes);
      const existing = await getBookById(id);
      if (!existing) {
        const unzipped = unzipSync(bytes);
        const ch1Html = unzipped["OEBPS/ch1.xhtml"] ? strFromU8(unzipped["OEBPS/ch1.xhtml"]) : "";
        const ch2Html = unzipped["OEBPS/ch2.xhtml"] ? strFromU8(unzipped["OEBPS/ch2.xhtml"]) : "";
        const strip = (h) => h.replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
        const chapters = [
          {
            id: "ch1",
            title: "Capitolo I \u2014 Maestro Ciliegia e il pezzo di legno",
            html: extractBodyInner(ch1Html),
            text: strip(ch1Html)
          },
          {
            id: "ch2",
            title: "Capitolo II \u2014 Geppetto prende il pezzo di legno",
            html: extractBodyInner(ch2Html),
            text: strip(ch2Html)
          }
        ];
        const allWords = chapters.map((c) => c.text).join(" ").split(/\s+/).filter(Boolean);
        const book = {
          id,
          lang: "it",
          title: "Le avventure di Pinocchio",
          author: "Carlo Collodi",
          format: "epub",
          folderId: null,
          chapters,
          chapterIndex: 0,
          scrollRatio: 0,
          totalWords: allWords.length,
          uniqueWords: new Set(allWords.map((w) => w.toLowerCase())).size,
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        await putBook(book, bytes);
      }
    }
    const zhUrl = getExtensionUrl("samples/luxun-zh.txt");
    const zhRes = await fetch(zhUrl);
    if (zhRes.ok) {
      const text = await zhRes.text();
      const id = await sha256Hex(text);
      if (!await getBookById(id)) {
        await putBook({
          id,
          lang: "zh",
          title: "\u72C2\u4EBA\u65E5\u8BB0 (\u9009\u6BB5)",
          author: "\u9C81\u8FC5",
          format: "txt",
          folderId: null,
          chapters: [{ id: "ch1", title: "\u72C2\u4EBA\u65E5\u8BB0", text }],
          chapterIndex: 0,
          scrollRatio: 0,
          totalWords: text.replace(/\s+/g, "").length,
          uniqueWords: new Set(Array.from(text.replace(/\s+/g, ""))).size,
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
      }
    }
    const jaUrl = getExtensionUrl("samples/wagahai-ja.txt");
    const jaRes = await fetch(jaUrl);
    if (jaRes.ok) {
      const text = await jaRes.text();
      const id = await sha256Hex(text);
      if (!await getBookById(id)) {
        await putBook({
          id,
          lang: "ja",
          title: "\u543E\u8F29\u306F\u732B\u3067\u3042\u308B (\u5192\u982D)",
          author: "\u590F\u76EE\u6F31\u77F3",
          format: "txt",
          folderId: null,
          chapters: [{ id: "ch1", title: "\u7B2C\u4E00\u7AE0", text }],
          chapterIndex: 0,
          scrollRatio: 0,
          totalWords: text.replace(/\s+/g, "").length,
          uniqueWords: new Set(Array.from(text.replace(/\s+/g, ""))).size,
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
      }
    }
  } catch (err2) {
    console.warn("Sample book seeding warning:", err2);
  }
}
function extractBodyInner(xhtml) {
  const m = xhtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return m ? m[1].trim() : xhtml;
}
async function updateToolbarBadge(settings, tabId) {
  const ext = getExtApi();
  if (!ext?.action) return;
  const s = settings || await getSettings();
  const isPausedTab = tabId !== void 0 && s.pausedTabIds.includes(tabId);
  if (!s.runOnWebPages || isPausedTab) {
    await ext.action.setBadgeText({ text: "OFF", ...tabId !== void 0 ? { tabId } : {} });
    await ext.action.setBadgeBackgroundColor({ color: "#475569", ...tabId !== void 0 ? { tabId } : {} });
  } else {
    await ext.action.setBadgeText({
      text: s.activeLang.toUpperCase(),
      ...tabId !== void 0 ? { tabId } : {}
    });
    await ext.action.setBadgeBackgroundColor({ color: "#0f172a", ...tabId !== void 0 ? { tabId } : {} });
  }
}
function broadcastToAllTabs(payload, excludeTabId) {
  queryTabs({}).then((tabs) => {
    for (const tab of tabs) {
      if (tab.id !== void 0 && tab.id !== excludeTabId) {
        sendTabMessage(tab.id, payload).catch(() => {
        });
      }
    }
  });
}
function isDomainBlocked(urlStr, neverRunDomains) {
  try {
    const u = new URL(urlStr);
    const host = u.hostname.toLowerCase();
    return neverRunDomains.some((d) => {
      const clean = d.toLowerCase().trim();
      return clean && (host === clean || host.endsWith("." + clean));
    });
  } catch {
    return false;
  }
}
function computeTotalKnownWords(words, lang) {
  const seenScriptPair = /* @__PURE__ */ new Set();
  let count = 0;
  for (const w of words) {
    if (w.deleted || w.status !== 5) continue;
    if (w.isPhrase && lang !== "vi") continue;
    if (seenScriptPair.has(w.word)) continue;
    seenScriptPair.add(w.word);
    if (w.altScript) seenScriptPair.add(w.altScript);
    count++;
  }
  return count;
}
async function computeTodayTally(lang, dayEndsAtHour) {
  const today = getLogicalDateString(Date.now(), dayEndsAtHour);
  const stats = await getDailyStatsByLang(lang);
  let wordsMarkedKnown = 0;
  let frequentMarkedKnown = 0;
  let wordsRead = 0;
  let secondsListened = 0;
  for (const s of stats) {
    if (s.date === today) {
      wordsMarkedKnown += s.wordsMarkedKnown;
      frequentMarkedKnown += s.frequentMarkedKnown;
      wordsRead += s.wordsRead;
      secondsListened += s.secondsListened;
    }
  }
  return { wordsMarkedKnown, frequentMarkedKnown, wordsRead, secondsListened };
}
var extApi = getExtApi();
extApi?.runtime?.onInstalled?.addListener(async (details) => {
  const settings = await getSettings();
  await loadBundledDictionary(settings.activeLang, fetchExtensionDict);
  await seedSampleBooksIfEmpty();
  await updateToolbarBadge(settings);
  extApi?.alarms?.create("verba-periodic-tick", { periodInMinutes: 1 });
  try {
    extApi?.contextMenus?.removeAll(() => {
      extApi?.contextMenus?.create({
        id: "verba-open-reader-view",
        title: "Open in Verba Reader View (Shift+L)",
        contexts: ["page", "selection"]
      });
    });
  } catch {
  }
  if (details?.reason === "install") {
    await createTab({ url: getExtensionUrl("dashboard.html#onboarding") }).catch(() => {
    });
  }
});
extApi?.contextMenus?.onClicked?.addListener(
  (info, tab) => {
    if (info.menuItemId === "verba-open-reader-view" && tab?.id !== void 0) {
      sendTabMessage(tab.id, { type: "VERBA_TRIGGER_READER" }).catch(() => {
      });
    }
  }
);
extApi?.alarms?.onAlarm?.addListener(async (alarm) => {
  if (alarm.name !== "verba-periodic-tick") return;
  const settings = await getSettings();
  if (settings.smartListeningTracking) {
    const audibleTabs = await queryTabs({ audible: true });
    for (const tab of audibleTabs) {
      if (!tab.url || !tab.title) continue;
      try {
        const host = new URL(tab.url).hostname.replace(/^www\./, "");
        if (settings.ignoredListeningDomains.includes(host)) continue;
        const detected = detectTextLanguage(tab.title);
        if (detected === settings.activeLang) {
          await incrementDailyStat(settings.activeLang, settings.deviceId, settings.dayEndsAtHour, {
            secondsListened: 60
          });
          const date = getLogicalDateString(Date.now(), settings.dayEndsAtHour);
          await putListeningLog({
            id: `${settings.activeLang}:${date}:${tab.title.slice(0, 80)}`,
            lang: settings.activeLang,
            title: tab.title,
            domain: host,
            date,
            secondsEarned: 60,
            status: "counted",
            updatedAt: Date.now()
          });
        } else if (!detected && settings.askUnsureTrackLang) {
          const date = getLogicalDateString(Date.now(), settings.dayEndsAtHour);
          await putListeningLog({
            id: `${settings.activeLang}:${date}:${tab.title.slice(0, 80)}`,
            lang: settings.activeLang,
            title: tab.title,
            domain: host,
            date,
            secondsEarned: 60,
            status: "held",
            updatedAt: Date.now()
          });
        }
      } catch {
      }
    }
  }
  if (settings.ankiSendAllLearning || settings.ankiMarkKnownOnMature || settings.ankiSuspendWhenKnown) {
    try {
      const allWords = await getAllWordsRaw();
      const changed = await syncWithAnki(allWords, settings);
      if (changed.length > 0) {
        await putWordRecordsBatch(changed);
        broadcastToAllTabs({ type: "VERBA_WORDS_REFRESH" });
      }
    } catch {
    }
  }
});
onRuntimeMessage(async (rawMsg, sender) => {
  const settings = await getSettings();
  const tabId = sender.tab?.id;
  switch (rawMsg.type) {
    case "GET_SETTINGS": {
      return settings;
    }
    case "SAVE_SETTINGS": {
      const patch = { ...rawMsg.patch };
      if (patch.activeLang && !patch.learningLangs && !settings.learningLangs.includes(patch.activeLang)) {
        patch.learningLangs = Array.from(/* @__PURE__ */ new Set([patch.activeLang, ...settings.learningLangs]));
      }
      const next = await saveSettings(patch);
      await updateToolbarBadge(next, tabId);
      broadcastToAllTabs({ type: "VERBA_SETTINGS_UPDATED", settings: next });
      return next;
    }
    case "GET_DICTIONARY": {
      const url = getExtensionUrl(`dictionaries/${rawMsg.lang}.json`);
      const res = await fetch(url);
      return await res.json();
    }
    case "GET_INIT_DATA": {
      let activeLang = settings.activeLang;
      let autoSwitchedFrom;
      const isPaused = tabId !== void 0 && settings.pausedTabIds.includes(tabId);
      const isForceOn = settings.forceEnabledUrls.includes(rawMsg.url);
      const isBlocked = !isForceOn && isDomainBlocked(rawMsg.url, settings.neverRunDomains);
      let enabled = settings.runOnWebPages && !isPaused && !isBlocked;
      let diglotModeOnThisPage = false;
      if (enabled && !isForceOn && (rawMsg.htmlLang || rawMsg.sampleText)) {
        const pageLang = detectTextLanguage(rawMsg.sampleText || "", rawMsg.htmlLang);
        if (pageLang && pageLang !== activeLang) {
          if (settings.autoSwitchPageLang && settings.learningLangs.includes(pageLang)) {
            autoSwitchedFrom = activeLang;
            activeLang = pageLang;
            await saveSettings({ activeLang });
          } else if (settings.inlineReplacementEnabled && activeLang !== "en") {
            diglotModeOnThisPage = true;
          } else if (!rawMsg.url.includes("youtube.com") && !rawMsg.url.includes("netflix.com")) {
            enabled = false;
          }
        }
      }
      await updateToolbarBadge({ ...settings, activeLang }, tabId);
      const words = await getWordsByLang(activeLang);
      const customDicts = await getCustomDictsByLang(activeLang);
      const todayStats = await computeTodayTally(activeLang, settings.dayEndsAtHour);
      const totalKnownCount = computeTotalKnownWords(words, activeLang);
      const payload = {
        settings: { ...settings, activeLang },
        activeLang,
        autoSwitchedFrom,
        enabledOnThisPage: enabled,
        diglotModeOnThisPage,
        words,
        customDicts,
        todayStats,
        totalKnownCount
      };
      return payload;
    }
    case "LOOKUP_WORD": {
      const idx = await loadBundledDictionary(rawMsg.lang, fetchExtensionDict);
      const words = await getWordsByLang(rawMsg.lang);
      const wordMap = new Map(words.map((w) => [w.word, w]));
      const customDicts = await getCustomDictsByLang(rawMsg.lang);
      const opts = getLangOptionsFromSettings(settings, rawMsg.lang);
      const res = lookupWordDetailed(
        rawMsg.word,
        rawMsg.lang,
        idx,
        opts,
        wordMap,
        customDicts,
        rawMsg.sentence,
        rawMsg.lemmaHint
      );
      if (rawMsg.incrementLookup && res.record) {
        const updated = {
          ...res.record,
          lookupCount: (res.record.lookupCount || 0) + 1,
          updatedAt: Date.now()
        };
        await putWordRecord(updated);
        res.record = updated;
      }
      return res;
    }
    case "GRADE_WORD": {
      const idx = await loadBundledDictionary(rawMsg.lang, fetchExtensionDict);
      const opts = getLangOptionsFromSettings(settings, rawMsg.lang);
      const resolved = resolveTrackingKey(
        rawMsg.lemmaOverride || rawMsg.word,
        rawMsg.lang,
        idx,
        opts.countingMode
      );
      const canonicalWord = rawMsg.isPhrase || rawMsg.isCustomSegment ? rawMsg.word : resolved.key;
      const prev = await getWordRecord(rawMsg.lang, canonicalWord);
      const now = Date.now();
      if (rawMsg.status === 0 && !rawMsg.customMeaning && !rawMsg.aiMeaning) {
        if (prev) {
          const resetRec = { ...prev, status: 0, deleted: true, updatedAt: now };
          await putWordRecord(resetRec);
          broadcastToAllTabs({ type: "VERBA_WORD_UPDATED", record: resetRec });
        }
        return { ok: true, record: null };
      }
      const primaryEntry = resolved.primaryEntry;
      const altScript = rawMsg.altScript || (primaryEntry?.alt && primaryEntry.alt !== canonicalWord ? primaryEntry.alt : primaryEntry?.w && primaryEntry.w !== canonicalWord ? primaryEntry.w : void 0);
      const nextRecord = {
        id: `${rawMsg.lang}:${canonicalWord}`,
        lang: rawMsg.lang,
        word: canonicalWord,
        ...altScript ? { altScript } : {},
        status: rawMsg.status,
        isPhrase: Boolean(rawMsg.isPhrase ?? (/\s/.test(canonicalWord) && rawMsg.lang !== "vi")),
        isCustomSegment: Boolean(rawMsg.isCustomSegment ?? prev?.isCustomSegment),
        ...rawMsg.lemmaOverride ? { lemmaOverride: rawMsg.lemmaOverride } : prev?.lemmaOverride ? { lemmaOverride: prev.lemmaOverride } : {},
        ...rawMsg.customMeaning !== void 0 ? { customMeaning: rawMsg.customMeaning } : prev?.customMeaning ? { customMeaning: prev.customMeaning } : {},
        ...rawMsg.aiMeaning !== void 0 ? { aiMeaning: rawMsg.aiMeaning } : prev?.aiMeaning ? { aiMeaning: prev.aiMeaning } : {},
        ...prev?.aiVerdict ? { aiVerdict: prev.aiVerdict } : {},
        reading: primaryEntry?.r || prev?.reading,
        lookupCount: (prev?.lookupCount || 0) + 1,
        source: prev?.source || "manual",
        contextSentence: rawMsg.contextSentence || prev?.contextSentence,
        ankiNoteId: prev?.ankiNoteId,
        ankiDeck: prev?.ankiDeck,
        ankiSuspendedByVerba: prev?.ankiSuspendedByVerba,
        deleted: false,
        createdAt: prev?.createdAt || now,
        updatedAt: now
      };
      await putWordRecord(nextRecord);
      if ((rawMsg.lang === "zh" || rawMsg.lang === "yue") && opts.unifyScripts && rawMsg.status === 5 && altScript && altScript !== canonicalWord) {
        const altPrev = await getWordRecord(rawMsg.lang, altScript);
        await putWordRecord({
          id: `${rawMsg.lang}:${altScript}`,
          lang: rawMsg.lang,
          word: altScript,
          altScript: canonicalWord,
          status: 5,
          isPhrase: false,
          isCustomSegment: false,
          lookupCount: altPrev?.lookupCount || 0,
          source: "manual",
          createdAt: altPrev?.createdAt || now,
          updatedAt: now
        });
      }
      if (!nextRecord.isPhrase || rawMsg.lang === "vi") {
        const isFrequent = Boolean(primaryEntry?.rank && primaryEntry.rank <= 5e3);
        if (rawMsg.status === 5 && prev?.status !== 5) {
          await incrementDailyStat(rawMsg.lang, settings.deviceId, settings.dayEndsAtHour, {
            wordsMarkedKnown: 1,
            frequentMarkedKnown: isFrequent ? 1 : 0
          });
        } else if (rawMsg.status >= 1 && rawMsg.status <= 4 && (!prev || prev.status === 0)) {
          await incrementDailyStat(rawMsg.lang, settings.deviceId, settings.dayEndsAtHour, {
            wordsMarkedLearning: 1
          });
        }
      }
      if (settings.ankiSendAllLearning && settings.ankiLevelsToSend.includes(rawMsg.status) && !nextRecord.ankiNoteId) {
        sendWordToAnki(
          {
            lang: rawMsg.lang,
            word: canonicalWord,
            reading: nextRecord.reading,
            pitch: primaryEntry?.pitch,
            meanings: nextRecord.customMeaning ? [nextRecord.customMeaning] : primaryEntry?.m || [],
            sentence: nextRecord.contextSentence,
            pickedByHand: false
          },
          nextRecord,
          settings
        ).then(async (ankiRes) => {
          await putWordRecord({ ...nextRecord, ankiNoteId: ankiRes.noteId, ankiDeck: ankiRes.deck });
        }).catch(() => {
        });
      }
      const updatedWords = await getWordsByLang(rawMsg.lang);
      const totalKnownCount = computeTotalKnownWords(updatedWords, rawMsg.lang);
      const todayStats = await computeTodayTally(rawMsg.lang, settings.dayEndsAtHour);
      broadcastToAllTabs({
        type: "VERBA_WORD_UPDATED",
        record: nextRecord,
        totalKnownCount,
        todayStats
      });
      return { ok: true, record: nextRecord, totalKnownCount, todayStats };
    }
    case "BATCH_MARK_KNOWN": {
      const now = Date.now();
      const existing = await getWordsByLang(rawMsg.lang);
      const existingMap = new Map(existing.map((w) => [w.word, w]));
      const toSave = [];
      for (const w of rawMsg.words) {
        const prev = existingMap.get(w);
        if (prev && prev.status !== 0) continue;
        toSave.push({
          id: `${rawMsg.lang}:${w}`,
          lang: rawMsg.lang,
          word: w,
          status: 5,
          isPhrase: /\s/.test(w) && rawMsg.lang !== "vi",
          isCustomSegment: false,
          lookupCount: prev?.lookupCount || 0,
          source: rawMsg.source,
          createdAt: prev?.createdAt || now,
          updatedAt: now
        });
      }
      await putWordRecordsBatch(toSave);
      if (rawMsg.source === "manual" && toSave.length > 0) {
        await incrementDailyStat(rawMsg.lang, settings.deviceId, settings.dayEndsAtHour, {
          wordsMarkedKnown: toSave.length
        });
      }
      const updatedWords = await getWordsByLang(rawMsg.lang);
      const totalKnownCount = computeTotalKnownWords(updatedWords, rawMsg.lang);
      const todayStats = await computeTodayTally(rawMsg.lang, settings.dayEndsAtHour);
      broadcastToAllTabs({ type: "VERBA_WORDS_REFRESH", totalKnownCount, todayStats });
      return {
        ok: true,
        markedCount: toSave.length,
        markedWords: toSave.map((r) => r.word),
        totalKnownCount,
        todayStats
      };
    }
    case "SPLIT_CUSTOM_WORD": {
      const prev = await getWordRecord(rawMsg.lang, rawMsg.word);
      if (prev) {
        const updated = {
          ...prev,
          isCustomSegment: false,
          deleted: true,
          status: 0,
          updatedAt: Date.now()
        };
        await putWordRecord(updated);
        broadcastToAllTabs({ type: "VERBA_WORDS_REFRESH" });
      }
      return { ok: true };
    }
    case "TRANSLATE": {
      const opts = rawMsg.sourceLang !== "auto" ? getLangOptionsFromSettings(settings, rawMsg.sourceLang) : null;
      const target = rawMsg.targetLang || opts?.translateIntoLang || "en";
      const mode = opts?.whoTranslates || "google";
      return await translateText(rawMsg.text, rawMsg.sourceLang, target, mode);
    }
    case "AI_CHECK_WORD": {
      const opts = getLangOptionsFromSettings(settings, rawMsg.lang);
      const verdict = await runAiWordCheck(
        rawMsg.word,
        rawMsg.lang,
        rawMsg.sentence,
        settings,
        opts.translateIntoLang
      );
      const idx = await loadBundledDictionary(rawMsg.lang, fetchExtensionDict);
      const resolved = resolveTrackingKey(rawMsg.word, rawMsg.lang, idx, opts.countingMode);
      const prev = await getWordRecord(rawMsg.lang, resolved.key) || await getWordRecord(rawMsg.lang, rawMsg.word);
      const now = Date.now();
      const nextRec = prev ? { ...prev, aiVerdict: verdict, updatedAt: now } : {
        id: `${rawMsg.lang}:${resolved.key}`,
        lang: rawMsg.lang,
        word: resolved.key,
        status: 0,
        isPhrase: Boolean(/\s/.test(resolved.key) && rawMsg.lang !== "vi"),
        isCustomSegment: false,
        lookupCount: 1,
        source: "manual",
        aiVerdict: verdict,
        deleted: false,
        createdAt: now,
        updatedAt: now
      };
      await putWordRecord(nextRec);
      return { ok: true, verdict };
    }
    case "ANKI_TEST": {
      return await testAnkiConnection(rawMsg.port);
    }
    case "ANKI_SEND_WORD": {
      const prev = await getWordRecord(rawMsg.payload.lang, rawMsg.payload.word);
      const res = await sendWordToAnki(rawMsg.payload, prev, settings);
      const now = Date.now();
      const nextRec = prev ? {
        ...prev,
        status: prev.status === 0 ? 1 : prev.status,
        ankiNoteId: res.noteId,
        ankiDeck: res.deck,
        ankiSuspendedByVerba: false,
        updatedAt: now
      } : {
        id: `${rawMsg.payload.lang}:${rawMsg.payload.word}`,
        lang: rawMsg.payload.lang,
        word: rawMsg.payload.word,
        status: 1,
        isPhrase: /\s/.test(rawMsg.payload.word) && rawMsg.payload.lang !== "vi",
        isCustomSegment: false,
        lookupCount: 1,
        source: "manual",
        contextSentence: rawMsg.payload.sentence,
        ankiNoteId: res.noteId,
        ankiDeck: res.deck,
        createdAt: now,
        updatedAt: now
      };
      await putWordRecord(nextRec);
      broadcastToAllTabs({ type: "VERBA_WORD_UPDATED", record: nextRec });
      return { ok: true, ...res, record: nextRec };
    }
    case "ANKI_SYNC_NOW": {
      const allWords = await getAllWordsRaw();
      const changed = await syncWithAnki(allWords, settings);
      if (changed.length > 0) {
        await putWordRecordsBatch(changed);
        broadcastToAllTabs({ type: "VERBA_WORDS_REFRESH" });
      }
      return { ok: true, updatedCount: changed.length };
    }
    case "RECORD_READING_WORDS": {
      if (rawMsg.count <= 0) return { ok: true };
      if (rawMsg.paragraphKey) {
        const today = getLogicalDateString(Date.now(), settings.dayEndsAtHour);
        const fresh = await checkAndRecordArticleParagraphRead(`${today}:${rawMsg.paragraphKey}`);
        if (!fresh) return { ok: true, skippedDuplicate: true };
      }
      const stat = await incrementDailyStat(rawMsg.lang, settings.deviceId, settings.dayEndsAtHour, {
        wordsRead: rawMsg.count
      });
      return { ok: true, stat };
    }
    case "RECORD_LISTENING_SECONDS": {
      if (rawMsg.seconds <= 0) return { ok: true };
      if (!rawMsg.held) {
        await incrementDailyStat(rawMsg.lang, settings.deviceId, settings.dayEndsAtHour, {
          secondsListened: rawMsg.seconds
        });
      }
      if (rawMsg.title) {
        const date = getLogicalDateString(Date.now(), settings.dayEndsAtHour);
        await putListeningLog({
          id: `${rawMsg.lang}:${date}:${rawMsg.title.slice(0, 80)}`,
          lang: rawMsg.lang,
          title: rawMsg.title,
          domain: rawMsg.domain || "reader",
          date,
          secondsEarned: rawMsg.seconds,
          status: rawMsg.held ? "held" : "counted",
          updatedAt: Date.now()
        });
      }
      return { ok: true };
    }
    case "SAVE_ARTICLE_TO_SHELF": {
      const id = await sha256Hex(`${rawMsg.lang}:article:${rawMsg.url}`);
      const prev = await getBookById(id);
      const wordsArr = rawMsg.text.split(/\s+/).filter(Boolean);
      const book = {
        id,
        lang: rawMsg.lang,
        title: prev?.title || rawMsg.title || "Saved Article",
        format: "article",
        folderId: prev?.folderId ?? null,
        chapters: [{ id: "article", title: rawMsg.title || "Article", html: rawMsg.html, text: rawMsg.text }],
        chapterIndex: prev?.chapterIndex || 0,
        scrollRatio: prev?.scrollRatio || 0,
        sourceUrl: rawMsg.url,
        totalWords: wordsArr.length,
        uniqueWords: new Set(wordsArr.map((w) => w.toLowerCase())).size,
        createdAt: prev?.createdAt || Date.now(),
        updatedAt: Date.now()
      };
      await putBook(book);
      return { ok: true, bookId: id };
    }
    case "SAVE_VIDEO_PROGRESS": {
      await putVideoHistory(rawMsg.item);
      return { ok: true };
    }
    case "GET_VIDEO_PROGRESS": {
      return await getVideoById(rawMsg.id) || null;
    }
    case "BROADCAST_WORDS_REFRESH": {
      await updateToolbarBadge(settings, tabId);
      broadcastToAllTabs(
        { type: "VERBA_WORDS_REFRESH", lang: rawMsg.lang || settings.activeLang },
        tabId
      );
      return { ok: true };
    }
    case "OPEN_EXTENSION_PAGE": {
      const pageMap = {
        dashboard: "dashboard.html",
        books: "books.html",
        video: "video.html"
      };
      const targetUrl = getExtensionUrl(pageMap[rawMsg.page] + (rawMsg.query ? `?${rawMsg.query}` : ""));
      await createTab({ url: targetUrl });
      return { ok: true };
    }
  }
});
export {
  updateToolbarBadge
};
