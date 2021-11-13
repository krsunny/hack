import { Component, Directive, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { compare, NgbdSortableHeader, SortEvent } from 'src/app/utils/sort-table.util';


interface Hack {
  id: number;
  createdBy: string;
  createdOn: Date;
  title: string;
  description: string;
  tags: string;
  upVote: [];
}

const HackArray: any[] = [];



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userId;
  userType;
  title = '';
  desc = '';
  tag = '';
  hackArray = HackArray;

  // @ViewChildren(NgbdSortableHeader)headers: QueryList<NgbdSortableHeader> | undefined;

  constructor(private modalService: NgbModal,
    public authenticationService: AuthenticationService,
    private router: Router,
  ) {

    if (!authenticationService.getLoggedInUserDetails()) {
      router.navigate(['login'])
    } else {
      this.userId = authenticationService.getLoggedInUserDetails().username;
      this.userType = authenticationService.getLoggedInUserDetails().type;
    }

  }
  closeResult = '';

  ngOnInit(): void {
    console.log(this.userId, this.userType);
    this.hackArray = JSON.parse(localStorage.getItem('hackideas') as any);
  }



  

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      console.log(this.closeResult);
      if (result == 'Save click') {
        console.log(this.title);
        console.log(this.tag);


        var hacks = {
          id: 1,
          createdBy: this.userId,
          createdOn: new Date,
          title: this.title,
          description: this.desc,
          tags: this.tag,
          upVote: [],
          // downVote: []
        }

        if (localStorage.getItem('hackideas')) {
          // console.log();
          var prevData = JSON.parse(localStorage.getItem('hackideas') as any);
          hacks.id = prevData[prevData.length - 1].id + 1;
          prevData.push(hacks);
          console.log(prevData);
          localStorage.setItem('hackideas', JSON.stringify(prevData));

          // localStorage.setItem('hackideas',JSON.stringify(JSON.parse(localStorage.getItem('hackideas') as any).push(hacks)))
        } else {
          localStorage.setItem('hackideas', JSON.stringify([hacks]))
        }

        this.hackArray = JSON.parse(localStorage.getItem('hackideas') as any);

      }

      this.title = '';
      this.tag = '';
      this.desc = '';

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log(this.closeResult);

    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  logout() {
    localStorage.removeItem('currentUser')
    this.router.navigate(['login']);
  }

  upvoteclass(id: any) {

    var prevData = JSON.parse(localStorage.getItem('hackideas') as any);

    var classToappend = "like-unclicked";

    prevData.map((i: any) => {
      if (i.id == id) {
        if (i.upVote.includes(this.userId)) {
          classToappend = 'like-clicked';
        } else {
          classToappend = 'like-unclicked';
        }
      }
    })

    return classToappend;
    // }
    // else{
    //   return 'like-unclicked';
    // }
  }
  upVote(id: any) {
    var prevData = JSON.parse(localStorage.getItem('hackideas') as any);
    prevData.map((i: any) => {
      console.log(i);

      if (i.id == id) {
        if (i.upVote.includes(this.userId)) {
          var index = i.upVote.indexOf(this.userId);
          if (index !== -1) {
            i.upVote.splice(index, 1);
            // localStorage.setItem('hackideas', JSON.stringify(prevData));          
          }
        } else {
          i.upVote.push(this.userId);
          // localStorage.setItem('hackideas', JSON.stringify(prevData));          
        }
      }
    })
    localStorage.setItem('hackideas', JSON.stringify(prevData));
    this.updateHackArray();
  }

  updateHackArray() {
    this.hackArray = JSON.parse(localStorage.getItem('hackideas') as any);
  }

  getAllLiked(id: any) {
    var prevData = JSON.parse(localStorage.getItem('hackideas') as any);
    let upvotes = ['1']
    upvotes.pop();
    prevData.map((i: any) => {

      if (i.id == id) {
        var users = this.authenticationService.users;
        users.map((k: any) => {
          if (i.upVote.includes(k.username)) {
            upvotes.push(k.firstName + " " + k.lastName)
          }
        })
      }
    })
    return upvotes;

  }

  @ViewChildren(NgbdSortableHeader)
  headers!: QueryList<NgbdSortableHeader>;

  onSort({column, direction}: SortEvent) {

    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // sorting countries
    if (direction === '') {
      this.hackArray = this.hackArray;
    } else {
      this.hackArray = [...this.hackArray].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

}
