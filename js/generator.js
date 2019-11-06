function article(plural, definite, vowelSound) {
    if (definite) {
        return "the";
    }
    if (plural) {
        return "";
    }
    if (vowelSound) {
        return "an";
    }
    return "a";
}

function nounPhrase(plural, definite) {
    var adj_l = randomChoice(adjectives);
    var adj = adj_l[0];
    var art = article(plural, definite, adj_l[1]);
    var noun = randomChoice(nouns)[plural ? 1 : 0];
    if (art != "") {
        return [art, adj, noun];
    }
    return [adj, noun];
}

function verb(plural, past) {
    var verb = randomChoice(verbs);
    if (past) {
        return verb[2];
    }
    if (plural) {
        return verb[0];
    }
    return verb[1];
}

function correctCase(words) {
    var c = $("input[name=case]:checked").val();
    if (c == "sentence") {
        words[0] = words[0][0].toUpperCase() + words[0].slice(1);
    } else if (c == "title") {
        for (var i = 0; i < words.length; i++) {
            words[i] = words[i][0].toUpperCase() + words[i].slice(1);
        }
    } else if (c == "upper") {
        for (var i = 0; i < words.length; i++) {
            words[i] = words[i].toUpperCase();
        }
    }
    return words;
}

function generate() {
    var subj_pl = randomBool();
    var subj_def = randomBool();
    var obj_pl = randomBool();
    var obj_def = randomBool();
    var v_past = randomBool();
    var words = nounPhrase(subj_pl, subj_def);
    words.push(verb(subj_pl, v_past));
    words = words.concat(nounPhrase(obj_pl, obj_def));
    words = correctCase(words);
    var sentence = words.join($("input[name=separator]").val()) + $("input[name=terminator]").val();
    $("#passphrase_field").val(sentence);
    evaluate();
}

function entropy(pw) {
    var n_noun = 2;
    var bits_per_noun = 12;
    var n_adj = 2;
    var bits_per_adj = 9;
    var n_verb = 1;
    var bits_per_verb = 10;
    return n_noun * bits_per_noun + n_adj * bits_per_adj + n_verb * bits_per_verb;
}

function timeToCrack(pw) {
    var result = zxcvbn(pw);
    return result.crack_times_display.offline_fast_hashing_1e10_per_second;
}

function evaluate() {
    var pw = $("#passphrase_field").val();
    $(".character_count").html(pw.length);
    $("#time_to_crack").html(timeToCrack(pw));
    $("#entropy").html(entropy(pw));

    // var result = zxcvbn(pw);
    // var feedback = [];
    // if (result.feedback.warning) {
    //     feedback.push(result.feedback.warning);
    // }
    // if (result.feedback.suggestions) {
    //     feedback = feedback.concat(result.feedback.suggestions);
    // }
    // for (var i = 0; i < feedback.length; i++) {
    //     if (feedback[i][feedback[i].length - 1] != ".") {
    //         feedback[i] += ".";
    //     }
    // }
    // var msg = feedback.join(" ");
}

function copyToClipboard() {
    $("#passphrase_field").select();
    document.execCommand("copy");
}

window.onload = function() {
    $("#generate_button").on("click", generate);
    $("#copy_button").on("click", copyToClipboard);
    $("#faq_link").on("click", function() {
        $("#faq").collapse("toggle");
        $("#options").collapse("hide");
        $("#evaluation").collapse("hide");
    });
    $("#options_link").on("click", function() {
        $("#options").collapse("toggle");
        $("#faq").collapse("hide");
        $("#evaluation").collapse("hide");
    });
    $("#eval_link").on("click", function() {
        $("#evaluation").collapse("toggle");
        $("#faq").collapse("hide");
        $("#options").collapse("hide");
    });
    $("#passphrase_field").on("input", evaluate);
    generate();
}
