/**
 * Jquery Text Resize plugin
 * @2012 Wilson Mendes ()
 *
 * Modifica o tamanho de fonte do text; Aceita alguns parametros opcionais.
 *
 * @example $.textResize('#the_content', { 'array_option' });
 * @desc Descreve o conteúdo de ações do plugin.
 * @example $.textResize('#the_content', { 'variation': 2, 'containerInsert':
 *          '#myContent', 'optionInterface': 'button', 'cookie': 'value_cookie'
 *          });
 * @desc Descreve o conteúdo com os valores padrão.
 *
 * @param String
 *            com o valor referente ao nome do container ("nome do div" ou "nome
 *            da classe").
 * @param Array
 *            com os atrbutos do plugin para inicialização.
 * @type undefined
 * @name $.textResize
 * @cat Plugins/ Jquery Text Resize
 * @author Wilson Mendes/willmendesneto@gmail.com
 * @author Thiago Teles/thiagoteles.designer@gmail.com
 */
(function($) {
  'use strict';

  /**
   * Class for works with Cookies:
   *
   * Ex:
   *    Cookies.set(name, value[, end[, path[, domain[, secure]]]])
   *    Cookies.get(name)
   *    Cookies.remove(name[, path], domain)
   *    Cookies.hasItem(name)
   *    Cookies.keys()
   *
   * @type {Object}
   */
  var Cookies = {
    get: function (sKey) {
      return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
    },
    set: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
      if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
      var sExpires = '';
      if (vEnd) {
        switch (vEnd.constructor) {
          case Number:
            sExpires = vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + vEnd;
            break;
          case String:
            sExpires = '; expires=' + vEnd;
            break;
          case Date:
            sExpires = '; expires=' + vEnd.toUTCString();
            break;
        }
      }
      document.cookie = encodeURIComponent(sKey) + '=' + encodeURIComponent(sValue) + sExpires + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '') + (bSecure ? '; secure' : '');
      return true;
    },
    remove: function (sKey, sPath, sDomain) {
      if (!sKey || !this.hasItem(sKey)) {
        return false;
      }
      document.cookie = encodeURIComponent(sKey) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' + ( sDomain ? '; domain=' + sDomain : '') + ( sPath ? '; path=' + sPath : '');
      return true;
    },
    hasItem: function (sKey) {
      return (new RegExp('(?:^|;\\s*)' + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(document.cookie);
    },

    keys: function () {
      var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '').split(/\s*(?:\=[^;]*)?;\s*/);
      var aKeysLength = aKeys.length;
      for (var nIdx = 0; nIdx < aKeysLength; nIdx++) {
        aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
      }
      return aKeys;
    }
  };

  $.textResize = function(selector, settings) {

    var configSelector = 'html, body';
    if (selector) {
      configSelector = selector;
    }
    // Array de configuracoes do Plugin Text Resize
    var config = {
      variation: 2,
      // Valor da Variacao dos elementos
      animation: false,
      // Animacao da transicao do elemento ("true" or "false")
      delay: 1000,
      // Temporizador da animacao ("DELAY"; Somente aceito no caso do valor da animacao ser "true")
      reduceText: 'A-',
      // Texto padrao para o campo de reducao da fonte
      resetText: 'A',
      // Texto padrao para o campo de tamanho padrao da fonte
      enlargeText: 'A+',
      // Texto padrao para o campo de acrescimo de fonte
      classReduce: 'reduceText',
      // Nome da classe de reducao da fonte
      classReset: 'resetText',
      // Nome da classe de reducao da fonte
      classEnlarge: 'enlargeText',
      // Nome da classe de reducao da fonte
      clicks: false,
      // Quantidade de clicks configurado ("false" ou inteiro referente a quantidade de clicks aceitos)
      containerInsert: false,
      // Container onde vao ser inseridos os elementos ("false" ou nome do elemento onde serao inseridos os elementos
      //EX:  "#container-test" ou ".container-test")
      optionInterface: 'link',
      // Opcao de retorno de insercao dos elementos que trabalham com a fonte ("link" ou "button";
      // Aceitos somente se a opcao "containerInsert" for diferente de "false")
      cookie: true,
      // Verificacao para salvar fonte como COOKIE ("false" ou nome do elemento do array "COOKIE" configurado; Necessita do arquivo "jquery.cookie.js")
      fontType: 'px',
      imageAnimation: false,
      // Verificacao para salvar fonte como COOKIE ("false" ou nome do elemento do array "COOKIE" configurado; Necessita do arquivo "jquery.cookie.js")
    };
    if (settings) {
      $.extend(config, settings);
    }

    // o objeto com base no container informado na inicializacao
    var $obj = $(configSelector),
      // Achando imagem dentro do container inicializado
      $img = $obj.find('img'),
      // Pegando a altura da imagem
      fontDefault = $obj.css('font-size'),
      // Pegando o atributo "font-size" do container inicializado
      currentSize = parseInt($obj.css('font-size'), 10),
      // Passando o valor "font-size" para um valor @int
      userClicksReduce = 0,
      // Inicializando o valor de quantidade de clicks para aumento com '0'
      userClicksEnlarge = 0,
      // Valor para imagem
      percent = 100,
      fontEnlarge = '',
      fontReduce = '',
      cookieClicks = ''
    ;

    config.classReduce = '.' + config.classReduce;
    config.classEnlarge = '.' + config.classEnlarge;
    config.classReset = '.' + config.classReset;

    $img.css({
      'max-width': '100%',
      'height' : 'auto',
      'vertical-align': 'middle',
      '-ms-interpolation-mode': 'bicubic'
    });

    var imgDefault = $img.width(),
        currentImageSize = imgDefault
    ;

    if(config.imageAnimation !== false){
      $img.removeAttr('width').width(imgDefault);
    }

    // Pegando o valor do COOKIE, caso ele exista no NAVEGADOR insere o valor dele no container especificado
    if ((config.cookie !== false) && (config.cookie !== 'null') && (config.cookie !== null)) {
      cookieClicks = Cookies.get(config.cookie);

      currentSize = (! isNaN(cookieClicks) &&  cookieClicks !== null) ? parseInt(cookieClicks, 10) : parseInt(fontDefault, 10);
      fontDefault = parseInt(fontDefault, 10);

      //  Verificando se o Tamanho em COOKIE e maior que o tamanho padrao
      if( currentSize !== null && currentSize > fontDefault){
        userClicksEnlarge = ((currentSize-fontDefault) / config.variation);
        currentImageSize = ((imgDefault * percent) / 100) + ( parseInt(imgDefault / 100, 10) + userClicksEnlarge) + config.fontType;
        $img.css('width', parseInt(currentImageSize, 10));
      }// Verificando se o Tamanho em COOKIE e maior que o tamanho padrao
      if( currentSize !== null && currentSize < fontDefault){
        userClicksReduce = ((fontDefault-currentSize) / config.variation);
        currentImageSize = ((imgDefault * percent) / 100) - ( parseInt(imgDefault / 100, 10) + userClicksReduce)  + config.fontType;

        $img.css('width', parseInt(currentImageSize, 10));
      }
      $obj.css('font-size', cookieClicks + config.fontType);
    }

    // Verificacao da configuracao do container onde sera inserido os botoes/links do plugin, verificando a configuracao do plugin
    var $containerInsert = $(config.containerInsert);

    if (config.containerInsert !== false) {
      var htmlContent = '';
      // Verificacao para a opcao de interface como LINK ou BUTTON
      if (config.optionInterface === 'link') {
        htmlContent = '<a href="#" class="' + config.classReduce.replace('.', '') + '" title="reduce text">' + config.reduceText + '</a>' +
                '<a href="#" class="' + config.classReset.replace('.', '') + '" title="reset text">' + config.resetText + '</a>' +
                        '<a href="#" class="' + config.classEnlarge.replace('.', '') + '" title="enlarge text">' + config.enlargeText + '</a>';
      } else if (config.optionInterface === 'button') {
        htmlContent = '<input type="button" value="' + config.reduceText + '" class="' + config.classReduce.replace('.', '') + '" />' +
                        '<input type="button" value="' + config.resetText + '" class="' + config.classReset.replace('.', '') + '" />' +
                        '<input type="button" value="' +  config.enlargeText + '" class="' +  config.classEnlarge.replace('.', '') + '" />';
      }
      $containerInsert.html( htmlContent );

    } else {
      $containerInsert = $obj;
    }

    // Funcao para reducao do texto
    $containerInsert.on('click', config.classReduce, function() {
      if (config.clicks > userClicksReduce) {

        percent -= config.variation;
        fontReduce = currentSize - config.variation;

        if (config.animation === true) {
          $obj.animate({
            'font-size' : fontReduce + config.fontType
          }, config.delay);

          if(config.imageAnimation !== false){
            $img.animate({
              'width' : parseInt((imgDefault * percent) / 100, 10),
            }, config.delay);
          }

        } else {
          $obj.css('font-size', fontReduce);
          $img.css('width', parseInt((imgDefault * percent) / 100, 10));
        }
        // Incremento no contador REDUCE
        ++userClicksReduce;
        // Decremento no contador ENLARGE
        if (userClicksEnlarge > 0){
          --userClicksEnlarge;
        }

        currentSize = fontReduce;
        // COOKIE Verification
        if ((config.cookie !== false)) {
          cookieClicks = Cookies.get(config.cookie);
          cookieClicks = currentSize;
          Cookies.set(config.cookie, cookieClicks);
        }
      }
    });

    // Funcao para ampliar o texto
    $containerInsert.on('click', config.classEnlarge, function() {
      if (config.clicks > userClicksEnlarge) {

        percent += config.variation;
        fontEnlarge = currentSize + config.variation;
        if (config.animation === true) {
          $obj.animate({
            'font-size' : fontEnlarge + config.fontType
          }, config.delay);

          if(config.imageAnimation !== false){
            $img.animate({
              'width' : parseInt((imgDefault * percent) / 100, 10),
            }, config.delay);
          }
        } else {
          $obj.css('font-size', fontEnlarge);
          $img.css('width', parseInt((imgDefault * percent) / 100, 10));
        }
        // Decremento no contador ENLARGE
        ++userClicksEnlarge;
        // Decremento no contador REDUCE
        if (userClicksReduce > 0){
          --userClicksReduce;
        }

        currentSize = fontEnlarge;
        // COOKIE Verification
        if ((config.cookie !== false)) {

          cookieClicks = Cookies.get(config.cookie);
          cookieClicks = currentSize;
          Cookies.set(config.cookie, currentSize);
        }
      }
    });
    // Funcao para retornar o texto ao tamanho padrÃ£o
    $containerInsert.on('click', config.classReset, function() {

      if (config.animation === true) {
        $obj.animate({
          'font-size' : fontDefault
        }, config.delay);

        if(config.imageAnimation !== false){
          $img.animate({
            'width' : imgDefault,
          }, config.delay);
        }
      } else {
        $obj.css('font-size', fontDefault);
        $img.css('width', parseInt(imgDefault, 10));
      }
      // Reiniciando os valores
      userClicksReduce = userClicksEnlarge = 0;
      currentSize = parseInt(fontDefault, 10);
      // COOKIE Verification
      if ((config.cookie !== false)) {
        cookieClicks = 'null';
        Cookies.set(config.cookie, cookieClicks);
      }
    });
    return this;
  };
})(window.jQuery || window.Zepto);
