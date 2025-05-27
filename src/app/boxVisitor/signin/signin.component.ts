import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpService } from '../../service/http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class SigninComponent implements OnInit {
  // ตัวแปร
  php:any = 'visitor/signin'
  table:any = 'user'
  formSignin:any
  // ฟอร์ม
  Form() {
    this.formSignin = this.fb.group({
      header:[''],
      table:[''],
      email:['',Validators.required],
      pass:['',Validators.required]
    })
  }
  // เรียกใช้
  constructor(
    private fb:FormBuilder,
    private api:HttpService,
  ){}
  // ฟังก์ชัน
  ngOnInit(): void {
    if (sessionStorage.getItem('user')) {
      document.location.href = '/home'
    }
    this.Form()
  }
  Signin() {
    Swal.fire({
      title: "กำลังดำเนินการ",
      icon: "info",
      showConfirmButton: false,
    });
    this.formSignin.get('header').setValue('signin')
    this.formSignin.get('table').setValue(this.table)
    this.api.POST(this.php,this.formSignin.value).subscribe({
      next:(result:any)=>{
        if (result) {
          switch (result) {
            case 'error':
              Swal.fire({
                title: "โปรดระบุข้อมูลให้ถูกต้อง",
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
              });
              break;
            case 'disable':
              Swal.fire({
                title: "บัญชีนี้ยังไม่มีสิทธิ์ใช้งาน",
                icon: "warning",
                showConfirmButton: false,
                timer: 1500,
              });
              break;
            default:
              Swal.fire({
                title: "กำลังเข้าสู่ระบบ",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
              });
              let loop = setTimeout(() => {
                clearTimeout(loop)
                sessionStorage.setItem('user',JSON.stringify(result))
                document.location.href = '/home'
              }, 1500);
              break;
          }
        }
      }
    })
  }
  Switch(inputTarget:any,eyeTarget01:any,eyeTarget02:any) {
    let inputBox = document.getElementById(inputTarget)as HTMLInputElement
    let eye01 = document.getElementById(eyeTarget01)as HTMLElement
    let eye02 = document.getElementById(eyeTarget02)as HTMLElement
    if (inputBox.type == 'text') {
      inputBox.type = 'password'
      eye01.style.display = 'none'
      eye02.style.display = 'flex'
    } else {
      inputBox.type = 'text'
      eye01.style.display = 'flex'
      eye02.style.display = 'none'
    }
  }
}
