import { Injectable } from '@angular/core';
import { SwalService } from './swal.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(
    private swal: SwalService
  ) { }

  errorHandler(err: HttpErrorResponse) {
    console.log(err);
    if (err.status === 403) {
      let errorMessage = "";
      for (const e of err.error.ErrorMessages) {
        errorMessage += e + "\n";
      }
      this.swal.callToast(errorMessage, "error");
    } else if (err.status === 500) {
      this.swal.callToast(err.error.errorMessages[0], "error");
    } else if (err.status === 400) {
      let errorMessage = "";
      const validationErrors = err.error.errors;
      if (validationErrors) {
        for (const key in validationErrors) {
          if (validationErrors.hasOwnProperty(key)) {
            errorMessage += validationErrors[key].join("\n") + "\n";
          }
        }
      } else {
        errorMessage = err.error.title || "Validation error occurred.";
      }
      this.swal.callToast(errorMessage, "error");
    } else if (err.status === 401) {
      this.swal.callToast(err.error.errorMessages[0], "error");
    } else if (err.status === 402) {
      this.swal.callToast(err.error.errorMessages[0], "error");
    } else if (err.status === 404) {
      let errorMessage = "";
      for (const e of err.error.ErrorMessages) {
        errorMessage += e + "\n";
      }
      this.swal.callToast(errorMessage, "error");
    }
  }
}
