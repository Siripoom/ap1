import { Component } from '@angular/core';
import { HeaderVisitorComponent } from "../../boxNav/header-visitor/header-visitor.component";
import { CFP } from "../cfp-noheader/call-for-paper.component";

@Component({
  selector: 'app-call-for-paper',
  templateUrl: './call-for-paper.component.html',
  styleUrl: './call-for-paper.component.css',
  imports: [
    CFP,
    HeaderVisitorComponent
],
})
export class CallForPaperComponent {

}
