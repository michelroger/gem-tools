/* Eventos DOM da tela Hinos (logica nos handlers de window.HinosBindingAccess). */
(function () {
  'use strict';

  function bindHinosEvents() {
    var a = window.HinosBindingAccess;
    if (!a) return;

    var sel = document.getElementById('hinosStudentSelect');
    if (sel) {
      sel.addEventListener('change', function () {
        a.onStudentSelectChange(sel.value || null);
      });
    }
    var vozActive = document.getElementById('hinosActiveStudentVoz');
    if (vozActive) {
      vozActive.addEventListener('change', function () {
        a.onActiveStudentVozChange(vozActive.value);
      });
    }
    var addBtn = document.getElementById('hinosAddStudent');
    if (addBtn) {
      addBtn.addEventListener('click', function () {
        a.tryAddStudentFromModal();
      });
    }
    var nameInp = document.getElementById('hinosNewStudentName');
    if (nameInp) {
      nameInp.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          a.tryAddStudentFromModal();
        }
      });
    }
    var remBtn = document.getElementById('hinosRemoveStudent');
    if (remBtn) {
      remBtn.addEventListener('click', function () {
        a.removeActiveStudentIfConfirmed();
      });
    }
    var expBtn = document.getElementById('hinosExportBackup');
    if (expBtn) {
      expBtn.addEventListener('click', function () {
        a.exportBackup();
      });
    }
    var impBtn = document.getElementById('hinosImportBackup');
    var impFile = document.getElementById('hinosImportBackupFile');
    if (impBtn && impFile) {
      impBtn.addEventListener('click', function () {
        impFile.value = '';
        impFile.click();
      });
      impFile.addEventListener('change', function () {
        var f = impFile.files && impFile.files[0];
        if (!f) return;
        var reader = new FileReader();
        reader.onload = function () {
          a.onImportBackupText(String(reader.result || ''));
        };
        reader.onerror = function () {
          a.onImportBackupReadError();
        };
        reader.readAsText(f, 'UTF-8');
      });
    }
    document.querySelectorAll('.hinos-afin-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var af = btn.getAttribute('data-hinos-afin');
        if (af) a.onAfinaçãoTabClick(af);
      });
    });
    var prev = document.getElementById('hinosPrev');
    var next = document.getElementById('hinosNext');
    var numIn = document.getElementById('hinosHinoNum');
    if (prev && numIn) {
      prev.addEventListener('click', function () {
        a.onHinoPrev(numIn);
      });
    }
    if (next && numIn) {
      next.addEventListener('click', function () {
        a.onHinoNext(numIn);
      });
    }
    if (numIn) {
      numIn.addEventListener('change', function () {
        a.onHinoNumChange(numIn);
      });
    }
    document.querySelectorAll('.hinos-voz-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var v = btn.getAttribute('data-hinos-voice');
        if (v) a.onVoiceButtonClick(v);
      });
    });
    document.querySelectorAll('.hinos-study-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var flag = btn.getAttribute('data-hinos-study');
        if (flag) a.onStudyFlagClick(flag);
      });
    });
    var clr = document.getElementById('hinosClearHino');
    if (clr) {
      clr.addEventListener('click', function () {
        a.clearCurrentHinoVoices();
      });
    }
    var hinosEditModal = document.getElementById('hinosEditorModal');
    var hinosEditClose = document.getElementById('hinosEditorClose');
    if (hinosEditClose) {
      hinosEditClose.addEventListener('click', function () {
        a.closeEditorModal();
      });
    }
    if (hinosEditModal) {
      hinosEditModal.addEventListener('click', function (e) {
        if (e.target === hinosEditModal) a.closeEditorModal();
      });
    }
    var hinosNewModal = document.getElementById('hinosNewStudentModal');
    var hinosNewClose = document.getElementById('hinosNewStudentClose');
    var hinosNewCancel = document.getElementById('hinosNewStudentCancel');
    var hinosOpenNewBtn = document.getElementById('hinosOpenNewStudentModal');
    if (hinosNewClose) {
      hinosNewClose.addEventListener('click', a.closeNewStudentModal);
    }
    if (hinosNewCancel) {
      hinosNewCancel.addEventListener('click', a.closeNewStudentModal);
    }
    if (hinosOpenNewBtn) {
      hinosOpenNewBtn.addEventListener('click', a.openNewStudentModal);
    }
    if (hinosNewModal) {
      hinosNewModal.addEventListener('click', function (e) {
        if (e.target === hinosNewModal) a.closeNewStudentModal();
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      a.onDocumentEscapeKey(e);
    });
  }

  window.HinosEvents = {
    bindHinosEvents: bindHinosEvents
  };
})();
