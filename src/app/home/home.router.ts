import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
    {
        path: 'home',
        component: HomePage,
        children: [
            {
                path: '',
                loadChildren:() => import('../pages/chats/chats.module').then(m => m.ChatsPageModule)
            },
            {
                path: 'chats',
                loadChildren:() => import('../pages/chats/chats.module').then(m => m.ChatsPageModule)
            },
            {
                path: 'profile',
                loadChildren:() => import('../pages/profile/profile.module').then(m => m.ProfilePageModule)
            },
            {
                path: 'settings',
                loadChildren:() => import('../pages/settings/settings.module').then(m => m.SettingsPageModule)
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRouter {}