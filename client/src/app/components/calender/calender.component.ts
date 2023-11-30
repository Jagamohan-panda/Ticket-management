import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { formatIsoTimeString } from '@fullcalendar/core/internal';
import { TicketboardService } from '../../services/ticketboard.service';

@Component({
  selector: 'app-calender',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calender.component.html',
  styleUrl: './calender.component.scss',
})
export class CalenderComponent {
  constructor(private ticketService: TicketboardService) {
    
  }
  loading = false;
  ticketsArray: any[] = [];
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: this.handleDateClick.bind(this),
    events: this.ticketsArray,
    //  [
    //   { title: 'event 1', date: '2023-11-01' },
    //   { title: 'event 2', date: '2023-11-02' }
    // ],
    headerToolbar: {
      left: 'prev today next',
      center: 'title',
      right: '',
    },
    weekends: true,
    dayMaxEvents: true,
    selectable: true,
    editable: true,
    // selectMirror: true,
    // select: function(info) {
    //   alert('selected ' + info.startStr + ' to ' + info.endStr);
    //   console.log("Lipun---")
    // },
  };
  ngOnInt(){
    this.getProjectTickets();
  }
  handleDateClick(arg: any) {
    alert('date click! ' + arg.dateStr);
  }
  getProjectTickets() {
    this.loading = true;
    this.ticketService.getProjectTickets().subscribe((res: any) => {
      this.loading = false;

      const results = res.results.map((ticket: any) => {
        const date = new Date(ticket.created_time);
        ticket.date = date.toISOString().slice(0, 10);
        return {title:ticket.title,date:ticket.date};
      });
      console.log(results);
      this.ticketsArray = results;
    });
  }
}
