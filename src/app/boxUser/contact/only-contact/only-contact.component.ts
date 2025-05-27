import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../../../service/http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-only-contact',
  templateUrl: './only-contact.component.html',
  styleUrl: './only-contact.component.css',
  imports: [
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class OnlyContactComponent implements OnInit {
  // ตัวแปร
  php:any = 'user/contact'
  table:any = 'contact_data'
  formSet:any
  // ฟอร์ม
  Form() {
    this.formSet = this.fb.group({
      header:[''],
      table:[''],
      no:[''],
      name:['',Validators.required],
      email:['',Validators.required],
      text:['',Validators.required],
      date:[''],
    })
  }
  // เรียกใช้
  constructor(
    private fb:FormBuilder,
    private api:HttpService
  ){}
  // ฟังก์ชัน
  ngOnInit(): void {
    this.Form()
  }
  Add() {
    this.formSet.get('header').setValue('add')
    this.formSet.get('table').setValue(this.table)
    this.formSet.get('no').setValue(this.api.LongTime())
    this.formSet.get('date').setValue(this.api.YYYY() + '-' + this.api.MM() + '-' + this.api.DD())
    this.api.POST(this.php,this.formSet.value).subscribe({
      next:(result:any)=>{
        this.formSet.reset()
        if (result) {
          switch (result) {
            case 'success':
              Swal.fire({
                title: "ส่งข้อมูลสำเร็จ",
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
}
