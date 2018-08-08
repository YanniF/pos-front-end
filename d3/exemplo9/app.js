function GraficoDeColunas(parametros) {
  // seleciona o elemento SVG
  const svg = d3.select(parametros.seletor).attr('width', parametros.largura).attr('height', parametros.altura);

  // define as margens da área de plotagem e calcula suas larguras e alturas
  const margem = {
    esquerda: 70,
    direita: 20,
    superior: 40,
    inferior: 100
  }  
  this.larguraPlotagem = parametros.largura - margem.esquerda - margem.direita;
  this.alturaPlotagem = parametros.altura - margem.superior - margem.inferior;

  // cria uma nova área de plotagem
  svg.select('#plotagem').remove(); // remove a área de plotagem atual, se existir
  this.plotagem = svg.append('g')
      .attr('id', 'plotagem')
      .attr('width', this.larguraPlotagem)
      .attr('heigth', this.alturaPlotagem)
      .attr('transform', `translate(${margem.esquerda}, ${margem.superior})`);

  // cria as escolas horizontal, vertical e de cores
  this.x = d3.scaleBand().range([0, this.larguraPlotagem]).padding(.1);
  this.y = d3.scaleLinear().range([this.alturaPlotagem, 0]);
  this.cores = d3.scaleOrdinal().range(d3.schemeCategory10);

  // prepara as linhas de grade
  this.grade = d3.axisRight(this.y).tickSize(this.larguraPlotagem).tickFormat('');
  this.plotagem.append('g').attr('id', 'grade');

  // prepara os eixos X e Y
  this.eixoX = d3.axisBottom(this.x);
  this.plotagem.append('g')
      .attr('transform', 'translate(0, ' + this.alturaPlotagem + ')')
      .attr('id', 'eixoX');

  this.eixoY = d3.axisLeft(this.y);
  this.plotagem.append('g').attr('id', 'eixoY');

  // cria os títulos do eixos
  this.plotagem.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('transform', 'translate(-40, ' + this.alturaPlotagem / 2 + ') rotate(-90)')
      .text(parametros.tituloY)
      .classed('titulo-eixo', true);

  this.plotagem.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('transform', 'translate(' + this.larguraPlotagem / 2 + ', ' + (this.alturaPlotagem + 80) + ')')
      .text(parametros.tituloX)
      .classed('titulo-eixo', true);

  this.callback = parametros.callback;

  // função para atualizar os dados do gráfico
  this.atualiza = dados => {

    // atualiza as escalas de acordo com os novos dados
    this.x.domain(dados.map(d => d.chave));
    this.y.domain([0,d3.max(dados.map(d => d.valor))]);
    this.cores.domain(dados.map(d=>d.chave));

    // cria os elementos SVG dos eixos e das linhas da grade
    this.plotagem.select('#eixoX').transition().duration(this.duracaoAnimacao).call(this.eixoX);
    this.plotagem.select('#eixoY').transition().duration(this.duracaoAnimacao).call(this.eixoY);
    this.plotagem.select('#grade').transition().duration(this.duracaoAnimacao).call(this.grade);

    // ajusta a quantidade de retângulos aos dados, criando ou removendo os retângulos necessários
    const retangulos = this.plotagem.selectAll('.barra').data(dados);
    const self = this;

    retangulos.enter()
      .append('rect')
      .on('mouseover', function(d) {
        d3.select(this).style('fill', function(d){ return d3.rgb(self.cores(d.chave)).darker(.7); })
      })
      .on('mouseout', function(d) {
        d3.select(this).style('fill', self.cores(d.chave))
      })
      .on('click', function(d) {
        self.callback(d)
      })
      .classed('barra', true);
    retangulos.exit().remove();

    // formata os retângulos de acordo com os dados
    this.plotagem.selectAll('.barra')
        .transition()
        .duration(this.duracaoAnimacao)
        .attr('x', d => this.x(d.chave))
        .attr('y', d => this.y(d.valor))
        .attr('width', this.x.bandwidth())
        .attr('height', d => this.alturaPlotagem - this.y(d.valor))
        .attr('fill', d => this.cores(d.chave));

    // ajusta a quantidade de rótulos aos dados, criando ou removendo os rótulos necessários
    const rotulos = this.plotagem.selectAll('.rotulo').data(dados);
      
    rotulos.enter().append('text').classed('rotulo', true);
    rotulos.exit().remove();

    // formata os rótulos de acordo com os dados
    this.plotagem.selectAll('.rotulo')
        .transition()
        .duration(this.duracaoAnimacao)
        .text(d => d.valor)
        .attr('x', d => this.x(d.chave))
        .attr('y', d => this.y(d.valor))
        .attr('dx', d => this.x.bandwidth() * .5)
        .attr('dy', -5);

    // define o tempo da duração das animações  (em milissegundos)
    this.duracaoAnimacao = 500;
  }  

  this.atualiza(parametros.dados);
}
