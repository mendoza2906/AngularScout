import { APP_CONFIG } from '../../config/app-config';
import {Injectable} from '@angular/core';
import {HttpClient, HttpRequest, HttpEvent} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FileService {

  constructor(private http: HttpClient) {}

  pushFileToStorage(file: File): Observable<any> {
    const uploadData: FormData = new FormData();
    uploadData.append('file', file, file.name);
    return this.http.post(APP_CONFIG.restUrl + '/files/uploadFile', uploadData, {
      reportProgress: true, observe: 'events'
    });
  }

  download(url: string): Observable<Blob> {
    return this.http.get(url, {responseType: 'blob'});
  }

}
