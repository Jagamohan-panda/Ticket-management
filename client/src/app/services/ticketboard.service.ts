import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketboardService {

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `token ${token}`);
  }
  getProjectTickets() {
    const headers=this.getHeaders()
    return this.http.get(`${environment.baseUrl}ticket/`,{headers})
  }
  getMyTickets(id:any){
    const headers=this.getHeaders()
    return this.http.get(`${environment.baseUrl}ticket/?assigne_to=${id}`,{headers})
  }
  chageStatus(id:Number,status:Number){
    const headers=this.getHeaders()
    return this.http.put(`${environment.baseUrl}ticket/${id}/`,{status:status},{headers})
  }
  createTicket(data:any) {
    const headers=this.getHeaders()
    return this.http.post(`${environment.baseUrl}ticket/`,data,{headers})
  }
  updatePriority(ticketId: number, requestData: any): Observable<any>{
    const headers=this.getHeaders()
    return this.http.put(`${environment.baseUrl}ticket/${ticketId}/`,requestData,{headers})
  }
  updateTicket(id:number,data:any) {
    const headers=this.getHeaders()
    delete data.created_time
    delete data.created_by
    console.log(data)
    return this.http.put(`${environment.baseUrl}ticket/${id}/`,data,{headers})
  }
  getDevelopers(){
    const headers=this.getHeaders()
    return this.http.get(`${environment.baseUrl}user/?role=developer`,{headers})
  }
}
