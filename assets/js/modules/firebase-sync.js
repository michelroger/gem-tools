/**
 * Módulo de Integração com Firebase Firestore
 * Gerencia a sincronização de alunos (offline-first) e envio de métricas de acesso.
 */
(function () {
  'use strict';

  var db = null;
  var isInitialized = false;
  var activeListenerUnsubscribe = null;
  var activeListenerSyncCode = null;

  // Verifica se as credenciais configuradas são válidas (não são os placeholders)
  function isValidConfig(cfg) {
    if (!cfg) return false;
    return cfg.apiKey && cfg.apiKey !== 'SEU_API_KEY' && cfg.projectId && cfg.projectId !== 'SEU_PROJECT_ID';
  }

  // Inicializa o Firebase Firestore com persistência offline
  function initFirebase() {
    if (typeof firebase === 'undefined') {
      console.warn('Firebase SDK não carregado. Operando em modo offline local.');
      return;
    }

    var config = window.firebaseConfig;
    if (!isValidConfig(config)) {
      console.info('Firebase não configurado ou credenciais de exemplo em firebase-config.js. Sincronização em nuvem desativada.');
      return;
    }

    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(config);
      }
      
      // Ativa o cache persistente do Firestore no IndexedDB (nativo do SDK v8/v9 compat)
      db = firebase.firestore();
      db.settings({
        cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
      });
      
      // Tenta habilitar persistência offline (tratando erro se múltiplas abas estiverem abertas)
      db.enablePersistence().catch(function (err) {
        if (err.code === 'failed-precondition') {
          console.warn('Persistência offline do Firestore falhou: múltiplas abas abertas.');
        } else if (err.code === 'unimplemented') {
          console.warn('Persistência offline do Firestore não suportada pelo navegador atual.');
        }
      });

      isInitialized = true;
      console.log('Firebase Firestore inicializado com persistência offline com sucesso.');
    } catch (error) {
      console.error('Erro ao inicializar Firebase:', error);
    }
  }

  // Obtém informações básicas sobre o dispositivo/navegador do usuário
  function getDeviceInfo() {
    try {
      var ua = navigator.userAgent;
      var M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
      var tem;
      if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
      }
      if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
      }
      M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
      if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
      
      var os = 'Unknown OS';
      if (navigator.appVersion.indexOf('Win') !== -1) os = 'Windows';
      if (navigator.appVersion.indexOf('Mac') !== -1) os = 'MacOS';
      if (navigator.appVersion.indexOf('X11') !== -1) os = 'UNIX';
      if (navigator.appVersion.indexOf('Linux') !== -1) os = 'Linux';
      if (/Android/i.test(ua)) os = 'Android';
      if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';

      return os + ' (' + M.join(' v') + ')';
    } catch (e) {
      return 'Navegador Desconhecido';
    }
  }

  // Conta a quantidade de hinos e lições marcados para o resumo de progresso
  function getProgressSummary(student) {
    var hinosCount = 0;
    var estudosCount = 0;

    if (student && student.hinos) {
      ['do', 'mib', 'sib'].forEach(function (afin) {
        var book = student.hinos[afin] || {};
        Object.keys(book).forEach(function (key) {
          var entry = book[key] || {};
          // Se tiver alguma voz aprovada
          if (entry.S || entry.C || entry.T || entry.B) {
            hinosCount++;
          }
        });
      });
    }

    if (student && student.estudos) {
      var colecao = student.estudos['metodo-inclusivo-ccb'] || {};
      Object.keys(colecao).forEach(function (instKey) {
        var instEstudos = colecao[instKey] || {};
        Object.keys(instEstudos).forEach(function (itemId) {
          var entry = instEstudos[itemId] || {};
          if (entry.aprovada) {
            estudosCount++;
          }
        });
      });
    }

    var existingSummary = (student && student.progressSummary) ? student.progressSummary : {};

    return {
      hinosAprovados: hinosCount,
      licoesAprovadas: estudosCount,
      staffHighScore: typeof existingSummary.staffHighScore === 'number' ? existingSummary.staffHighScore : 0,
      staffBestTime: typeof existingSummary.staffBestTime === 'number' ? existingSummary.staffBestTime : 0,
      staffRushHighScore: typeof existingSummary.staffRushHighScore === 'number' ? existingSummary.staffRushHighScore : 0,
      staffRushHinoHighScore: typeof existingSummary.staffRushHinoHighScore === 'number' ? existingSummary.staffRushHinoHighScore : 0
    };
  }

  // API Pública do módulo de sincronização
  var FirebaseSync = {
    // Retorna se o banco remoto está ativo
    isActive: function () {
      return isInitialized && db !== null;
    },

    // Inicializa o Firebase (chamado após carregar as chaves)
    init: function () {
      initFirebase();
    },

    // Gera um código de sincronização aleatório e único de 6 caracteres
    generateSyncCode: function () {
      var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Evita caracteres confusos como O, 0, I, 1
      var code = '';
      for (var i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    },

    // Envia os dados do aluno para a nuvem
    uploadStudent: function (student, callback) {
      if (!this.isActive() || !student || !student.syncCode) {
        if (callback) callback(null);
        return;
      }

      var code = student.syncCode.toUpperCase().trim();
      var summary = getProgressSummary(student);

      // Copia profunda para não poluir o objeto local com metadados do banco
      var payload = JSON.parse(JSON.stringify(student));
      
      // Adiciona metadados e informações de métricas
      payload.syncCode = code;
      payload.lastActive = firebase.firestore.FieldValue.serverTimestamp();
      payload.deviceInfo = getDeviceInfo();
      payload.progressSummary = summary;

      db.collection('students').doc(code).set(payload, { merge: true })
        .then(function () {
          if (callback) callback(true);
        })
        .catch(function (err) {
          console.error('Erro ao enviar dados do aluno:', err);
          if (callback) callback(false, err);
        });
    },

    // Baixa os dados de um aluno a partir de seu código de sincronização
    downloadStudent: function (syncCode, callback) {
      if (!this.isActive() || !syncCode) {
        if (callback) callback(null, 'Serviço desativado');
        return;
      }

      var code = syncCode.toUpperCase().trim();

      db.collection('students').doc(code).get()
        .then(function (doc) {
          if (doc.exists) {
            var data = doc.data();
            // Limpa timestamps do Firestore para evitar problemas de JSON stringify locais
            if (data.lastActive) delete data.lastActive;
            if (callback) callback(data);
          } else {
            if (callback) callback(null, 'Código de sincronização não encontrado.');
          }
        })
        .catch(function (err) {
          console.error('Erro ao baixar aluno:', err);
          if (callback) callback(null, err.message || 'Erro de conexão.');
        });
    },

    // Escuta alterações do aluno em tempo real para sincronização entre aparelhos
    listenToStudent: function (syncCode, onUpdateCallback) {
      if (!this.isActive() || !syncCode || !onUpdateCallback) return;

      var code = syncCode.toUpperCase().trim();

      // Se já estivermos escutando o mesmo código, não recria o listener
      if (activeListenerUnsubscribe && activeListenerSyncCode === code) {
        return;
      }

      // Cancela o ouvinte anterior se houver
      if (activeListenerUnsubscribe) {
        activeListenerUnsubscribe();
        activeListenerUnsubscribe = null;
      }

      activeListenerSyncCode = code;

      try {
        activeListenerUnsubscribe = db.collection('students').doc(code).onSnapshot(function (doc) {
          if (doc.exists) {
            var data = doc.data();
            // Limpa timestamps
            if (data.lastActive) delete data.lastActive;
            onUpdateCallback(data);
          }
        }, function (err) {
          console.error('Erro no listener em tempo real do Firestore:', err);
          activeListenerSyncCode = null;
        });
      } catch (e) {
        console.error('Falha ao registrar listener:', e);
        activeListenerSyncCode = null;
      }
    },

    // Cancela a escuta ativa de alterações
    stopListening: function () {
      if (activeListenerUnsubscribe) {
        activeListenerUnsubscribe();
        activeListenerUnsubscribe = null;
      }
      activeListenerSyncCode = null;
    },

    // Incrementa contagem de uso de uma funcionalidade específica (métrica)
    logFeatureUse: function (featureId) {
      if (!this.isActive() || !featureId) return;

      try {
        var ref = db.collection('metrics').doc('features');
        var updateObj = {};
        updateObj[featureId] = firebase.firestore.FieldValue.increment(1);

        ref.set(updateObj, { merge: true }).catch(function (err) {
          // Falha silenciosa para não interromper a navegação do usuário
          console.debug('Erro ao registrar métrica de funcionalidade:', err);
        });
      } catch (e) { }
    },

    // Incrementa a contagem de execuções de um hino/lição do método
    logItemPlay: function (itemId, collectionId) {
      if (!this.isActive() || !itemId) return;

      try {
        var collName = collectionId || 'hinario5';
        var docName = collName === 'metodo-inclusivo-ccb' ? 'lessons' : 'hymns';
        var ref = db.collection('metrics').doc(docName);
        
        var fieldKey = String(itemId).replace(/\./g, '_'); // Evita problemas com pontos no nome da chave do documento
        var updateObj = {};
        updateObj[fieldKey] = firebase.firestore.FieldValue.increment(1);

        ref.set(updateObj, { merge: true }).catch(function (err) {
          console.debug('Erro ao registrar métrica de item tocado:', err);
        });
      } catch (e) { }
    },

    // Busca todos os alunos cadastrados no Firestore (para o Modo Professor)
    fetchAllStudents: function (callback) {
      if (!this.isActive()) {
        if (callback) callback(null, 'Serviço desativado');
        return;
      }

      db.collection('students').get()
        .then(function (querySnapshot) {
          var list = [];
          querySnapshot.forEach(function (doc) {
            var data = doc.data();
            if (data.lastActive) {
              try {
                var date = data.lastActive.toDate();
                data.lastActiveFormatted = date.toLocaleString('pt-BR');
              } catch (e) {
                data.lastActiveFormatted = 'Data desconhecida';
              }
              delete data.lastActive;
            } else {
              data.lastActiveFormatted = 'Sem registro';
            }
            list.push(data);
          });
          
          list.sort(function (a, b) {
            var nameA = (a.name || '').toLowerCase();
            var nameB = (b.name || '').toLowerCase();
            return nameA.localeCompare(nameB, 'pt-BR');
          });

          if (callback) callback(list);
        })
        .catch(function (err) {
          console.error('Erro ao buscar alunos para o Modo Professor:', err);
          if (callback) callback(null, err.message || 'Erro de conexão.');
        });
    },

    // Busca os dados das coleções de métricas
    fetchMetrics: function (callback) {
      if (!this.isActive()) {
        if (callback) callback(null, 'Serviço desativado');
        return;
      }

      var metricsData = {
        features: {},
        hymns: {},
        lessons: {}
      };

      db.collection('metrics').get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            metricsData[doc.id] = doc.data() || {};
          });
          if (callback) callback(metricsData);
        })
        .catch(function (err) {
          console.error('Erro ao buscar métricas:', err);
          if (callback) callback(null, err.message || 'Erro ao carregar.');
        });
    }
  };

  // Expõe no escopo global
  window.FirebaseSync = FirebaseSync;

  // Inicializa assim que o script terminar de ser analisado
  // (firebase-config.js precisa ser carregado antes deste arquivo no HTML)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFirebase);
  } else {
    initFirebase();
  }
})();
