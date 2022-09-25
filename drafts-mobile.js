// Borradores para editor móvil
function installDrafts() {
    $(".header-action").prepend('<button class="mw-ui-icon mw-ui-icon-element mw-ui-icon-download" style="height: 12px;" id="saveDraft" title="Guardar borrador"></button><button class="mw-ui-icon mw-ui-icon-element mw-ui-icon-history" style="height: 12px;" id="recoverDraft" title="Recuperar borrador"></button><button class="mw-ui-icon mw-ui-icon-element mw-ui-icon-signature" style="height: 12px;" id="sign" title="Firmar"></button>');
    $("#saveDraft").click(saveDraftBtn);
    $("#recoverDraft").click(recoverDraftBtn);
    $("#sign").click(signBtn);
}

function saveDraftBtn() {
    const header = $(".overlay-title > h2 > span:first").text().match(/«([^»]+)/)[1];
    if (localStorage.getItem("mw_draft_" + header) && !confirm("Ya existe un borrador. ¿Sobreescribir?")) {
        return;
    }
    const txt = $("#wikitext-editor").val();
    if (header) {
        localStorage.setItem("mw_draft_" + header, txt);
        alert("Borrador guardado con éxito. ¡Recuerda que solo se guarda en tu navegador y que si borras las cookies se pierde!");
    }
    else {
        alert("Error... no se pudo guardar :(");
    }
}

function recoverDraftBtn() {
    const header = $(".overlay-title > h2 > span:first").text().match(/«([^»]+)/)[1];
    if (!localStorage.getItem("mw_draft_" + header)) {
        return alert("No tienes borradores guardados para este artículo");
    }
    if (confirm("Se sobreescribirá el contenido que estás editando con el de tu borrador. ¿Seguro que quieres hacer eso?")) {
        $("#wikitext-editor").val(localStorage.getItem("mw_draft_" + header));
    }
}

// https://stackoverflow.com/questions/11076975/how-to-insert-text-into-the-textarea-at-the-current-cursor-position
function typeInTextarea(newText, el) {
    const start = el.selectionStart;
    const end = el.selectionEnd;
    el.setRangeText(newText, start, end, 'select');
}

function signBtn() {
    typeInTextarea(" \~\~\~\~", $("#wikitext-editor")[0]);
}

function draftsHook() {
    if ($(".overlay-header.save-header.hideable.hidden").length && !$("#saveDraft").length) { installDrafts(); }
	setTimeout(draftsHook, 500);
}

setTimeout(draftsHook, 500);
