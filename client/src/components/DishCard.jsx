import { useState } from 'react';
import { money } from '../lib/api.js';
import { foodImage } from '../lib/foodImages.js';

export default function DishCard({ dish, qty, onChange }) {
  const [broken, setBroken] = useState(false);
  return (
    <article className={`card flex flex-col overflow-hidden ${dish.available ? '' : 'opacity-60'}`}>
      {broken ? (
        <div className="grid h-44 place-items-center bg-brand-50 text-5xl font-extrabold text-brand-600">{dish.name[0]}</div>
      ) : (
        <img src={foodImage(dish)} alt={dish.name} loading="lazy" onError={() => setBroken(true)} className="h-44 w-full object-cover" />
      )}
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-semibold">{dish.name}</h3>
        <p className="text-sm text-stone-500">{dish.description}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <strong>{money(dish.price)}</strong>
          {!dish.available ? (
            <span className="text-sm text-stone-400">Sold out</span>
          ) : qty ? (
            <span className="flex items-center gap-3">
              <button className="h-8 w-8 rounded-full border border-stone-300" onClick={() => onChange(dish.id, -1)} aria-label={`Remove one ${dish.name}`}>−</button>
              <span className="w-4 text-center font-semibold">{qty}</span>
              <button className="h-8 w-8 rounded-full bg-brand-600 text-white" onClick={() => onChange(dish.id, 1)} aria-label={`Add one ${dish.name}`}>+</button>
            </span>
          ) : (
            <button className="btn-primary py-1.5" onClick={() => onChange(dish.id, 1)}>Add for pickup</button>
          )}
        </div>
      </div>
    </article>
  );
}
