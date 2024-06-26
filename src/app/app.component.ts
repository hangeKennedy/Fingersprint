import { Component, OnInit } from '@angular/core';
import { WebSocketService } from './service/web-socket.service';
import { User } from './user';
import { FingerTrama } from './finger-trama';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit{
  title = 'fingersprint_Virdi';
  //ImageData
  user?: User;
  imageBase64?:string;

  //Fingedata
  fingerTrama?: FingerTrama; 
  data?:string;

  public messages: User[] = [];

  constructor(
    private webSocketService: WebSocketService
    ) { }

  ngOnInit(): void {
    this.webSocketService.connect().subscribe(
      (message) => {
        this.user = JSON.parse(message);
        this.fingerTrama = this.user;
        
        if(this.user != undefined && this.user.msgId == 2001){
          var xx = JSON.parse(this.user?.body)

          this.imageBase64 = xx.imageData;


          console.log("Conecto : "+ JSON.stringify(this.user) );


        } else if(this.fingerTrama != undefined && this.fingerTrama.msgId == 2002){
          var yy = JSON.parse(this.fingerTrama?.body)

          this.data = yy.FingerData;

          console.log("Conecto : "+ JSON.stringify(this.fingerTrama) );
        }
        else{
          //console.log("Conecto : "+ message );
        }

        
      },
      (error) => {
        console.error(error);
      }
    );
  }

  //API
  //POST
  postHuella(){
      this.webSocketService.postHuella(this.imageBase64).subscribe((res) =>{
        console.log(res + " completo");
      })

  }

  //Web socket
  //fingerindes numero de dedo
  sendMessage(numDedo: string): void {
    this.webSocketService.sendMessage(`{"msgId":"2000","body":{"UserId":"","ImageType":"JPG","BrandType":"VIRDI","FingerIndex":${numDedo},"TemplateFormat":3}}`);
  }
}
