import { HttpClient } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "@environments/environment";

@Service()
export class ConfigApi {
  private readonly http = inject(HttpClient);
  private readonly configUrl = `${environment.backendUrl}/cash-manager-config`;

  public exportConfig(): Observable<Blob> {
    return this.http.get(this.configUrl, { responseType: "blob" });
  }

  /** The backend answers 204 No Content, that HttpClient returns as null. */
  public importConfig(file: File): Observable<null> {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post<null>(this.configUrl, formData);
  }
}
