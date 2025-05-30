let paleta_fundo = "ffff81";
let paleta_contorno = "#fff2e7";
let paleta_cores = [
  "#ffb000",
  "#ff4200",
  "#3a8ecb",
  "#ff99cc",
  "#1d1d1b",
  "#ffff81",
];

let seno_escala = 0.01;

let grade_coluna_qtd;
let grade_linha_qtd;


function setup() {
  createCanvas(windowWidth, 350);
  strokeJoin(ROUND);

  grade_coluna_qtd = floor(random(3, 7));
  let modulo_tamanho = width / grade_coluna_qtd;
  grade_linha_qtd = floor(height / modulo_tamanho);

  modulo_tamanho = height / grade_linha_qtd;
  adjustedWidth = modulo_tamanho * grade_coluna_qtd;

  semente = random(1000);

  // Set text properties once here
  textAlign(CENTER, CENTER);
  textSize(48);
  textFont('SignifierTest');
  fill(255, 255, 255, 255);
  stroke(55, 92, 227, 230);

  describe('EN - Draw a grid of squares and within each square a geometric graphic is drawn...');
}

function draw() {
  background(220);
  randomSeed(semente);
  grade((width - adjustedWidth) / 2, 0, grade_coluna_qtd, grade_linha_qtd, adjustedWidth);

  let baseText = "Maths Club";
  let padding = 20;  // padding so text doesn't touch edges
  let maxTextWidth = width - padding * 2;

  textAlign(CENTER, CENTER);
  textFont('SignifierTest');
  fill(255, 255, 225, 220);
  stroke(255, 255, 255, 255);
  strokeWeight(2);

  // Start with a large font size
  let textSizeValue = 300;
  textSize(textSizeValue);

  let tw = textWidth(baseText);

  if (tw > maxTextWidth) {
    textSizeValue = textSizeValue * (maxTextWidth / tw);
  }

  // Clamp minimum text size so it doesn't get too small or zero
  textSizeValue = max(textSizeValue, 12);
  textSize(textSizeValue);

  // Draw text centered horizontally and vertically in canvas
  text(baseText, width / 2, height / 2);
}

function windowResized() {
  resizeCanvas(windowWidth, 350);

  grade_coluna_qtd = floor(random(3, 7));
  let modulo_tamanho = width / grade_coluna_qtd;
  grade_linha_qtd = floor(height / modulo_tamanho);
  
  modulo_tamanho = height / grade_linha_qtd;
  adjustedWidth = modulo_tamanho * grade_coluna_qtd;

  semente = random(1000);
}


function grade(x_inicial, y_inicial, coluna_qtd, linha_qtd, largura_total) {
  stroke(paleta_contorno);
  strokeWeight(2);
  let modulo_tamanho = largura_total / coluna_qtd;
  let movimento_diferencial = 0;
  
  for ( let j = 0; j < linha_qtd; j++) {
    for ( let i = 0; i < coluna_qtd; i++) {
      
      let x = x_inicial + i * modulo_tamanho;
      let y = y_inicial + j * modulo_tamanho;
      
      let cor_indice = floor(random(paleta_cores.length - 1));
      fill(paleta_cores[cor_indice]);
      rect(x, y, modulo_tamanho, modulo_tamanho);
      fill(paleta_cores[(cor_indice + 1) % paleta_cores.length]);
      
      let movimento = map(sin(frameCount * seno_escala + movimento_diferencial), -1, 1, 0, 1);
      
      let seletor = floor(random(6 + 3));

      // Mouse scale factor for size modulation between 0.9 and 1.1 (subtle effect)
      let mouseScaleX = map(mouseX, 0, width, 0.9, 1.1);
      let mouseScaleY = map(mouseY, 0, height, 0.9, 1.1);
      let mouseScale = (mouseScaleX + mouseScaleY) / 2;

      if (seletor === 0) {
        let raio_externo = (modulo_tamanho / 2 - 5) * mouseScale;
        let raio_interno = raio_externo * movimento;
        let pontas_qtd = [4, 6, 8, 10, 12, 14, 16, 18][floor(random() * 8)];
        estrela(x + modulo_tamanho / 2, y + modulo_tamanho / 2, raio_interno, raio_externo, pontas_qtd, 0);
      }
      
      else if (seletor === 1) {
        let diametro = random(modulo_tamanho / 2, modulo_tamanho) * movimento * mouseScale;
        circle(x + modulo_tamanho / 2, y + modulo_tamanho / 2, diametro);
      }
      
      else if (seletor === 2) {
        let pontas = [3, 5, 7, 9, 11, 13][floor(random(6))];
        let pontas_altura = map(movimento, 0, 1, 0.2, 0.8);
        coroa_dupla(x, y, modulo_tamanho, modulo_tamanho, pontas, pontas_altura);
      }
      
      else if (seletor === 3) {
        let haste_largura = map(movimento, 0, 1, 0.2, 0.8);
        machado(x, y, modulo_tamanho, modulo_tamanho, haste_largura);
      }
      
      else if (seletor === 4) {
        let abertura_largura = random(0.4, 1) * movimento;
        losango(x, y, modulo_tamanho, modulo_tamanho, abertura_largura);
      }
      
      else if (seletor >= 5 && modulo_tamanho > 60) {
        grade(x, y, 2, 2, modulo_tamanho);
      }
      
      movimento_diferencial += 1;
    }
  }
}


// Código adaptado de Alexandre Villares
function estrela(x, y, raio_interno, raio_externo, pontas_qtd, angulo_inicial) {

  let step = TWO_PI / pontas_qtd;
  beginShape();
  for (i = 0; i < pontas_qtd; i++) {
    ang = angulo_inicial + step * i;
    interno_x = x + cos(ang) * raio_interno;
    interno_y = y + sin(ang) * raio_interno;
    vertex(interno_x, interno_y);
    externo_x = x + cos(ang + step / 2.0) * raio_externo;
    externo_y = y + sin(ang + step / 2.0) * raio_externo;
    vertex(externo_x, externo_y);
  }
  endShape(CLOSE);
}


function coroa_simples(x, y, largura, altura, pontas_qtd, pontas_altura_relativa) {
  let pontas_altura = altura * pontas_altura_relativa;
  let pontas_deslocamento = largura / (pontas_qtd - 1);
  let ponta_x, ponta_y;
  beginShape();
  for (i = 0; i < pontas_qtd; i++) {
    ponta_x = x + i * pontas_deslocamento;
    ponta_y = y;
    if (i % 2 != 0) {
      ponta_y = y + pontas_altura;
    }
    vertex(ponta_x, ponta_y);
  }
  vertex(x + largura, ponta_y + altura);
  vertex(x, ponta_y + altura)
  endShape(CLOSE);
 }

function coroa_dupla(x, y, largura, altura, pontas_qtd, pontas_altura_relativa) {
  let pontas_altura = altura * pontas_altura_relativa / 2;
  let pontas_deslocamento = largura / (pontas_qtd - 1);
  beginShape();
  for (let i = 0; i < pontas_qtd; i++) {
    var ponta_x = x + i * pontas_deslocamento;
    var ponta_y = y;
    if (i % 2 !== 0) {
        ponta_y = y + pontas_altura;
    }
    vertex(ponta_x, ponta_y);
  }
  for (let i = 0; i < pontas_qtd; i++) {
    let ponta_x = (x + largura) - (i * pontas_deslocamento);
    let ponta_y = y + altura;
    if (i % 2 !== 0) {
        ponta_y = (y + altura) - pontas_altura;
    }
    vertex(ponta_x, ponta_y);
  }
  endShape(CLOSE);
}

function machado(x, y, largura, altura, haste_largura_relativa) {
  let haste_largura = largura * haste_largura_relativa / 2;
  beginShape();
  vertex(x, y);
  vertex(x + haste_largura, y + haste_largura);
  vertex(x + haste_largura, y);
  vertex(x + (largura - haste_largura), y);
  vertex(x + (largura - haste_largura), y + haste_largura);
  vertex(x + largura, y);
  vertex(x + largura, y + altura);
  vertex(x + (largura - haste_largura), y + (altura - haste_largura));
  vertex(x + (largura - haste_largura), y + altura);
  vertex(x + haste_largura, y + altura);
  vertex(x + haste_largura, y + (altura - haste_largura));
  vertex(x, y + altura);
  endShape(CLOSE);
}


function losango(x, y, largura, altura, abertura_relativa) {
  let abertura_largura = largura * abertura_relativa / 2;
  beginShape();
  vertex(x + abertura_largura, y + altura / 2);
  vertex(x + largura / 2, y);
  vertex(x + (largura - abertura_largura), y + altura / 2);
  vertex(x + largura / 2, y + altura);
  endShape(CLOSE);
}

