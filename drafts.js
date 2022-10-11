/*
----------------------
FUNCIÓN DE BORRADORES
----------------------

En alpha perpetua - By Marquii
*/
var draftsInstalled = false;

function installDrafts() {
    $(".toolbar.section.section-main").append('<div class="group group-format" rel="format"><span class="tool oo-ui-widget oo-ui-widget-enabled oo-ui-buttonElement oo-ui-buttonElement-frameless oo-ui-iconElement oo-ui-buttonWidget" aria-disabled="false" rel="bold"><a class="oo-ui-buttonElement-button" role="button" title="Guardar borrador" id="saveDraft" tabindex="0" aria-disabled="false" rel="nofollow"><span class="oo-ui-iconElement-icon oo-ui-icon-download"></span><span class="oo-ui-labelElement-label"></span><span class="oo-ui-indicatorElement-indicator oo-ui-indicatorElement-noIndicator"></span></a></span><span class="tool oo-ui-widget oo-ui-widget-enabled oo-ui-buttonElement oo-ui-buttonElement-frameless oo-ui-iconElement oo-ui-buttonWidget" aria-disabled="false" rel="bold"><a class="oo-ui-buttonElement-button" role="button" title="Recuperar borrador" id="recoverDraft" tabindex="0" aria-disabled="false" rel="nofollow"><span class="oo-ui-iconElement-icon oo-ui-icon-history"></span><span class="oo-ui-labelElement-label"></span><span class="oo-ui-indicatorElement-indicator oo-ui-indicatorElement-noIndicator"></span></a></span><span class="tool oo-ui-widget oo-ui-widget-enabled oo-ui-buttonElement oo-ui-buttonElement-frameless oo-ui-iconElement oo-ui-buttonWidget" aria-disabled="false" rel="bold"><a class="oo-ui-buttonElement-button" role="button" title="Firmar" id="sign" tabindex="0" aria-disabled="false" rel="nofollow"><span class="oo-ui-iconElement-icon oo-ui-icon-signature"></span><span class="oo-ui-labelElement-label"></span><span class="oo-ui-indicatorElement-indicator oo-ui-indicatorElement-noIndicator"></span></a></span></div>');
    $("#saveDraft").click(saveDraftBtn);
    $("#recoverDraft").click(recoverDraftBtn);
    $("#sign").click(signBtn);
    draftsInstalled = true;
}

function saveDraft() {
    if (window.isSaving) {
        return alert("Estoy guardando...");
    }
    window.isSaving = true;
    savedQuery = "https://inciclopedia.org/w/api.php?action=query&prop=revisions&titles=Usuario:" + encodeURIComponent(mw.config.values['wgUserName'] + "/Borradores/" + mw.config.values['wgPageName']) + "&rvprop=content&formatversion=2&format=json";
    console.log("GET a " + savedQuery);
    $.getJSON({
        url: savedQuery
    }).done(function (data) {
        const txt = $("#wpTextbox1").val();
        if (data["query"] && data["query"]["pages"] && data["query"]["pages"][0] && data["query"]["pages"][0]["revisions"] && data["query"]["pages"][0]["revisions"][0] && !confirm("Ya existe un borrador. ¿Sobreescribir?")) {
            window.isSaving = false;
            return;
        }
        console.log("A por el CSRF");
        $.getJSON({
            url: "https://inciclopedia.org/w/api.php?action=query&meta=tokens&format=json"
        }).done(function (data) {
            csrfToken = data["query"]["tokens"]["csrftoken"];
            query = "https://inciclopedia.org/w/api.php"
            console.log("POST a " + query);
            $.post(query, {
                "action": "edit",
                "title": "Usuario:" + mw.config.values['wgUserName'] + "/Borradores/" + mw.config.values['wgPageName'],
                "token": csrfToken,
                "minor": true,
                "summary": "Guardando borrador",
                "text": txt,
                "format": "json"
            }, function(data) {
                if (data && data["edit"] && data["edit"]["result"] == "Success") {
                    alert("Borrador guardado en tu página de usuario! Puedes verlo en Usuario:" + mw.config.values['wgUserName'] + "/Borradores/" + mw.config.values['wgPageName'])
                } else {
                    alert("Es posible que algo haya ido mal guardando el borrador :(");
                }
                window.isSaving = false;
            })
        });
    });
}

function recoverDraft() {
    $.getJSON({
        url: "https://inciclopedia.org/w/api.php?action=query&prop=revisions&titles=Usuario:" + encodeURIComponent(mw.config.values['wgUserName'] + "/Borradores/" + mw.config.values['wgPageName']) + "&rvprop=content&formatversion=2&format=json"
    }).done(function (data) {
        if (data["query"] && data["query"]["pages"] && data["query"]["pages"][0] && data["query"]["pages"][0]["revisions"] && data["query"]["pages"][0]["revisions"][0]) {
            wikitext = data["query"]["pages"][0]["revisions"][0]["content"];
            if (confirm("Se sobreescribirá el contenido que estás editando con el de tu borrador. ¿Seguro que quieres hacer eso?")) {
                $("#wpTextbox1").val(wikitext);
            }
        } else {
            return alert("No tienes borradores guardados para este artículo");
        }
    });
}

// https://stackoverflow.com/questions/11076975/how-to-insert-text-into-the-textarea-at-the-current-cursor-position
function typeInTextarea(newText, el) {
    const start = el.selectionStart;
    const end = el.selectionEnd;
    el.setRangeText(newText, start, end, 'select');
}

function signBtn() {
    typeInTextarea("\~\~\~\~", $("#wpTextbox1")[0]);
}

function draftsHook() {
	if (draftsInstalled) { return; }
	if ($("#wikiEditor-ui-toolbar").length) { installDrafts(); } else { setTimeout(draftsHook, 500); }
}

setTimeout(draftsHook, 500);