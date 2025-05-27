import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../boxNav/header/header.component";
import { SideBarComponent } from "../../boxNav/side-bar/side-bar.component";
import { HttpService } from '../../service/http.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrl: './certificate.component.css',
  imports: [
    HeaderComponent,
    SideBarComponent,
    FormsModule,
    ReactiveFormsModule,
    NgIf
  ],
})
export class CertificateComponent implements OnInit {
  // ตัวแปร
  php:any = 'user/certificate'
  table:any = ''
  user:any
  paper:any
  paperNo:any
  lang:any
  award:any
  awardText:any
  formCheckScore:any
  score01:any
  score02:any
  score03:any
  owner:any = [
    {"title":"","titleEN":"","fname":"","fnameEN":"","lname":"","lnameEN":"",}
  ]
  formFetchOwner:any
  formMaxScore:any
  formListQA:any
  maxScore:any
  // ฟอร์ม
  Form() {
    this.formFetchOwner= this.fb.group({
      header:[''],
      table:[''],
      email:['']
    })
    this.formCheckScore = this.fb.group({
      header:[''],
      table:[''],
      no:['']
    })
    this.formMaxScore = this.fb.group({
      header:[''],
      table:[''],
      no:[''],
    })
    this.formListQA = this.fb.group({
      header:[''],
      table:[''],
      noPaper:[''],
    })
  }
  // เรียกใช้
  constructor(
    private api:HttpService,
    private fb:FormBuilder
  ){}
  // ฟังก์ชัน
  ngOnInit(): void {
    this.Form()
    this.user = JSON.parse(sessionStorage.getItem('user') + '')
    console.log('user')
    console.log(this.user)
    this.paperNo = sessionStorage.getItem('no')
    console.log('paperNo')
    console.log(this.paperNo)
    this.paper = JSON.parse(sessionStorage.getItem('paper') + '')
    console.log('paper')
    console.log(this.paper)
    this.lang = sessionStorage.getItem('lang')
    console.log('lang')
    console.log(this.lang)
    this.FetchOwner()
    // this.FetchScore('paper_evaluator')
    // this.FetchScore('paper_evaluator2')
    // this.FetchScore('paper_evaluator3')
    this.FetchMaxScore()
  }
  FetchOwner() {
    this.formFetchOwner.get('header').setValue('fetchOwner')
    this.formFetchOwner.get('table').setValue('user')
    this.formFetchOwner.get('email').setValue(this.paper.email)
    console.log(this.formFetchOwner.value)
    this.api.POST(this.php,this.formFetchOwner.value).subscribe({
      next:(result:any)=>{
        console.log('FetchOwner')
        console.log(result)
        this.owner = result
      }
    })
  }
  FetchMaxScore() {
    this.formMaxScore.get('header').setValue('maxScore')
    this.formMaxScore.get('table').setValue('paper_question')
    this.formMaxScore.get('no').setValue(this.paper.noNews)
    console.log('Max ScoreV')
    console.log(this.formMaxScore.value)
    let score = 0
    this.api.POST(this.php,this.formMaxScore.value).subscribe({
      next:(result:any)=>{
        console.log('Max Score')
        console.log(result)
        if (result.question01) {
          score = score + 5
        }
        if (result.question02) {
          score = score + 5
        }
        if (result.question03) {
          score = score + 5
        }
        if (result.question04) {
          score = score + 5
        }
        if (result.question05) {
          score = score + 5
        }
        if (result.question06) {
          score = score + 5
        }
        if (result.question07) {
          score = score + 5
        }
        if (result.question08) {
          score = score + 5
        }
        if (result.question09) {
          score = score + 5
        }
        if (result.question10) {
          score = score + 5
        }
        console.log('maxScore ' + score)
        this.formListQA.get('header').setValue('listQA')
        this.formListQA.get('table').setValue('news_evaluator')
        this.formListQA.get('noPaper').setValue(this.paper.no)
        console.log(this.formListQA.value)
        this.api.POST(this.php,this.formListQA.value).subscribe({
          next:(result:any)=>{
            console.log('ListQA')
            console.log(result)
            this.award = result.length * score
            console.log(this.award)
            this.FetchScore('paper_evaluator3')
          }
        })
      }
    })
  }
  FetchScore(table:any) {
    this.formCheckScore.get('header').setValue('checkScore')
    this.formCheckScore.get('table').setValue(table)
    this.formCheckScore.get('no').setValue(this.paper.no)
    console.log(this.formCheckScore.value)
    this.api.POST(this.php,this.formCheckScore.value).subscribe({
      next:(result:any)=>{
        console.log('FetchScore')
        console.log(result)
        let score = 0
        for (let index = 0; index < result.length; index++) {
          if (result[index].at01) {
            score = score + parseInt(result[index].at01)
          }
          if (result[index].at02) {
            score = score + parseInt(result[index].at02)
          }
          if (result[index].at03) {
            score = score + parseInt(result[index].at03)
          }
          if (result[index].at04) {
            score = score + parseInt(result[index].at04)
          }
          if (result[index].at05) {
            score = score + parseInt(result[index].at05)
          }
          if (result[index].at06) {
            score = score + parseInt(result[index].at06)
          }
          if (result[index].at07) {
            score = score + parseInt(result[index].at07)
          }
          if (result[index].at08) {
            score = score + parseInt(result[index].at08)
          }
          if (result[index].at09) {
            score = score + parseInt(result[index].at09)
          }
          if (result[index].at10) {
            score = score + parseInt(result[index].at10)
          }
        }
        if (table == 'paper_evaluator') {
          
          this.score01 = score
          console.log('score01 = ' + this.score01)
        } else if (table == 'paper_evaluator2') {
          this.score02 = score
          console.log('score02 = ' + this.score02)
        } else if (table == 'paper_evaluator3') {
          this.score03 = score
          console.log('score03 = ' + this.score03)
          let sum = (this.score03 / this.award) *100
          console.log('sum : ' + sum)
          // if (this.lang == 'en') {
            if (sum >= 95) {
              this.awardText = 'Participated paper'
            } else if (sum >= 90 && sum < 95) {
              this.awardText = 'Very Good paper'
            } else if (sum >= 80 && sum < 90) {
              this.awardText = 'Good paper'
            }
          // } else if (this.lang == 'th') {
          //   if (sum >= 95) {
          //     this.awardText = 'ยอดเยี่ยม'
          //   } else if (sum >= 90 && sum < 95) {
          //     this.awardText = 'ดีมาก'
          //   } else if (sum >= 80 && sum < 90) {
          //     this.awardText = 'ดี'
          //   }
          // }
        }
      }
    })
  }
  Print() {
    let headers = document.getElementsByClassName('header')
    let outlines = document.getElementsByClassName('outline')
    let asides = document.getElementsByClassName('aside')
    let mains = document.getElementsByClassName('main')
    let prints = document.getElementsByClassName('print')
    let header = headers[0]as HTMLElement
    let outline = outlines[0]as HTMLElement
    let aside = asides[0]as HTMLElement
    let main = mains[0]as HTMLElement
    let print = prints[0]as HTMLElement
    header.style.display = 'none'
    aside.style.display = 'none'
    main.style.width = '100vw'
    print.style.display = 'none'
    window.print()
    header.style.display = 'flex'
    aside.style.display = 'flex'
    main.style.width = 'calc(100vw - 250px)'
    print.style.display = 'flex'
  }
}
