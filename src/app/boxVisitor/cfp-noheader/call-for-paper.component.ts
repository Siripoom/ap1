import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpService } from '../../service/http.service';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cfp-noheader',
  templateUrl: './call-for-paper.component.html',
  styleUrl: './call-for-paper.component.css',
  imports: [
    NgFor,
    RouterLink
  ],
})
export class CFP implements OnInit {
  // ตัวแปร
  php:any = 'user/home'
  table:any = 'news'
  data:any
  formFetch:any
  // ฟอร์ม
  Form() {
    this.formFetch = this.fb.group({
      header:[''],
      table:[''],
      role:['']
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
    this.Fetch()
  }
  Fetch() {
    this.formFetch.get('header').setValue('fetch')
    this.formFetch.get('table').setValue(this.table)
    this.formFetch.get('role').setValue('')
    this.api.POST(this.php,this.formFetch.value).subscribe({
      next:(result:any)=>{
        console.log(result)
        if (result) {
          this.data = result
        }
      }
    })
  }
}
