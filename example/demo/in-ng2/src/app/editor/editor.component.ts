import {Component, ElementRef, Renderer, Output, EventEmitter } from '@angular/core'
import * as wangEditor from '../../../node_modules/wangeditor/release/wangEditor.js'


@Component({
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent {

  private editor:any
  @Output() onPostData = new EventEmitter()

  constructor(private el: ElementRef,private renderer: Renderer) { }

  ngAfterViewInit() {  
    let editordom = this.el.nativeElement.querySelector('#editorElem')
    this.editor = new wangEditor(editordom)
    this.editor.customConfig.uploadImgShowBase64 = true
    this.editor.create()
  }

  clickHandle():any {
    let data = this.editor.txt.text()
    return data
  }


}
