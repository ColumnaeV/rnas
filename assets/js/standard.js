// Loading //
document.onreadystatechange = function () {
    var state = document.readyState
    if (state == 'interactive') {
        document.getElementById('body-container').style.opacity="0";
  } else if (state == 'complete') {
      setTimeout(function(){
          document.getElementById('interactive');
          document.getElementById('load').style.cssText="transform:translateY(-150vh);";
          document.getElementById('body-container').style.opacity="1";
      },100);
  }
}

$(document).ready(function (){
    // Other //
    var vh100 = ($(window).outerHeight() / $(window).outerWidth()*100 + "vw");
    var vh50 = ($(window).outerHeight() / $(window).outerWidth()*50 + "vw");
    $('.cover-wrapper, .cover-image, .cover-title').css({ height: vh50 });

    // Nav Control //
    $(".down").click(function (){
        $('html, body').stop(true, false).animate({
            scrollTop: $(event.target).closest("div#body-container").children("div.section").offset().top + 1
        }, 800, 'easeInOutExpo');
    });
    $("div.back-to-top").click(function (){
        $('html, body').stop(true, false).animate({
            scrollTop: $("div.section").offset().top + 1
        }, 800, 'easeInOutExpo');
    });

    $(window).scroll(function(){
        if($(window).scrollTop() < $(".section").offset().top + 1000){
            $("div.back-to-top").removeClass("back-to-top-toggled").fadeOut(400);
        }else{
            $("div.back-to-top").addClass("back-to-top-toggled").fadeIn(400);
        }
    });

    // Uppercase //
    function forceKeyPressUppercase(e){
        var charInput = e.keyCode;
        if((charInput >= 97) && (charInput <= 122)) { // lowercase
        if(!e.ctrlKey && !e.metaKey && !e.altKey) { // no modifier key
            var newChar = charInput - 32;
            var start = e.target.selectionStart;
            var end = e.target.selectionEnd;
            e.target.value = e.target.value.substring(0, start) + String.fromCharCode(newChar) + e.target.value.substring(end);
            e.target.setSelectionRange(start+1, start+1);
            e.preventDefault();
            }
        }
    }

    // Text Line Restrictions //
    $('textarea[data-limit-rows=true]')
    .on('keypress', function (event) {
        var textarea = $(this),
            text = textarea.val(),
            numberOfLines = (text.match(/\n/g) || []).length + 1,
            maxRows = parseInt(textarea.attr('rows'));

        if (event.which === 13 && numberOfLines === maxRows ) {
          return false;
        }
    });

    $('textarea').keypress(function( e ) {
        if(e.which === 32) 
            return false;
    });

    document.getElementById("rna-input").addEventListener("keypress", forceKeyPressUppercase, false);

    var decStopCodVal = 0;
    // Decision of Stop Codon //
    $("div.pass-stops").click(function (){
        $("div.pass-stops").toggleClass('pass-stops-toggled');
        decStopCodVal = decStopCodVal + 1;
        if(decStopCodVal % 2 == 0 || decStopCodVal == 0) {
            $("div.pass-stops").html("Stopping At First Stop Codon");
        } else {
            $("div.pass-stops").html("Passing All Stop Codons");
        }
    });

    var orfVal = 1;
    // ORF value //
    $('div.orf-counter').click(function () {
        orfVal = orfVal + 1;
        if(orfVal <= 3) {
            $('span.orf-value').text(orfVal);
        } else {
            orfVal = orfVal - 3;
            $('span.orf-value').text(orfVal);
        }
    });

    // Tests if string is valid for RNA testing. //
    $("div.init-button").click(function (){
        $("table.rna-table").empty();
        // Variable Settings //
        var rnaOri = $("textarea#rna-input").val();
        var spliceVal = orfVal - 1;
        // console.log(spliceVal);
        var rnaLength = $("textarea#rna-input").val().length;
        // console.log(rnaLength);
        var rna = rnaOri.slice(spliceVal, rnaLength);
        // console.log(rna);

        // var rna = $("textarea#rna-input").val();
        var a = new Array();
        var i = 3;
        var codonCount = rna.length/3;
        var acceptable = /^[ACGU]+$/;
        // var rnaString =  document.getElementById("rna-input").value;
        var rnaString = rna;
        do {
	        a.push(rna.substring(0, i));
        } while((rna = rna.substring(i, rna.length)) != "");
    
        const map1 = a.map(rna => rna.length);
        var lastArrEle = map1.slice(-1);
        // console.log(a);
        // console.log(lastArrEle);
        // console.log(codonCount);
        // console.log(rnaString);
        
        // DNA array //
        var rnaToDnaInt = {'A':'t','C':'g','G':'c','U':'a'};
        var dnaIntToDnaTemp = {'a':'A','c':'C','g':'G','t':'T'};
        var rnaToDnaComp = {'U':'T'};

        // RNA to Temp. DNA //
        var dnaInt = rnaString;
        dnaInt = dnaInt.replace(/[ACGU]/g, m => rnaToDnaInt[m]);
        var dnaTemp = dnaInt;
        dnaTemp = dnaTemp.replace(/[acgt]/g, m => dnaIntToDnaTemp[m]);
        // console.log(dnaTemp);
        var dnaTempArray = new Array();
        do {
	        dnaTempArray.push(dnaTemp.substring(0, i));
        } while((dnaTemp = dnaTemp.substring(i, dnaTemp.length)) != "");
        // console.log(dnaTempArray);

        //RNA to Comp. DNA //
        var dnaComp = rnaString;
        dnaComp = dnaComp.replace(/[U]/g, m => rnaToDnaComp[m]);
        // console.log(dnaComp);
        var dnaCompArray = new Array();
        do {
	        dnaCompArray.push(dnaComp.substring(0, i));
        } while((dnaComp = dnaComp.substring(i, dnaComp.length)) != "");
        // console.log(dnaCompArray);





        // Errors //
        var error91 = 1;
        var error97 = 1;
        var error103 = 1;
        var error110 = 1;

        // Begins with a stop codon //
            if(a[0] == "UAG" || a[0] == "UAA" || a[0] == "UGA") {
                displayError91 = "\n· RNA sequence begins with a stop codon.";
            } else {
                error91 = 0;
                displayError91 = "";
            }
        // Fragmented codons
            if(lastArrEle % 3 !== 0 || lastArrEle == 0) {
                displayError97 = "\n· Invalid base count in RNA sequence. " + lastArrEle + " Extra bases.";
            } else {
                error97 = 0;
                displayError97 = "";
            }
        // Invalid bases used
            if(!rnaString.match(acceptable)) {
                displayError103 = "\n· Invalid characters utilised for the RNA sequence.";
            } else {
                error103 = 0;
                displayError103 = "";
            }

        // Empty Input
            if(lastArrEle == 0) {
                displayError91 = "";
                displayError97 = "";
                displayError103 = "";
                displayError110 = "\n· [Input RNA Sequence] field is empty.";
            } else {
                error110 = 0;
                displayError110 = "";
            }

        // console.log(error91);
        // console.log(error97);
        // console.log(error103);
        // console.log(error110);

        // Array Codon Comparison Function //
            var codonPosCode = 0;
            var codonPos = 1;
            var stopCodCounter = 0;

            // Decision function //
            function initSequence() {
                if (decStopCodVal % 2 == 0 || decStopCodVal == 0) {
                    runSequenceFS();
                } else {
                    runSequence();
                }
            }

            // With Stop Codons Pass //
            function runSequence() {
                if(codonPos <= codonCount) {
                    runCodon();
                } else {
                    completeSequence();
                }
            }

            function completeSequence() {
                setTimeout(function () {
                    $("div.init-button").html("Complete!");
                }, 500);
                setTimeout(function () {
                    alert("RNA Sequencer: Complete.\n\n" + codonCount + " codons were paired with amino acids.\n" + stopCodCounter + " detected stop codons.\nAmino acid pairing stopped due to termination of RNA sequence.");
                    $("div.init-button").html("Run Sequence").removeClass('init-button-clicked');
                }, 1000);
                setTimeout(function () {
                    $('html, body').stop(true, false).animate({
                        scrollTop: $("table.rna-table").offset().top
                    }, 800, 'easeInOutExpo');
                }, 1100);
            }

            function runCodon() {
                // Alanine
                if(a[codonPosCode] == "GCU" || a[codonPosCode] == "GCC" || a[codonPosCode] == "GCA" || a[codonPosCode] == "GCG") {
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Ala / A</td><td>Alanine</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequence();
                }
                // Arginine
                if(a[codonPosCode] == "CGU" || a[codonPosCode] == "CGC" || a[codonPosCode] == "CGA" || a[codonPosCode] == "CGG" || a[codonPosCode] == "AGA" || a[codonPosCode] == "AGG") {
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Arg / R</td><td>Arginine</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequence();
                }
                // Asparagine
                if(a[codonPosCode] == "AAU" || a[codonPosCode] == "AAC") { 
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Asn / N</td><td>Asparagine</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequence();
                }
                //  Aspartic Acid
                if(a[codonPosCode] == "GAU" || a[codonPosCode] == "GAC") { 
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Asp / D</td><td>Aspartic Acid</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequence();
                }
                // Cysteine
                if(a[codonPosCode] == "UGU" || a[codonPosCode] == "UGC") { 
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Cys / C</td><td>Cysteine</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequence();
                }
                // Glutamine
                if(a[codonPosCode] == "CAA" || a[codonPosCode] == "CAG") { 
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Gln / Q</td><td>Glutamine</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequence();
                }
                // Glutamic Acid
                if(a[codonPosCode] == "GAA" || a[codonPosCode] == "GAG") { 
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Glu / E</td><td>Glutamic Acid</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequence();
                }
                // Glycine
                if(a[codonPosCode] == "GGU" || a[codonPosCode] == "GGC" || a[codonPosCode] == "GGA" || a[codonPosCode] == "GGG") { 
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Gly / G</td><td>Glycine</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequence();
                }
                // Histidine
                if(a[codonPosCode] == "CAU" || a[codonPosCode] == "CAC") { 
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>His / H</td><td>Histidine</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequence();
                }
                // Isoleucine
                if(a[codonPosCode] == "AUU" || a[codonPosCode] == "AUC" || a[codonPosCode] == "AUA") { 
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Ile / I</td><td>Isoleucine</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequence();
                }
                // Leucine
                if(a[codonPosCode] == "UUA" || a[codonPosCode] == "UUG" || a[codonPosCode] == "CUU" || a[codonPosCode] == "CUC" || a[codonPosCode] == "CUA" || a[codonPosCode] == "CUG") { 
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Leu / L</td><td>Leucine</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequence();
                }
                // Lysine
                if(a[codonPosCode] == "AAA" || a[codonPosCode] == "AAG") { 
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Lys / K</td><td>Lysine</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequence();
                }
                // Methionine
                if(a[codonPosCode] == "AUG") { 
                    $("table.rna-table").append("<tr class='start-codon'><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Met / M</td><td>Methionine (START)</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequence();
                }
                // Phenylalanine
                if(a[codonPosCode] == "UUU" || a[codonPosCode] == "UUC") { 
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Phe / F</td><td>Phenylalanine</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequence();
                }
                // Proline
                if(a[codonPosCode] == "CCU" || a[codonPosCode] == "CCC" || a[codonPosCode] == "CCA" || a[codonPosCode] == "CCG") { 
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Pro / P</td><td>Proline</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequence();
                }
                // Serine
                if(a[codonPosCode] == "UCU" || a[codonPosCode] == "UCC" || a[codonPosCode] == "UCA" || a[codonPosCode] == "UCG" || a[codonPosCode] == "AGU" || a[codonPosCode] == "AGC") { 
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Ser / S</td><td>Serine</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequence();
                }
                // Threonine
                if(a[codonPosCode] == "ACU" || a[codonPosCode] == "ACC" || a[codonPosCode] == "ACA" || a[codonPosCode] == "ACG") { 
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Thr / T</td><td>Threonine</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequence();
                }
                // Tryptophan
                if(a[codonPosCode] == "UGG") { 
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Trp / W</td><td>Tryptophan</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequence();
                }
                // Tyrosine
                if(a[codonPosCode] == "UAU" || a[codonPosCode] == "UAC") { 
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Tyr / Y</td><td>Tyrosine</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequence();
                }
                // Valine
                if(a[codonPosCode] == "GUU" || a[codonPosCode] == "GUC" || a[codonPosCode] == "GUA" || a[codonPosCode] == "GUG") { 
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Val / V</td><td>Valine</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequence();
                }

            // STOP CODONS //
                // Amber
                if(a[codonPosCode] == "UAG") { 
                    $("table.rna-table").append("<tr class='stop-codon'><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td></td><td>Amber (STOP)</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    stopCodCounter = stopCodCounter + 1;
                    runSequence();
                }
                // Ochre
                if(a[codonPosCode] == "UAA") { 
                    $("table.rna-table").append("<tr class='stop-codon'><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td></td><td>Ochre (STOP)</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    stopCodCounter = stopCodCounter + 1;
                    runSequence();
                }
                // Opal
                if(a[codonPosCode] == "UGA") { 
                    $("table.rna-table").append("<tr class='stop-codon'><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td></td><td>Opal (STOP)</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    stopCodCounter = stopCodCounter + 1;
                    runSequence();
                }

            }

            // Stop at first Stop Codon //
            function runSequenceFS() {
                if(codonPos <= codonCount && a[codonPosCode] !== "UAG" && a[codonPosCode] !== "UAA" && a[codonPosCode] !== "UGA") {
                    runCodonFS();
                } else {
                    completeSequenceFS();
                }
            }

            function runCodonFS() {
                // Alanine
                if(a[codonPosCode] == "GCU" || a[codonPosCode] == "GCC" || a[codonPosCode] == "GCA" || a[codonPosCode] == "GCG") {
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Ala / A</td><td>Alanine</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequenceFS();
                }
                // Arginine
                if(a[codonPosCode] == "CGU" || a[codonPosCode] == "CGC" || a[codonPosCode] == "CGA" || a[codonPosCode] == "CGG" || a[codonPosCode] == "AGA" || a[codonPosCode] == "AGG") {
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Arg / R</td><td>Arginine</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequenceFS();
                }
                // Asparagine
                if(a[codonPosCode] == "AAU" || a[codonPosCode] == "AAC") { 
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Asn / N</td><td>Asparagine</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequenceFS();
                }
                //  Aspartic Acid
                if(a[codonPosCode] == "GAU" || a[codonPosCode] == "GAC") { 
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Asp / D</td><td>Aspartic Acid</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequenceFS();
                }
                // Cysteine
                if(a[codonPosCode] == "UGU" || a[codonPosCode] == "UGC") { 
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Cys / C</td><td>Cysteine</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequenceFS();
                }
                // Glutamine
                if(a[codonPosCode] == "CAA" || a[codonPosCode] == "CAG") { 
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Gln / Q</td><td>Glutamine</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequenceFS();
                }
                // Glutamic Acid
                if(a[codonPosCode] == "GAA" || a[codonPosCode] == "GAG") { 
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Glu / E</td><td>Glutamic Acid</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequenceFS();
                }
                // Glycine
                if(a[codonPosCode] == "GGU" || a[codonPosCode] == "GGC" || a[codonPosCode] == "GGA" || a[codonPosCode] == "GGG") { 
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Gly / G</td><td>Glycine</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequenceFS();
                }
                // Histidine
                if(a[codonPosCode] == "CAU" || a[codonPosCode] == "CAC") { 
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>His / H</td><td>Histidine</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequenceFS();
                }
                // Isoleucine
                if(a[codonPosCode] == "AUU" || a[codonPosCode] == "AUC" || a[codonPosCode] == "AUA") { 
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Ile / I</td><td>Isoleucine</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequenceFS();
                }
                // Leucine
                if(a[codonPosCode] == "UUA" || a[codonPosCode] == "UUG" || a[codonPosCode] == "CUU" || a[codonPosCode] == "CUC" || a[codonPosCode] == "CUA" || a[codonPosCode] == "CUG") { 
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Leu / L</td><td>Leucine</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequenceFS();
                }
                // Lysine
                if(a[codonPosCode] == "AAA" || a[codonPosCode] == "AAG") { 
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Lys / K</td><td>Lysine</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequenceFS();
                }
                // Methionine
                if(a[codonPosCode] == "AUG") { 
                    $("table.rna-table").append("<tr class='start-codon'><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Met / M</td><td>Methionine (START)</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequenceFS();
                }
                // Phenylalanine
                if(a[codonPosCode] == "UUU" || a[codonPosCode] == "UUC") { 
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Phe / F</td><td>Phenylalanine</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequenceFS();
                }
                // Proline
                if(a[codonPosCode] == "CCU" || a[codonPosCode] == "CCC" || a[codonPosCode] == "CCA" || a[codonPosCode] == "CCG") { 
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Pro / P</td><td>Proline</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequenceFS();
                }
                // Serine
                if(a[codonPosCode] == "UCU" || a[codonPosCode] == "UCC" || a[codonPosCode] == "UCA" || a[codonPosCode] == "UCG" || a[codonPosCode] == "AGU" || a[codonPosCode] == "AGC") { 
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Ser / S</td><td>Serine</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequenceFS();
                }
                // Threonine
                if(a[codonPosCode] == "ACU" || a[codonPosCode] == "ACC" || a[codonPosCode] == "ACA" || a[codonPosCode] == "ACG") { 
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Thr / T</td><td>Threonine</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequenceFS();
                }
                // Tryptophan
                if(a[codonPosCode] == "UGG") { 
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Trp / W</td><td>Tryptophan</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequenceFS();
                }
                // Tyrosine
                if(a[codonPosCode] == "UAU" || a[codonPosCode] == "UAC") { 
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Tyr / Y</td><td>Tyrosine</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequenceFS();
                }
                // Valine
                if(a[codonPosCode] == "GUU" || a[codonPosCode] == "GUC" || a[codonPosCode] == "GUA" || a[codonPosCode] == "GUG") { 
                    $("table.rna-table").append("<tr><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td>Val / V</td><td>Valine</td></tr>");
                    codonPos = codonPos + 1;
                    codonPosCode = codonPosCode + 1;
                    runSequenceFS();
                }
            }

            function completeSequenceFS() {
                // Amber
                if(a[codonPosCode] == "UAG") { 
                    $("table.rna-table").append("<tr class='stop-codon'><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td></td><td>Amber (STOP)</td></tr>");
                    setTimeout(function () {
                        $("div.init-button").html("Complete!");
                    }, 500);
                    setTimeout(function () {
                        alert("RNA Sequencer: Complete.\n\n"+ codonPos + " of the " + codonCount + " detected codons were paired.\nAmino acid pairing stopped due to stop codon Amber.");
                        $("div.init-button").html("Run Sequence").removeClass('init-button-clicked');
                    }, 1000);
                    setTimeout(function () {
                        $('html, body').stop(true, false).animate({
                            scrollTop: $("table.rna-table").offset().top
                        }, 800, 'easeInOutExpo');
                    }, 1100);
                }
                // Ochre
                if(a[codonPosCode] == "UAA") { 
                    $("table.rna-table").append("<tr class='stop-codon'><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td></td><td>Ochre (STOP)</td></tr>");
                    setTimeout(function () {
                        $("div.init-button").html("Complete!");
                    }, 500);
                    setTimeout(function () {
                        alert("RNA Sequencer: Complete.\n\n"+ codonPos + " of the " + codonCount + " detected codons were paired.\nAmino acid pairing terminated due to stop codon Ochre.");
                        $("div.init-button").html("Run Sequence").removeClass('init-button-clicked');
                    }, 1000);
                    setTimeout(function () {
                        $('html, body').stop(true, false).animate({
                            scrollTop: $("table.rna-table").offset().top
                        }, 800, 'easeInOutExpo');
                    }, 1100);
                }
                // Opal
                if(a[codonPosCode] == "UGA") { 
                    $("table.rna-table").append("<tr class='stop-codon'><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td></td><td>Opal (STOP)</td></tr>");
                    setTimeout(function () {
                        $("div.init-button").html("Complete!");
                    }, 500);
                    setTimeout(function () {
                        alert("RNA Sequencer: Complete.\n\n"+ codonPos + " of the " + codonCount + " detected codons were paired.\nAmino acid pairing terminated due to stop codon Opal.");
                        $("div.init-button").html("Run Sequence").removeClass('init-button-clicked');
                    }, 1000);
                    setTimeout(function () {
                        $('html, body').stop(true, false).animate({
                            scrollTop: $("table.rna-table").offset().top
                        }, 800, 'easeInOutExpo');
                    }, 1100);
                    
                }
                if (codonPos >= codonCount) {
                    setTimeout(function () {
                        $("div.init-button").html("Complete!");
                    }, 500);
                    setTimeout(function () {
                        alert("RNA Sequencer: Complete.\n\n" + codonCount + " codons were paired with amino acids.\n" + stopCodCounter + " detected stop codons.\nAmino acid pairing stopped due to termination of RNA sequence.");
                        $("div.init-button").html("Run Sequence").removeClass('init-button-clicked');
                    }, 1000);
                    setTimeout(function () {
                        $('html, body').stop(true, false).animate({
                            scrollTop: $("table.rna-table").offset().top
                        }, 800, 'easeInOutExpo');
                    }, 1100);
                }
            }


        if(error91 == 1 || error97 == 1 || error103 == 1 || error110 == 1) {
            alert("RNA Sequencer:\n\nAmino acid pairing was aborted due to the following errors:" + displayError91 + displayError97 + displayError103 + displayError110);
        } else {
            $("table.rna-table").empty().append("<tr><th>Position</th><th class='dna-label'>Temp. DNA</th><th class='dna-label'>Comp. DNA</th><th>Codon</th><th>Abbr.</th><th>AA</th></tr>");
            $("div.init-button").html("Sequencing...").addClass('init-button-clicked');

            // Start pairing codons.
            initSequence();
        }

        // STOP Alerts //
        // function stopAmber() {
        //     $("table.rna-table").append("<tr class='stop-codon'><td>"+codonPos+"</td><td class='dna-codon'>"+dnaTempArray[codonPosCode]+"</td><td class='dna-codon'>"+dnaCompArray[codonPosCode]+"</td><td>"+a[codonPosCode]+"</td><td></td><td>Amber (STOP)</td></tr>");
        // }
        // function stopOchre() {
        //     alert("RNA Sequencer: Complete.\n\n"+ codonPos + " of the " + codonCount + " detected codons were paired.\nAmino acid pairing stopped due to a stop codon.");
        // }
        // function stopOpal() {
        //     alert("RNA Sequencer: Complete.\n\n"+ codonPos + " of the " + codonCount + " detected codons were paired.\nAmino acid pairing stopped due to a stop codon.");
        // }

    });
    
    // Animated Arrow //
    (function($) {
    $.fn.seqfx = function() {
        var elements = this,
            l = elements.length,
            i = 0;

        function execute() {
            var current = $(elements[i]);
            i = (i) % l;

            current
                .fadeIn(300)
                .delay(800)
                .fadeOut(300, execute);
        }
        execute();
        return this;
    };
}(jQuery));

$(".down, h4").seqfx();
});
