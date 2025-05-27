import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../boxNav/header/header.component";
import { SideBarComponent } from "../../boxNav/side-bar/side-bar.component";
import { NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../../service/http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [
    HeaderComponent,
    SideBarComponent,
    NgFor,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
],
})
export class HomeComponent implements OnInit {
  // ตัวแปร
  php:any = 'user/home'
  table:any = 'news'
  user:any
  types:any
  data:any
  evaluator:any
  listEvaluator:any
  personEvaluator:any
  length:number = 0
  formFetch:any
  formSet:any
  formDel:any
  formEvaluator:any
  formSetEvaluator:any
  formRoleEvaluator:any
  formPersonEvaluator:any
  formQuestion:any
  formFetchQuestion:any
  // ฟอร์ม
  Form() {
    this.formFetch = this.fb.group({
      header:[''],
      table:[''],
      role:['']
    })
    this.formSet = this.fb.group({
      header:[''],
      table:[''],
      no:[''],
      title:['',Validators.required],
      types:['',Validators.required],
      dateS:['',Validators.required],
      dateE:['',Validators.required],
      status:['',Validators.required],
      round:['',Validators.required],
      text:['',Validators.required],
    })
    this.formDel = this.fb.group({
      header:[''],
      table:[''],
      no:[''],
    })
    this.formEvaluator = this.fb.group({
      header:[''],
      table:[''],
      role:['']
    })
    this.formSetEvaluator = this.fb.group({
      header:[''],
      table:[''],
      no:[''],
      noNews:[''],
      name:[''],
      email:[''],
      date:[''],
    })
    this.formRoleEvaluator = this.fb.group({
      header:[''],
      table:[''],
    })
    this.formPersonEvaluator = this.fb.group({
      header:[''],
      table:[''],
      noNews:['']
    })
    this.formQuestion = this.fb.group({
      header:[''],
      table:[''],
      email:[''],
      newsNo:[''],
      question01:[''],
      question02:[''],
      question03:[''],
      question04:[''],
      question05:[''],
      question06:[''],
      question07:[''],
      question08:[''],
      question09:[''],
      question10:[''],
    })
    this.formFetchQuestion = this.fb.group({
      header:[''],
      table:[''],
      newsNo:[''],
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
    console.log(this.user)
    this.Form()
    this.Fetch()
    this.FetchTypes()
    this.RoleEvaluator()
  }
  Fetch() {
    const user = JSON.parse(sessionStorage.getItem('user')+'')
    this.formFetch.get('header').setValue('fetch')
    this.formFetch.get('table').setValue(this.table)
    this.formFetch.get('role').setValue(user.role)
    this.api.POST(this.php,this.formFetch.value).subscribe({
      next:(result:any)=>{
        if (result) {
          this.data = result
        }
      }
    })
  }
  FetchTypes() {
    const user = JSON.parse(sessionStorage.getItem('user')+'')
    this.formFetch.get('header').setValue('types')
    this.formFetch.get('table').setValue('academictypes')
    this.formFetch.get('role').setValue(user.role)
    this.api.POST(this.php,this.formFetch.value).subscribe({
      next:(result:any)=>{
        if (result) {
          this.types = result
        }
      }
    })
  }
  FetchPersonEvaluator() {
    this.personEvaluator = []
    this.formPersonEvaluator.get('header').setValue('personEvaluator')
    this.formPersonEvaluator.get('table').setValue('news_evaluator')
    this.formPersonEvaluator.get('noNews').setValue(this.formSet.value.no)
    console.log(this.formPersonEvaluator.value)
    this.api.POST(this.php,this.formPersonEvaluator.value).subscribe({
      next:(result:any)=>{
        console.log(result)
        if (result) {
          this.personEvaluator = result
        }
      }
    })
  }
  DelPersonEvaluator(no:any) {
    Swal.fire({
      title: "ลบรายการนี้หรือไม่?",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก"
    }).then((result) => {
      if (result.isConfirmed) {
        this.formDel.get('header').setValue('delPersonEvaluator')
    this.formDel.get('table').setValue('news_evaluator')
        this.formDel.get('no').setValue(no)
        this.api.POST(this.php,this.formDel.value).subscribe({
          next:(result:any)=>{
            console.log(result)
            if (result) {
              switch (result) {
                case 'success':
                  this.FetchPersonEvaluator()
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
  AddEvaluatorPerson() {
    let emailEvaluator = document.getElementById('emailEvaluator')as HTMLInputElement
    this.formSetEvaluator.get('header').setValue('addEvaluatorPerson')
    this.formSetEvaluator.get('table').setValue('news_evaluator')
    this.formSetEvaluator.get('no').setValue(this.api.LongTime())
    this.formSetEvaluator.get('noNews').setValue(this.formSet.value.no)
    this.formSetEvaluator.get('name').setValue('')
    this.formSetEvaluator.get('email').setValue(emailEvaluator.value)
    this.formSetEvaluator.get('date').setValue(this.api.YYYY() + '-' + this.api.MM() + '-' + this.api.DD())
    this.api.POST(this.php,this.formSetEvaluator.value).subscribe({
      next:(result:any)=>{
        emailEvaluator.value = ''
        if (result == 'success') {
          this.FetchPersonEvaluator()
          Swal.fire({
            title: "ดำเนินการสำเร็จ",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
        } else if (result == 'error') {
          Swal.fire({
            title: "กรุณาลองใหม่อีกครั้ง",
            icon: "error",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    })
  }
  RoleEvaluator() {
    this.formRoleEvaluator.get('header').setValue('roleEveluator')
    this.formRoleEvaluator.get('table').setValue('user')
    this.api.POST(this.php,this.formRoleEvaluator.value).subscribe({
      next:(result:any)=>{
        console.log(result)
        this.listEvaluator = result
      }
    })
  }
  Register(no:any) {
    sessionStorage.setItem('no',no)
    document.location.href = '/register'
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
    formTitle.innerText = 'เพิ่มข่าวสาร'
  }
  EditOpoup(
    no:any,
    title:any,
    types:any,
    dateS:any,
    dateE:any,
    status:any,
    round:any,
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
    this.formSet.get('round').setValue(round)
    this.formSet.get('text').setValue(text)
    this.FetchPersonEvaluator()
    this.personEvaluator = []
    let popup = document.getElementById('popup')as HTMLElement
    popup.style.display = 'flex'
    let formTitle = document.getElementById('formTitle')as HTMLElement
    formTitle.innerText = 'จัดการข่าวสาร'
  }
  ClosePopup() {
    let popup = document.getElementById('popup')as HTMLElement
    popup.style.display = 'none'
    let popupQuestion = document.getElementById('popupQuestion')as HTMLElement
    popupQuestion.style.display = 'none'
    this.formSet.reset()
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
  Set() {
    console.log(this.formSet.value)
    this.api.POST(this.php,this.formSet.value).subscribe({
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
              break;
          }
        }
      }
    })
  }
  ShowAddEva(no:any,name:any) {
    let addEvaluator = document.getElementById('addEvaluator')as HTMLElement
    addEvaluator.style.display = 'flex'
    let evaNo = document.getElementById('evaNo')as HTMLElement
    // evaNo.innerText = no
    evaNo.innerText = name
    console.log(no)
    this.formSetEvaluator.get('no').setValue(no)
  }
  AddEvaluatorPaper() {
    let addEvaluator = document.getElementById('addEvaluator')as HTMLElement
    addEvaluator.style.display = 'none'
    let emailEvaluator = document.getElementById('emailEvaluator')as HTMLInputElement
    let evaNo = document.getElementById('evaNo')as HTMLElement
    console.log(evaNo.textContent)
    this.formSetEvaluator.get('header').setValue('addEvaluatorPaper')
    this.formSetEvaluator.get('table').setValue('news_evaluator')
    // this.formSetEvaluator.get('no').setValue(evaNo.textContent)
    this.formSetEvaluator.get('email').setValue(emailEvaluator.value)
    console.log(this.formSetEvaluator.value)
    this.api.POST(this.php,this.formSetEvaluator.value).subscribe({
      next:(result:any)=>{
        console.log(result)
        emailEvaluator.value = ''
        if (result == 'success') {
          this.FetchPersonEvaluator()
          Swal.fire({
            title: "ดำเนินการสำเร็จ",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
        } else if (result == 'error') {
          Swal.fire({
            title: "กรุณาลองใหม่อีกครั้ง",
            icon: "error",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    })
  }
  OpenListQuestion(news:any,title:any) {
    const idName = [
      'question01',
      'question02',
      'question03',
      'question04',
      'question05',
      'question06',
      'question07',
      'question08',
      'question09',
      'question10'
    ]
    for (let index = 0; index < idName.length; index++) {
      let fixID = document.getElementById(idName[index])as HTMLElement
      fixID.style.display = 'none'
      this.formQuestion.get(idName[index]).setValue('')
    }
    let popupQuestion = document.getElementById('popupQuestion')as HTMLElement
    popupQuestion.style.display = 'flex'
    let titleQuestion = document.getElementById('titleQuestion')as HTMLElement
    titleQuestion.innerHTML = 'ชื่อเรื่อง : ' + title
    this.formQuestion.get('newsNo').setValue(news)
    this.FetchQuestion()
  }
  HideInput(id:any,num:number) {
    const idName = [
      'question01',
      'question02',
      'question03',
      'question04',
      'question05',
      'question06',
      'question07',
      'question08',
      'question09',
      'question10'
    ]
    let nav = document.getElementById(id)as HTMLElement
    nav.style.display = 'none'
    for (let index = num - 1; index < idName.length; index++) {
      let fixID = document.getElementById(idName[index])as HTMLElement
      fixID.style.display = 'none'
      this.formQuestion.get(idName[index]).setValue(null)
    }
  }
  ShowInput(num:number) {
    const idName = [
      'question01',
      'question02',
      'question03',
      'question04',
      'question05',
      'question06',
      'question07',
      'question08',
      'question09',
      'question10'
    ]
    let nav = document.getElementById(idName[num])as HTMLElement
    nav.style.display = 'flex'
    // for (let index = num - 1; index < idName.length; index++) {
    //   let fixID = document.getElementById(idName[index])as HTMLElement
    //   fixID.style.display = 'none'
    // }
  }
  AddQuestion() {
    this.formQuestion.get('header').setValue('addQuestion')
    this.formQuestion.get('table').setValue('paper_question')
    this.formQuestion.get('email').setValue(this.user.email)
    console.log(this.formQuestion.value)
    this.api.POST(this.php,this.formQuestion.value).subscribe({
      next:(result:any)=>{
        console.log(result)
        if (result == 'success') {
          this.ClosePopup()
          Swal.fire({
            title: "ดำเนินการสำเร็จ",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    })
  }
  FetchQuestion() {
    const idName = [
      'question01',
      'question02',
      'question03',
      'question04',
      'question05',
      'question06',
      'question07',
      'question08',
      'question09',
      'question10'
    ]
    let i = 0
    this.formFetchQuestion.get('header').setValue('fetchQuestion')
    this.formFetchQuestion.get('table').setValue('paper_question')
    this.formFetchQuestion.get('newsNo').setValue(this.formQuestion.value.newsNo)
    console.log(this.formFetchQuestion.value)
    this.api.POST(this.php,this.formFetchQuestion.value).subscribe({
      next:(result:any)=>{
        console.log(result)
        if (result != 'error') {
          if (result.question10) {
            i = 9
          } else if (result.question09) {
            i = 8
          } else if (result.question08) {
            i = 7
          } else if (result.question07) {
            i = 6
          } else if (result.question06) {
            i = 5
          } else if (result.question05) {
            i = 4
          } else if (result.question04) {
            i = 3
          } else if (result.question03) {
            i = 2
          } else if (result.question02) {
            i = 1
          } else {
            i = 0
          }
          for (let index = 0; index < i + 1; index++) {
            let fixID = document.getElementById(idName[index])as HTMLElement
            fixID.style.display = 'flex'
            this.formQuestion.get(idName[index]).setValue(result[idName[index]])
          }
        } else {
          let fixID = document.getElementById('question01')as HTMLElement
            fixID.style.display = 'flex'
        }
      }
    })
  }
  SetEva(no:any) {
    sessionStorage.setItem('no',no)
    document.location.href = '/setEvaluator'
  }
}
