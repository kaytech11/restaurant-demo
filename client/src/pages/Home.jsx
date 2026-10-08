

// import { useEffect, useMemo, useState } from 'react';
// import { api, money } from '../lib/api.js'; import { heroImage } from '../lib/foodImages.js';
// import useCart from '../hooks/useCart.js';
// import Navbar from '../components/Navbar.jsx';
// import DishCard from '../components/DishCard.jsx';
// import CartDrawer from '../components/CartDrawer.jsx';

// export default function Home() {
//   const [menu, setMenu] = useState([]); const [category, setCategory]
//     = useState('All'); const [open, setOpen] = useState(false); const [placed, setPlaced] = useState(null);
//   const [error, setError] = useState('');
//   const { cart, lines, count, total, change, clear }
//     = useCart(menu);
//   useEffect(() => { api('/menu').then(setMenu).catch((e) => setError(e.message)); }, []);categories = useMemo(() => 
//     ['All', ...new Set(menu.map((m) => m.category))], [menu]);
//   const visible = menu.filter((m) => category === 'All' || m.category === category);
//   return (<div className="restaurant-page"> 
//   <Navbar count={count} onCart={() => setOpen(true)} />
//      {/* HERO */} <section className="restaurant-hero"> 
//       <img src={heroImage} alt="" className="hero-image absolute inset-0 -z-10 h-full w-full object-cover opacity-70"
//        onError={(e) => (e.currentTarget.style.display = 'none')} /> 
//        <div className="mx-auto flex min-h-[570px] max-w-6xl items-center px-4 py-16 md:py-24"> 
//         <div className="hero-content max-w-2xl text-white"> 
//           <div className="hero-kicker mb-4 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.28em] text-amber-300"> 
//             <span className="h-px w-10 bg-amber-400" /> Mama's Kitchen </div> <h1 className="hero-title max-w-2xl font-serif text-5xl 
//             font-bold leading-[1.05] tracking-tight md:text-7xl"> Hot food, <br /> 
//             <span className="text-amber-300">made with love.</span> </h1> <p className="hero-description mt-5 max-w-xl text-base leading-7 text-stone-200 md:text-lg"> F
//               reshly prepared Nigerian favourites, packed with flavour and delivered straight to your door. </p> <div className="hero-button mt-8 flex flex-wrap gap-3"> <a href="#menu" className="group inline-flex items-center gap-3 rounded-full bg-amber-500 px-7 py-3.5 font-semibold text-stone-950 shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-amber-400" > Explore the menu <span className="transition-transform duration-300 group-hover:translate-x-1"> → </span> </a> <button onClick={() => setOpen(true)} className="rounded-full border border-white/30 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/20" > View basket </button> </div> <div className="hero-button mt-8 flex flex-wrap gap-5 text-sm text-stone-300"> <span>✦ Freshly prepared</span> <span>✦ Fast delivery</span> <span>✦ Easy ordering</span> </div> </div> </div> <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-stone-50 to-transparent" /> </section> <main id="menu" className="menu-section mx-auto max-w-6xl px-4 py-12 md:py-16"> {placed && (<div className="order-success mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-900 shadow-sm"> Order #{placed.id} received. Total {money(placed.total)}. We're preparing it now. </div>)} {error && (<div className="error-notice mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700"> {error} </div>)} {/* MENU INTRO */} <div className="mb-8 text-center"> <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-amber-600"> From our kitchen </p> <h2 className="restaurant-heading text-4xl md:text-5xl"> What are you craving? </h2> <div className="mx-auto mt-4 flex items-center justify-center gap-3"> <span className="h-px w-12 bg-amber-300" /> <span className="text-amber-600">✦</span> <span className="h-px w-12 bg-amber-300" /> </div> <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-stone-500"> Take a look through our menu and choose your favourite. Good food is only a few clicks away. </p> </div> {/* CATEGORY TABLE */} <div className="menu-category-bar mb-8 overflow-x-auto pb-2"> <div className="flex min-w-max justify-center gap-2"> {categories.map((c) => (<button key={c} className={c === category ? 'pill-on' : 'pill-off'} onClick={() => setCategory(c)} > {c} </button>))} </div> </div> {/* MENU */} <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"> {visible.map((m, index) => (<div key={m.id} className="menu-item" style={{ animationDelay: `${index * 90}ms`, }} > <div className="restaurant-card h-full"> <DishCard dish={m} qty={cart[m.id]} onChange={change} /> </div> </div>))} </div> </main> {/* FOOTER */} <footer className="restaurant-footer border-t border-stone-200 bg-stone-950 px-4 py-10 text-center text-sm text-stone-400"> <div className="mx-auto max-w-6xl"> <div className="font-serif text-2xl font-bold text-white"> Mama's Kitchen </div> <p className="mt-2 text-stone-500"> Made with love. Served with flavour. </p> <div className="mx-auto mt-5 h-px max-w-xs bg-stone-800" /> <p className="mt-5 text-xs text-stone-600"> © Mama's Kitchen. Demo restaurant. </p> </div> </footer> {open && (<CartDrawer lines={lines} total={total} change={change} onClose={() => setOpen(false)} onPlaced={(order) => { setPlaced(order); clear(); setOpen(false); window.scrollTo({ top: 0, behavior: 'smooth', }); }} />)} </div>);
// }


import { useEffect, useMemo, useState } from 'react';
import { api, money } from '../lib/api.js';
import { heroImage } from '../lib/foodImages.js';
import useCart from '../hooks/useCart.js';
import Navbar from '../components/Navbar.jsx';
import DishCard from '../components/DishCard.jsx';
import CartDrawer from '../components/CartDrawer.jsx';

export default function Home() {
  const [menu, setMenu] = useState([]);
  const [category, setCategory] = useState('All');
  const [open, setOpen] = useState(false);
  const [placed, setPlaced] = useState(null);
  const [error, setError] = useState('');

  const { cart, lines, count, total, change, clear } = useCart(menu);

  useEffect(() => {
    api('/menu')
      .then(setMenu)
      .catch((e) => setError(e.message));
  }, []);

  const categories = useMemo(
    () => ['All', ...new Set(menu.map((m) => m.category))],
    [menu]
  );

  const visible = menu.filter(
    (m) => category === 'All' || m.category === category
  );

  return (
    <div className="restaurant-page">
      <Navbar count={count} onCart={() => setOpen(true)} />

      {/* HERO */}
      <section className="restaurant-hero">
        <img
          src={heroImage}
          alt=""
          className="hero-image absolute inset-0 -z-10 h-full w-full object-cover opacity-70"
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />

        <div className="mx-auto flex min-h-[570px] max-w-6xl items-center px-4 py-16 md:py-24">
          <div className="hero-content max-w-2xl text-white">
            <div className="hero-kicker mb-4 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.28em] text-amber-300">
              <span className="h-px w-10 bg-amber-400" />
              Mama's Kitchen
            </div>

            <h1 className="hero-title max-w-2xl font-serif text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
              Hot food,
              <br />
              <span className="text-amber-300">made with love.</span>
            </h1>

            <p className="hero-description mt-5 max-w-xl text-base leading-7 text-stone-200 md:text-lg">
              Freshly prepared Nigerian favourites, packed with flavour and
              delivered straight to your door.
            </p>

            <div className="hero-button mt-8 flex flex-wrap gap-3">
              <a
                href="#menu"
                className="group inline-flex items-center gap-3 rounded-full bg-amber-500 px-7 py-3.5 font-semibold text-stone-950 shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-amber-400"
              >
                Explore the menu
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>

              <button
                onClick={() => setOpen(true)}
                className="rounded-full border border-white/30 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/20"
              >
                View basket
              </button>
            </div>

            <div className="hero-button mt-8 flex flex-wrap gap-5 text-sm text-stone-300">
              <span>✦ Freshly prepared</span>
              <span>✦ Fast delivery</span>
              <span>✦ Easy ordering</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-stone-50 to-transparent" />
      </section>

      <main
        id="menu"
        className="menu-section mx-auto max-w-6xl px-4 py-12 md:py-16"
      >
        {placed && (
          <div className="order-success mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-900 shadow-sm">
            Order #{placed.id} received. Total {money(placed.total)}. We're
            preparing it now.
          </div>
        )}

        {error && (
          <div className="error-notice mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* MENU INTRO */}
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-amber-600">
            From our kitchen
          </p>

          <h2 className="restaurant-heading text-4xl md:text-5xl">
            What are you craving?
          </h2>

          <div className="mx-auto mt-4 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-amber-300" />
            <span className="text-amber-600">✦</span>
            <span className="h-px w-12 bg-amber-300" />
          </div>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-stone-500">
            Take a look through our menu and choose your favourite. Good food
            is only a few clicks away.
          </p>
        </div>

        {/* CATEGORY TABLE */}
        <div className="menu-category-bar mb-8 overflow-x-auto pb-2">
          <div className="flex min-w-max justify-center gap-2">
            {categories.map((c) => (
              <button
                key={c}
                className={c === category ? 'pill-on' : 'pill-off'}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* MENU */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((m, index) => (
            <div
              key={m.id}
              className="menu-item"
              style={{
                animationDelay: `${index * 90}ms`,
              }}
            >
              <div className="restaurant-card h-full">
                <DishCard
                  dish={m}
                  qty={cart[m.id]}
                  onChange={change}
                />
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="restaurant-footer border-t border-stone-200 bg-stone-950 px-4 py-10 text-center text-sm text-stone-400">
        <div className="mx-auto max-w-6xl">
          <div className="font-serif text-2xl font-bold text-white">
            Mama's Kitchen
          </div>

          <p className="mt-2 text-stone-500">
            Made with love. Served with flavour.
          </p>

          <div className="mx-auto mt-5 h-px max-w-xs bg-stone-800" />

          <p className="mt-5 text-xs text-stone-600">
            © Mama's Kitchen. Demo restaurant.
          </p>
        </div>
      </footer>

      {open && (
        <CartDrawer
          lines={lines}
          total={total}
          change={change}
          onClose={() => setOpen(false)}
          onPlaced={(order) => {
            setPlaced(order);
            clear();
            setOpen(false);
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            });
          }}
        />
      )}
    </div>
  );
}