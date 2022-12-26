import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogTodoComponent } from '../dialog-todo/dialog-todo.component';
import { HomepageComponent } from '../homepage/homepage.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private dialog : MatDialog,
    private todo: HomepageComponent) { }

  ngOnInit(): void {
  }

  openDialog() {
    this.dialog.open(DialogTodoComponent, {
      width: '30%'
    }).afterClosed().subscribe(val=>{
      if(val === 'save'){
        this.todo.getAllTodo();
      }
    })
  }

}
