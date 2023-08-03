import { BehaviorSubject } from 'rxjs';

interface Alert {
    type: 'alert-success' | 'alert-danger';
    message: string;
    showAfterRedirect: boolean;
}

const alertSubject = new BehaviorSubject<Alert|null>(null);

export const alertService = {
    alert: alertSubject.asObservable(),
    success,
    error,
    clear,
};

function success(message : string, showAfterRedirect : boolean = false) : void {
    alertSubject.next({
        type: 'alert-success',
        message,
        showAfterRedirect
    });
}

function error(message : string, showAfterRedirect : boolean = false) : void {
    alertSubject.next({
        type: 'alert-danger',
        message,
        showAfterRedirect
    });
}

// clear alerts
function clear() : void {
    // if showAfterRedirect flag is true the alert is not cleared
    // for one route change (e.g. after successful registration)
    let alert : Alert|null = alertSubject.value;
    if (alert?.showAfterRedirect) {
        alert.showAfterRedirect = false;
    } else {
        alert = null;
    }
    alertSubject.next(alert);
}