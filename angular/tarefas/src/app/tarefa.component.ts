import { Component } from '@angular/core';

@Component({
  selector: 'tarefa',
  styles: [``],
  template: `
    <form #f="ngForm" (ngSubmit)="envia(f.value)">
    <p>
      <label for="tarefa">Tarefa: </label>
      <input #tf="ngModel" type="text" [(ngModel)]="t.tarefa" id="tarefa" name="tarefa" required>
      <span [hidden]="tf.untouched || tf.valid" style="color:red">A tarefa pe obrigatória</span>
    </p>
    <p>
      <label for="prioridade">Prioridade: </label>
      <select [(ngModel)]="t.prioridade" id="prioridade" name="prioridade" required>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
    </p>
    <p>
      <label for="data">Data: </label>
      <input #td="ngModel" type="date" [(ngModel)]="t.data" id="data" name="data" required>
      <span [hidden]="td.untouched || td.valid" style="color:red">Data inválida</span>
    </p>
    <input type="hidden" [(ngModel)]="preenchedor" name="preenchedor">
    <button type="submit" [disabled]="!f.valid">Enviar</button>
  </form>
  <pre> {{t | json}}</pre>
  `
})

export class TarefaComponent { 
  preenchedor: string = "Yanni";

  t: any = {
    tarefa: '',
    prioridade: 1,
    data: (new Date()).toISOString().slice(0,10)
  }

  envia(dados): void {
    console.log(dados)
  }
}