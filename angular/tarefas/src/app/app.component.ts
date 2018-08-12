import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  styles: [`
    nav a {
      padding: 5px;
      margin: 5px;
      border: 1px solid black;
      text-decoration: none;
    }
    .ativo {
      background-color: #696;
      color: #fff;
    }
  `],
  template: `
    <h1>Gestão de Tarefas</h1>
    <nav>
      <a routerLink="/tarefas" routerLinkActive="ativo">Tarefas</a>
      <a routerLink="/projetos" routerLinkActive="ativo">Projetos</a>
    </nav>
    <router-outlet></router-outlet>
    <copyright></copyright>
  `
})
export class AppComponent {
  
}
