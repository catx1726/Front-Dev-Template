import { TestBed } from '@angular/core/testing';

import { LoaderServiceService } from './loader-service.service';

describe('LoaderServiceService', () => {
  let service: LoaderServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoaderServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
