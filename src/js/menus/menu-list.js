/*
    所有菜单的汇总
*/

// 存储菜单的构造函数
const MenuConstructors = {}

import Bold from './bold/index.js'
MenuConstructors.bold = Bold

import Head from './head/index.js'
MenuConstructors.head = Head

import Link from './link/index.js'
MenuConstructors.link = Link

import Italic from './italic/index.js'
MenuConstructors.italic = Italic

import Redo from './redo/index.js'
MenuConstructors.redo = Redo

import StrikeThrough from './strikethrough/index.js'
MenuConstructors.strikeThrough = StrikeThrough

import Underline from './underline/index.js'
MenuConstructors.underline = Underline

import Undo from './undo/index.js'
MenuConstructors.undo = Undo

// 吐出所有菜单集合
export default MenuConstructors