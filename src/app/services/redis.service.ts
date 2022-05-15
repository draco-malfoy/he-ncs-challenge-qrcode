import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UPSTASH_BASE_URL } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class RedisService {

  constructor(private http: HttpClient) { }

  // public save(data: any): Observable<any> {

  //   const url = UPSTASH_BASE_URL + "/SET/challengeids"
  //   return this.http.post(url, {})
  // }
}
