/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*NB: nel file CSS in(bottomLinkLeft/bottomLinkRight) aggiungere parametro 'bottom: 0;' e 'position:absolute;' 
      in (sfondo) aggiungere parametro 'position: relative;' */
//Funzione che gestisce il margine del Menu div di navigazione.


$(window).on('load',function(){
        $('#navigation').css('margin-bottom',$('#bottomLinkLeft').outerHeight(true)+"px");
        $('#rightmenu').css('margin-bottom',$('#bottomLinkRight').outerHeight(true)+"px");
});

/*

$(function getId(){    
    //Recupero ID del div che contiene i bottoni di sinistra.
    var bottomLeft = document.getElementById('bottomLinkLeft');
    //Recupero ID del div che contiene il menu di navigazione.
    var navigation = document.getElementById('navigation');

    var heightLeft = '';
    //Verifico se esiste il div 'bottomLinkLeft'.
    if(bottomLeft !== null){              
        //Recupero l'altezza reale del div che contiene tutti bottoni di sinistra.
        heightLeft = bottomLeft.offsetHeight;
        //Verifico se esiste il div 'navigation'.
        if(navigation !== null){
           //Setto l'altezza recuperata dal div dei bottoni nel mariginBottom del div di Navigazione, per evitare che il div vada a sovrapporsi.
           navigation.style.marginBottom = heightLeft + 'px';
        }
    }

    //Recupero ID del div che contiene i bottoni di destra.
    var bottomRight = document.getElementById('bottomLinkRight');
    //Recupero ID del div che contiene il menu di navigazione di destra.
    var navigationRight = document.getElementById('rightmenu');
    var heightRight = '';
    //Verifico se esiste il div 'bottomLinkRight'
    if(bottomRight !== null){              
        //Recupero l'altezza reale del div che contiene tutti bottoni di destra.
        heightRight = bottomRight.offsetHeight;
        //Verifico se esiste il div 'navigationRight'.
        if(navigationRight !== null){
           //Setto l'altezza recuperata dal div dei bottoni nel mariginBottom del div di Navigazione, per evitare che il div vada sovrapporsi.
           navigationRight.style.marginBottom = heightRight + 'px';
        }
    }
});


*/
