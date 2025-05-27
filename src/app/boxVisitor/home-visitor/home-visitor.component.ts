import { Component, OnInit } from '@angular/core';
import { HeaderVisitorComponent } from "../../boxNav/header-visitor/header-visitor.component";
import { RouterLink } from '@angular/router';
import { CFP } from "../cfp-noheader/call-for-paper.component";
import { HttpService } from '../../service/http.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-home-visitor',
  templateUrl: './home-visitor.component.html',
  styleUrl: './home-visitor.component.css',
  imports: [
    RouterLink,
    CFP,
    HeaderVisitorComponent,
    FormsModule,
    ReactiveFormsModule,
    NgFor,
],
})
export class HomeVisitorComponent implements OnInit {
  // ตัวแปร
  php:any = 'visitor/homeVisitor'
  table:any = 'welcome_note'
  note:any
  base64:any
  formFetchNote:any
  // ฟอร์ม
  Form() {
    this.formFetchNote = this.fb.group({
      header:[''],
      table:['']
    })
  }
  // เรียกใช้
  constructor(
    private api:HttpService,
    private fb:FormBuilder
  ){}
  // ฟังก์ชัน
  ngOnInit(): void {
    if (sessionStorage.getItem('user')) {
      document.location.href = '/home'
    }
    this.Form()
    this.FetchNote()
  }
  FetchNote() {
    this.formFetchNote.get('header').setValue('fetchNote')
    this.formFetchNote.get('table').setValue(this.table)
    console.log(this.formFetchNote.value)
    this.api.POST(this.php,this.formFetchNote.value).subscribe({
      next:(result:any)=>{
        console.log(result)
        if (result) {
          this.note = result
        }
      }
    })
  }
  ViewPDF(base64:any){
    let iframe = document.getElementById('iframe')as HTMLIFrameElement
    iframe.src = base64
  }
}
