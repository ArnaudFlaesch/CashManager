import { HttpClient } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "@environments/environment";
import { Label } from "./label";

@Service()
export class LabelApi {
  private readonly http = inject(HttpClient);
  private readonly labelUrl = `${environment.backendUrl}/labels`;

  public getLabels(): Observable<Label[]> {
    return this.http.get<Label[]>(this.labelUrl);
  }

  public addLabel(label: string): Observable<Label> {
    return this.http.post<Label>(this.labelUrl, { newLabel: label });
  }

  /** The backend answers with an empty body, that HttpClient returns as null. */
  public deleteLabel(labelId: number): Observable<null> {
    return this.http.delete<null>(`${this.labelUrl}/${labelId}`);
  }
}
