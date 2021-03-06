Plugin Jquery Text Resize (http://willmendesneto.github.io/Jquery-Text-Resize/)
===========

O plugin jquery-text-resize.js é um plugin de fácil utilização e inicialização.

Instalação:
----------

Sua implementação no documento é bastante simples. Basta baixar o arquivo jquery-text-resize.js e descompactar o arquivo
em seu projeto na pasta de sua escolha e incluir o arquivo ao documento 


Como usar:
----------

Inserir o arquivo referente ao plugin jquery (testado com +jquery.1.6.2.js), o arquivo jquery-text-resize.js e caso 

Exemplo:

### Javascript

```html
  <!--jQuery-->
  <script src="http://code.jquery.com/jquery-1.7.2.min.js"></script>
  <!--jQuery Text Resize-->
  <script type="text/javascript" src="js/jquery-text-resize.js"></script>
  
  <script type="text/javascript">
    $(document).ready(function() {
      $.textResize('#content', {
        'variation': 2,
        'animation' : true,
        'containerInsert' : '.myContainer',
        'reduceText'    : 'Conteúdo reduzido',
        'resetText'     : 'Fonte Padrão',
        'enlargeText'   : 'Conteúdo aumentado',
        'classReduce'   : 'diminuir',
        'classReset'    : 'normal',
        'classEnlarge'  : 'aumentar',
        'optionInterface' : 'button',
        'clicks'      : 4,
        'cookie'      : 'tamanho',
        'animation' : true,
        'imageAnimation' : true
      });
    });
  </script> 
```
----------------------------------------------------------------------------------

### HTML

```html
  <!-- CONTAINER ONDE SERÃO INSERIDOS OS BOTOES -->
  <div class="myContainer"></div>
  <div id="content">
    <p>Conteúdo a ser modificado pelo plugin.</p>
  </div>
```
----------------------------------------------------------------------------------
Este container vai ser reescrito pelo plugin com as informações passadas na inicialização

### HTML

```html
  <div class="myContainer">
    <input class="diminuir" type="button" value="Conteúdo reduzido">
    <input class="normal" type="button" value="Fonte Padrão">
    <input class="aumentar" type="button" value="Conteúdo aumentado">
  </div>
```

----------------------------------------------------------------------------------
Opções
----------

As opções de configuração fornecidas pelo plugin são as seguintes: 

### Javascript

```javascript
'variation' : 2, // Valor da Variacao dos elementos
'animation' : false, // Animacao da transicao do elemento ("true" or "false")
'delay' : 1000, // Temporizador da animacao ("DELAY"; Somente aceito no caso do valor da animacao ser "true")
'reduceText' : 'A-', // Texto padrao para o campo de reducao da fonte
'resetText' : 'A', // Texto padrao para o campo de tamanho padrao da fonte
'enlargeText' : 'A+', // Texto padrao para o campo de acrescimo de fonte
'classReduce' : 'reduceText', // Nome da classe de reducao da fonte
'classReset' : 'resetText', // Nome da classe de reducao da fonte
'classEnlarge' : 'enlargeText', // Nome da classe de reducao da fonte
'clicks' : false, // Quantidade de clicks configurado ("false" ou inteiro referente a quantidade de clicks aceitos)
'containerInsert' : false, // Container onde vao ser inseridos os elementos ("false" ou nome do elemento onde serao inseridos os elementos EX: "#container-test" ou ".container-test")
'optionInterface' : 'link', // Opcao de retorno de insercao dos elementos que trabalham com a fonte ("link" ou "button"; Aceitos somente se a opcao "containerInsert" for diferente de "false")
'cookie' : false, // Verificacao para salvar fonte como COOKIE ("false" ou nome do elemento do array "COOKIE" configurado; Necessita do arquivo "jquery.cookie.js")
```
----------------------------------------------------------------------------------

### Autor

**Wilson Mendes (willmendesneto)**
+ <https://twitter.com/willmendesneto>
+ <http://github.com/willmendesneto>
