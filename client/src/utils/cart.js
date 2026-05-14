const KEY = "gsp_cart";

function notifyCart() {
  window.dispatchEvent(new Event("gsp-cart-change"));
}

export function getCart() {
  try {
    const raw = localStorage.getItem(KEY);
    const a = raw ? JSON.parse(raw) : [];
    return Array.isArray(a) ? a : [];
  } catch {
    return [];
  }
}

export function setCart(lines) {
  localStorage.setItem(KEY, JSON.stringify(lines));
  notifyCart();
}

export function clearCart() {
  localStorage.removeItem(KEY);
  notifyCart();
}

export function cartItemCount(lines) {
  const list = lines ?? getCart();
  return list.reduce((sum, row) => sum + (Number(row.quantity) || 0), 0);
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
