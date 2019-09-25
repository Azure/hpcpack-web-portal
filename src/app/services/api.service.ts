import { Injectable, Optional, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DefaultService, BASE_PATH, Configuration } from '../api-client'

export * from '../api-client'

@Injectable({
  providedIn: 'root'
})
export class ApiService extends DefaultService {

  constructor(
    httpClient: HttpClient,
    @Optional() @Inject(BASE_PATH) basePath: string,
    @Optional() configuration: Configuration
  ) {
    super(httpClient, basePath, configuration);
  }
}
