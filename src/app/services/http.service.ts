import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ErrorService } from './error.service';
import { SwalService } from './swal.service';
import { LoadingService } from './loading.service';
import { ResultModel } from '../models/result.model';
import { apiUrl } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  public isLoading: boolean = false;

  constructor(
    public http: HttpClient,
    private auth: AuthService,
    private error: ErrorService,
    private swal: SwalService,
    private loading: LoadingService
  ) { }

  post<T>(apiUrl: string, body: any, callBack: (res: T) => void, errorCallBack?: (err?:HttpErrorResponse) => void) {
    this.loading.show();
    this.http.post<ResultModel<T>>(`${apiUrl}`, body, {
      headers: {
        "Authorization": "Bearer " + this.auth.token
      }
    }).subscribe({
      next: (res) => {
        if (res.data) {
          callBack(res.data);
          this.loading.hide();
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loading.hide();
        this.error.errorHandler(err);
        if (errorCallBack) {
          errorCallBack(err);
        }
      }
    });
  }

  get<T>(apiUrl: string, callBack: (res: T) => void, errorCallBack?: () => void) {
    this.loading.show();
    this.http.get<ResultModel<T>>(`${apiUrl}`, {
      headers: {
        "Authorization": "Bearer " + this.auth.token
      }
    }).subscribe({
      next: (res) => {
        if (res.data) {
          callBack(res.data);
          this.loading.hide();
        }
      },
      error: (err: HttpErrorResponse) => {
        this.error.errorHandler(err);
        this.loading.hide();
        if (errorCallBack) {
          errorCallBack();
        }
      }
    })
  }

  getTurkeyApi(apiUrl:string, callBack: (res:any) => void){
    this.http.get(`https://api.turkiyeapi.dev/v1/${apiUrl}`, {
    }).subscribe({
      next: (res) => {
        if (res) {
          callBack(res);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.error.errorHandler(err);
      }
    })
  }

  getObservable<T>(url: string) {
    return this.http.get<T>(`${apiUrl}${url}`);
  }

  uploadPost<T>(
    apiUrl: string,
    formData: FormData,
    callBack: (res: T) => void,
    progressCallback: (progressValue: number) => void,
    errorCallBack?: () => void
  ) {
    this.loading.show();

    this.http.post<ResultModel<T>>(`${apiUrl}`, formData, {
      headers: {
        "Authorization": "Bearer " + this.auth.token
      },
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event: any) => {
        // Upload progress
        if (event.type === 1 && event.total) { // HttpEventType.UploadProgress = 1
          const percentDone = Math.round(100 * event.loaded / event.total);
          progressCallback(percentDone);
        }

        // Response geldiğinde
        if (event.type === 4) { // HttpEventType.Response = 4
          if (event.body?.data) {
            callBack(event.body.data);
          }
          progressCallback(100);
          this.loading.hide();
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loading.hide();
        this.error.errorHandler(err);
        if (errorCallBack) errorCallBack();
      }
    });
  }

  downloadFile(apiUrl: string, fileName: string, fileType: string, errorCallBack?: () => void) {
    this.loading.show();

    this.http.get(`${apiUrl}`, {
      headers: { "Authorization": "Bearer " + this.auth.token },
      responseType: 'blob' as 'blob'
    }).subscribe({
      next: (blob: Blob) => {
        // Dosya uzantısını fileName üzerinden belirle
        const extension = fileType;
        let mimeType = 'application/octet-stream';

        switch (extension) {
          case '.pdf': mimeType = 'application/pdf'; break;
          case '.jpg':
          case '.jpeg': mimeType = 'image/jpeg'; break;
          case '.png': mimeType = 'image/png'; break;
          case '.doc': mimeType = 'application/msword'; break;
          case '.docx': mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'; break;
          case '.xls': mimeType = 'application/vnd.ms-excel'; break;
          case '.xlsx': mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'; break;
          case '.zip': mimeType = 'application/zip'; break;
        }

        const downloadBlob = new Blob([blob], { type: mimeType });
        const url = window.URL.createObjectURL(downloadBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        this.loading.hide();
      },
      error: (err: HttpErrorResponse) => {
        this.loading.hide();
        this.swal.callToast("Dosya indirilemedi.", "error");
        if (errorCallBack) errorCallBack();
        this.error.errorHandler(err);
      }
    });
  }
}
