import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  // ตัวแปร
  fecthURL:any = 'http://127.0.0.1:5000/'
  imageURL:any = 'http://127.0.0.1:5000/images/images.php?image='
  ext:any = '.php'
  formDel:any
  php:any
  base64:any
  // ฟอร์ม
  // เรียกใช้
  constructor(
    private http:HttpClient,
  ) { }
  // ฟังก์ชัน
  POST(url:any,data:any) {
    return this.http.post(this.fecthURL+url+this.ext,data)
  }
  GetImage(image:any,location:any) {
    return this.imageURL + image + '&location=' + location
  }
  DD() {
    let date = new Date()
    let dd = date.getDate() + ''
    if (dd.length == 1) {
      dd = '0' + dd
    }
    return dd
  }
  MM() {
    let date = new Date()
    let mm = (date.getMonth() + 1) + ''
    if (mm.length == 1) {
      mm = '0' + mm
    }
    return mm
  }
  YYYY() {
    let date = new Date()
    let yyyy = date.getFullYear()
    return yyyy
  }
  Time() {
    let date = new Date()
    let hours = date.getHours() + ''
    if (hours.length == 1) {
      hours = '0' + hours
    }
    let minute = date.getMinutes() + ''
    if (minute.length == 1) {
      minute = '0' + minute
    }
    let time = hours + ':' + minute
    return time
  }
  MonthName(number:number) {
    let name = [
      'มกราคม',
      'กุมภาพันธ์',
      'มีนาคม',
      'เมษายน',
      'พฤษภาคม',
      'มิถุนายน',
      'กรกฎาคม',
      'สิงหาคม',
      'กันยายน',
      'ตุลาคม',
      'พฤศจิกายน',
      'ธันวาคม',
    ]
    let month = name[number - 1]
    return month
  }
  LongTime() {
    let date = new Date()
    date.toLocaleString('en-US', { timeZone: 'Asia/Bangkok', day: 'numeric' })
    let year = date.getFullYear() + ''
    let month = (date.getMonth() + 1) + ''
    let day = (date.getUTCDate() + 1) + ''
    let hours = date.getHours() + ''
    let minutes = date.getMinutes() + ''
    let seconds = date.getSeconds() + ''
    let milliseconds = date.getMilliseconds() + ''
    if (month.length == 1) {
      month = '0' + month
    }
    if (day.length == 1) {
      day = '0' + day
    }
    if (hours.length == 1) {
      hours = '0' + hours
    }
    if (minutes.length == 1) {
      minutes = '0' + minutes
    }
    if (seconds.length == 1) {
      seconds = '0' + seconds
    }
    while (milliseconds.length != 3) {
      milliseconds = '0' + milliseconds
    }
    let time = year + month + day + hours + minutes + seconds + milliseconds
    return time
  }
  Base64(event:any) {
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = ()=>{
      this.base64 = reader.result as string
      // console.log(this.base64)
      return this.base64
    }
  }
}
