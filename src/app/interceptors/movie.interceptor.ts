import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class MovieInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.url.includes('https://api.themoviedb.org')) {
      request = request.clone({
        params: request.params.set('api_key', environment.movieApiKey),
      });
    } else {
      request = request.clone({
        headers: request.headers.set('x-apikey', environment.restDbApiKey),
      });
    }

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (request.url.includes('discover/movie')) {
            event = event.clone({ body: event.body.results });
          } else if (request.url.includes('genre/movie/list')) {
            event = event.clone({ body: event.body.genres });
          }
        }
        return event;
      })
    );
  }
}
