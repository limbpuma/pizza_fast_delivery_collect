# 🧪 COMPREHENSIVE TESTING GUIDE - LIEFERANDO MULTI-SIZE PIZZAS

## 🎯 **TESTING OBJECTIVES**

This guide tests the complete Lieferando-style button behavior with multi-size pizza support.

## 🔍 **PRE-TEST VERIFICATION**

1. **Server Status:** ✅ Running on `http://localhost:5176/`
2. **Compilation:** ✅ No TypeScript errors
3. **Git Status:** ✅ Changes committed
4. **Feature Branch:** `fix/card-products`

## 📋 **TEST SCENARIOS**

### **🍕 Test 1: Multi-Size Pizza Addition**

**Objective:** Verify that adding different sizes of the same pizza works correctly.

**Steps:**
1. Navigate to menu page
2. Find a pizza with 🍕 badge (e.g., "Pizza Margherita")
3. **Initial state check:**
   - Button should be orange with "+"
   - No decrement button visible
4. **Add first size:**
   - Click orange "+" button → Modal opens
   - Select "Klein (26cm)" → Click "Add to Basket"
   - **Expected:** Button shows `[🗑️] [1]` (trash icon, quantity 1)
5. **Add second size:**
   - Click orange "+" button → Modal opens
   - Select "Normal (32cm)" → Click "Add to Basket"  
   - **Expected:** Button shows `[-] [2]` (minus icon, total quantity 2)
6. **Add more of same size:**
   - Click orange "+" button → Modal opens
   - Select "Normal (32cm)" again → Click "Add to Basket"
   - **Expected:** Button shows `[-] [3]` (minus icon, total quantity 3)

### **🍕 Test 2: Multi-Size Pizza Decrement**

**Objective:** Verify intelligent decrement behavior.

**Starting State:** Pizza with quantity [3] from Test 1

**Steps:**
1. **First decrement:**
   - Click `[-]` button
   - **Expected:** Quantity changes to `[-] [2]`
2. **Second decrement:** 
   - Click `[-]` button
   - **Expected:** Quantity changes to `[🗑️] [1]` (trash icon appears)
3. **Final decrement:**
   - Click `[🗑️]` button
   - **Expected:** Buttons disappear completely, pizza removed from cart

### **🛒 Test 3: Cart Display Verification**

**Objective:** Verify cart shows individual pizza sizes correctly.

**Setup:** Add multiple sizes of same pizza

**Steps:**
1. Add "Pizza Margherita Klein (26cm)" x1
2. Add "Pizza Margherita Normal (32cm)" x2
3. Navigate to cart (`/cart`)
4. **Expected Cart Display:**
   ```
   1× Pizza Margherita (Klein 26cm)     €8.50
   [-] [1] [+] [Delete]
   
   2× Pizza Margherita (Normal 32cm)    €21.00  
   [-] [2] [+] [Delete]
   ```
5. **Test individual controls:**
   - Click `[+]` on Klein → Should increment to 2
   - Click `[-]` on Normal → Should decrement to 1
   - Click `[Delete]` → Should remove that specific size

### **⚡ Test 4: Quick Add Verification (Unchanged)**

**Objective:** Ensure Quick Add products still work as before.

**Steps:**
1. Find product with ⚡ badge (if any exist)
2. **First click:** Should add directly to cart with blue button animation
3. **Button display:** Should show quantity number inside button
4. **Decrement:** Should work as before

### **🔄 Test 5: Mixed Cart Scenario**

**Objective:** Test interaction between Quick Add and Pizza products.

**Steps:**
1. Add Quick Add product (if available)
2. Add multiple pizza sizes
3. Verify both display correctly in menu and cart
4. Verify buttons behave independently

## 🐛 **POTENTIAL ISSUES TO WATCH FOR**

1. **Duplicate React Keys:** Check browser console for warnings
2. **Incorrect Quantity Display:** Button should show sum of all sizes
3. **Decrement Logic:** Should remove items intelligently (first found)
4. **Cart Display:** Each size should be separate line item
5. **Modal Behavior:** Should still open for pizza increment
6. **Performance:** No lag when adding/removing items

## ✅ **SUCCESS CRITERIA**

- [ ] Pizza buttons show total quantity across all sizes
- [ ] Decrement removes individual size variants intelligently  
- [ ] Cart displays each pizza size as manageable item
- [ ] Modal still opens for pizza additions
- [ ] No console errors or React warnings
- [ ] Quick Add products unaffected (if any exist)
- [ ] Visual consistency maintained (Lieferando style)

## 🚨 **FAILURE INDICATORS**

- Quantity buttons show wrong numbers
- React key duplicate warnings in console
- Cart items don't update properly
- Modal doesn't open for pizzas
- Decrement affects wrong items
- Console errors during interactions

---

**Test Date:** 2025-06-17  
**Tester:** Manual testing required  
**Environment:** http://localhost:5176/  
**Status:** 🟡 **PENDING MANUAL VERIFICATION**
