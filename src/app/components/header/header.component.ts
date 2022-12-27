import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { DialogTodoComponent } from '../dialog-todo/dialog-todo.component';
import { HomepageComponent } from '../homepage/homepage.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public user: any = [];
  private userId: string | null = '';

  constructor(private dialog : MatDialog,
    private todo: HomepageComponent,
    private auth: AuthService,
    private userService: UsersService
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  openDialog(): void {
    this.dialog.open(DialogTodoComponent, {
      width: '30%'
    }).afterClosed().subscribe(val=>{
      if(val === 'save'){
        this.todo.getAllTodo();
      }
    })
  }

  getUser() {
    this.userService.getUser().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.user = data[0];
    });
  }

  logOut() {
    this.auth.logOut();
  }

}
