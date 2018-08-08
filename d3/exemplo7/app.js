function criaGrafico(parametros) {
  const max = d3.max(parametros.dados.map(d => d.valor));
  const svg = d3.select('#grafico');
  const margem = {
    esquerda: 70,
    direita: 20,
    superior: 40,
    inferior: 100
  }

  svg.attr('width', parametros.largura).attr('height', parametros.altura);

  const plotagem = svg.append('g').attr('transform', `translate(${margem.esquerda}, ${margem.superior})`);
  
  const larguraPlotagem = parametros.largura - margem.esquerda - margem.direita;
  const alturaPlotagem = parametros.altura - margem.superior - margem.inferior;

  const x = d3.scaleBand().domain(parametros.dados.map(d => d.chave)).range([0, larguraPlotagem]).padding(.1);
  const y = d3.scaleLinear().domain([0, max]).range([alturaPlotagem, 0]);
  // const cores = d3.scaleLinear().domain([0, parametros.dados.length]).range(['#e92d2d', '#e2a3a3']);
  const cores = d3.scaleOrdinal().domain([0, parametros.dados.length]).range(['#d73027', '#fc8d59', '#fee090', '#e0f3f8', '#91bfdb', '#4575b4']);

  const eixoX = d3.axisBottom(x);
  const eixoY = d3.axisLeft(y);
  const grade = d3.axisRight(y).tickSize(larguraPlotagem).tickFormat('');

  plotagem.append('g')
  .attr('transform', 'translate(0, ' + alturaPlotagem + ')')
  .attr('id', 'eixoX')
  .call(eixoX);

  plotagem.append('g').attr('id', 'eixoY').call(eixoY);

  plotagem.append('g').attr('id', 'grade').call(grade);

  plotagem.selectAll('.barra')
  .data(parametros.dados)
  .enter() 
  .append('rect')
  .classed('barra', true)
  .attr('x', d => x(d.chave))
  .attr('y', d => y(d.valor))
  .attr('width', x.bandwidth())
  .attr('height', d => alturaPlotagem - y(d.valor))
  .attr('fill', (d, i) => cores(i));

  plotagem.selectAll('.rotulos')
  .data(parametros.dados)
  .enter() 
  .append('text')
  .classed('rotulo', true)
  .text(d => d.valor)
  .attr('x', d => x(d.chave))
  .attr('y', d => y(d.valor))
  .attr('dx', d => x.bandwidth() * .5)
  .attr('dy', -5);

  plotagem.append('text')
  .attr('x', 0)
  .attr('y', 0)
  .style('text-anchor', 'middle')
  .attr('transform', 'translate(-40, ' + alturaPlotagem / 2 + ') rotate(-90)')
  .text(parametros.tituloY);

  plotagem.append('text')
  .attr('x', 0)
  .attr('y', 0)
  .style('text-anchor', 'middle')
  .attr('transform', 'translate(' + larguraPlotagem / 2 + ', ' + (alturaPlotagem + 80) + ')')
  .text(parametros.tituloX);
}
