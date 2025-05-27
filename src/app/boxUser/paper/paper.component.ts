import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { HeaderComponent } from '../../boxNav/header/header.component';
import { SideBarComponent } from '../../boxNav/side-bar/side-bar.component';
import { HttpService } from '../../service/http.service';

@Component({
  selector: 'app-paper',
  templateUrl: './paper.component.html',
  styleUrl: './paper.component.css',
  imports: [
    HeaderComponent,
    SideBarComponent,
    NgFor,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class PaperComponent implements OnInit {
  // ตัวแปร
  php: any = 'user/paper'
  table: any = 'paper'
  user: any
  data: any
  log: any
  evaluator: any
  L01: any
  L02: any
  L03: any
  Q: any
  length: number = 0
  formFetch: any
  formLog: any
  formRegister: any
  formEvaluator: any
  formDel: any
  formNewFile: any
  formFetchEvaluator: any
  evaluatorData: any
  formGetQ: any
  formGetAQ: any
  noNews: any
  formAddScore: any
  fileScore01: any = []
  fileScore02: any = []
  fileScore03: any = []
  formCheckScore: any
  formFecthNews: any
  round: any = 0
  file01: any
  file02: any
  file03: any
  paperStatus: any
  formSetSTPaper: any
  formSetSTPaper2: any
  formSetSTPaper3: any
  saveST01: any
  saveST02: any
  saveST03: any
  formUpDoc: any
  formUpBill: any
  billImage:any
  // ฟอร์ม
  Form() {
    this.formFetch = this.fb.group({
      header: [''],
      table: [''],
      no: ['']
    })
    this.formUpBill = this.fb.group({
      header: [''],
      table: [''],
      no: [''],
      bill: [''],
    })
    this.formFecthNews = this.fb.group({
      header: ['fecthNews'],
      table: ['news'],
      no: ['']
    })
    this.formRegister = this.fb.group({
      header: [''],
      table: [''],
      no: [''],
      noNews: [''],
      titleNews: [''],
      typesNews: [''],
      dateSNews: [''],
      dateENews: [''],
      textNews: [''],
      email: [''],
      name: [''],
      role: [''],
      fields: [''],
      faculty: [''],
      university: [''],
      date: [''],
      file: ['', Validators.required],
    })
    this.formLog = this.fb.group({
      header: [''],
      table: [''],
      paperNo: ['']
    })
    this.formEvaluator = this.fb.group({
      header: [''],
      table: [''],
      paperNo: ['']
    })
    this.formDel = this.fb.group({
      header: [''],
      table: [''],
      no: [''],
    })
    this.formNewFile = this.fb.group({
      header: [''],
      table: [''],
      no: [''],
      file: ['', Validators.required]
    })
    this.formFetchEvaluator = this.fb.group({
      header: [''],
      table: [''],
      no: [''],
    })
    this.formGetQ = this.fb.group({
      header: [''],
      table: [''],
      noNews: ['']
    })
    this.formGetAQ = this.fb.group({
      header: [''],
      table: [],
      no: [''],
      email: [''],
      at01: [''],
      at02: [''],
      at03: [''],
      at04: [''],
      at05: [''],
      at06: [''],
      at07: [''],
      at08: [''],
      at09: [''],
      at10: [''],
      note: ['', Validators.required],
      file: ['', Validators.required]
    })
    this.formAddScore = this.fb.group({
      header: [''],
      table: [''],
      no: [''],
      noPaper: [''],
      email: [''],
      at01: [0],
      at02: [0],
      at03: [0],
      at04: [0],
      at05: [0],
      at06: [0],
      at07: [0],
      at08: [0],
      at09: [0],
      at10: [0],
      note: ['', Validators.required],
      file: '',
    })
    this.formCheckScore = this.fb.group({
      header: [''],
      table: [''],
      no: [''],
      email: ['']
    })
    this.formSetSTPaper = this.fb.group({
      header: [''],
      table: [''],
      no: [''],
      status: ['', Validators.required],
      saveST01: [''],
      saveST02: [''],
      saveST03: [''],
      saveTo: [],
    })
    this.formSetSTPaper2 = this.fb.group({
      header: [''],
      table: [''],
      no: [''],
      status: ['', Validators.required],
      saveST01: [''],
      saveST02: [''],
      saveST03: [''],
      saveTo: [],
    })
    this.formSetSTPaper3 = this.fb.group({
      header: [''],
      table: [''],
      no: [''],
      status: ['', Validators.required],
      saveST01: [''],
      saveST02: [''],
      saveST03: [''],
      saveTo: [],
      dateE:['']
    })
    this.formUpDoc = this.fb.group({
      header: [''],
      table: [''],
      no: [''],
      file: ['', Validators.required]
    })
  }
  // เรียกใช้
  constructor(
    private fb: FormBuilder,
    private api: HttpService
  ) { }
  // ฟังก์ชัน
  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user') + '')
    this.Form()
    try {
      const no = sessionStorage.getItem('no')
      this.Fetch()
      this.LogPaper()
      this.FetchEvaluator()
    } catch (error) {
      document.location.href = '/home'
    }
    this.FetchL01()
    this.FetchL02()
    this.FetchL03()
  }
  Fetch() {
    let approve01 = document.getElementById('approve01') as HTMLInputElement
    let approve01n = document.getElementById('approve01n') as HTMLInputElement
    let approve02 = document.getElementById('approve02') as HTMLInputElement
    let approve02n = document.getElementById('approve02n') as HTMLInputElement
    let approve03 = document.getElementById('approve03') as HTMLInputElement
    let approve03n = document.getElementById('approve03n') as HTMLInputElement
    const user = JSON.parse(sessionStorage.getItem('user') + '')
    this.formFetch.get('header').setValue('fetch')
    this.formFetch.get('table').setValue(this.table)
    this.formFetch.get('no').setValue(sessionStorage.getItem('no'))
    this.api.POST(this.php, this.formFetch.value).subscribe({
      next: (result: any) => {
        console.log('paper')
        console.log(result)
        if (result) {
          this.file01 = result[0].file
          this.file02 = result[0].file2
          this.file03 = result[0].file3
          this.paperStatus = result[0].status
          this.saveST01 = result[0].saveST01
          this.saveST02 = result[0].saveST02
          this.saveST03 = result[0].saveST03
          this.billImage = result[0].bill
          this.data = result
          // let tt = setTimeout(() => {
          //   clearTimeout(tt)
          //   if (result[0].status == 0) {
          //   } else  if (result[0].status == 1) {
          //     console.log('status : ' + result[0].status)
          //     approve01.checked = true
          //   }
          // }, 2500);
          this.noNews = result[0].noNews
          this.formFecthNews.get('header').setValue('fetchNews')
          this.formFecthNews.get('table').setValue('news')
          this.formFecthNews.get('no').setValue(result[0].noNews)
          this.api.POST(this.php, this.formFecthNews.value).subscribe({
            next: (result: any) => {
              console.log('News : ')
              console.log(result)
              this.round = result.round
            }
          })
        }
      }
    })
  }
  FetchL01() {
    const user = JSON.parse(sessionStorage.getItem('user') + '')
    this.formFetch.get('header').setValue('evaList01')
    this.formFetch.get('table').setValue('news_evaluator')
    this.formFetch.get('no').setValue(sessionStorage.getItem('no'))
    this.api.POST(this.php, this.formFetch.value).subscribe({
      next: (result: any) => {
        console.log('l01')
        console.log(result)
        if (result) {
          this.L01 = result
          let same = -1
          for (let index = 0; index < result.length; index++) {
            // if (result[index].email == user.email) {
            same = index
            this.FileScore(result[same].noPaper, result[same].email, 'paper_evaluator', same)
            // }
          }
          // if (same != -1) {
          //   console.log('same : ' + same)
          //   // this.fileScore01[same] = true
          // } else {
          //   this.fileScore01[same] = false
          // }
        }
      }
    })
  }
  FetchL02() {
    const user = JSON.parse(sessionStorage.getItem('user') + '')
    this.formFetch.get('header').setValue('evaList02')
    this.formFetch.get('table').setValue('news_evaluator')
    this.formFetch.get('no').setValue(sessionStorage.getItem('no'))
    this.api.POST(this.php, this.formFetch.value).subscribe({
      next: (result: any) => {
        console.log('l02')
        console.log(result)
        if (result) {
          this.L02 = result
          let same = -1
          for (let index = 0; index < result.length; index++) {
            // if (result[index].email == user.email) {
            same = index
            this.FileScore02(result[same].noPaper, result[same].email, 'paper_evaluator2', same)
            // }
          }
          // if (same != -1) {
          //   console.log('same : ' + same)
          //   // this.fileScore01[same] = true
          // } else {
          //   this.fileScore01[same] = false
          // }
        }
      }
    })
  }
  FetchL03() {
    const user = JSON.parse(sessionStorage.getItem('user') + '')
    this.formFetch.get('header').setValue('evaList02')
    this.formFetch.get('table').setValue('news_evaluator')
    this.formFetch.get('no').setValue(sessionStorage.getItem('no'))
    this.api.POST(this.php, this.formFetch.value).subscribe({
      next: (result: any) => {
        console.log('l03')
        console.log(result)
        if (result) {
          this.L03 = result
          let same = -1
          for (let index = 0; index < result.length; index++) {
            // if (result[index].email == user.email) {
            same = index
            this.FileScore03(result[same].noPaper, result[same].email, 'paper_evaluator3', same)
            // }
          }
          // if (same != -1) {
          //   console.log('same : ' + same)
          //   // this.fileScore01[same] = true
          // } else {
          //   this.fileScore01[same] = false
          // }
        }
      }
    })
  }
  LogPaper() {
    const user = JSON.parse(sessionStorage.getItem('user') + '')
    this.formLog.get('header').setValue('log')
    this.formLog.get('table').setValue(this.table)
    this.formLog.get('paperNo').setValue(sessionStorage.getItem('no'))
    this.api.POST(this.php, this.formLog.value).subscribe({
      next: (result: any) => {
        console.log(result)
        if (result) {
          this.log = result
        }
      }
    })
  }
  OpenPopup(no: any) {
    let popup = document.getElementById('popup') as HTMLElement
    popup.style.display = 'flex'
    this.formEvaluator.get('header').setValue('evaluator')
    this.formEvaluator.get('table').setValue(this.table)
    this.formEvaluator.get('paperNo').setValue(no)
    this.api.POST(this.php, this.formEvaluator.value).subscribe({
      next: (result: any) => {
        console.log(result)
        if (result) {
          if (result.length > 0) {
            this.evaluator = result
          } else {
            this.evaluator = []
          }
        } else {
          this.evaluator = []
        }
      }
    })
  }
  OpenFile(no: any) {
    window.open(no, '_blank')
  }
  ClosePopup() {
    let popup = document.getElementById('popup') as HTMLElement
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
    this.formRegister.get('name').setValue(this.user.title + this.user.fname + ' ' + this.user.lname)
    this.formRegister.get('role').setValue(this.user.role)
    this.formRegister.get('fields').setValue(this.user.fields)
    this.formRegister.get('faculty').setValue(this.user.faculty)
    this.formRegister.get('university').setValue(this.user.university)
    this.formRegister.get('date').setValue(this.api.YYYY() + '-' + this.api.MM() + '-' + this.api.DD())
    console.log(this.formRegister.value)
    this.api.POST(this.php, this.formRegister.value).subscribe({
      next: (result: any) => {
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
  NameDate(date: any) {
    let yyyy = date.substring(0, 4)
    let mm = date.substring(5, 7)
    let dd = date.substring(8, 10)
    return dd + ' ' + this.api.MonthName(mm) + ' ' + yyyy
  }
  Del(no: any) {
    Swal.fire({
      title: "ลบข้อมูลนี้หรือไม่?",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      showCancelButton: true,
      icon: "info",
    }).then((result) => {
      if (result.isConfirmed) {
        this.formDel.get('header').setValue('del')
        this.formDel.get('table').setValue(this.table)
        this.formDel.get('no').setValue(no)
        this.api.POST(this.php, this.formDel.value).subscribe({
          next: (result: any) => {
            if (result) {
              switch (result) {
                case 'success':
                  this.Fetch()
                  this.LogPaper()
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
  NewFile() {
    this.formNewFile.get('header').setValue('newFile')
    this.formNewFile.get('table').setValue('paper')
    this.formNewFile.get('no').setValue(sessionStorage.getItem('no'))
    this.api.POST(this.php, this.formNewFile.value).subscribe({
      next: (result: any) => {
        console.log(result)
        if (result == 'success') {
          Swal.fire({
            title: "ดำเนินการสำเร็จ",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          let loop = setTimeout(() => {
            clearTimeout(loop)
            document.location.reload()
          }, 1500);
        }
      }
    })
  }
  FetchEvaluator() {
    this.formFetchEvaluator.get('header').setValue('evaluatorData')
    this.formFetchEvaluator.get('table').setValue('paper_evaluator')
    this.formFetchEvaluator.get('no').setValue(sessionStorage.getItem('no'))
    console.log(this.formFetchEvaluator.value)
    this.api.POST(this.php, this.formFetchEvaluator.value).subscribe({
      next: (result: any) => {
        console.log(result)
        if (result) {
          this.evaluatorData = result
        }
      }
    })
  }
  OE(title: any, table: any) {
    let titleTag = document.getElementById('adddScoreTitle') as HTMLElement
    titleTag.innerHTML = title
    this.formAddScore.reset()
    let popup = document.getElementById('popup') as HTMLElement
    popup.style.display = 'flex'
    this.formGetQ.get('header').setValue('fetchQ')
    this.formGetQ.get('table').setValue('paper_question')
    this.formGetQ.get('noNews').setValue(this.noNews)
    console.log(this.formGetQ.value)
    // this.formAddScore.get('header').setValue(header)
    this.formAddScore.get('table').setValue(table)
    this.api.POST(this.php, this.formGetQ.value).subscribe({
      next: (result: any) => {
        console.log(result)
        this.Q = result
      }
    })
  }
  AddScore() {
    this.formAddScore.get('header').setValue('addScore')
    // this.formAddScore.get('table').setValue(table)
    this.formAddScore.get('no').setValue(this.api.LongTime())
    this.formAddScore.get('noPaper').setValue(sessionStorage.getItem('no'))
    this.formAddScore.get('email').setValue(this.user.email)
    console.log(this.formAddScore.value)
    this.api.POST(this.php, this.formAddScore.value).subscribe({
      next: (result: any) => {
        console.log(result)
        if (result == 'success') {
          Swal.fire({
            title: "ดำเนินการสำเร็จ",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          let loop = setTimeout(() => {
            clearTimeout(loop)
            document.location.reload()
          }, 1500);
        }
      }
    })
  }
  Base64(event: any) {
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      this.formAddScore.get('file').setValue((reader.result as string) + '')
      this.formUpDoc.get('file').setValue((reader.result as string) + '')
      // console.log(this.formAddScore.value.file)
    }
  }
  FileScore(no: any, email: any, table: any, td: any) {
    this.formCheckScore.get('header').setValue('checkScore')
    this.formCheckScore.get('table').setValue(table)
    this.formCheckScore.get('no').setValue(no)
    this.formCheckScore.get('email').setValue(email)
    let fileL01s = document.getElementsByClassName('fileL01')
    let readNotes = document.getElementsByClassName('readNote')
    let socreTotals = document.getElementsByClassName('socreTotal')
    console.log('formCheckScore')
    console.log(this.formCheckScore.value)
    console.log('td : ' + td)
    this.api.POST(this.php, this.formCheckScore.value).subscribe({
      next: (result: any) => {
        console.log(result)
        if (result) {
          this.fileScore01[td] = true
          let readNote = readNotes[td] as HTMLElement
          readNote.innerHTML = '<textarea rows="4">' + result.note + '</textarea>'
          let fileL01 = fileL01s[td] as HTMLElement
          fileL01.innerHTML = `
          <a download="paper.pdf" href="`+ result.file + `"
            class="bt-blue openFile" type="button"><i class="fa-solid fa-download"></i>
            เปิดไฟล์</a>
          `
          let maxScore = 0
          let at = []
          if (parseInt(result.at01) > 0) {
            at[0] = (result.at01)
            maxScore = maxScore + 5
          } else {
            at[0] = 0
          }
          if (parseInt(result.at02) > 0) {
            at[1] = parseInt(result.at02)
            maxScore = maxScore + 5
          } else {
            at[1] = 0
          }
          if (parseInt(result.at03) > 0) {
            at[2] = (result.at03)
            maxScore = maxScore + 5
          } else {
            at[2] = 0
          }
          if (parseInt(result.at04) > 0) {
            at[3] = parseInt(result.at04)
            maxScore = maxScore + 5
          } else {
            at[3] = 0
          }
          if (parseInt(result.at05) > 0) {
            at[4] = parseInt(result.at05)
            maxScore = maxScore + 5
          } else {
            at[4] = 0
          }
          if (parseInt(result.at06) > 0) {
            at[5] = (result.at06)
            maxScore = maxScore + 5
          } else {
            at[5] = 0
          }
          if (parseInt(result.at07) > 0) {
            at[6] = (result.at07)
            maxScore = maxScore + 5
          } else {
            at[6] = 0
          }
          if (parseInt(result.at08) > 0) {
            at[7] = (result.at08)
            maxScore = maxScore + 5
          } else {
            at[7] = 0
          }
          if (parseInt(result.at09) > 0) {
            at[8] = (result.at09)
            maxScore = maxScore + 5
          } else {
            at[8] = 0
          }
          if (parseInt(result.at10) > 0) {
            at[9] = parseInt(result.at10)
            maxScore = maxScore + 5
          } else {
            at[9] = 0
          }
          let score = 0
          for (let index = 0; index < at.length; index++) {
            score = score + parseInt(at[index])
          }
          let socreTotal = socreTotals[td] as HTMLElement
          socreTotal.innerHTML = `<span>ผลคะนแนน: ` + score + `/` + maxScore + `</span>`
        } else {
          this.fileScore01[td] = false
        }
      }
    })
  }
  FileScore02(no: any, email: any, table: any, td: any) {
    this.formCheckScore.get('header').setValue('checkScore')
    this.formCheckScore.get('table').setValue(table)
    this.formCheckScore.get('no').setValue(no)
    this.formCheckScore.get('email').setValue(email)
    let fileL01s = document.getElementsByClassName('fileL02')
    let readNotes = document.getElementsByClassName('readNote2')
    let socreTotals = document.getElementsByClassName('socreTotal2')
    console.log('formCheckScore')
    console.log(this.formCheckScore.value)
    console.log('td FS2 : ' + td)
    this.api.POST(this.php, this.formCheckScore.value).subscribe({
      next: (result: any) => {
        console.log('FileScore02 res')
        console.log(result)
        if (result) {
          this.fileScore02[td] = true
          let fileL01 = fileL01s[td] as HTMLElement
          let readNote = readNotes[td] as HTMLElement
          readNote.innerHTML = '<textarea rows="4">' + result.note + '</textarea>'
          fileL01.innerHTML = `
          <a download="paper.pdf" href="`+ result.file + `"
            class="bt-blue openFile" type="button"><i class="fa-solid fa-download"></i>
            เปิดไฟล์</a>
          `
          let maxScore = 0
          let at = []
          if (parseInt(result.at01) > 0) {
            at[0] = (result.at01)
            maxScore = maxScore + 5
          } else {
            at[0] = 0
          }
          if (parseInt(result.at02) > 0) {
            at[1] = parseInt(result.at02)
            maxScore = maxScore + 5
          } else {
            at[1] = 0
          }
          if (parseInt(result.at03) > 0) {
            at[2] = (result.at03)
            maxScore = maxScore + 5
          } else {
            at[2] = 0
          }
          if (parseInt(result.at04) > 0) {
            at[3] = parseInt(result.at04)
            maxScore = maxScore + 5
          } else {
            at[3] = 0
          }
          if (parseInt(result.at05) > 0) {
            at[4] = parseInt(result.at05)
            maxScore = maxScore + 5
          } else {
            at[4] = 0
          }
          if (parseInt(result.at06) > 0) {
            at[5] = (result.at06)
            maxScore = maxScore + 5
          } else {
            at[5] = 0
          }
          if (parseInt(result.at07) > 0) {
            at[6] = (result.at07)
            maxScore = maxScore + 5
          } else {
            at[6] = 0
          }
          if (parseInt(result.at08) > 0) {
            at[7] = (result.at08)
            maxScore = maxScore + 5
          } else {
            at[7] = 0
          }
          if (parseInt(result.at09) > 0) {
            at[8] = (result.at09)
            maxScore = maxScore + 5
          } else {
            at[8] = 0
          }
          if (parseInt(result.at10) > 0) {
            at[9] = parseInt(result.at10)
            maxScore = maxScore + 5
          } else {
            at[9] = 0
          }
          let score = 0
          for (let index = 0; index < at.length; index++) {
            score = score + parseInt(at[index])
          }
          let socreTotal = socreTotals[td] as HTMLElement
          socreTotal.innerHTML = `<span>ผลคะนแนน: ` + score + `/` + maxScore + `</span>`
        } else {
          this.fileScore02[td] = false
        }
      }
    })
  }
  FileScore03(no: any, email: any, table: any, td: any) {
    this.formCheckScore.get('header').setValue('checkScore')
    this.formCheckScore.get('table').setValue(table)
    this.formCheckScore.get('no').setValue(no)
    this.formCheckScore.get('email').setValue(email)
    let fileL01s = document.getElementsByClassName('fileL03')
    let readNotes = document.getElementsByClassName('readNote3')
    let socreTotals = document.getElementsByClassName('socreTotal3')
    console.log('formCheckScore')
    console.log(this.formCheckScore.value)
    console.log('td : ' + td)
    this.api.POST(this.php, this.formCheckScore.value).subscribe({
      next: (result: any) => {
        console.log(result)
        if (result) {
          this.fileScore03[td] = true
          let fileL01 = fileL01s[td] as HTMLElement
          let readNote = readNotes[td] as HTMLElement
          readNote.innerHTML = '<textarea rows="4">' + result.note + '</textarea>'
          fileL01.innerHTML = `
          <a download="paper.pdf" href="`+ result.file + `"
            class="bt-blue openFile" type="button"><i class="fa-solid fa-download"></i>
            เปิดไฟล์</a>
          `
          let maxScore = 0
          let at = []
          if (parseInt(result.at01) > 0) {
            at[0] = (result.at01)
            maxScore = maxScore + 5
          } else {
            at[0] = 0
          }
          if (parseInt(result.at02) > 0) {
            at[1] = parseInt(result.at02)
            maxScore = maxScore + 5
          } else {
            at[1] = 0
          }
          if (parseInt(result.at03) > 0) {
            at[2] = (result.at03)
            maxScore = maxScore + 5
          } else {
            at[2] = 0
          }
          if (parseInt(result.at04) > 0) {
            at[3] = parseInt(result.at04)
            maxScore = maxScore + 5
          } else {
            at[3] = 0
          }
          if (parseInt(result.at05) > 0) {
            at[4] = parseInt(result.at05)
            maxScore = maxScore + 5
          } else {
            at[4] = 0
          }
          if (parseInt(result.at06) > 0) {
            at[5] = (result.at06)
            maxScore = maxScore + 5
          } else {
            at[5] = 0
          }
          if (parseInt(result.at07) > 0) {
            at[6] = (result.at07)
            maxScore = maxScore + 5
          } else {
            at[6] = 0
          }
          if (parseInt(result.at08) > 0) {
            at[7] = (result.at08)
            maxScore = maxScore + 5
          } else {
            at[7] = 0
          }
          if (parseInt(result.at09) > 0) {
            at[8] = (result.at09)
            maxScore = maxScore + 5
          } else {
            at[8] = 0
          }
          if (parseInt(result.at10) > 0) {
            at[9] = parseInt(result.at10)
            maxScore = maxScore + 5
          } else {
            at[9] = 0
          }
          let score = 0
          for (let index = 0; index < at.length; index++) {
            score = score + parseInt(at[index])
          }
          let socreTotal = socreTotals[td] as HTMLElement
          socreTotal.innerHTML = `<span>ผลคะนแนน: ` + score + `/` + maxScore + `</span>`
        } else {
          this.fileScore03[td] = false
        }
      }
    })
  }
  SetST(header: any) {
    this.formSetSTPaper.get('header').setValue('setST')
    this.formSetSTPaper.get('table').setValue('paper')
    this.formSetSTPaper.get('no').setValue(this.data[0].no)
    this.formSetSTPaper2.get('header').setValue('setST')
    this.formSetSTPaper2.get('table').setValue('paper')
    this.formSetSTPaper2.get('no').setValue(this.data[0].no)
    this.formSetSTPaper3.get('header').setValue('setST')
    this.formSetSTPaper3.get('table').setValue('paper')
    this.formSetSTPaper3.get('no').setValue(this.data[0].no)
    let calcStatus
    switch (header) {
      case 'SetST01':
        if (this.formSetSTPaper.value.status == 1) {
          calcStatus = 1
        } else if (this.formSetSTPaper.value.status == 2) {
          calcStatus = 2
        } else {
          calcStatus = 0
        }
        this.formSetSTPaper.get('saveST01').setValue(calcStatus)
        this.formSetSTPaper.get('saveTo').setValue(1)
        console.log(this.formSetSTPaper.value)
        this.api.POST(this.php, this.formSetSTPaper.value).subscribe({
          next: (result: any) => {
            console.log(result)
            if (result == 'success') {
              Swal.fire({
                title: "ดำเนินการสำเร็จ",
                icon: "success",
                showConfirmButton: false,
                timer: 1500
              });
              // let loop = setTimeout(() => {
              //   clearTimeout(loop)
              //   document.location.reload()
              // }, 1500);
            }
          }
        })
        break;
      case 'SetST02':
        if (this.formSetSTPaper2.value.status == 2) {
          calcStatus = 1
        } else {
          calcStatus = 0
        }
        this.formSetSTPaper2.get('saveST02').setValue(calcStatus)
        this.formSetSTPaper2.get('saveTo').setValue(2)
        console.log(this.formSetSTPaper2.value)
        this.api.POST(this.php, this.formSetSTPaper2.value).subscribe({
          next: (result: any) => {
            console.log(result)
            if (result == 'success') {
              Swal.fire({
                title: "ดำเนินการสำเร็จ",
                icon: "success",
                showConfirmButton: false,
                timer: 1500
              });
              // let loop = setTimeout(() => {
              //   clearTimeout(loop)
              //   document.location.reload()
              // }, 1500);
            }
          }
        })

        break;
      case 'SetST03':
        if (this.formSetSTPaper3.value.status == 3) {
          calcStatus = 1
        } else {
          calcStatus = 0
        }
        this.formSetSTPaper3.get('saveST03').setValue(calcStatus)
        this.formSetSTPaper3.get('saveTo').setValue(3)
        this.formSetSTPaper3.get('dateE').setValue(this.api.YYYY() + '-' + this.api.MM() + '-' + this.api.DD())
        console.log(this.formSetSTPaper3.value)
        this.api.POST(this.php, this.formSetSTPaper3.value).subscribe({
          next: (result: any) => {
            console.log(result)
            if (result == 'success') {
              Swal.fire({
                title: "ดำเนินการสำเร็จ",
                icon: "success",
                showConfirmButton: false,
                timer: 1500
              });
              let loop = setTimeout(() => {
                clearTimeout(loop)
                document.location.reload()
              }, 1500);
            }
          }
        })

        break;
    }
  }
  UpDoc(target: any) {
    this.formUpDoc.get('header').setValue(target)
    this.formUpDoc.get('table').setValue('paper')
    this.formUpDoc.get('no').setValue(this.data[0].no)
    console.log(this.formUpDoc.value)
    this.api.POST(this.php,this.formUpDoc.value).subscribe({
      next:(result:any)=>{
        console.log(result)
        if (result == 'success') {
          Swal.fire({
            title: "ดำเนินการสำเร็จ",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          let loop = setTimeout(() => {
            clearTimeout(loop)
            document.location.reload()
          }, 1500);
        }
      }
    })
  }
  Certificate(no:any,language:any) {
      sessionStorage.setItem('no',no)
      sessionStorage.setItem('lang',language)
      sessionStorage.setItem('email',this.data[0].email)
      sessionStorage.setItem('paper',JSON.stringify(this.data[0]))
      Swal.fire({
        title: "กำลังดำเนินการ",
        icon: "info",
        showConfirmButton: false,
        timer: 1500,
      });
      let loop = setTimeout(() => {
        clearTimeout(loop)
        document.location.href = '/certificate'
      }, 1500);
    }
  Base64Bill(event:any) {
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = ()=>{
      this.formUpBill.get('bill').setValue((reader.result as string) + '')
      this.billImage = reader.result as string
    }
  }
  UpBill() {
    this.formUpBill.get('header').setValue('upBill')
    this.formUpBill.get('table').setValue('paper')
    this.formUpBill.get('no').setValue(this.data[0].no)
    console.log(this.formUpBill.value)
    this.api.POST(this.php,this.formUpBill.value).subscribe({
      next:(result:any)=>{
        console.log(result)
        if (result == 'success') {
          Swal.fire({
            title: "ดำเนินการสำเร็จ",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          let loop = setTimeout(() => {
            clearTimeout(loop)
            document.location.reload()
          }, 1500);
        }
      }
    })
  }
}
