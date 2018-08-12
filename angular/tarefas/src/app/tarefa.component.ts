import { Component } from '@angular/core';
import { Tarefa, TarefasService } from './tarefas.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'tarefa',
  templateUrl: 'tarefa.component.html',
  styleUrls: [ 'tarefa.component.css' ]
})

export class TarefaComponent { 
  tarefa: Tarefa;

  constructor(public ts: TarefasService, public rs: ActivatedRoute) {
    const id = +this.rs.snapshot.paramMap.get('id');
    this.tarefa = this.ts.getTarefa(id);
  }
}