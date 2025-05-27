import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpService } from '../../service/http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class SignupComponent implements OnInit {
  // ตัวแปร
  php:any = 'visitor/signup'
  table:any = 'user'
  formSignup:any
  // ฟอร์ม
  Form() {
    this.formSignup = this.fb.group({
      header:['signup'],
      table:['user'],
      email:['',Validators.required],
      pass:['',Validators.required],
      passCon:['',Validators.required],
      title:['',Validators.required],
      fname:['',Validators.required],
      lname:['',Validators.required],
      titleEN:['',Validators.required],
      fnameEN:['',Validators.required],
      lnameEN:['',Validators.required],
      university:['',Validators.required],
      faculty:['',Validators.required],
      fields:['',Validators.required],
      role:['',Validators.required],
    })
  }
  // เรียกใช้
  constructor(
    private fb:FormBuilder,
    private api:HttpService,
  ){}
  // ฟังก์ชัน
  ngOnInit(): void {
    this.Form()
  }
  Signup() {
    if (this.formSignup.value.pass == this.formSignup.value.passCon) {
      this.formSignup.get('header').setValue('signup')
      this.formSignup.get('table').setValue('user')
      this.api.POST(this.php,this.formSignup.value).subscribe({
        next:(result:any)=>{
          switch (result) {
            case 'success':
              Swal.fire({
                title: "สมัครสมาชิกสำเร็จ",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
              });
              let loop = setTimeout(() => {
                clearTimeout(loop)
                document.location.href = '/signin'
              }, 1500);
              break;
            case 'error':
              Swal.fire({
                title: "อีเมลล์นี้ถูกใช้ไปแล้ว",
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
              });
              break;
          }
        }
      })
    } else {
      Swal.fire({
        title: "รหัสผ่านไม่ตรงกัน",
        icon: "error",
        timer: 1500
      });
    }
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
