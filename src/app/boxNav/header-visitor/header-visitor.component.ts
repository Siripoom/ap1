import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpService } from '../../service/http.service';

@Component({
  selector: 'app-header-visitor',
  templateUrl: './header-visitor.component.html',
  styleUrl: './header-visitor.component.css',
  imports: [
    RouterLink,
  ],
})
export class HeaderVisitorComponent implements OnInit {
  // ตัวแปร
  year:any
  // ฟอร์ม

  // เรียกใช้
  constructor(
    private api:HttpService
  ){}
  // ฟังก์ชัน
  ngOnInit(): void {
    this.year = this.api.YYYY()
    let pathName = (window.location.pathname).substring(1,(window.location.pathname).length)
    let home = document.getElementById('barHome')as HTMLElement
    switch (pathName) {
      case 'home-visitor':
        home = document.getElementById('barHome')as HTMLElement
        break;
      case 'callForPaper-visitor':
        home = document.getElementById('barCallForPaper')as HTMLElement
        break;
      case 'contact-visitor':
        home = document.getElementById('barContact')as HTMLElement
        break;
    }
    
    home.style.position = "absolute"
    home.style.top = "0px"
    home.style.left = "0px"
    home.style.display = "flex"
    home.style.width = "100%"
    home.style.height = "8px"
    home.style.background = "#ff9000"
  }
}
