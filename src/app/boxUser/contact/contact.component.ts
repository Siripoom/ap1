import { Component } from '@angular/core';
import { HeaderComponent } from "../../boxNav/header/header.component";
import { SideBarComponent } from "../../boxNav/side-bar/side-bar.component";
import { OnlyContactComponent } from "./only-contact/only-contact.component";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
  imports: [
    HeaderComponent,
    SideBarComponent,
    OnlyContactComponent
],
})
export class ContactComponent {

}
