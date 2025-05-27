import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../service/http.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { HeaderComponent } from "../../boxNav/header/header.component";
import { SideBarComponent } from "../../boxNav/side-bar/side-bar.component";

@Component({
  selector: 'app-set-evaluator',
  templateUrl: './set-evaluator.component.html',
  styleUrl: './set-evaluator.component.css',
  imports: [
    NgFor,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    SideBarComponent
],
})
export class SetEvaluatorComponent implements OnInit {
  // ตัวแปร
  user:any
  php:any = 'dev/setEvaluator'
  table:any = 'news_evaluator'
  data:any
  evaPerson:any
  readyPerson:any
  formFetch:any
  formSet:any
  formDel:any
  // ฟอร์ม
  Form(){
    this.formFetch = this.fb.group({
      header:[''],
      table:[''],
      no:[''],
    })
    this.formSet = this.fb.group({
      header:[''],
      table:[''],
      no:[''],
      noPaper:[''],
      email:[''],
      name:[''],
      date:['']
    })
    this.formDel = this.fb.group({
      header:[''],
      table:[''],
      no:[''],
    })
  }
  // เรียกใช้
  constructor(
    private api:HttpService,
    private fb:FormBuilder,
  ){}
  // ฟังก์ชัน
  ngOnInit(): void {
    try {
      sessionStorage.getItem('no')
    } catch (error) {
      document.location.href = '/home'
    }
    this.user = JSON.parse(sessionStorage.getItem('user') + '')
    this.Form()
    this.Fetch()
    this.FetchEvaPerson()
    this.FetchReadyPerson()
  }
  Fetch() {
    this.formFetch.get('header').setValue('fetch')
    this.formFetch.get('table').setValue('paper')
    this.formFetch.get('no').setValue(sessionStorage.getItem('no'))
    console.log(this.formFetch.value)
    this.api.POST(this.php,this.formFetch.value).subscribe({
      next:(result:any)=>{
        console.log(result)
        if (result) {
          this.data = result
        }
      }
    })
  }
  FetchEvaPerson() {
    this.formFetch.get('header').setValue('fetchEvaPersonList')
    this.api.POST(this.php,this.formFetch.value).subscribe({
      next:(result:any)=>{
        this.evaPerson = result
      }
    })
  }
  FetchReadyPerson() {
    this.formFetch.get('header').setValue('fetchReadyPersonList')
    this.formFetch.get('table').setValue(this.table)
    console.log('ready')
    this.api.POST(this.php,this.formFetch.value).subscribe({
      next:(result:any)=>{
        console.log('ready')
        console.log(result)
        this.readyPerson = result
      }
    })
  }
  Set() {
      this.formSet.get('noPaper').setValue(sessionStorage.getItem('no'))
      this.formSet.get('date').setValue(this.api.YYYY() + '-' + this.api.MM() + '-' + this.api.DD())
      console.log(this.formSet.value)
      this.api.POST(this.php,this.formSet.value).subscribe({
        next:(result:any)=>{
          if (result) {
            switch (result) {
              case 'success':
                this.Fetch()
                this.ClosePopup()
                this.FetchReadyPerson()
                Swal.fire({
                  title: "ดำเนินการสำเร็จ",
                  icon: "success",
                  showConfirmButton: false,
                  timer: 1500,
                });
                break;
              case 'same':
                Swal.fire({
                  title: "ผู้ประเมินรายนี้ถูกเลือกแล้ว",
                  icon: "error",
                  showConfirmButton: false,
                  timer: 1500,
                });
              break;
            }
          }
        }
      })
    }
  OpenPopup() {
      let evaluatorBox = document.getElementById('evaluatorBox')as HTMLElement
      evaluatorBox.style.display = 'none'
      this.formSet.get('header').setValue('add')
      this.formSet.get('table').setValue(this.table)
      this.formSet.get('no').setValue(this.api.LongTime())
      let popup = document.getElementById('popup')as HTMLElement
      popup.style.display = 'flex'
      let formTitle = document.getElementById('formTitle')as HTMLElement
      formTitle.innerText = 'เพิ่มผู้ประเมิน'
    }
    EditOpoup(
      no:any,
      title:any,
      types:any,
      dateS:any,
      dateE:any,
      status:any,
      text:any
    ) {
      let evaluatorBox = document.getElementById('evaluatorBox')as HTMLElement
      evaluatorBox.style.display = 'flex'
      this.formSet.get('header').setValue('set')
      this.formSet.get('table').setValue(this.table)
      this.formSet.get('no').setValue(no)
      this.formSet.get('title').setValue(title)
      this.formSet.get('types').setValue(types)
      this.formSet.get('dateS').setValue(dateS)
      this.formSet.get('dateE').setValue(dateE)
      this.formSet.get('status').setValue(status)
      this.formSet.get('text').setValue(text)
      let popup = document.getElementById('popup')as HTMLElement
      popup.style.display = 'flex'
      let formTitle = document.getElementById('formTitle')as HTMLElement
      formTitle.innerText = 'จัดการผู้ประเมิน'
    }
    ClosePopup() {
      let popup = document.getElementById('popup')as HTMLElement
      popup.style.display = 'none'
    }
    Del(no:any) {
      Swal.fire({
        title: "ลบรายการนี้หรือไม่?",
        showCancelButton: true,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก"
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
                    this.FetchReadyPerson()
                    Swal.fire({
                      title: "ดำเนินการสำเร็จ",
                      icon: "success",
                      showConfirmButton: false,
                      timer: 1500,
                    });
                    break;
                }
              }
            }
          })
        }
      });
    }
    NameDate(date:any) {
      let yyyy = date.substring(0,4)
      let mm = date.substring(5,7)
      let dd = date.substring(8,10)
      console.log(yyyy)
      console.log(mm)
      console.log(dd)
      return dd + ' ' + this.api.MonthName(mm) + ' ' + yyyy
    }
}
