import { BehaviorSubject } from 'rxjs';
import {redirect} from 'next/navigation';
import { authRoutes } from '@/route/backend';
import { authRoutes as localAuthRoutes } from '@/route/local';

import { fetchWrapper } from '@/helper/fetch-wrapper';

import { alertService } from '@/service/alert.service';

const userSubject = new BehaviorSubject<StoredUser|undefined>(
    typeof window !== 'undefined' && JSON.parse(localStorage.getItem('user') || '{}')
);

export type StoredUser = {
    token: string;
}

export interface UserCreator {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface UserUpdater {
    username?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
}

export const userService = {
    user: userSubject.asObservable(),
    get userValue() { return userSubject.value },
    login,
    logout,
    register,
    get,
    update,
    delete: _delete
};

async function login(username : string, password : string) : Promise<void> {
    const user = await fetchWrapper.backend.post(authRoutes.login, { username, password });

    // publish user to subscribers and store in local storage to stay logged in between page refreshes
    userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
}

function logout() {
    alertService.clear();
    // remove user from local storage, publish null to user subscribers and redirect to login page
    localStorage.removeItem('user');
    userSubject.next(undefined);
    redirect(localAuthRoutes.login);
}

async function register(user : UserCreator) : Promise<void> {
    await fetchWrapper.backend.post( authRoutes.register, user);
}

async function get() : Promise<void> {
    return await fetchWrapper.backend.get(authRoutes.me);
}

async function update(params: UserUpdater) : Promise<void> {
    const user = await fetchWrapper.backend.put(authRoutes.update, params)

    // TODO update user information in storage
}

async function _delete() : Promise<void> {
    await fetchWrapper.backend.delete(authRoutes.delete);

    logout();
}