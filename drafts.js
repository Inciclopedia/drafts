function installDrafts() {
    $(".toolbar.section.section-main").append('<div class="group group-format" rel="format"><span class="tool oo-ui-widget oo-ui-widget-enabled oo-ui-buttonElement oo-ui-buttonElement-frameless oo-ui-iconElement oo-ui-buttonWidget" aria-disabled="false" rel="bold"><a class="oo-ui-buttonElement-button" role="button" title="Guardar borrador" id="saveDraft" tabindex="0" aria-disabled="false" rel="nofollow"><span class="oo-ui-iconElement-icon oo-ui-icon-download"></span><span class="oo-ui-labelElement-label"></span><span class="oo-ui-indicatorElement-indicator oo-ui-indicatorElement-noIndicator"></span></a><span class="tool oo-ui-widget oo-ui-widget-enabled oo-ui-buttonElement oo-ui-buttonElement-frameless oo-ui-iconElement oo-ui-buttonWidget" aria-disabled="false" rel="bold"><a class="oo-ui-buttonElement-button" role="button" title="Recuperar borrador" id="recoverDraft" tabindex="0" aria-disabled="false" rel="nofollow"><span class="oo-ui-iconElement-icon oo-ui-icon-history"></span><span class="oo-ui-labelElement-label"></span><span class="oo-ui-indicatorElement-indicator oo-ui-indicatorElement-noIndicator"></span></a></div>');
    $("#saveDraft").click(saveDraftBtn);
    $("#recoverDraft").click(recoverDraftBtn);
}

function saveDraftBtn() {
    const header = $("#firstHeading").text().match(/«([^»]+)/)[1];
    if (localStorage.getItem("mw_draft_" + header) && !confirm("Ya existe un borrador. ¿Sobreescribir?")) {
        return;
    }
    const txt = $("#wpTextbox1").val();
    if (header) {
        localStorage.setItem("mw_draft_" + header, txt);
        alert("Borrador guardado con éxito. ¡Recuerda que solo se guarda en tu navegador y que si borras las cookies se pierde!")
    }
    else {
        alert("Error... no se pudo guardar :(");
    }
}

function recoverDraftBtn() {
    const header = $("#firstHeading").text().match(/«([^»]+)/)[1];
    if (!localStorage.getItem("mw_draft_" + header)) {
        return alert("No tienes borradores guardados para este artículo");
    }
    if (confirm("Se sobreescribirá el contenido que estás editando con el de tu borrador. ¿Seguro que quieres hacer eso?")) {
        $("#wpTextbox1").val(localStorage.getItem("mw_draft_" + header));
    }
}