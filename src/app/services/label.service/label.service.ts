import { HttpClient } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { Observable } from "rxjs";
import { Label } from "@model/Label";
import { environment } from "../../../environments/environment";

@Service()
export class LabelService {
  private readonly http = inject(HttpClient);
  private readonly labelUrl = `${environment.backend_url}/label`;

  public getLabels(): Observable<Label[]> {
    return this.http.get<Label[]>(`${this.labelUrl}/`);
  }

  public addLabel(label: string): Observable<Label> {
    return this.http.post<Label>(`${this.labelUrl}/addLabel`, { newLabel: label });
  }

  public deleteLabel(labelId: number): Observable<void> {
    return this.http.delete<void>(`${this.labelUrl}/deleteLabel`, { params: { labelId } });
  }
}
