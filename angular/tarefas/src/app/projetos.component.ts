import { Component } from '@angular/core';
import { Projeto, ProjetosService } from './projetos.service';

@Component({
  selector: 'projetos',
  template:`
    <h2>Projetos</h2>
    <ul>
      <li *ngFor="let p of projetos">{{p.codigo}} - <a routerLink="/projetos/{{p.codigo}}">{{p.projeto}}</a></li>
    </ul>  
  `
})

export class ProjetosComponent {
  projetos: Projeto[] = [];

  constructor(public ps: ProjetosService) {
    this.projetos = ps.getProjetos();
  }
}