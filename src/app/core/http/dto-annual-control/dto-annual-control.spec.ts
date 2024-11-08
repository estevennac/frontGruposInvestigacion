import { TestBed } from "@angular/core/testing";

import { DtoAnnualControlService } from "./dto-annual-control.service";

describe("DtoAnnualControlService", () =>{
  let service: DtoAnnualControlService;

  beforeEach(() =>{
    TestBed.configureTestingModule({});
    service = TestBed.inject(DtoAnnualControlService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
