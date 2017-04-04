/*
    所有菜单的汇总
*/

// 存储菜单的构造函数
const MenuConstructors = {}

import Bold from './bold.js'
MenuConstructors.bold = Bold

import Head from './head.js'
MenuConstructors.head = Head

import Link from './link.js'
MenuConstructors.link = Link

// 吐出所有菜单集合
export default MenuConstructors