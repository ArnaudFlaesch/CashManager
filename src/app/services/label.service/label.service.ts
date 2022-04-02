import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ILabel } from '../../model/ILabel';
import { environment } from '../../../environments/environment';
import authorizationBearer from '../authorizationBearer/authorizationBearer';

@Injectable()
export class LabelService {
  constructor(private http: HttpClient) {}

  public getLabels(): Observable<ILabel[]> {
    return this.http.get<ILabel[]>(`${environment.backend_url}/label/`, {
      headers: {
        Authorization: authorizationBearer(),
        'Content-type': 'application/json'
      }
    });
  }

  public addLabel(label: string): Observable<ILabel> {
    return this.http.post<ILabel>(
      `${environment.backend_url}/label/addLabel`,
      { label: label },
      {
        headers: {
          Authorization: authorizationBearer(),
          'Content-type': 'application/json'
        }
      }
    );
  }

  public deleteLabel(id: number): Observable<void> {
    return this.http.delete<void>(
      `${environment.backend_url}/label/deleteLabel/?id=${id}`,
      {
        headers: {
          Authorization: authorizationBearer(),
          'Content-type': 'application/json'
        }
      }
    );
  }
}
