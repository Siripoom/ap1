import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../boxNav/header/header.component";
import { SideBarComponent } from "../../boxNav/side-bar/side-bar.component";
import { HttpService } from '../../service/http.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-grade-final',
  templateUrl: './grade-final.component.html',
  styleUrl: './grade-final.component.css',
  imports: [
    HeaderComponent,
    SideBarComponent,
    NgFor,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
],
})
export class GradeFinalComponent implements OnInit {
  // ตัวแปร
  php:any = 'evaluator/gradeFinal'
  table:any = 'paper'
  dataNews:any = {no:'',titleNews:''}
  dataPaper:any = {text:''}
  dataQuestion:any = {text:''}
  score:number = 0
  scoreAll:number = 0
  score2:number = 0
  scoreAll2:number = 0
  formFetch:any
  formFetchQuestion:any = []
  formEvaluator:any = []
  formEvaluator2:any = []
  formFetchEvaluator:any
  dataEvaluator:any
  dataEvaluator2:any
  name01:number = 0
  name02:number = 0
  name03:number = 0
  name04:number = 0
  name05:number = 0
  name06:number = 0
  name07:number = 0
  name08:number = 0
  name09:number = 0
  name10:number = 0
  // ฟอร์ม
  Form() {
    this.formFetch = this.fb.group({
      header:[''],
      table:[''],
      no:[''],
      title:[''],
    })
    this.formFetchQuestion = this.fb.group({
      header:[''],
      table:[''],
    })
    this.formEvaluator = this.fb.group({
      header:[''],
      table:[''],
      no:[''],
      status:[''],
      at01:[''],
      at02:[''],
      at03:[''],
      at04:[''],
      at05:[''],
      at06:[''],
      at07:[''],
      at08:[''],
      at09:[''],
      at10:[''],
      note:['',Validators.required],
      file:['',Validators.required],
      score:[''],
      scoreMax:[''],
    })
    this.formEvaluator2 = this.fb.group({
      header:[''],
      table:[''],
      no:[''],
      status:[''],
      at01:[''],
      at02:[''],
      at03:[''],
      at04:[''],
      at05:[''],
      at06:[''],
      at07:[''],
      at08:[''],
      at09:[''],
      at10:[''],
      note:[''],
      file:[''],
      score:[''],
      scoreMax:[''],
    })
    this.formFetchEvaluator = this.fb.group({
      header:[''],
      table:[''],
      no:['']
    })
  }
  // ฟังก์ชัน
  constructor(
    private api:HttpService,
    private fb:FormBuilder
  ){}
  // เรียกใช้
  ngOnInit(): void {
    this.Form()
    this.FetchPaper()
    this.FetchNews()
    this.FetchQuestion()
    this.formEvaluator.get('status').setValue(1)
    this.FetchEvaluator('paper_evaluator')
    this.FetchEvaluator('paper_evaluator2')
  }
  FetchPaper() {
    this.formFetch.get('header').setValue('fetch')
    this.formFetch.get('table').setValue(this.table)
    this.formFetch.get('no').setValue(sessionStorage.getItem('no'))
    this.api.POST(this.php,this.formFetch.value).subscribe({
      next:(result:any)=>{
        this.dataPaper = result
      }
    })
  }
  FetchNews() {
    this.formFetch.get('header').setValue('fetchNews')
    this.formFetch.get('table').setValue('news')
    this.formFetch.get('no').setValue(sessionStorage.getItem('no'))
    this.formFetch.get('title').setValue(sessionStorage.getItem('title'))
    this.api.POST(this.php,this.formFetch.value).subscribe({
      next:(result:any)=>{
        this.dataNews = result
      }
    })
  }
  FetchQuestion() {
    this.formFetch.get('header').setValue('fetchQuestion')
    this.formFetch.get('table').setValue('paper_question')
    this.formFetch.get('no').setValue(sessionStorage.getItem('no'))
    this.formFetch.get('title').setValue(sessionStorage.getItem('title'))
    console.log(this.formFetch.value)
    this.api.POST(this.php,this.formFetch.value).subscribe({
      next:(result:any)=>{
        console.log(result)
        // this.dataQuestion = result
        if (result.question10) {
          this.dataQuestion = [
            {'question':result.question01,'name':'name01'},
            {'question':result.question02,'name':'name02'},
            {'question':result.question03,'name':'name03'},
            {'question':result.question04,'name':'name04'},
            {'question':result.question05,'name':'name05'},
            {'question':result.question06,'name':'name06'},
            {'question':result.question07,'name':'name07'},
            {'question':result.question08,'name':'name08'},
            {'question':result.question09,'name':'name09'},
            {'question':result.question10,'name':'name10'},
          ]
          this.scoreAll = 100
          this.scoreAll2 = 100
        } else if (result.question09) {
          this.dataQuestion = [
            {'question':result.question01,'name':'name01'},
            {'question':result.question02,'name':'name02.'},
            {'question':result.question03,'name':'name03'},
            {'question':result.question04,'name':'name04'},
            {'question':result.question05,'name':'name05'},
            {'question':result.question06,'name':'name06'},
            {'question':result.question07,'name':'name07'},
            {'question':result.question08,'name':'name08'},
            {'question':result.question09,'name':'name09'},
          ]
          this.scoreAll = 90
          this.scoreAll2 = 90
        } else if (result.question08) {
          this.dataQuestion = [
            {'question':result.question01,'name':'name01'},
            {'question':result.question02,'name':'name02'},
            {'question':result.question03,'name':'name03'},
            {'question':result.question04,'name':'name04'},
            {'question':result.question05,'name':'name05'},
            {'question':result.question06,'name':'name06'},
            {'question':result.question07,'name':'name07'},
            {'question':result.question08,'name':'name08'},
          ]
          this.scoreAll = 80
          this.scoreAll2 = 80
        } else if (result.question07) {
          this.dataQuestion = [
            {'question':result.question01,'name':'name01'},
            {'question':result.question02,'name':'name02'},
            {'question':result.question03,'name':'name03'},
            {'question':result.question04,'name':'name04'},
            {'question':result.question05,'name':'name05'},
            {'question':result.question06,'name':'name06'},
            {'question':result.question07,'name':'name07'},
          ]
          this.scoreAll = 70
          this.scoreAll2 = 70
        } else if (result.question06) {
          this.dataQuestion = [
            {'question':result.question01,'name':'name01'},
            {'question':result.question02,'name':'name02'},
            {'question':result.question03,'name':'name03'},
            {'question':result.question04,'name':'name04'},
            {'question':result.question05,'name':'name05'},
            {'question':result.question06,'name':'name06'},
          ]
          this.scoreAll = 60
          this.scoreAll2 = 60
        } else if (result.question05) {
          this.dataQuestion = [
            {'question':result.question01,'name':'name01'},
            {'question':result.question02,'name':'name02'},
            {'question':result.question03,'name':'name03'},
            {'question':result.question04,'name':'name04'},
            {'question':result.question05,'name':'name05'},
          ]
          this.scoreAll = 50
          this.scoreAll2 = 50
        } else if (result.question04) {
          this.dataQuestion = [
            {'question':result.question01,'name':'name01'},
            {'question':result.question02,'name':'name02'},
            {'question':result.question03,'name':'name03'},
            {'question':result.question04,'name':'name04'},
          ]
          this.scoreAll = 40
          this.scoreAll2 = 40
        } else if (result.question03) {
          this.dataQuestion = [
            {'question':result.question01,'name':'name01'},
            {'question':result.question02,'name':'name02'},
            {'question':result.question03,'name':'name03'},
          ]
          this.scoreAll = 30
          this.scoreAll2 = 30
        } else if (result.question02) {
          this.dataQuestion = [
            {'question':result.question01,'name':'name01'},
            {'question':result.question02,'name':'name02'},
          ]
          this.scoreAll = 20
          this.scoreAll2 = 20
        } else if (result.question01) {
          this.dataQuestion = [
            {'question':result.question01,'name':'name01'},
          ]
          this.scoreAll = 10
          this.scoreAll2 = 10
        } else {
          this.dataQuestion = []
        }
        // this.dataQuestion = [
        //   {'question01':result.question01},
        //   {'question02':result.question02},
        //   {'question03':result.question03},
        //   {'question04':result.question04},
        //   {'question05':result.question05},
        //   {'question06':result.question06},
        //   {'question07':result.question07},
        //   {'question08':result.question08},
        //   {'question09':result.question09},
        //   {'question10':result.question10},
        // ]
        console.log(this.dataQuestion)
        console.log(this.dataQuestion.length)
      }
    })
  }
  OpenFile() {
    window.open(this.dataPaper.file, '_blank')
  }
  OpenFile2() {
    window.open(this.dataPaper.file2, '_blank')
  }
  QuestionGrade(total:number,question:any,name:any) {
    console.log('t : ' + total)
    console.log('q : ' + question)
    console.log('n : ' + name)
    if (name == 'name01') {
      this.formEvaluator.get('at01').setValue(total)
      this.name01 = total
    } else if (name == 'name02') {
      this.formEvaluator.get('at02').setValue(total)
      this.name02 = total
    } else if (name == 'name03') {
      this.formEvaluator.get('at03').setValue(total)
      this.name03 = total
    } else if (name == 'name04') {
      this.formEvaluator.get('at04').setValue(total)
      this.name04 = total
    } else if (name == 'name05') {
      this.formEvaluator.get('at05').setValue(total)
      this.name05 = total
    } else if (name == 'name06') {
      this.formEvaluator.get('at06').setValue(total)
      this.name06 = total
    } else if (name == 'name07') {
      this.formEvaluator.get('at07').setValue(total)
      this.name07 = total
    } else if (name == 'name08') {
      this.formEvaluator.get('at08').setValue(total)
      this.name08 = total
    } else if (name == 'name09') {
      this.formEvaluator.get('at09').setValue(total)
      this.name09 = total
    } else if (name == 'name10') {
      this.formEvaluator.get('at10').setValue(total)
      this.name10 = total
    }
    this.score = 0
    let fixName = [
      'name01',
      'name02',
      'name03',
      'name04',
      'name05',
      'name06',
      'name07',
      'name08',
      'name09',
      'name10',
    ]
    // for (let index = 0; index < this.mixScore.length; index++) {
      // this.score = this.score + this.mixScore[fixName[0]] + this.mixScore[fixName[1]] + this.mixScore[fixName[2]] + this.mixScore[fixName[3]]
      
    // }
    // console.log(this.mixScore)
    this.score = (this.name01 * 2) + (this.name02 * 2) + (this.name03 * 2) + (this.name04 * 2) + (this.name05 * 2) + (this.name06 * 2) + (this.name07 * 2) + (this.name08 * 2) + (this.name09 * 2) + (this.name10 * 2)
    this.formEvaluator.get('score').setValue(this.score)
  }
  
  QuestionGrade2(total:number,question:any,name:any) {
    console.log('t : ' + total)
    console.log('q : ' + question)
    console.log('n : ' + name)
    if (name == 'name01') {
      this.formEvaluator2.get('at01').setValue(total)
      this.name01 = total
    } else if (name == 'name02') {
      this.formEvaluator2.get('at02').setValue(total)
      this.name02 = total
    } else if (name == 'name03') {
      this.formEvaluator2.get('at03').setValue(total)
      this.name03 = total
    } else if (name == 'name04') {
      this.formEvaluator2.get('at04').setValue(total)
      this.name04 = total
    } else if (name == 'name05') {
      this.formEvaluator2.get('at05').setValue(total)
      this.name05 = total
    } else if (name == 'name06') {
      this.formEvaluator2.get('at06').setValue(total)
      this.name06 = total
    } else if (name == 'name07') {
      this.formEvaluator2.get('at07').setValue(total)
      this.name07 = total
    } else if (name == 'name08') {
      this.formEvaluator2.get('at08').setValue(total)
      this.name08 = total
    } else if (name == 'name09') {
      this.formEvaluator2.get('at09').setValue(total)
      this.name09 = total
    } else if (name == 'name10') {
      this.formEvaluator2.get('at10').setValue(total)
      this.name10 = total
    }
    this.score = 0
    let fixName = [
      'name01',
      'name02',
      'name03',
      'name04',
      'name05',
      'name06',
      'name07',
      'name08',
      'name09',
      'name10',
    ]
    // for (let index = 0; index < this.mixScore.length; index++) {
      // this.score = this.score + this.mixScore[fixName[0]] + this.mixScore[fixName[1]] + this.mixScore[fixName[2]] + this.mixScore[fixName[3]]
      
    // }
    // console.log(this.mixScore)
    this.score2 = (this.name01 * 2) + (this.name02 * 2) + (this.name03 * 2) + (this.name04 * 2) + (this.name05 * 2) + (this.name06 * 2) + (this.name07 * 2) + (this.name08 * 2) + (this.name09 * 2) + (this.name10 * 2)
    this.formEvaluator2.get('score').setValue(this.score2)
  }
  Approve(status:any) {
    this.formEvaluator.get('status').setValue(status)
  }
  Evaluator() {
    this.formEvaluator.get('header').setValue('evaluator')
    this.formEvaluator.get('table').setValue('')
    this.formEvaluator.get('no').setValue(sessionStorage.getItem('no'))
    this.formEvaluator.get('scoreMax').setValue(this.scoreAll)
    console.log(this.formEvaluator.value)
    this.api.POST(this.php,this.formEvaluator.value).subscribe({
      next:(result:any)=>{
        console.log(result)
        if (result == 'success') {
          this.FetchEvaluator('paper_evaluator')
          let b01 = document.getElementById('b01')as HTMLElement
          let b02 = document.getElementById('b02')as HTMLElement
          b01.style.display = 'block'
          b02.style.display = 'none'
          Swal.fire({
            title: "ดำเนินการสำเร็จ",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    })
  }
  Evaluator2() {
    this.formEvaluator2.get('header').setValue('evaluator2')
    this.formEvaluator2.get('table').setValue('')
    this.formEvaluator2.get('no').setValue(sessionStorage.getItem('no'))
    this.formEvaluator2.get('status').setValue('5')
    this.formEvaluator2.get('scoreMax').setValue(this.scoreAll2)
    console.log(this.formEvaluator2.value)
    this.api.POST(this.php,this.formEvaluator2.value).subscribe({
      next:(result:any)=>{
        console.log(result)
        if (result == 'success') {
          
          this.FetchEvaluator('paper_evaluator2')
          let b01 = document.getElementById('b01')as HTMLElement
          let b02 = document.getElementById('b02')as HTMLElement
          b01.style.display = 'none'
          b02.style.display = 'block'
          Swal.fire({
            title: "ดำเนินการสำเร็จ",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    })
  }
  FetchEvaluator(table:any) {
    this.formFetchEvaluator.get('header').setValue('fetchEvaluator')
    this.formFetchEvaluator.get('table').setValue(table)
    this.formFetchEvaluator.get('no').setValue(sessionStorage.getItem('no'))
    this.api.POST(this.php,this.formFetchEvaluator.value).subscribe({
      next:(result:any)=>{
        if (result) {
          if (table == 'paper_evaluator') {
            console.log('eva')
            console.log(result)
            this.dataEvaluator = result
            
    this.score = 0
            try {
              const fixName = [
                'at01',
                'at02',
                'at03',
                'at04',
                'at05',
                'at06',
                'at07',
                'at08',
                'at09',
                'at10',
              ]
              for (let index = 0; index < 10; index++) {
                if (parseInt(result[fixName[index]]) > 0) {
                  this.score = this.score + parseInt(result[fixName[index]])
                }
              }
            } catch (error) {
              
            }
            this.score = this.score * 2
            // this.score = parseInt(result.at01) + parseInt(result.at02) + parseInt(result.at03) + parseInt(result.at04) + parseInt(result.at05) + parseInt(result.at06) + parseInt(result.at07) + parseInt(result.at08) + parseInt(result.at09) + parseInt(result.at10)
            let time = setTimeout(() => {
              clearTimeout(time)
              try {
                let name01s = document.getElementsByName('name01')
                let name01 = name01s[parseInt(result.at01)]as HTMLInputElement
                name01.checked = true
                for (let index = 0; index < name01s.length; index++) {
                  let nav =  name01s[index]as HTMLInputElement
                  nav.disabled = true
                }
                name01.disabled = true
                let name02s = document.getElementsByName('name02')
                let name02 = name02s[parseInt(result.at02)]as HTMLInputElement
                name02.checked = true
                for (let index = 0; index < name01s.length; index++) {
                  let nav =  name02s[index]as HTMLInputElement
                  nav.disabled = true
                }
                let name03s = document.getElementsByName('name03')
                let name03 = name03s[parseInt(result.at03)]as HTMLInputElement
                name03.checked = true
                for (let index = 0; index < name01s.length; index++) {
                  let nav =  name03s[index]as HTMLInputElement
                  nav.disabled = true
                }
                let name04s = document.getElementsByName('name04')
                let name04 = name04s[parseInt(result.at04)]as HTMLInputElement
                name04.checked = true
                for (let index = 0; index < name01s.length; index++) {
                  let nav =  name04s[index]as HTMLInputElement
                  nav.disabled = true
                }
                let name05s = document.getElementsByName('name05')
                let name05 = name05s[parseInt(result.at05)]as HTMLInputElement
                name05.checked = true
                for (let index = 0; index < name01s.length; index++) {
                  let nav =  name05s[index]as HTMLInputElement
                  nav.disabled = true
                }
                let name06s = document.getElementsByName('name06')
                let name06 = name06s[parseInt(result.at06)]as HTMLInputElement
                name06.checked = true
                for (let index = 0; index < name01s.length; index++) {
                  let nav =  name06s[index]as HTMLInputElement
                  nav.disabled = true
                }
                let name07s = document.getElementsByName('name07')
                let name07 = name07s[parseInt(result.at07)]as HTMLInputElement
                name07.checked = true
                for (let index = 0; index < name01s.length; index++) {
                  let nav =  name07s[index]as HTMLInputElement
                  nav.disabled = true
                }
                let name08s = document.getElementsByName('name08')
                let name08 = name08s[parseInt(result.at08)]as HTMLInputElement
                name08.checked = true
                for (let index = 0; index < name01s.length; index++) {
                  let nav =  name08s[index]as HTMLInputElement
                  nav.disabled = true
                }
                let name09s = document.getElementsByName('name09')
                let name09 = name09s[parseInt(result.at09)]as HTMLInputElement
                name09.checked = true
                for (let index = 0; index < name01s.length; index++) {
                  let nav =  name09s[index]as HTMLInputElement
                  nav.disabled = true
                }
                let name10s = document.getElementsByName('name10')
                let name10 = name10s[parseInt(result.at10)]as HTMLInputElement
                name10.checked = true
                for (let index = 0; index < name01s.length; index++) {
                  let nav =  name10s[index]as HTMLInputElement
                  nav.disabled = true
                }
              } catch (error) {
                
              }
            }, 500);
            let app01 = document.getElementById('app01')as HTMLInputElement
            let app02 = document.getElementById('app02')as HTMLInputElement
            let app03 = document.getElementById('app03')as HTMLInputElement
            let app04 = document.getElementById('app04')as HTMLInputElement
            let note = document.getElementById('note')as HTMLInputElement
            let file = document.getElementById('file')as HTMLInputElement
            let submit = document.getElementById('submit')as HTMLInputElement
            let BTD01 = document.getElementById('BTD01')as HTMLInputElement
            BTD01.style.display = 'flex'
            if (result.stetus == '1') {
              app01.checked = true
            } else if (result.status == '2') {
              app02.checked = true
            } else if (result.status == '3') {
              app03.checked = true
            } else if (result.status == '4') {
              app04.checked = true
            }
            if (result.status == '2' || result.status == '3' || result.status == '5') {
              let EVABoxD = document.getElementById('EVABoxD')as HTMLElement
              let EVABox1 = document.getElementById('EVABox1')as HTMLElement
              let EVABox2 = document.getElementById('EVABox2')as HTMLElement
              EVABoxD.style.display = 'flex'
              EVABox1.style.display = 'flex'
              EVABox2.style.display = 'flex'
            }
            app01.disabled = true
            app02.disabled = true
            app03.disabled = true
            app04.disabled = true
            this.formEvaluator.get('note').setValue(result.note)
            this.formEvaluator.get('file').setValue(result.file)
            let loop = setTimeout(() => {
              clearTimeout(loop)
              note.disabled = true
            file.disabled = true
            }, 500);
            submit.style.display = 'none'
          } else if (table == 'paper_evaluator2') {
            console.log('eva2')
            console.log(result)
           if (result) {
            this.dataEvaluator2 = result
            try {
              let name01s = document.getElementsByName('name01')
              let name01 = name01s[parseInt(result.at01) + 6]as HTMLInputElement
              name01.checked = true
              for (let index = 0; index < name01s.length; index++) {
                let nav =  name01s[index]as HTMLInputElement
                nav.disabled = true
              }
              name01.disabled = true
              let name02s = document.getElementsByName('name02')
              let name02 = name02s[parseInt(result.at02) + 6]as HTMLInputElement
              name02.checked = true
              for (let index = 0; index < name01s.length; index++) {
                let nav =  name02s[index]as HTMLInputElement
                nav.disabled = true
              }
              let name03s = document.getElementsByName('name03')
              let name03 = name03s[parseInt(result.at03) + 6]as HTMLInputElement
              name03.checked = true
              for (let index = 0; index < name01s.length; index++) {
                let nav =  name03s[index]as HTMLInputElement
                nav.disabled = true
              }
              let name04s = document.getElementsByName('name04')
              let name04 = name04s[parseInt(result.at04) + 6]as HTMLInputElement
              name04.checked = true
              for (let index = 0; index < name01s.length; index++) {
                let nav =  name04s[index]as HTMLInputElement
                nav.disabled = true
              }
              let name05s = document.getElementsByName('name05')
              let name05 = name05s[parseInt(result.at05) + 6]as HTMLInputElement
              name05.checked = true
              for (let index = 0; index < name01s.length; index++) {
                let nav =  name05s[index]as HTMLInputElement
                nav.disabled = true
              }
              let name06s = document.getElementsByName('name06')
              let name06 = name06s[parseInt(result.at06) + 6]as HTMLInputElement
              name06.checked = true
              for (let index = 0; index < name01s.length; index++) {
                let nav =  name06s[index]as HTMLInputElement
                nav.disabled = true
              }
              let name07s = document.getElementsByName('name07')
              let name07 = name07s[parseInt(result.at07) + 6]as HTMLInputElement
              name07.checked = true
              for (let index = 0; index < name01s.length; index++) {
                let nav =  name07s[index]as HTMLInputElement
                nav.disabled = true
              }
              let name08s = document.getElementsByName('name08')
              let name08 = name08s[parseInt(result.at08) + 6]as HTMLInputElement
              name08.checked = true
              for (let index = 0; index < name01s.length; index++) {
                let nav =  name08s[index]as HTMLInputElement
                nav.disabled = true
              }
              let name09s = document.getElementsByName('name09')
              let name09 = name09s[parseInt(result.at09) + 6]as HTMLInputElement
              name09.checked = true
              for (let index = 0; index < name01s.length; index++) {
                let nav =  name09s[index]as HTMLInputElement
                nav.disabled = true
              }
              let name10s = document.getElementsByName('name10')
              let name10 = name10s[parseInt(result.at10) + 6]as HTMLInputElement
              name10.checked = true
              for (let index = 0; index < name01s.length; index++) {
                let nav =  name10s[index]as HTMLInputElement
                nav.disabled = true
              }
            } catch (error) {
              
            }
            this.score2 = 0
            try {
              const fixNamea = [
                'at01',
                'at02',
                'at03',
                'at04',
                'at05',
                'at06',
                'at07',
                'at08',
                'at09',
                'at10',
              ]
              for (let index = 0; index < 10; index++) {
                if (parseInt(result[fixNamea[index]]) > 0) {
                  this.score2 = this.score2 + parseInt(result[fixNamea[index]])
                  console.log('score' + index + ' : ' + result[fixNamea[index]])
                }
              }
            } catch (error) {
              
            }
            this.score2 = this.score2 * 2
            let submit2 = document.getElementById('submit2')as HTMLInputElement
            submit2.style.display = 'none'
           }
          }
        }
      }
    })
  }
  OpenEvaluator() {
    window.open(this.dataEvaluator.file, '_blank')
  }
  EVABox1() {
    let b01 = document.getElementById('b01')as HTMLElement
    let b02 = document.getElementById('b02')as HTMLElement
    b01.style.display = 'block'
    b02.style.display = 'none'
    this.FetchEvaluator('paper_evaluator')
  }
  EVABox2() {
    let b01 = document.getElementById('b01')as HTMLElement
    let b02 = document.getElementById('b02')as HTMLElement
    b01.style.display = 'none'
    b02.style.display = 'block'
    if (this.dataEvaluator2) {
      this.FetchEvaluator('paper_evaluator2')
    } else {
      try {
      let name01s = document.getElementsByName('name01')
      for (let index = 0; index < name01s.length; index++) {
        let nav =  name01s[index]as HTMLInputElement
        nav.disabled = false
      }
      let name02s = document.getElementsByName('name02')
      for (let index = 0; index < name01s.length; index++) {
        let nav =  name02s[index]as HTMLInputElement
        nav.disabled = false
      }
      let name03s = document.getElementsByName('name03')
      for (let index = 0; index < name01s.length; index++) {
        let nav =  name03s[index]as HTMLInputElement
        nav.disabled = false
      }
      let name04s = document.getElementsByName('name04')
      for (let index = 0; index < name01s.length; index++) {
        let nav =  name04s[index]as HTMLInputElement
        nav.disabled = false
      }
      let name05s = document.getElementsByName('name05')
      for (let index = 0; index < name01s.length; index++) {
        let nav =  name05s[index]as HTMLInputElement
        nav.disabled = false
      }
      let name06s = document.getElementsByName('name06')
      for (let index = 0; index < name01s.length; index++) {
        let nav =  name06s[index]as HTMLInputElement
        nav.disabled = false
      }
      let name07s = document.getElementsByName('name07')
      for (let index = 0; index < name01s.length; index++) {
        let nav =  name07s[index]as HTMLInputElement
        nav.disabled = false
      }
      let name08s = document.getElementsByName('name08')
      for (let index = 0; index < name01s.length; index++) {
        let nav =  name08s[index]as HTMLInputElement
        nav.disabled = false
      }
      let name09s = document.getElementsByName('name09')
      for (let index = 0; index < name01s.length; index++) {
        let nav =  name09s[index]as HTMLInputElement
        nav.disabled = false
      }
      let name10s = document.getElementsByName('name10')
      for (let index = 0; index < name01s.length; index++) {
        let nav =  name10s[index]as HTMLInputElement
        nav.disabled = false
      }
    } catch (error) {
      
    }
  }
    }
    
}
