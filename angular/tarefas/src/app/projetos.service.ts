import { Injectable } from "@angular/core";

export class Projeto {
  codigo: number;
  projeto: string;
}

@Injectable()
export class ProjetosService {
  projetos: Projeto[] = [
    {codigo: 1, projeto: 'Casa'},
    {codigo: 2, projeto: 'Trabalho'},
  ]

  getProjetos(): Projeto[] {
    return this.projetos;
  }

  getProjeto(n: number) {
    for(let i = 0; i < this.projetos.length; i++) {
      if(this.projetos[i].codigo == n)
        return this.projetos[i];
    }
    return null;
  }
}