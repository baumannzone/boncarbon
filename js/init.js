(function ( $ ) {
  skel.init( {
    reset: 'full',
    breakpoints: {
      global: { href: 'css/style.css', containers: '35em', grid: { gutters: [ '1.5em', 0 ] } },
      large: { media: '(max-width: 1680px)', href: 'css/style-large.css' },
      medium: {
        media: '(max-width: 980px)',
        href: 'css/style-medium.css',
        containers: '80%',
        viewport: { scalable: false }
      },
      small: { media: '(max-width: 736px)', href: 'css/style-small.css', grid: { gutters: [ '1em', 0 ] } },
      xsmall: { media: '(max-width: 480px)', href: 'css/style-xsmall.css', containers: '100%' }
    }
  } );
  $( function () {
    var $window = $( window ),
      $body = $( 'body' ),
      $html = $( 'html' );
    // Disable animations/transitions until the page has loaded.
    $html.addClass( 'is-loading' );
    $window.on( 'load', function () {
      window.setTimeout( function () {
        $html.removeClass( 'is-loading' );
      }, 0 );
    } );
    // Touch mode.
    if ( skel.vars.isMobile ) {
      var $wrapper;
      // Create wrapper.
      $body.wrapInner( '<div id="wrapper" />' );
      $wrapper = $( '#wrapper' );
      // Hack: iOS vh bug.
      if ( skel.vars.deviceType == 'ios' )
        $wrapper
          .css( 'margin-top', -25 )
          .css( 'padding-bottom', 25 );
      // Pass scroll event to window.
      $wrapper.on( 'scroll', function () {
        $window.trigger( 'scroll' );
      } );
      // Scrolly.
      $window.on( 'load.hl_scrolly', function () {
        $( '.scrolly' ).scrolly( {
          speed: 1500,
          parent: $wrapper,
          pollOnce: true
        } );
        $window.off( 'load.hl_scrolly' );
      } );
      // Enable touch mode.
      $html.addClass( 'is-touch' );

    }
    else {

      // Scrolly.
      $( '.scrolly' ).scrolly( {
        speed: 1500
      } );

    }

    // Header.
    var $header = $( '#header' ),
      $headerTitle = $header.find( 'header' ),
      $headerContainer = $header.find( '.container' );

    // Make title fixed.
    if ( !skel.vars.isMobile ) {
      $window.on( 'load.hl_headerTitle', function () {
        skel.on( '-medium !medium', function () {
          $headerTitle
            .css( 'position', 'fixed' )
            .css( 'height', 'auto' )
            .css( 'top', '50%' )
            .css( 'left', '0' )
            .css( 'width', '100%' )
            .css( 'margin-top', ($headerTitle.outerHeight() / -2) );
        } );

        skel.on( '+medium', function () {
          $headerTitle
            .css( 'position', '' )
            .css( 'height', '' )
            .css( 'top', '' )
            .css( 'left', '' )
            .css( 'width', '' )
            .css( 'margin-top', '' );
        } );
        $window.off( 'load.hl_headerTitle' );
      } );
    }

    // Scrollex.
    skel.on( '-small !small', function () {
      $header.scrollex( {
        terminate: function () {
          $headerTitle.css( 'opacity', '' );
        },
        scroll: function ( progress ) {
          // Fade out title as user scrolls down.
          if ( progress > 0.5 )
            x = 1 - progress;
          else
            x = progress;
          $headerTitle.css( 'opacity', Math.max( 0, Math.min( 1, x * 2 ) ) );
        }
      } );
    } );

    skel.on( '+small', function () {
      $header.unscrollex();
    } );

    // Main sections.
    $( '.main' ).each( function () {
      var $this = $( this ),
        $primaryImg = $this.find( '.image.primary > img' ),
        $bg,
        options;
      // No primary image? Bail.
      if ( $primaryImg.length == 0 )
        return;

      // Hack: IE8 fallback.
      if ( skel.vars.IEVersion < 9 ) {
        $this
          .css( 'background-image', 'url("' + $primaryImg.attr( 'src' ) + '")' )
          .css( '-ms-behavior', 'url("css/ie/backgroundsize.min.htc")' );
        return;
      }

      // Create bg and append it to body.
      $bg = $( '<div class="main-bg" id="' + $this.attr( 'id' ) + '-bg"></div>' )
        .css( 'background-image', (
          'url("css/images/overlay.png"), url("' + $primaryImg.attr( 'src' ) + '")'
        ) )
        .appendTo( $body );

      // Scrollex.
      options = {
        mode: 'middle',
        delay: 200,
        top: '-10vh',
        bottom: '-10vh'
      };

      if ( skel.canUseProperty( 'transition' ) ) {
        options.init = function () { $bg.removeClass( 'active' ); };
        options.enter = function () { $bg.addClass( 'active' ); };
        options.leave = function () { $bg.removeClass( 'active' ); };
      }
      else {
        $bg
          .css( 'opacity', 1 )
          .hide();

        options.init = function () { $bg.fadeOut( 0 ); };
        options.enter = function () { $bg.fadeIn( 400 ); };
        options.leave = function () { $bg.fadeOut( 400 ); };
      }
      $this.scrollex( options );
    } );
  } );
})( jQuery );