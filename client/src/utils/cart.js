import { getStoredUser } from "./auth";

const LEGACY_CART_KEY = "gsp_cart";
const GUEST_CART_KEY = "gsp_cart_guest";

function notifyCart() {
  window.dispatchEvent(new Event("gsp-cart-change"));
}

function userCartKey(userId) {
  const id = Number(userId);
  if (Number.isFinite(id) && id > 0) return `gsp_cart_u_${id}`;
  return GUEST_CART_KEY;
}

function activeStorageKey() {
  const user = getStoredUser();
  return userCartKey(user?.id);
}

function readCartAtKey(key) {
  try {
    const raw = localStorage.getItem(key);
    const a = raw ? JSON.parse(raw) : [];
    return Array.isArray(a) ? a : [];
  } catch {
    return [];
  }
}

function writeCartAtKey(key, lines) {
  localStorage.setItem(key, JSON.stringify(lines));
}

/** One-time move from pre-per-user `gsp_cart` into the guest bucket. */
function migrateLegacyGuestOnce() {
  try {
    const legacy = readCartAtKey(LEGACY_CART_KEY);
    if (legacy.length === 0) return;
    const guest = readCartAtKey(GUEST_CART_KEY);
    if (guest.length > 0) {
      localStorage.removeItem(LEGACY_CART_KEY);
      return;
    }
    writeCartAtKey(GUEST_CART_KEY, legacy);
    localStorage.removeItem(LEGACY_CART_KEY);
    notifyCart();
  } catch {
    /* ignore */
  }
}

export function getCart() {
  migrateLegacyGuestOnce();
  return readCartAtKey(activeStorageKey());
}

export function setCart(lines) {
  migrateLegacyGuestOnce();
  writeCartAtKey(activeStorageKey(), lines);
  notifyCart();
}

export function clearCart() {
  const key = activeStorageKey();
  localStorage.removeItem(key);
  if (key === GUEST_CART_KEY) {
    localStorage.removeItem(LEGACY_CART_KEY);
  }
  notifyCart();
}

export function cartItemCount(lines) {
  const list = lines ?? getCart();
  return list.reduce((sum, row) => sum + (Number(row.quantity) || 0), 0);
}

function mergeGuestIntoUserLines(userLines, guestLines) {
  const byId = new Map();
  for (const line of userLines) {
    const id = Number(line.product_id);
    if (id) byId.set(id, { ...line });
  }
  for (const g of guestLines) {
    const id = Number(g.product_id);
    if (!id) continue;
    const stock = Number(g.stock);
    const addQ = Math.max(0, Math.floor(Number(g.quantity) || 0));
    const prev = byId.get(id);
    if (prev) {
      const current = Number(prev.quantity) || 0;
      const cap =
        Number.isFinite(stock) && stock > 0 ? stock : current + addQ;
      const nextQty = Math.min(current + addQ, cap);
      byId.set(id, {
        ...prev,
        ...g,
        quantity: nextQty,
        stock: Number.isFinite(stock) && stock > 0 ? stock : prev.stock,
      });
    } else {
      const cap = Number.isFinite(stock) && stock > 0 ? stock : addQ;
      const q = Math.min(addQ, cap);
      byId.set(id, { ...g, quantity: q });
    }
  }
  return Array.from(byId.values());
}

/**
 * After sign-in: fold the anonymous cart into this account's cart, then clear guest storage.
 */
export function mergeGuestCartIntoUserAfterLogin(userId) {
  const uid = Number(userId);
  if (!Number.isFinite(uid) || uid <= 0) return;
  migrateLegacyGuestOnce();
  const guest = readCartAtKey(GUEST_CART_KEY);
  if (guest.length === 0) return;
  const uKey = userCartKey(uid);
  const merged = mergeGuestIntoUserLines(readCartAtKey(uKey), guest);
  writeCartAtKey(uKey, merged);
  localStorage.removeItem(GUEST_CART_KEY);
  notifyCart();
}

/**
 * @param {object} product — row from products API
 * @param {number} qty
 */
export function addToCart(product, qty = 1) {
  const id = Number(product?.id);
  if (!id) return { ok: false, message: "Invalid product" };
  const stock = Number(product.stock);
  const addQty = Math.max(1, Math.floor(Number(qty) || 1));
  if (!Number.isFinite(stock) || stock <= 0) {
    return { ok: false, message: "This product is out of stock" };
  }

  const lines = getCart();
  const idx = lines.findIndex((l) => Number(l.product_id) === id);
  const current = idx >= 0 ? Number(lines[idx].quantity) || 0 : 0;
  const nextQty = current + addQty;
  if (nextQty > stock) {
    return {
      ok: false,
      message: `Only ${stock} in stock (you already have ${current} in cart).`,
    };
  }

  const line = {
    product_id: id,
    quantity: nextQty,
    name: product.name ?? "Product",
    price: Number(product.price) || 0,
    image: product.image ?? "",
    stock,
  };

  if (idx >= 0) {
    lines[idx] = { ...lines[idx], ...line, quantity: nextQty };
  } else {
    lines.push(line);
  }
  setCart(lines);
  return { ok: true };
}

export function updateCartLineQuantity(productId, quantity) {
  const id = Number(productId);
  const q = Math.max(0, Math.floor(Number(quantity) || 0));
  const lines = getCart();
  const idx = lines.findIndex((l) => Number(l.product_id) === id);
  if (idx < 0) return;

  const prev = lines[idx];
  const rest = lines.filter((l) => Number(l.product_id) !== id);
  if (q <= 0) {
    setCart(rest);
    return;
  }
  const stock = Number(prev.stock);
  const use = Math.min(q, Number.isFinite(stock) && stock > 0 ? stock : q);
  rest.push({ ...prev, quantity: use });
  setCart(rest);
}
