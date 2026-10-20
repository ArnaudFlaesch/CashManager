import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { environment } from "../../../environments/environment";

@Service()
export class ConfigService {
  private readonly http = inject(HttpClient);
  private readonly configUrl = `${environment.backend_url}/cashManagerConfig`;

  public exportConfig(): Observable<Blob> {
    return this.http.get(`${this.configUrl}/export`, { responseType: "blob" });
  }

  public importConfig(file: File): Observable<boolean> {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post<boolean>(`${this.configUrl}/import`, formData);
  }
}
