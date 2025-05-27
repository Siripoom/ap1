import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
  imports: [
    RouterLink,
    NgIf,
  ],
})
export class SideBarComponent implements OnInit {
  // ตัวแปร
  bar:any = 0
  user:any
  // ฟอร์ม

  // เรียกใช้

  // ฟังก์ชัน
  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user')+'')
    let pathName = (window.location.pathname).substring(1,(window.location.pathname).length)
    let loop = setTimeout(() => {
      clearTimeout(loop)
      try {
        let asideSpan = document.getElementById('textNews')as HTMLElement
        switch (pathName) {
          case 'news':
            asideSpan = document.getElementById('textNews')as HTMLElement
            break;
          case 'allPaper':
            asideSpan = document.getElementById('textAllPaper')as HTMLElement
            break;
          case 'myPaper':
            asideSpan = document.getElementById('textMyPaper')as HTMLElement
            break;
          case 'paper':
            asideSpan = document.getElementById('textMyPaper')as HTMLElement
            break;
          case 'certificate':
            asideSpan = document.getElementById('textMyPaper')as HTMLElement
            break;
          case 'sended':
            asideSpan = document.getElementById('textSended')as HTMLElement
            break;
          case 'grade':
            asideSpan = document.getElementById('textSended')as HTMLElement
            break;
          case 'award':
            asideSpan = document.getElementById('textAward')as HTMLElement
            break;
          case 'contact':
            asideSpan = document.getElementById('textContext')as HTMLElement
            break;
          case 'user':
            asideSpan = document.getElementById('textUser')as HTMLElement
            break;
          case 'manageWelcome':
            asideSpan = document.getElementById('textManageWelcome')as HTMLElement
            break;
          case 'contactMassage':
            asideSpan = document.getElementById('textEmail')as HTMLElement
            break;
        }
        asideSpan.style.color = '#ff9000'
      } catch (error) {
      }
    }, 100);
  }
  Switch() {
    let sidebarBox = document.getElementById('sidebarBox')as HTMLElement
    let textNews = document.getElementById('textNews')as HTMLElement
    let textAllPaper = document.getElementById('textAllPaper')as HTMLElement
    let textMyPaper = document.getElementById('textMyPaper')as HTMLElement
    let textAward = document.getElementById('textAward')as HTMLElement
    let textContext = document.getElementById('textContext')as HTMLElement
    let textEmail = document.getElementById('textEmail')as HTMLElement
    let switchSidebar = document.getElementById('switchSidebar')as HTMLElement
    let showRole = document.getElementById('showRole')as HTMLElement
    let menus = document.getElementsByClassName('menu')
    let icons = document.getElementsByClassName('icon')
    try {
      let textSended = document.getElementById('textSended')as HTMLElement
      switch (this.bar) {
        case 0:
          textSended.style.display = 'none'
          break;
        case 1:
          textSended.style.display = 'flex'
          break;
      }
    } catch (error) {
      
    }
    try {
      let textUser = document.getElementById('textUser')as HTMLElement
      switch (this.bar) {
        case 0:
          textUser.style.display = 'none'
          break;
        case 1:
          textUser.style.display = 'flex'
          break
      }
    } catch (error) {
      
    }
    switch (this.bar) {
      case 0:
        this.bar = 1
        sidebarBox.style.borderRadius = '20px'
        sidebarBox.style.marginTop = '30px'
        sidebarBox.style.marginBottom = '30px'
        sidebarBox.style.height = 'calc(100vh - 191px)'
        sidebarBox.style.marginLeft = '-190px'
        sidebarBox.style.background = '#011b53'
        switchSidebar.style.color = 'white'
        switchSidebar.style.background = '#011b53'
        showRole.style.display = 'none'
        for (let index = 0; index < menus.length; index++) {
          let menu = menus[index]as HTMLElement
          menu.style.padding = 'unset'
          menu.style.marginLeft = '20px'
          menu.style.justifyContent = 'center'
          menu.style.alignItems = 'center'
        }
        for (let index = 0; index < icons.length; index++) {
          let icon = icons[index]as HTMLElement
          icon.style.color = 'white'
        }
        let loopA01 = setTimeout(() => {
          clearTimeout(loopA01)
          sidebarBox.style.width = '60px'
          sidebarBox.style.marginLeft = '0px'
          textNews.style.display = 'none'
          textAllPaper.style.display = 'none'
          textMyPaper.style.display = 'none'
          textAward.style.display = 'none'
          textContext.style.display = 'none'
          textEmail.style.display = 'none'
        }, 500);
        break;
      case 1:
        this.bar = 0
        sidebarBox.style.borderRadius = '0px'
        sidebarBox.style.marginTop = '0px'
        sidebarBox.style.marginBottom = '0px'
        sidebarBox.style.height = 'calc(100vh - 131px)'
        sidebarBox.style.width = '250px'
        sidebarBox.style.marginLeft = '0px'
        sidebarBox.style.background = 'white'
        switchSidebar.style.color = '#011b53'
        switchSidebar.style.background = 'white'
        showRole.style.display = 'flex'
        for (let index = 0; index < menus.length; index++) {
          let menu = menus[index]as HTMLElement
          menu.style.padding = '5px 0px 5px 40px'
          menu.style.marginLeft = '0px'
          menu.style.justifyContent = 'start'
          menu.style.alignItems = 'center'
        }
        for (let index = 0; index < icons.length; index++) {
          let icon = icons[index]as HTMLElement
          icon.style.color = '#011b53'
        }
        let loopB01 = setTimeout(() => {
          clearTimeout(loopB01)
          textNews.style.display = 'flex'
          textAllPaper.style.display = 'flex'
          textMyPaper.style.display = 'flex'
          textAward.style.display = 'flex'
          textContext.style.display = 'flex'
          textEmail.style.display = 'flex'
        }, 500);
        break;
    }
  }
}
