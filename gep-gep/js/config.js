/* Gep Gep — ayarlar. proxy: yapay zeka aracısının adresi. cartoKey: CARTO harita anahtarı (boşsa eski adres). contact: iletişim e-postası (boşsa gösterilmez) */
const GEP = { proxy: 'https://gepgep-ai.okuzey3.workers.dev', cartoKey: '', contact: '',
  /* Açık özellikler. Temizlenip denetlenenler buraya eklenir: 'gezi','sky','shop','log' */
  features: ['gezi','sky'],
  nearWeb: false   /* true olursa Vikipedi'den yakın yer çekilir; ticari temizlik bitene kadar kapalı */ };
