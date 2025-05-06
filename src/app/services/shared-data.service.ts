import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private dataSource = new BehaviorSubject<any>(null);

  setData(data: any) {
    this.dataSource.next(data);
  }

  getData() {
    return this.dataSource.asObservable();
  }

  getSnapshot() {
    return this.dataSource.getValue();
  }
}
