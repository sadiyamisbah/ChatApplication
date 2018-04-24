import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  @Input() userFirstName: string;
  @Input() userLastName: string;
  @Input() userStatus: string;
  @Input() messageRead ?: number;
  public firstChar: string;
  constructor() { }

  ngOnInit(): void {

    this.firstChar = this.userFirstName[0];

  } // end ngOnInit


}
