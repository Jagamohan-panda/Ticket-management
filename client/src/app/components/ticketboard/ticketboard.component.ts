import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketboardService } from '../../services/ticketboard.service';
import { HttpClient } from '@angular/common/http';
import { environment, localUser } from '../../../enviroment';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-ticketboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './ticketboard.component.html',
  styleUrl: './ticketboard.component.scss',
})
export class TicketboardComponent {
  ticketsArray: any[] = [];
  selectedTicket: any;
  status: string[] = ['Todo', 'In Progress', 'Done'];
  userRole: string = '';
  loading = false;
  displayStyle = 'none';
  editDisplayStyle = 'none';
  editForm = false;
  assignee = '';
  priority_status = '';
  edit_ticket:any={}
  priorities = [
    { value: 1, label: 'Low' },
    { value: 2, label: 'Medium' },
    { value: 3, label: 'High' },
  ];
  developers: any[] = [];
  logged_user = '';
  ticketsForYou: any[] = [];
  ticketForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    status: new FormControl(1),
    created_by: new FormControl(localUser().user.user_id),
    assigned_to: new FormControl('', Validators.required),
    priority: new FormControl(2),
  });
  ticketFormEdit: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    status: new FormControl(1),
    created_by: new FormControl(localUser().user.user_id),
    assigned_to: new FormControl('', Validators.required),
    priority: new FormControl(2),
    created_time: new FormControl(''),
  });
  constructor(private ticketService: TicketboardService) {
    this.getProjectTickets();
    this.getDevelopers();
    const user = localUser().user;
    this.userRole = user.role;
    this.logged_user = user.user_id;
    if (user) {
      this.userRole = user.role;
    }
  }
  getProjectTickets() {
    this.loading = true;
    this.ticketService.getProjectTickets().subscribe((res: any) => {
      this.loading = false;
      this.ticketsArray = res.results;
      this.ticketsForYou = this.filterTicketForYou(res.results);
    });
  }
  getDevelopers() {
    this.ticketService.getDevelopers().subscribe((res: any) => {
      this.developers = res.results;
    });
  }

  filterTicket(status: string) {
    return this.ticketsArray.filter((m) => m.status == status);
  }
  filterTicketForYou(data: any) {
    return data.filter((m: any) => m.assigned_to.id == this.logged_user);
  }
  allowDrop(e: any) {
    e.preventDefault();
  }

  drag(e: any, ticket: any) {
    this.selectedTicket = ticket;
    // console.log("drag event--",e.target)
  }

  drop(e: any, status: string) {
    e.preventDefault();
    // console.log("drop event--",e.target)
    this.loading = true;
    const selectedTicketIndex = this.ticketsArray.findIndex(
      (ticket) => ticket.id === this.selectedTicket.id
    );
    const newStatus = this.status.indexOf(status) + 1;
    if (selectedTicketIndex !== -1) {
      
      if (
        this.selectedTicket.assigned_to.id == this.logged_user ||
        this.userRole == 'M'
      ) {
        this.ticketService
          .chageStatus(this.selectedTicket.id, newStatus)
          .subscribe(
            (res: any) => {
              this.loading = false;
              this.ticketsArray[selectedTicketIndex].status = status;
            },
            (error) => {
              this.loading = false;
              alert(error.detail);
              console.error('Error fetching subjects:', error);
            }
          );
      } else {
        alert("You're not allowed to edit this ticket !");
        this.loading = false;
      }
    } else {
      console.error('Selected ticket not found in the ticketsArray.');
    }
  }
  openPopup() {
    this.displayStyle = 'block';
  }
  closePopup() {
    this.displayStyle = 'none';
  }
  ticketSubmit() {
    this.loading = true;
    this.ticketService.createTicket(this.ticketForm.value).subscribe(
      (res: any) => {
        this.loading = false;
        this.getProjectTickets();
        this.closePopup();
      },
      (error) => {
        this.loading = false;
        console.error('Error fetching subjects:', error);
      }
    );
  }

  handleView(ticket: any) {
    const prio = this.priorities.filter(
      (prio: any) => prio.label == ticket.priority
    );
    const status=ticket.status=="Todo"?1:ticket.status=="Done"?3:2
    this.edit_ticket=ticket
    this.ticketFormEdit = new FormGroup({
      title: new FormControl(ticket.title),
      description: new FormControl(ticket.description),
      status: new FormControl(status),
      created_by: new FormControl(
        ticket.created_by.first_name + ticket.created_by.last_name
      ),
      assigned_to: new FormControl(ticket.assigned_to.id),
      priority: new FormControl(prio[0].value),
      created_time: new FormControl(ticket.created_time),
    });
    this.assignee = `${ticket.assigned_to.first_name} ${ticket.assigned_to.last_name}`;
    this.priority_status = ticket.priority;
    this.editTicketOpenPopup();
  }
  editTicketOpenPopup() {
    this.editDisplayStyle = 'block';
  }
  editFormPopupClose() {
    this.editDisplayStyle = 'none';
    this.editForm = false;
  }
  handleEditSubmit() {
    if (this.editForm) {
      console.log('submit', this.ticketFormEdit.value);
      this.ticketService.updateTicket(this.edit_ticket.id,this.ticketFormEdit.value).subscribe(
        (res: any) => {
          this.loading = false;
          this.getProjectTickets();
          this.closePopup();
        },
        (error:any) => {
          this.loading = false;
          console.error('Error fetching subjects:', error);
        }
      );
    }
    
    if (
      
      this.edit_ticket.assigned_to.id == this.logged_user ||
      this.userRole == 'M'
    ) {
      this.editForm = true;
    } else {
      alert("You're not allowed to edit this ticket !");
    }
  }
}
