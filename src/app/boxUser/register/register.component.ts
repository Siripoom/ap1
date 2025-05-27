import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { HeaderComponent } from '../../boxNav/header/header.component';
import { SideBarComponent } from '../../boxNav/side-bar/side-bar.component';
import { HttpService } from '../../service/http.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  imports: [
    HeaderComponent,
    SideBarComponent,
    NgFor,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
],
})
export class RegisterComponent implements OnInit {
  // ตัวแปร
  php:any = 'user/register'
  table:any = 'paper'
  user:any
  data:any
  length:number = 0
  formFetch:any
  formRegister:any
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
    } catch (error) {
      document.location.href = '/home'
    }
    this.user = JSON.parse(sessionStorage.getItem('user')+'')
  }
  Fetch() {
    const user = JSON.parse(sessionStorage.getItem('user')+'')
    this.formFetch.get('header').setValue('fetch')
    this.formFetch.get('table').setValue('news')
    this.formFetch.get('no').setValue(sessionStorage.getItem('no'))
    this.api.POST(this.php,this.formFetch.value).subscribe({
      next:(result:any)=>{
        if (result) {
          this.data = result
        }
      }
    })
  }
  OpenPopup() {
    let popup = document.getElementById('popup')as HTMLElement
    popup.style.display = 'flex'
    let pdf = document.getElementById('pdf')as HTMLIFrameElement
    pdf.src = this.formRegister.value.file
  }
  OpenFile() {
    window.open(this.formRegister.value.file, '_blank')
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
  Base64(event:any) {
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = ()=>{
      this.formRegister.get('file').setValue(reader.result as string)
      console.log(this.formRegister.value)
    }
  }
}
