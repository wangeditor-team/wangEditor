(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * 默认配置
 *
 * @author 老雷<leizongmin@gmail.com>
 */


// 默认白名单
var whiteList = {
  a:      ['target', 'href', 'title'],
  abbr:   ['title'],
  address: [],
  area:   ['shape', 'coords', 'href', 'alt'],
  article: [],
  aside:  [],
  audio:  ['autoplay', 'controls', 'loop', 'preload', 'src'],
  b:      [],
  bdi:    ['dir'],
  bdo:    ['dir'],
  big:    [],
  blockquote: ['cite'],
  br:     [],
  caption: [],
  center: [],
  cite:   [],
  code:   [],
  col:    ['align', 'valign', 'span', 'width'],
  colgroup: ['align', 'valign', 'span', 'width'],
  dd:     [],
  del:    ['datetime'],
  details: ['open'],
  div:    [],
  dl:     [],
  dt:     [],
  em:     [],
  font:   ['color', 'size', 'face'],
  footer: [],
  h1:     [],
  h2:     [],
  h3:     [],
  h4:     [],
  h5:     [],
  h6:     [],
  header: [],
  hr:     [],
  i:      [],
  img:    ['src', 'alt', 'title', 'width', 'height'],
  ins:    ['datetime'],
  li:     [],
  mark:   [],
  nav:    [],
  ol:     [],
  p:      [],
  pre:    [],
  s:      [],
  section:[],
  small:  [],
  span:   [],
  sub:    [],
  sup:    [],
  strong: [],
  table:  ['width', 'border', 'align', 'valign'],
  tbody:  ['align', 'valign'],
  td:     ['width', 'colspan', 'align', 'valign'],
  tfoot:  ['align', 'valign'],
  th:     ['width', 'colspan', 'align', 'valign'],
  thead:  ['align', 'valign'],
  tr:     ['rowspan', 'align', 'valign'],
  tt:     [],
  u:      [],
  ul:     [],
  video:  ['autoplay', 'controls', 'loop', 'preload', 'src', 'height', 'width']
};

/**
 * 匹配到标签时的处理方法
 *
 * @param {String} tag
 * @param {String} html
 * @param {Object} options
 * @return {String}
 */
function onTag (tag, html, options) {
  // do nothing
}

/**
 * 匹配到不在白名单上的标签时的处理方法
 *
 * @param {String} tag
 * @param {String} html
 * @param {Object} options
 * @return {String}
 */
function onIgnoreTag (tag, html, options) {
  // do nothing
}

/**
 * 匹配到标签属性时的处理方法
 *
 * @param {String} tag
 * @param {String} name
 * @param {String} value
 * @return {String}
 */
function onTagAttr (tag, name, value) {
  // do nothing
}

/**
 * 匹配到不在白名单上的标签属性时的处理方法
 *
 * @param {String} tag
 * @param {String} name
 * @param {String} value
 * @return {String}
 */
function onIgnoreTagAttr (tag, name, value) {
  // do nothing
}

/**
 * HTML转义
 *
 * @param {String} html
 */
function escapeHtml (html) {
  return html.replace(REGEXP_LT, '&lt;').replace(REGEXP_GT, '&gt;');
}

/**
 * 安全的标签属性值
 *
 * @param {String} tag
 * @param {String} name
 * @param {String} value
 * @return {String}
 */
function safeAttrValue (tag, name, value) {
  // 转换为友好的属性值，再做判断
  value = friendlyAttrValue(value);

  if (name === 'href' || name === 'src') {
    // 过滤 href 和 src 属性
    // 仅允许 http:// | https:// | mailto: | / 开头的地址
    value = value.trim();
    if (value === '#') return '#';
    if (!(value.substr(0, 7) === 'http://' ||
         value.substr(0, 8) === 'https://' ||
         value.substr(0, 7) === 'mailto:' ||
         value[0] === '/')) {
      return '';
    }
  } else if (name === 'background') {
    // 过滤 background 属性 （这个xss漏洞较老了，可能已经不适用）
    // javascript:
    REGEXP_DEFAULT_ON_TAG_ATTR_4.lastIndex = 0;
    if (REGEXP_DEFAULT_ON_TAG_ATTR_4.test(value)) {
      return '';
    }
  } else if (name === 'style') {
    // /*注释*/
    REGEXP_DEFAULT_ON_TAG_ATTR_3.lastIndex = 0;
    if (REGEXP_DEFAULT_ON_TAG_ATTR_3.test(value)) {
      return '';
    }
    // expression()
    REGEXP_DEFAULT_ON_TAG_ATTR_7.lastIndex = 0;
    if (REGEXP_DEFAULT_ON_TAG_ATTR_7.test(value)) {
      return '';
    }
    // url()
    REGEXP_DEFAULT_ON_TAG_ATTR_8.lastIndex = 0;
    if (REGEXP_DEFAULT_ON_TAG_ATTR_8.test(value)) {
      REGEXP_DEFAULT_ON_TAG_ATTR_4.lastIndex = 0;
      if (REGEXP_DEFAULT_ON_TAG_ATTR_4.test(value)) {
        return '';
      }
    }
  }

  // 输出时需要转义<>"
  value = escapeAttrValue(value);
  return value;
}

// 正则表达式
var REGEXP_LT = /</g;
var REGEXP_GT = />/g;
var REGEXP_QUOTE = /"/g;
var REGEXP_QUOTE_2 = /&quot;/g;
var REGEXP_ATTR_VALUE_1 = /&#([a-zA-Z0-9]*);?/img;
var REGEXP_ATTR_VALUE_COLON = /&colon;?/img;
var REGEXP_ATTR_VALUE_NEWLINE = /&newline;?/img;
var REGEXP_DEFAULT_ON_TAG_ATTR_3 = /\/\*|\*\//mg;
var REGEXP_DEFAULT_ON_TAG_ATTR_4 = /((j\s*a\s*v\s*a|v\s*b|l\s*i\s*v\s*e)\s*s\s*c\s*r\s*i\s*p\s*t\s*|m\s*o\s*c\s*h\s*a)\:/ig;
var REGEXP_DEFAULT_ON_TAG_ATTR_5 = /^[\s"'`]*(d\s*a\s*t\s*a\s*)\:/ig;
var REGEXP_DEFAULT_ON_TAG_ATTR_6 = /^[\s"'`]*(d\s*a\s*t\s*a\s*)\:\s*image\//ig;
var REGEXP_DEFAULT_ON_TAG_ATTR_7 = /e\s*x\s*p\s*r\s*e\s*s\s*s\s*i\s*o\s*n\s*\(.*/ig;
var REGEXP_DEFAULT_ON_TAG_ATTR_8 = /u\s*r\s*l\s*\(.*/ig;

/**
 * 对双引号进行转义
 *
 * @param {String} str
 * @return {String} str
 */
function escapeQuote (str) {
  return str.replace(REGEXP_QUOTE, '&quot;');
}

/**
 * 对双引号进行转义
 *
 * @param {String} str
 * @return {String} str
 */
function unescapeQuote (str) {
  return str.replace(REGEXP_QUOTE_2, '"');
}

/**
 * 对html实体编码进行转义
 *
 * @param {String} str
 * @return {String}
 */
function escapeHtmlEntities (str) {
  return str.replace(REGEXP_ATTR_VALUE_1, function replaceUnicode (str, code) {
    return (code[0] === 'x' || code[0] === 'X')
            ? String.fromCharCode(parseInt(code.substr(1), 16))
            : String.fromCharCode(parseInt(code, 10));
  });
}

/**
 * 对html5新增的危险实体编码进行转义
 *
 * @param {String} str
 * @return {String}
 */
function escapeDangerHtml5Entities (str) {
  return str.replace(REGEXP_ATTR_VALUE_COLON, ':')
            .replace(REGEXP_ATTR_VALUE_NEWLINE, ' ');
}

/**
 * 清除不可见字符
 *
 * @param {String} str
 * @return {String}
 */
function clearNonPrintableCharacter (str) {
  var str2 = '';
  for (var i = 0, len = str.length; i < len; i++) {
    str2 += str.charCodeAt(i) < 32 ? ' ' : str.charAt(i);
  }
  return str2.trim();
}

/**
 * 将标签的属性值转换成一般字符，便于分析
 *
 * @param {String} str
 * @return {String}
 */
function friendlyAttrValue (str) {
  str = unescapeQuote(str);             // 双引号
  str = escapeHtmlEntities(str);         // 转换HTML实体编码
  str = escapeDangerHtml5Entities(str);  // 转换危险的HTML5新增实体编码
  str = clearNonPrintableCharacter(str); // 清除不可见字符
  return str;
}

/**
 * 转义用于输出的标签属性值
 *
 * @param {String} str
 * @return {String}
 */
function escapeAttrValue (str) {
  str = escapeQuote(str);
  str = escapeHtml(str);
  return str;
}

/**
 * 去掉不在白名单中的标签onIgnoreTag处理方法
 */
function onIgnoreTagStripAll () {
  return '';
}

/**
 * 删除标签体
 *
 * @param {array} tags 要删除的标签列表
 * @param {function} next 对不在列表中的标签的处理函数，可选
 */
function StripTagBody (tags, next) {
  if (typeof(next) !== 'function') {
    next = function () {};
  }

  var isRemoveAllTag = !Array.isArray(tags);
  function isRemoveTag (tag) {
    if (isRemoveAllTag) return true;
    return (tags.indexOf(tag) !== -1);
  }

  var removeList = [];   // 要删除的位置范围列表
  var posStart = false;  // 当前标签开始位置

  return {
    onIgnoreTag: function (tag, html, options) {
      if (isRemoveTag(tag)) {
        if (options.isClosing) {
          var ret = '[/removed]';
          var end = options.position + ret.length;
          removeList.push([posStart !== false ? posStart : options.position, end]);
          posStart = false;
          return ret;
        } else {
          if (!posStart) {
            posStart = options.position;
          }
          return '[removed]';
        }
      } else {
        return next(tag, html, options);
      }
    },
    remove: function (html) {
      var rethtml = '';
      var lastPos = 0;
      removeList.forEach(function (pos) {
        rethtml += html.slice(lastPos, pos[0]);
        lastPos = pos[1];
      });
      rethtml += html.slice(lastPos);
      return rethtml;
    }
  };
}

/**
 * 去除备注标签
 *
 * @param {String} html
 * @return {String}
 */
function stripCommentTag (html) {
  return html.replace(STRIP_COMMENT_TAG_REGEXP, '');
}
var STRIP_COMMENT_TAG_REGEXP = /<!--[\s\S]*?-->/g;

/**
 * 去除不可见字符
 *
 * @param {String} html
 * @return {String}
 */
function stripBlankChar (html) {
  var chars = html.split('');
  chars = chars.filter(function (char) {
    var c = char.charCodeAt(0);
    if (c === 127) return false;
    if (c <= 31) {
      if (c === 10 || c === 13) return true;
      return false;
    }
    return true;
  });
  return chars.join('');
}


exports.whiteList = whiteList;
exports.onTag = onTag;
exports.onIgnoreTag = onIgnoreTag;
exports.onTagAttr = onTagAttr;
exports.onIgnoreTagAttr = onIgnoreTagAttr;
exports.safeAttrValue = safeAttrValue;
exports.escapeHtml = escapeHtml;
exports.escapeQuote = escapeQuote;
exports.unescapeQuote = unescapeQuote;
exports.escapeHtmlEntities = escapeHtmlEntities;
exports.escapeDangerHtml5Entities = escapeDangerHtml5Entities;
exports.clearNonPrintableCharacter = clearNonPrintableCharacter;
exports.friendlyAttrValue = friendlyAttrValue;
exports.escapeAttrValue = escapeAttrValue;
exports.onIgnoreTagStripAll = onIgnoreTagStripAll;
exports.StripTagBody = StripTagBody;
exports.stripCommentTag = stripCommentTag;
exports.stripBlankChar = stripBlankChar;

},{}],2:[function(require,module,exports){
/**
 * 模块入口
 *
 * @author 老雷<leizongmin@gmail.com>
 */

var DEFAULT = require('./default');
var parser = require('./parser');
var FilterXSS = require('./xss');


/**
 * XSS过滤
 *
 * @param {String} html 要过滤的HTML代码
 * @param {Object} options 选项：whiteList, onTag, onTagAttr, onIgnoreTag, onIgnoreTagAttr, safeAttrValue, escapeHtml
 * @return {String}
 */
function filterXSS (html, options) {
  var xss = new FilterXSS(options);
  return xss.process(html);
}


// 输出
exports = module.exports = filterXSS;
exports.FilterXSS = FilterXSS;
for (var i in DEFAULT) exports[i] = DEFAULT[i];
for (var i in parser) exports[i] = parser[i];


// 低版本浏览器支持
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (item) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
}
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function (fn, scope) {
    for (var i = 0; i < this.length; i++) {
      fn.call(scope, this[i], i, this);
    }
  };
}
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, '');
  };
}


// 在AMD下使用
if (typeof define === 'function' && define.amd) {
  define(function () {
    return module.exports;
  });
}

// 在浏览器端使用
if (typeof window !== 'undefined') {
  window.filterXSS = module.exports;
}

},{"./default":1,"./parser":3,"./xss":4}],3:[function(require,module,exports){
/**
 * 简单 HTML Parser
 *
 * @author 老雷<leizongmin@gmail.com>
 */


/**
 * 获取标签的名称
 *
 * @param {String} html 如：'<a hef="#">'
 * @return {String}
 */
function getTagName (html) {
  var i = html.indexOf(' ');
  if (i === -1) {
    var tagName = html.slice(1, -1);
  } else {
    var tagName = html.slice(1, i + 1);
  }
  tagName = tagName.trim().toLowerCase();
  if (tagName[0] === '/') tagName = tagName.slice(1);
  if (tagName[tagName.length - 1] === '/') tagName = tagName.slice(0, -1);
  return tagName;
}

/**
 * 是否为闭合标签
 *
 * @param {String} html 如：'<a hef="#">'
 * @return {Boolean}
 */
function isClosing (html) {
  return (html.slice(0, 2) === '</');
}

/**
 * 分析HTML代码，调用相应的函数处理，返回处理后的HTML
 *
 * @param {String} html
 * @param {Function} onTag 处理标签的函数
 *   参数格式： function (sourcePosition, position, tag, html, isClosing)
 * @param {Function} escapeHtml 对HTML进行转义的韩松
 * @return {String}
 */
function parseTag (html, onTag, escapeHtml) {
  'user strict';

  var rethtml = '';        // 待返回的HTML
  var lastPos = 0;         // 上一个标签结束位置
  var tagStart = false;    // 当前标签开始位置
  var quoteStart = false;  // 引号开始位置
  var currentPos = 0;      // 当前位置
  var len = html.length;   // HTML长度
  var currentHtml = '';    // 当前标签的HTML代码
  var currentTagName = ''; // 当前标签的名称

  // 逐个分析字符
  for (currentPos = 0; currentPos < len; currentPos++) {
    var c = html.charAt(currentPos);
    if (tagStart === false) {
      if (c === '<') {
        tagStart = currentPos;
        continue;
      }
    } else {
      if (quoteStart === false) {
        if (c === '<') {
          rethtml += escapeHtml(html.slice(lastPos, currentPos));
          tagStart = currentPos;
          lastPos = currentPos;
          continue;
        }
        if (c === '>') {
          rethtml += escapeHtml(html.slice(lastPos, tagStart));
          currentHtml = html.slice(tagStart, currentPos + 1);
          currentTagName = getTagName(currentHtml);
          rethtml += onTag(tagStart,
                           rethtml.length,
                           currentTagName,
                           currentHtml,
                           isClosing(currentHtml));
          lastPos = currentPos + 1;
          tagStart = false;
          continue;
        }
        if (c === '"' || c === "'") {
          quoteStart = c;
          continue;
        }
      } else {
        if (c === quoteStart) {
          quoteStart = false;
          continue;
        }
      }
    }
  }
  if (lastPos < html.length) {
    rethtml += escapeHtml(html.substr(lastPos));
  }

  return rethtml;
}

// 不符合属性名称规则的正则表达式
var REGEXP_ATTR_NAME = /[^a-zA-Z0-9_:\.\-]/img;

/**
 * 分析标签HTML代码，调用相应的函数处理，返回HTML
 *
 * @param {String} html 如标签'<a href="#" target="_blank">' 则为 'href="#" target="_blank"'
 * @param {Function} onAttr 处理属性值的函数
 *   函数格式： function (name, value)
 * @return {String}
 */
function parseAttr (html, onAttr) {
  'user strict';

  var lastPos = 0;        // 当前位置
  var retAttrs = [];      // 待返回的属性列表
  var tmpName = false;    // 临时属性名称
  var len = html.length;  // HTML代码长度

  function addAttr (name, value) {
    name =  name.trim();
    name = name.replace(REGEXP_ATTR_NAME, '').toLowerCase();
    if (name.length < 1) return;
    retAttrs.push(onAttr(name, value || ''));
  };

  // 逐个分析字符
  for (var i = 0; i < len; i++) {
    var c = html.charAt(i),v;
    if (tmpName === false && c === '=') {
      tmpName = html.slice(lastPos, i);
      lastPos = i + 1;
      continue;
    }
    if (tmpName !== false) {
      if (i === lastPos && (c === '"' || c === "'")) {
        var j = html.indexOf(c, i + 1);
        if (j === -1) {
          break;
        } else {
          v = html.slice(lastPos + 1, j).trim();
          addAttr(tmpName, v);
          tmpName = false;
          i = j;
          lastPos = i + 1;
          continue;
        }
      }
    }
    if (c === ' ') {
      v = html.slice(lastPos, i).trim();
      if (tmpName === false) {
        addAttr(v);
      } else {
        addAttr(tmpName, v);
      }
      tmpName = false;
      lastPos = i + 1;
      continue;
    }
  }

  if (lastPos < html.length) {
    if (tmpName === false) {
      addAttr(html.slice(lastPos));
    } else {
      addAttr(tmpName, html.slice(lastPos));
    }
  }

  return retAttrs.join(' ').trim();
}

exports.parseTag = parseTag;
exports.parseAttr = parseAttr;

},{}],4:[function(require,module,exports){
/**
 * 过滤XSS
 *
 * @author 老雷<leizongmin@gmail.com>
 */

var DEFAULT = require('./default');
var parser = require('./parser');
var parseTag = parser.parseTag;
var parseAttr = parser.parseAttr;


/**
 * 返回值是否为空
 *
 * @param {Object} obj
 * @return {Boolean}
 */
function isNull (obj) {
  return (obj === undefined || obj === null);
}

/**
 * 取标签内的属性列表字符串
 *
 * @param {String} html
 * @return {Object}
 *   - {String} html
 *   - {Boolean} closing
 */
function getAttrs (html) {
  var i = html.indexOf(' ');
  if (i === -1) {
    return {
      html:    '',
      closing: (html[html.length - 2] === '/')
    };
  }
  html = html.slice(i + 1, -1).trim();
  var isClosing = (html[html.length - 1] === '/');
  if (isClosing) html = html.slice(0, -1).trim();
  return {
    html:    html,
    closing: isClosing
  };
}

/**
 * XSS过滤对象
 *
 * @param {Object} options 选项：whiteList, onTag, onTagAttr, onIgnoreTag,
 *                               onIgnoreTagAttr, safeAttrValue, escapeHtml
 *                               stripIgnoreTagBody, allowCommentTag, stripBlankChar
 */
function FilterXSS (options) {
  options = options || {};

  if (options.stripIgnoreTag) {
    if (options.onIgnoreTag) {
      console.error('Notes: cannot use these two options "stripIgnoreTag" and "onIgnoreTag" at the same time');
    }
    options.onIgnoreTag = DEFAULT.onIgnoreTagStripAll;
  }

  options.whiteList = options.whiteList || DEFAULT.whiteList;
  options.onTag = options.onTag || DEFAULT.onTag;
  options.onTagAttr = options.onTagAttr || DEFAULT.onTagAttr;
  options.onIgnoreTag = options.onIgnoreTag || DEFAULT.onIgnoreTag;
  options.onIgnoreTagAttr = options.onIgnoreTagAttr || DEFAULT.onIgnoreTagAttr;
  options.safeAttrValue = options.safeAttrValue || DEFAULT.safeAttrValue;
  options.escapeHtml = options.escapeHtml || DEFAULT.escapeHtml;
  this.options = options;
}

/**
 * 开始处理
 *
 * @param {String} html
 * @return {String}
 */
FilterXSS.prototype.process = function (html) {
  // 兼容各种奇葩输入
  html = html || '';
  html = html.toString();
  if (!html) return '';

  var me = this;
  var options = me.options;
  var whiteList = options.whiteList;
  var onTag = options.onTag;
  var onIgnoreTag = options.onIgnoreTag;
  var onTagAttr = options.onTagAttr;
  var onIgnoreTagAttr = options.onIgnoreTagAttr;
  var safeAttrValue = options.safeAttrValue;
  var escapeHtml = options.escapeHtml

  // 是否清除不可见字符
  if (options.stripBlankChar) {
    html = DEFAULT.stripBlankChar(html);
  }

  // 是否禁止备注标签
  if (!options.allowCommentTag) {
    html = DEFAULT.stripCommentTag(html);
  }

  // 如果开启了stripIgnoreTagBody
  if (options.stripIgnoreTagBody) {
    var stripIgnoreTagBody = DEFAULT.StripTagBody(options.stripIgnoreTagBody, onIgnoreTag);
    onIgnoreTag = stripIgnoreTagBody.onIgnoreTag;
  } else {
    stripIgnoreTagBody = false;
  }

  var retHtml = parseTag(html, function (sourcePosition, position, tag, html, isClosing) {
    var info = {
      sourcePosition: sourcePosition,
      position:       position,
      isClosing:      isClosing,
      isWhite:        (tag in whiteList)
    };

    // 调用onTag处理
    var ret = onTag(tag, html, info);
    if (!isNull(ret)) return ret;

    // 默认标签处理方法
    if (info.isWhite) {
      // 白名单标签，解析标签属性
      // 如果是闭合标签，则不需要解析属性
      if (info.isClosing) {
        return '</' + tag + '>';
      }

      var attrs = getAttrs(html);
      var whiteAttrList = whiteList[tag];
      var attrsHtml = parseAttr(attrs.html, function (name, value) {

        // 调用onTagAttr处理
        var isWhiteAttr = (whiteAttrList.indexOf(name) !== -1);
        var ret = onTagAttr(tag, name, value, isWhiteAttr);
        if (!isNull(ret)) return ret;

        // 默认的属性处理方法
        if (isWhiteAttr) {
          // 白名单属性，调用safeAttrValue过滤属性值
          value = safeAttrValue(tag, name, value);
          if (value) {
            return name + '="' + value + '"';
          } else {
            return name;
          }
        } else {
          // 非白名单属性，调用onIgnoreTagAttr处理
          var ret = onIgnoreTagAttr(tag, name, value, isWhiteAttr);
          if (!isNull(ret)) return ret;
          return;
        }
      });

      // 构造新的标签代码
      var html = '<' + tag;
      if (attrsHtml) html += ' ' + attrsHtml;
      if (attrs.closing) html += ' /';
      html += '>';
      return html;

    } else {
      // 非白名单标签，调用onIgnoreTag处理
      var ret = onIgnoreTag(tag, html, info);
      if (!isNull(ret)) return ret;
      return escapeHtml(html);
    }

  }, escapeHtml);

  // 如果开启了stripIgnoreTagBody，需要对结果再进行处理
  if (stripIgnoreTagBody) {
    retHtml = stripIgnoreTagBody.remove(retHtml);
  }

  return retHtml;
};


module.exports = FilterXSS;
},{"./default":1,"./parser":3}]},{},[2]);
