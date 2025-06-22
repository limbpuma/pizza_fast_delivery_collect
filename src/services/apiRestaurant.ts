// Import the new real menu loader
import { getMenu as getRealMenu } from './menuLoader';

const API_URL = "https://react-fast-pizza-api.onrender.com/api";

export async function getMenu() {
  // MIGRATION: Use real Campus Restaurant menu data instead of external API
  try {
    console.log('🔄 Loading real Campus Restaurant menu...');
    const realMenuData = await getRealMenu();
    console.log('✅ Successfully loaded real menu with', realMenuData.length, 'items');
    return realMenuData;
  } catch (error) {
    console.error('❌ Failed to load real menu data:', error);
    
    // Fallback to external API if real menu fails
    console.log('🔄 Falling back to external API...');
    const res = await fetch(`${API_URL}/menu`);
    if (!res.ok) throw Error("Failed getting menu from both real data and external API");
    const { data } = await res.json();
    return data;
  }
}

export async function getOrder(id: string) {
  const res = await fetch(`${API_URL}/order/${id}`);
  if (!res.ok) throw Error(`Couldn't find order #${id}`);

  const { data } = await res.json();
  return data;
}

export async function createOrder(newOrder) {
  try {
    const res = await fetch(`${API_URL}/order`, {
      method: "POST",
      body: JSON.stringify(newOrder),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw Error();
    const { data } = await res.json();
    return data;
  } catch {
    throw Error("Failed creating your order");
  }
}

export async function updateOrder(id, updateObj) {
  try {
    const res = await fetch(`${API_URL}/order/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updateObj),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw Error();
    // We don't need the data, so we don't return anything
  } catch (err) {
    throw Error("Failed updating your order");
  }
}
