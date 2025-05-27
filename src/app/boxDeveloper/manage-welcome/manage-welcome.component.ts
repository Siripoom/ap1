import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HeaderComponent } from '../../boxNav/header/header.component';
import { SideBarComponent } from '../../boxNav/side-bar/side-bar.component';
import { HttpService } from '../../service/http.service';

@Component({
  selector: 'app-manage-welcome',
  templateUrl: './manage-welcome.component.html',
  styleUrl: './manage-welcome.component.css',
  imports: [
    HeaderComponent,
    SideBarComponent,
    NgFor,
    FormsModule,
    ReactiveFormsModule,
],
})
export class ManageWelcomeComponent implements OnInit {
  // ตัวแปร
  php:any = 'dev/manageWelcome'
  table:any = 'welcome_note'
  data:any
  length:number = 0
  page:number = 1
  pageLength:number = 20
  maxPage:any = 1
  formLength:any
  formFetch:any
  formStatus:any
  formDel:any
  formSetRole:any
  formSet:any
  // ฟอร์ม
  Form() {
    this.formLength = this.fb.group({
      header:[''],
      table:[''],
    })
    this.formFetch = this.fb.group({
      header:[''],
      table:[''],
      start:[''],
      stop:[''],
      page:[''],
    })
    this.formStatus = this.fb.group({
      header:[''],
      table:[''],
      no:[''],
      status:[''],
    })
    this.formDel = this.fb.group({
      header:[''],
      table:[''],
      no:[''],
    })
    this.formSetRole = this.fb.group({
      header:[''],
      table:[''],
      no:[''],
      role:[''],
    })
    this.formSet = this.fb.group({
      header:[''],
      table:[''],
      no:[''],
      name:['',Validators.required],
      date:[''],
      file:['',Validators.required],
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
    this.Length()
  }
  Length() {
    this.formLength.get('header').setValue('length')
    this.formLength.get('table').setValue(this.table)
    this.api.POST(this.php,this.formLength.value).subscribe({
      next:(result:any)=>{
        this.length = result
        if (20 % this.pageLength > 0) {
          this.maxPage = parseInt(((this.length / this.pageLength) + 1) + '')
        } else {
          this.maxPage = parseInt((this.length / this.pageLength) + '')
        }
        this.Fetch(0,20)
      }
    })
  }
  Fetch(start:number,stop:number) {
    this.formFetch.get('header').setValue('fetch')
    this.formFetch.get('table').setValue(this.table)
    this.formFetch.get('start').setValue(start)
    this.formFetch.get('stop').setValue(stop)
    this.api.POST(this.php,this.formFetch.value).subscribe({
      next:(result:any)=>{
        if (result) {
          this.data = result
        } else {
          this.data = []
        }
      }
    })
  }
  SetRole(no:any,role:any) {
    this.formSetRole.get('header').setValue('setRole')
    this.formSetRole.get('table').setValue(this.table)
    this.formSetRole.get('no').setValue(no)
    this.formSetRole.get('role').setValue(role)
    this.api.POST(this.php,this.formSetRole.value).subscribe({
      next:(result:any)=>{
        switch (result) {
          case 'success':
            if (this.page == 1) {
              this.Fetch(0,20)
            } else {
              this.Fetch(this.page * 20,(this.page * 20) + 20)
            }
            Swal.fire({
              title: "ดำเนินการสำเร็จ",
              icon: "success",
              showConfirmButton: false,
              timer: 1500
            });
            break;
        }
      }
    })
  }
  Minus() {
    this.page -= 1
    if (this.page < 1) {
      this.page = this.maxPage
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
  Status(no:any,status:any) {
    if (status == 0) {
      status = 1
    } else if (status == 1) {
      status = 0
    }
    this.formStatus.get('header').setValue('status')
    this.formStatus.get('table').setValue(this.table)
    this.formStatus.get('no').setValue(no)
    this.formStatus.get('status').setValue(status)
    this.api.POST(this.php,this.formStatus.value).subscribe({
      next:(result:any)=>{
        if (result) {
          switch (result) {
            case 'success':
              if (this.page == 1) {
                this.Fetch(0,20)
              } else {
                this.Fetch(this.page * 20,(this.page * 20) + 20)
              }
              Swal.fire({
                title: "เปลี่ยนสถานะสำเร็จ",
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
                  if (this.page == 1) {
                    this.Fetch(0,20)
                  } else {
                    this.Fetch(this.page * 20,(this.page * 20) + 20)
                  }
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
  OpenPopup() {
    this.formSet.get('header').setValue('add')
    this.formSet.get('table').setValue(this.table)
    this.formSet.get('no').setValue(this.api.LongTime())
    let popup = document.getElementById('popup')as HTMLElement
    popup.style.display = 'flex'
    let formTitle = document.getElementById('formTitle')as HTMLElement
    formTitle.innerText = 'เพิ่มใบปริว'
  }
  EditOpoup(
    no:any,
    name:any,
    file:any
  ) {
    this.formSet.get('header').setValue('set')
    this.formSet.get('table').setValue(this.table)
    this.formSet.get('no').setValue(no)
    this.formSet.get('name').setValue(name)
    this.formSet.get('file').setValue(file)
    this.formSet.get('date').setValue(this.api.YYYY() + '-' + this.api.MM() + '-' + this.api.DD())
    let popup = document.getElementById('popup')as HTMLElement
    popup.style.display = 'flex'
    let formTitle = document.getElementById('formTitle')as HTMLElement
    formTitle.innerText = 'จัดการใบปริว'
  }
  ClosePopup() {
    let popup = document.getElementById('popup')as HTMLElement
    popup.style.display = 'none'
    this.formSet.reset()
  }
  Set() {
    this.formSet.get('date').setValue(this.api.YYYY() + '-' + this.api.MM() + '-' + this.api.DD())
      this.api.POST(this.php,this.formSet.value).subscribe({
        next:(result:any)=>{
          if (result) {
            switch (result) {
              case 'success':
                this.Fetch(0,19)
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
    Base64(event:any) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = ()=>{
        this.formSet.get('file').setValue(reader.result as string)
        console.log(this.formSet.value)
      }
    }
    NameDate(date:any) {
      let yyyy = date.substring(0,4)
      let mm = date.substring(5,7)
      let dd = date.substring(8,10)
      return dd + ' ' + this.api.MonthName(mm) + ' ' + yyyy
    }
}
