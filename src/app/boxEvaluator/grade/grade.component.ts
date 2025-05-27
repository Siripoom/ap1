import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../boxNav/header/header.component";
import { SideBarComponent } from "../../boxNav/side-bar/side-bar.component";
import { NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { HttpService } from '../../service/http.service';

@Component({
  selector: 'app-grade',
  templateUrl: './grade.component.html',
  styleUrl: './grade.component.css',
  imports: [
    HeaderComponent,
    SideBarComponent,
    NgFor,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
],
})
export class GradeComponent implements OnInit {
  // ตัวแปร
  php:any = 'user/paper'
  table:any = 'paper'
  user:any
  data:any
  log:any
  evaluator:any
  length:number = 0
  formFetch:any
  formLog:any
  formRegister:any
  formEvaluator:any
  formDel:any
  // ฟอร์ม
  Form() {
    this.formFetch = this.fb.group({
      header:[''],
      table:[''],
      no:['']
    })
    this.formRegister = this.fb.group({
      header:[''],
      table:[''],
      no:[''],
      noNews:[''],
      titleNews:[''],
      typesNews:[''],
      dateSNews:[''],
      dateENews:[''],
      textNews:[''],
      email:[''],
      name:[''],
      role:[''],
      fields:[''],
      faculty:[''],
      university:[''],
      date:[''],
      file:['',Validators.required],
    })
    this.formLog = this.fb.group({
      header:[''],
      table:[''],
      paperNo:['']
    })
    this.formEvaluator = this.fb.group({
      header:[''],
      table:[''],
      paperNo:['']
    })
    this.formDel = this.fb.group({
      header:[''],
      table:[''],
      no:[''],
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
    try {
      const no = sessionStorage.getItem('no')
      this.Fetch()
      this.LogPaper()
    } catch (error) {
      document.location.href = '/home'
    }
    
  }
  Fetch() {
    const user = JSON.parse(sessionStorage.getItem('user')+'')
    this.formFetch.get('header').setValue('fetch')
    this.formFetch.get('table').setValue(this.table)
    this.formFetch.get('no').setValue(sessionStorage.getItem('no'))
    this.api.POST(this.php,this.formFetch.value).subscribe({
      next:(result:any)=>{
        console.log(result)
        if (result) {
          this.data = result
        }
      }
    })
  }
  LogPaper() {
    const user = JSON.parse(sessionStorage.getItem('user')+'')
    this.formLog.get('header').setValue('log')
    this.formLog.get('table').setValue(this.table)
    this.formLog.get('paperNo').setValue(sessionStorage.getItem('no'))
    this.api.POST(this.php,this.formLog.value).subscribe({
      next:(result:any)=>{
        console.log(result)
        if (result) {
          this.log = result
        }
      }
    })
  }
  OpenPopup(no:any) {
    let popup = document.getElementById('popup')as HTMLElement
    popup.style.display = 'flex'
    this.formEvaluator.get('header').setValue('evaluator')
    this.formEvaluator.get('table').setValue(this.table)
    this.formEvaluator.get('paperNo').setValue(no)
    this.api.POST(this.php,this.formEvaluator.value).subscribe({
      next:(result:any)=>{
        console.log(result)
        if (result) {
          if (result.length > 0) {
            this.evaluator = result
          } else {
            this.evaluator = []
          }
        } else {
          this.evaluator = []
        }
      }
    })
  }
  OpenFile(no:any) {
    window.open(no, '_blank')
  }
  ClosePopup() {
    let popup = document.getElementById('popup')as HTMLElement
    popup.style.display = 'none'
  }
  Register() {
    this.formRegister.get('header').setValue('register')
    this.formRegister.get('table').setValue(this.table)
    this.formRegister.get('no').setValue(this.api.LongTime())
    this.formRegister.get('noNews').setValue(this.data[0].no)
    this.formRegister.get('titleNews').setValue(this.data[0].title)
    this.formRegister.get('typesNews').setValue(this.data[0].types)
    this.formRegister.get('dateSNews').setValue(this.data[0].dateS)
    this.formRegister.get('dateENews').setValue(this.data[0].dateE)
    this.formRegister.get('textNews').setValue(this.data[0].text)
    this.formRegister.get('email').setValue(this.user.email)
    this.formRegister.get('name').setValue(this.user.title+this.user.fname+' '+this.user.lname)
    this.formRegister.get('role').setValue(this.user.role)
    this.formRegister.get('fields').setValue(this.user.fields)
    this.formRegister.get('faculty').setValue(this.user.faculty)
    this.formRegister.get('university').setValue(this.user.university)
    this.formRegister.get('date').setValue(this.api.YYYY()+'-'+this.api.MM()+'-'+this.api.DD())
    console.log(this.formRegister.value)
    this.api.POST(this.php,this.formRegister.value).subscribe({
      next:(result:any)=>{
        console.log(result)
        if (result) {
          switch (result) {
            case 'success':
              this.Fetch()
              this.ClosePopup()
              Swal.fire({
                title: "ดำเนินการสำเร็จ",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
              });
              let loop = setTimeout(() => {
                clearTimeout(loop)
                document.location.href = '/myPaper'
              }, 1500);
              break;
          }
        }
      }
    })
  }
  NameDate(date:any) {
    let yyyy = date.substring(0,4)
    let mm = date.substring(5,7)
    let dd = date.substring(8,10)
    return dd + ' ' + this.api.MonthName(mm) + ' ' + yyyy
  }
  Del(no:any) {
      Swal.fire({
        title: "ลบข้อมูลนี้หรือไม่?",
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
        showCancelButton:true,
        icon: "info",
      }).then((result) => {
        if (result.isConfirmed) {
          this.formDel.get('header').setValue('del')
          this.formDel.get('table').setValue(this.table)
          this.formDel.get('no').setValue(no)
          this.api.POST(this.php,this.formDel.value).subscribe({
            next:(result:any)=>{
              if (result) {
                switch (result) {
                  case 'success':
                      this.Fetch()
                      this.LogPaper()
                    Swal.fire({
                      title: "ดำเนินการสำเร็จ",
                      icon: "success",
                      showConfirmButton: false,
                      timer: 1500
                    });
                    break;
                }
              }
            }
          })
        }
      });
    }
}
