import { Injectable } from "@angular/core";

export class Tarefa {
  codigo: number;
  tarefa: string;
  data: Date;
  prioridade: number;
  codigoProjeto: number;
}

@Injectable()
export class TarefasService {
  tarefas: Tarefa[] = [
    {
      codigo: 1,
      tarefa: 'Estudar',
      data: new Date(2018, 7, 11),
      prioridade: 1,
      codigoProjeto: 1 
    },
    {
      codigo: 2,
      tarefa: 'Ficar rica',
      data: new Date(2018, 10, 30),
      prioridade: 2,
      codigoProjeto: 1 
    },
    {
      codigo: 3,
      tarefa: 'Viajar',
      data: new Date(2018, 9, 15),
      prioridade: 3,
      codigoProjeto: 1 
    },
    {
      codigo: 4,
      tarefa: 'Fazer um site bem bonito',
      data: new Date(2018, 7, 25),
      prioridade: 2,
      codigoProjeto: 2 
    },
    {
      codigo: 5,
      tarefa: 'Fazer uma dancinha',
      data: new Date(2018, 8, 27),
      prioridade: 3,
      codigoProjeto: 2
    }
  ];

  getTarefas(): Tarefa[] {
    return this.tarefas;
  }

  getTarefa(n: number) {
    for(let i = 0; i < this.tarefas.length; i++) {
      if(this.tarefas[i].codigo == n)
        return this.tarefas[i];
    }
    return null;
  }
}