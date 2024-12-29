import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { catchError, switchMap, throwError } from "rxjs";
import { Router } from "@angular/router";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
    const authService = inject(AuthService);

    if(
        req.url.includes('/login') ||
        req.url.includes('/register') || 
        req.url.includes('/refresh')
    ) {
        return next(req);
    }

    if(authService.isAuthenticated()) {
        const token = sessionStorage.getItem('accessToken');
        req = addToken(req, token!!);
    }

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if(error.status === 401) {
                return handle401Error(req, next);
            }
            return throwError(() => error);
        })
    )
}

function addToken(req: HttpRequest<unknown>, token: string) {
    return req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`,
        }
    });
}

function handle401Error(req: HttpRequest<unknown>, next: HttpHandlerFn) {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.refreshToken().pipe(
        switchMap((token: string) => {
            sessionStorage.setItem('accessToken', token);
            return next(addToken(req, token));
        }),
        catchError(err => {
            authService.logout();
            router.navigate(['login']);
            return throwError(() => err);
        })
    );
}