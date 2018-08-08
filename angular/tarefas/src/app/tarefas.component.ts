import { Component } from '@angular/core';

@Component({
  selector: 'tarefas',
  template: `
    <ul>
      <!--<li *ngFor="let tarefa of tarefas; index as i">{{i + 1}} - {{tarefa}}</li>-->
      <li *ngFor="let tarefa of tarefas">{{tarefa}}</li>
    </ul>
    <p *ngIf="tarefas.length == 0">Parabéns, você concluiu todas as suas tarefas.</p>
  `
})

export class TarefasComponent { 
  tarefas: string[];

  constructor() {
    this.tarefas = [
      'Estudar',
      'Ficar rica',
      'Viajar'
    ];
  }
}