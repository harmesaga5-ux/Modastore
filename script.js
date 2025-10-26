const products = [
      {id:1,title:'Camiseta básica blanca',category:'hombres',price:24900,img:'img/camisetablanca.png'},
      {id:2,title:'Vestido floral',category:'mujeres',price:79900,img:'img/vestidofloral.jpg'},
      {id:3,title:'Chaqueta ligera',category:'hombres',price:129900,img:'img/chaqueta.jpg'},
      {id:4,title:'Blusa elegante',category:'mujeres',price:59900,img:'img/blusaelegante.jpg'},
      {id:5,title:'Pantalón jean',category:'hombres',price:89900,img:'img/pantalonjeans.jpg'},
      {id:6,title:'Conjunto infantil',category:'ninos',price:45900,img:'img/conjuntoniño.jpg'}
    ];

    const state = {cart:[],filtered:products.slice()};

    const catalog = document.getElementById('catalog');
    const resultCount = document.getElementById('resultCount');

    function formatCurrency(n){ return '$' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }

    function renderProducts(list){
      catalog.innerHTML='';
      list.forEach(p=>{
        const card = document.createElement('div'); card.className='card';
        card.innerHTML = `
          <img src="${p.img}" alt="${p.title}" />
          <h3>${p.title}</h3>
          <div class="small">Categoría: ${p.category}</div>
          <div class="meta"><div class="price">${formatCurrency(p.price)}</div><button class="btn btn-cursor" data-id="${p.id}">Agregar</button></div>
        `;
        catalog.appendChild(card);
      });
      resultCount.textContent = list.length;
    }

    document.getElementById('category').addEventListener('change', applyFilters);
    document.getElementById('sort').addEventListener('change', applyFilters);
    document.getElementById('searchBtn').addEventListener('click', applyFilters);
    document.getElementById('search').addEventListener('keydown', e=>{ if(e.key==='Enter') applyFilters(); });

    function applyFilters(){
      const cat = document.getElementById('category').value;
      const sort = document.getElementById('sort').value;
      const q = document.getElementById('search').value.trim().toLowerCase();
      let res = products.filter(p=> (cat==='all' || p.category===cat) && (q==='' || p.title.toLowerCase().includes(q)) );
      if(sort==='price-asc') res.sort((a,b)=>a.price-b.price);
      if(sort==='price-desc') res.sort((a,b)=>b.price-a.price);
      state.filtered = res;
      renderProducts(res);
    }
	
	function changeCategory(id){
		document.getElementById('category').value = id;		
		applyFilters();
	}

    catalog.addEventListener('click', e=>{
      if(e.target.matches('button[data-id]')){
        const id = Number(e.target.dataset.id);
        const prod = products.find(p=>p.id===id);
        addToCart(prod);
      }
    });

    function addToCart(prod){
      const found = state.cart.find(i=>i.id===prod.id);
      if(found) found.qty++;
      else state.cart.push({...prod, qty:1});
      updateCartUI();
    }

    function updateCartUI(){
      document.getElementById('cartCount').textContent = state.cart.reduce((s,i)=>s+i.qty,0);
      const cartItems = document.getElementById('cartItems'); cartItems.innerHTML='';
      state.cart.forEach(item=>{
        const el = document.createElement('div'); el.style.display='flex'; el.style.justifyContent='space-between'; el.style.marginBottom='8px';
        el.innerHTML = `<div>${item.title} <div class='small'>x${item.qty}</div></div><div>${formatCurrency(item.price*item.qty)}</div>`;
        cartItems.appendChild(el);
      });
      document.getElementById('cartTotal').textContent = formatCurrency(state.cart.reduce((s,i)=>s+i.price*i.qty,0));
    }

    document.getElementById('openCart').addEventListener('click', ()=> document.getElementById('cartModal').classList.add('open'));
    document.getElementById('closeCart').addEventListener('click', ()=> document.getElementById('cartModal').classList.remove('open'));
    document.getElementById('checkout').addEventListener('click', ()=>{
      if(state.cart.length===0) return alert('Tu carrito está vacío');
      alert('Gracias por tu compra. (Demo — aquí iría una pasarela de pago real)');
      state.cart = []; updateCartUI(); document.getElementById('cartModal').classList.remove('open');
    });

    renderProducts(products);
    updateCartUI();