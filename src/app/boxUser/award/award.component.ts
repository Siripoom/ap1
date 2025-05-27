import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { HeaderComponent } from '../../boxNav/header/header.component';
import { SideBarComponent } from '../../boxNav/side-bar/side-bar.component';
import { HttpService } from '../../service/http.service';

@Component({
  selector: 'app-award',
  templateUrl: './award.component.html',
  styleUrl: './award.component.css',
  imports: [
    HeaderComponent,
    SideBarComponent,
    NgFor,
    FormsModule,
    ReactiveFormsModule,
    NgIf
],
})
export class AwardComponent implements OnInit {
  // ตัวแปร
  php:any = 'user/award'
  table:any = 'news'
  user:any
  types:any
  data:any
  top:any = []
  evaluator:any
  length:number = 0
  page:number = 1
  pageLength:number = 20
  maxPage:any = 1
  formFetch:any
  formTop:any
  formLength:any
  // ฟอร์ม
  Form() {
    this.formLength = this.fb.group({
      header:[''],
      table:[''],
      types:[''],
    })
    this.formFetch = this.fb.group({
      header:[''],
      table:[''],
      start:[''],
      stop:[''],
      page:[''],
      types:[''],
    })
    this.formTop = this.fb.group({
      header:[''],
      table:[''],
      noNews:['']
    })
  }
  // เรียกใช้
  constructor(
    private fb:FormBuilder,
    private api:HttpService
  ){}
  // ฟังก์ชัน
  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user')+'')
    this.Form()
    this.FetchTypes()
    this.Length()
    
  }
  Length() {
    this.formLength.get('header').setValue('length')
    this.formLength.get('table').setValue(this.table)
    // let selectTypes = document.getElementById('selectTypes')as HTMLInputElement
    this.formLength.get('types').setValue('')
    this.api.POST(this.php,this.formLength.value).subscribe({
      next:(result:any)=>{
        console.log(result)
        if (result > 0) {
          this.length = result
          if (20 % this.pageLength > 0) {
            this.maxPage = parseInt(((this.length / this.pageLength) + 1) + '')
          } else {
            this.maxPage = parseInt((this.length / this.pageLength) + '')
          }
          this.Fetch(0,20)
        } else {
          this.length = 0
        }
      }
    })
  }
  Fetch(start:number,stop:number) {
    const user = JSON.parse(sessionStorage.getItem('user')+'')
    this.formFetch.get('header').setValue('fetch')
    this.formFetch.get('table').setValue(this.table)
    this.formFetch.get('start').setValue(start)
    this.formFetch.get('stop').setValue(stop)
    // let selectTypes = document.getElementById('selectTypes')as HTMLInputElement
    this.formFetch.get('types').setValue('')
    this.api.POST(this.php,this.formFetch.value).subscribe({
      next:(result:any)=>{
        if (result) {
          if (result.length > 0) {
            this.data = result
            for (let index = 0; index < result.length; index++) {
              this.Top(result[index].no,index)
            }
          } else {
            this.data = []
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
  Top(noNews:any,location:number) {
    this.formTop.get('header').setValue('top')
    this.formTop.get('table').setValue(this.table)
    this.formTop.get('noNews').setValue(noNews)
    this.api.POST(this.php,this.formTop.value).subscribe({
      next:(result:any)=>{
        if (result) {
          this.top[location] = result
        } else {
          this.top[location] = []
        }
      }
    })
  }
  OpenFile(no:any) {
    window.open(no, '_blank')
  }
  NameDate(date:any) {
    let yyyy = date.substring(0,4)
    let mm = date.substring(5,7)
    let dd = date.substring(8,10)
    return dd + ' ' + this.api.MonthName(mm) + ' ' + yyyy
  }
  Minus() {
    this.page -= 1
    if (this.page < 1) {
      if (this.maxPage == 0) {
        this.page = 1
      } else {
        this.page = this.maxPage
      }
    }
    if (this.page == 1) {
      this.Fetch(0,20)
    } else {
      this.Fetch(this.page * 20,(this.page * 20) + 20)
    }
  }
  Plus() {
    this.page +=1
    if (this.page >= this.maxPage) {
      this.page = 1
    }
    if (this.page == 1) {
      this.Fetch(0,20)
    } else {
      this.Fetch(this.page * 20,(this.page * 20) + 20)
    }
  }
  Certificate(no:any,language:any) {
    sessionStorage.setItem('certificate',no)
    Swal.fire({
      title: "กำลังดำเนินการ",
      icon: "info",
      showConfirmButton: false,
      timer: 1500,
    });
    let loop = setTimeout(() => {
      clearTimeout(loop)
      document.location.href = '/certificate'
    }, 1500);
  }
}
