import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../boxNav/header/header.component";
import { SideBarComponent } from "../../boxNav/side-bar/side-bar.component";
import { NgFor } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { HttpService } from '../../service/http.service';

@Component({
  selector: 'app-sended',
  templateUrl: './sended.component.html',
  styleUrl: './sended.component.css',
  imports: [
    HeaderComponent,
    SideBarComponent,
    NgFor
  ],
})
export class SendedComponent implements OnInit {
  // ตัวแปร
  php:any = 'evaluator/sended'
  table:any = 'paper'
  user:any
  dataEvaluator:any
  data:any = []
  dataView:any
  length:number = 0
  types:any
  formFetch:any
  formFetchEvaluator:any
  formReWrite:any
  paper:any = []
  // ฟอร์ม
  Form() {
    this.formFetch = this.fb.group({
      header:[''],
      table:[''],
      start:[''],
      stop:[''],
      page:[''],
      types:[''],
      noNews:[''],
    })
    this.formFetchEvaluator = this.fb.group({
      header:[''],
      table:[''],
      email:['']
    })
    this.formReWrite = this.fb.group({
      header:[''],
      table:[''],
      no:['']
    })
  }
  // เรียก
  constructor(
      private fb:FormBuilder,
      private api:HttpService
    ){}
  // ฟังก์ชัน
  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user')+'')
    this.Form()
    this.FetchTypes()
    // this.Fetch(0,19)
    this.FetchEvaluator(0,19)
  }
  FetchEvaluator(start:number,stop:number) {
    const user = JSON.parse(sessionStorage.getItem('user')+'')
    this.formFetchEvaluator.get('header').setValue('fetchEvaluator')
    this.formFetchEvaluator.get('table').setValue(this.table)
    this.formFetchEvaluator.get('email').setValue(user.email)
    console.log(this.formFetchEvaluator.value)
    this.api.POST(this.php,this.formFetchEvaluator.value).subscribe({
      next:(result:any)=>{
        console.log(result)
        // if (result) {
        //   console.log(result)
        //   for (let index = 0; index < result.length; index++) {
        //     this.Fetch(start,stop,result[index].noNews)
        //   }
        // }
        if (result) {
          if (result.length > 0) {
            this.data = this.data.concat(result)
            this.dataView = this.data
            console.log('this.dataView')
            console.log(this.dataView)
            for (let index = 0; index < result.length; index++) {
              this.ReWrite(result[index].noPaper,index)
            }
        } else {
          this.data = []
          this.dataView = []
        }
      }
      }
    })
  }
  Fetch(start:number,stop:number,noNews:any) {
    const user = JSON.parse(sessionStorage.getItem('user')+'')
    this.formFetch.get('header').setValue('fetch')
    this.formFetch.get('table').setValue(this.table)
    this.formFetch.get('start').setValue(start)
    this.formFetch.get('stop').setValue(stop)
    this.formFetch.get('noNews').setValue(noNews)
    this.api.POST(this.php,this.formFetch.value).subscribe({
      next:(result:any)=>{
        if (result) {
            if (result.length > 0) {
              this.data = this.data.concat(result)
              this.dataView = this.data
              console.log('this.dataView')
              console.log(this.dataView)
          } else {
            this.data = []
            this.dataView = []
          }
        }
      }
    })
  }
  FetchTypes() {
    const user = JSON.parse(sessionStorage.getItem('user')+'')
    this.formFetch.get('header').setValue('types')
    this.formFetch.get('table').setValue('academictypes')
    this.api.POST(this.php,this.formFetch.value).subscribe({
      next:(result:any)=>{
        if (result) {
          this.types = result
        }
      }
    })
  }
  Search() {
    this.dataView = []
    let i = 0
    let search = document.getElementById('search')as HTMLInputElement
    if (search.value.length > 0) {
      let value = search.value.toLowerCase()
      for (let index = 0; index < this.data.length; index++) {
        let inData = this.data[index].titleNews.toLowerCase()
        if (inData.includes(value)) {
          this.dataView[i] = this.data[index]
          i++
        }
      }
    } else {
      this.dataView = this.data
    }
  }
  Grade(no:any,title:any) {
    sessionStorage.setItem('no',no)
    sessionStorage.setItem('title',title)
    document.location.href = '/paper'
  }
  ReWrite(no:any,index:number) {
    this.formReWrite.get('header').setValue('reWrite')
    this.formReWrite.get('table').setValue('paper')
    this.formReWrite.get('no').setValue(no)
    let data
    console.log(this.formReWrite.value)
    this.api.POST(this.php,this.formReWrite.value).subscribe({
      next:(result:any)=>{
        this.paper[index] = result
        console.log('index :' + index)
        console.log(result)
      }
    })
  }
}
