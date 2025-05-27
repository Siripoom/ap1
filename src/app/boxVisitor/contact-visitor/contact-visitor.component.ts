import { Component } from '@angular/core';
import { HeaderVisitorComponent } from "../../boxNav/header-visitor/header-visitor.component";
import { OnlyContactComponent } from "../../boxUser/contact/only-contact/only-contact.component";

@Component({
  selector: 'app-contact-visitor',
  templateUrl: './contact-visitor.component.html',
  styleUrl: './contact-visitor.component.css',
  imports: [
    HeaderVisitorComponent,
    OnlyContactComponent
],
})
export class ContactVisitorComponent {

}
