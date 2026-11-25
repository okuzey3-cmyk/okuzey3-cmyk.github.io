/* Gep Gep — sekme renkleri, geçiş yönü ve menüdeki kayan seçim */
(() => {
  const ORDER = ['gezi','sky','shop','log'];
  const nav = document.querySelector('nav .in');
  const ind = document.createElement('span'); ind.className = 'ind'; nav.prepend(ind);
  function place(){
    const b = nav.querySelector('button.on'); if(!b) return;
    ind.style.width = b.offsetWidth + 'px';
    ind.style.transform = `translateX(${b.offsetLeft}px)`;
  }
  const show = App.show;
  App.show = function(tab){
    const from = ORDER.indexOf(this.tab), to = ORDER.indexOf(tab);
    document.body.dataset.dir = to >= from ? 'r' : 'l';
    document.body.dataset.tab = tab;
    show.call(this, tab);
    place();
  };
  document.body.dataset.tab = Store.get('tab', 'gezi');
  addEventListener('resize', place);
  new MutationObserver(place).observe(nav, {subtree:true, attributes:true, attributeFilter:['class']});
  requestAnimationFrame(() => { place(); setTimeout(place, 120); });
})();
