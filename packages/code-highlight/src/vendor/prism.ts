/**
 * @description prismjs
 * @author wangfupeng
 */

import { Text } from 'slate'

import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-visual-basic'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-ruby'
import 'prismjs/components/prism-swift'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-lua'
import 'prismjs/components/prism-groovy'
// 语言模块，参考 https://github.com/PrismJS/prism/tree/master/components

// prismjs 的 token 类型汇总
export const prismTokenTypes = [
  'comment',
  'prolog',
  'doctype',
  'cdata',
  'punctuation',
  'namespace',
  'property',
  'tag',
  'boolean',
  'number',
  'constant',
  'symbol',
  'deleted',
  'selector',
  'attr-name',
  'string',
  'builtin',
  'inserted',
  'operator',
  'entity',
  'url',
  'string',
  'atrule',
  'attr-value',
  'keyword',
  'function',
  'class-name',
  'regex',
  'important',
  'variable',
  'bold',
  'italic',
  'entity',
  'char',
]

/**
 * 获取 prism token 的字符串长度
 * @param token prism token
 */
export function getPrismTokenLength(token: any) {
  if (typeof token === 'string') {
    return token.length
  } else if (typeof token.content === 'string') {
    return token.content.length
  } else {
    // 累加 length
    return token.content.reduce(
      // @ts-ignore
      (l, t) => l + getPrismTokenLength(t),
      0
    )
  }
}

/**
 * 获取 prism 解析的 token 列表
 * @param textNode text node
 * @param language 代码语言
 */
export function getPrismTokens(textNode: Text, language: string) {
  if (!language) return []

  const langGrammar = Prism.languages[language]
  if (!langGrammar) return []

  return Prism.tokenize(textNode.text, langGrammar)

  // tokens 即 Prism 对整个字符串的拆分，有普通文字也有高亮的关键字
  // 例如 `const a = 100;` 的 tokens 是一个数组 [ token, ' a ', token, ' ', token ] ，有对象有字符串，对象就表示关键字
  // 如数组第一个 token 是 { type: "keyword", content: "const" } 。关键字类型不同 type 也不同
}
