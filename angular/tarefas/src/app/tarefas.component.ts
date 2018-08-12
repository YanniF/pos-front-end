import { Component } from '@angular/core';
import { Tarefa, TarefasService } from './tarefas.service';
import { Projeto, ProjetosService } from './projetos.service';

@Component({
  selector: 'tarefas',
  template: `
    <h2>Tarefas</h2>
    <ul>
      <li *ngFor="let t of tarefas"><a routerLink="/tarefas/{{t.codigo}}">{{t.tarefa}}</a> ({{t.prioridade}}) - {{t.data | date: 'dd/MM'}} - projeto: {{nomeProjeto(t.codigoProjeto)}}</li>
    </ul>
    <p *ngIf="tarefas.length == 0">Parabéns, você concluiu todas as suas tarefas.</p>
  `
})

export class TarefasComponent { 
  
  tarefas: Tarefa[] = [];
  projetos: Projeto[] = [];

  constructor(public ts: TarefasService, public ps: ProjetosService) {
    this.tarefas = ts.getTarefas();
    this.projetos = ps.getProjetos();
  }

  nomeProjeto(cp: number): string {
    for(let i = 0; i < this.projetos.length; i++) {
      if(this.projetos[i].codigo == cp)
        return this.projetos[i].projeto;
    }
    return 'Projeto inválido';
  }
}