// // Food photos live here so the backend never changes.
// // Order of preference: photo link set in the dashboard -> photo for this dish name -> photo for the category.
// // To use your own pictures, drop files in client/public/food/ and point to them, e.g. '/food/jollof.jpg'.
// const photo = (keywords, id) => `https://loremflickr.com/640/420/${keywords}?lock=${id}`;

// const BY_NAME = {
//   'Party Jollof Rice': photo('jollof,rice', 1),
//   'Grilled Chicken & Rice': photo('grilled,chicken', 2),
//   'Egusi Soup & Pounded Yam': photo('african,soup', 3),
//   'Ofada Rice & Ayamase': photo('rice,stew', 4),
//   'Beef Suya': photo('suya,skewers', 5),
//   'Peppered Gizzard': photo('chicken,spicy', 6),
//   'Moi Moi': photo('bean,pudding', 7),
//   'Fried Plantain': photo('fried,plantain', 8),
//   Coleslaw: photo('coleslaw,salad', 9),
//   Chapman: photo('cocktail,drink', 10),
//   Zobo: photo('hibiscus,drink', 11),
//   'Chilled Water': photo('water,bottle', 12),
//   'Puff Puff': photo('doughnut,fried', 13),
//   'Coconut Ice Cream': photo('coconut,icecream', 14),
// };

// const BY_CATEGORY = {
//   Mains: photo('rice,dinner', 20),
//   Starters: photo('grill,appetizer', 21),
//   Sides: photo('side,dish', 22),
//   Drinks: photo('drink,glass', 23),
//   Desserts: photo('dessert,sweet', 24),
// };

// export const heroImage = photo('african,food,table', 30);
// export const foodImage = (item) => item.image_url || BY_NAME[item.name] || BY_CATEGORY[item.category] || photo('food,meal', 99);



// Food photos live here so the backend never changes.
// Order of preference:
// 1. Photo link set in the dashboard
// 2. Photo for this dish name
// 3. Photo for the category
// 4. Jollof fallback

const BY_NAME = {
  'Party Jollof Rice': '/food/jollof.jpg',
  'Grilled Chicken & Rice': '/food/grilled-chicken.jpg',
  'Egusi Soup & Pounded Yam': '/food/egusi.jpg',
  'Ofada Rice & Ayamase': '/food/ofada.jpg',
  'Beef Suya': '/food/suya.jpg',
  'Peppered Gizzard': '/food/gizzard.jpg',
  'Moi Moi': '/food/moi-moi.jpg',
  'Fried Plantain': '/food/plantain.jpg',
  Coleslaw: '/food/coleslaw.jpg',
  Chapman: '/food/chapman.jpg',
  Zobo: '/food/zobo.jpg',
  'Chilled Water': '/food/water.jpg',
  'Puff Puff': '/food/puff-puff.jpg',
  'Coconut Ice Cream': '/food/coconut-ice-cream.jpg',
};

const BY_CATEGORY = {
  Mains: '/food/jollof.jpg',
  Starters: '/food/suya.jpg',
  Sides: '/food/plantain.jpg',
  Drinks: '/food/chapman.jpg',
  Desserts: '/food/coconut-ice-cream.jpg',
};

export const heroImage = '/food/hero.jpg';

export const foodImage = (item) =>
  item.image_url ||
  BY_NAME[item.name] ||
  BY_CATEGORY[item.category] ||
  '/food/jollof.jpg';