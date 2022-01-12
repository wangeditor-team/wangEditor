/**
 * @description header entry
 * @author wangfupeng
 */

import { IModuleConf } from '@wangeditor/core'
import {
  renderHeader1Conf,
  renderHeader2Conf,
  renderHeader3Conf,
  renderHeader4Conf,
  renderHeader5Conf,
} from './render-elem'
import {
  HeaderSelectMenuConf,
  Header1ButtonMenuConf,
  Header2ButtonMenuConf,
  Header3ButtonMenuConf,
  Header4ButtonMenuConf,
  Header5ButtonMenuConf,
} from './menu/index'
import {
  header1ToHtmlConf,
  header2ToHtmlConf,
  header3ToHtmlConf,
  header4ToHtmlConf,
  header5ToHtmlConf,
} from './elem-to-html'
import {
  parseHeader1HtmlConf,
  parseHeader2HtmlConf,
  parseHeader3HtmlConf,
  parseHeader4HtmlConf,
  parseHeader5HtmlConf,
} from './parse-elem-html'
import withHeader from './plugin'

const header: Partial<IModuleConf> = {
  renderElems: [
    renderHeader1Conf,
    renderHeader2Conf,
    renderHeader3Conf,
    renderHeader4Conf,
    renderHeader5Conf,
  ],
  elemsToHtml: [
    header1ToHtmlConf,
    header2ToHtmlConf,
    header3ToHtmlConf,
    header4ToHtmlConf,
    header5ToHtmlConf,
  ],
  parseElemsHtml: [
    parseHeader1HtmlConf,
    parseHeader2HtmlConf,
    parseHeader3HtmlConf,
    parseHeader4HtmlConf,
    parseHeader5HtmlConf,
  ],
  menus: [
    HeaderSelectMenuConf,
    Header1ButtonMenuConf,
    Header2ButtonMenuConf,
    Header3ButtonMenuConf,
    Header4ButtonMenuConf,
    Header5ButtonMenuConf,
  ],
  editorPlugin: withHeader,
}

export default header
