import { Component } from '@angular/core';
import { Projeto, ProjetosService } from './projetos.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'projeto',
  templateUrl: 'projeto.component.html',
  styleUrls: [ 'tarefa.component.css' ]
})

export class ProjetoComponent { 
  projeto: Projeto;

  constructor(public ps: ProjetosService, public rs: ActivatedRoute) {
    const id = +this.rs.snapshot.paramMap.get('id');
    this.projeto = this.ps.getProjeto(id);
  }
}