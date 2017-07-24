import { Component,ViewChild } from '@angular/core'
import { EditorComponent } from './editor'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  @ViewChild(EditorComponent) editor: EditorComponent;

  constructor() {}

  publishTopic() {
    let topicContent = this.editor.clickHandle()

    if(!topicContent){
        alert('请输入内容！')
        return
    }
    alert(topicContent)
  }

  PostData(event):void {
    console.log(event) 
  }
}
