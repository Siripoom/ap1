import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { HttpService } from '../../service/http.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  // ตัวแปร
  year:any
  user:any
  // ฟอร์ม

  // เรียกใช้
  constructor(
    private api:HttpService
  ){}
  // ฟังก์ชัน
  ngOnInit(): void {
    this.year = this.api.YYYY()
    this.user = JSON.parse(sessionStorage.getItem('user')+'')
  }
  Signout() {
    Swal.fire({
      title: "ออกจากระบบหรือไม่?",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      showCancelButton:true,
      icon: "info",
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.clear()
        Swal.fire({
          title: "ดำเนินการสำเร็จ",
          icon: "success",
          showConfirmButton: false,
          timer: 1500
        });
        let loop = setTimeout(() => {
          clearTimeout(loop)
          document.location.href = '/'
        }, 1500);
      }
    });
  }
}
