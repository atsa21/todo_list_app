import { Component, OnInit, ViewChild} from '@angular/core';
import { DialogTodoComponent } from '../dialog-todo/dialog-todo.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from 'src/app/services/api.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

export interface todoList {
  category: string;
  taskTitle: string;
  taskDescription: string;
  action: any;
  checked: false;
}

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  displayedColumns: string[] = [ 'checked', 'category', 'taskTitle', 'taskDescription', 'action'];
  dataSource!: MatTableDataSource<todoList>;

  numberOfTodo: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor( private dialog : MatDialog,
    private api : ApiService,
    private snackbar : SnackBarService){}

  ngOnInit(): void {
    this.getAllTodo();
  }
  
  openDialog() {
    this.dialog.open(DialogTodoComponent, {
      width: '30%'
    }).afterClosed().subscribe(val=>{
      if(val === 'save'){
        this.getAllTodo();
      }
    })
  }

  getAllTodo(){
    this.api.getTodo()
    .subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.numberOfTodo = this.dataSource.data.length;
      },
      error:(err)=>{
        this.snackbar.openSnackBar('Error while getting the todo', 'Close');
      }
    })
  }

  editTodo(row : any){
    this.dialog.open(DialogTodoComponent, {
      width: '30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val === 'update'){
        this.getAllTodo();
      }
    })
  }

  checkTodo(row: any, id : number){
    if (row.checked == false) {
      row.checked = true;
      this.api.putTodo(row, id)
      .subscribe({
        next:(res)=>{
          this.getAllTodo();
        }
      })
    } else if (row.checked == true) {
      row.checked = false;
      this.api.putTodo(row, id)
      .subscribe({
        next:(res)=>{
          this.getAllTodo();
        }
      })
    }
  }

  deleteTodo(id: number){
    this.api.deleteTodo(id)
    .subscribe({
      next:(res)=>{
        this.getAllTodo();
      },
      error:()=>{
        this.snackbar.openSnackBar('Error while deleting the todo', 'Close');
      }
    })
  }

  search(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
