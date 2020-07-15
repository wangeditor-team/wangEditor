/**
 * @description 所有菜单的构造函数
 * @author wangfupeng
 */

import Bold from './bold/index'
import Head from './head/index'
import Link from './link/index'
import Italic from './italic/index'
import Underline from './underline/index'
import StrikeThrough from './strike-through/index'
import FontStyle from './font-style/index'
import FontSize from './font-size'
import Justify from './justify/index'
import Quote from './quote/index'
import BackColor from './back-color/index'
import FontColor from './font-color/index'
import Video from './video/index'
import Image from './img/index'

export default {
    bold: Bold,
    head: Head,
    italic: Italic,
    link: Link,
    underline: Underline,
    strikeThrough: StrikeThrough,
    fontStyle: FontStyle,
    fontSize: FontSize,
    justify: Justify,
    quote: Quote,
    backColor: BackColor,
    fontColor: FontColor,
    video: Video,
    image: Image,
}
