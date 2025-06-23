import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Label } from '@model/Label';
import { environment } from '../../../environments/environment';
import authorizationBearer from '../authorizationBearer/authorizationBearer';

@Injectable()
export class LabelService {
  private http = inject(HttpClient);

  public getLabels(): Observable<Label[]> {
    return this.http.get<Label[]>(`${environment.backend_url}/label/`, {
      headers: {
        Authorization: authorizationBearer(),
        'Content-type': 'application/json'
      }
    });
  }

  public addLabel(label: string): Observable<Label> {
    return this.http.post<Label>(
      `${environment.backend_url}/label/addLabel`,
      { newLabel: label },
      {
        headers: {
          Authorization: authorizationBearer(),
          'Content-type': 'application/json'
        }
      }
    );
  }

  public deleteLabel(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.backend_url}/label/deleteLabel?labelId=${id}`, {
      headers: {
        Authorization: authorizationBearer(),
        'Content-type': 'application/json'
      }
    });
  }
}
