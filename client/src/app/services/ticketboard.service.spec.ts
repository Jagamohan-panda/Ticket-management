import { TestBed } from '@angular/core/testing';

import { TicketboardService } from './ticketboard.service';

describe('TicketboardService', () => {
  let service: TicketboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
