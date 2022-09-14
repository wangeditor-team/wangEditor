/**
 * @description menu config
 * @author wangfupeng
 */

export function genCodeLangs() {
  // 1. text value 对应关系参考 prism 官网 https://prismjs.com/#supported-languages
  // 2. 要加入一个新语言时，要引入相应的 js 模块（代码在 `vender/prism.ts`），例如 `import 'prismjs/components/prism-php'`

  return [
    { text: 'CSS', value: 'css' },
    { text: 'HTML', value: 'html' },
    { text: 'XML', value: 'xml' },
    { text: 'Javascript', value: 'javascript' },
    { text: 'Typescript', value: 'typescript' },
    { text: 'JSX', value: 'jsx' },
    { text: 'Go', value: 'go' },
    { text: 'PHP', value: 'php' },
    { text: 'C', value: 'c' },
    { text: 'Python', value: 'python' },
    { text: 'Java', value: 'java' },
    { text: 'C++', value: 'cpp' },
    { text: 'C#', value: 'csharp' },
    { text: 'Visual Basic', value: 'visual-basic' },
    { text: 'SQL', value: 'sql' },
    { text: 'Ruby', value: 'ruby' },
    { text: 'Swift', value: 'swift' },
    { text: 'Bash', value: 'bash' },
    { text: 'Lua', value: 'lua' },
    { text: 'Groovy', value: 'groovy' },
    { text: 'Markdown', value: 'markdown' },
  ]
}
