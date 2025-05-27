import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../../service/http.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
})
export class TestComponent implements OnInit {
  // ตัวแปร
  file:any
  formUpfile:any
  // ฟอร์ม
  Form() {
    this.formUpfile = this.fb.group({
      header:[''],
      file:['',Validators.required],
      fileName:['']
    })
  }
  // เรียกใช้
  constructor(
    private fb:FormBuilder,
    private api:HttpService
  ) {}
  // ฟังก์ชัน
  ngOnInit(): void {
    this.Form()
  }
  Upload() {
    console.log(this.formUpfile.value)
  }
}
