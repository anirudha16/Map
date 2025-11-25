# Cursor Fix Prompt: Module Initialization Error

## Copy-Paste This Prompt to Cursor

---

**Fix the module initialization error in `frontend/src/services/api.js` that causes `getPlacesInBBox` to appear as a missing export.**

**Context:**
- The file currently contains a top-level `console.log` (or similar expression) that references `getPlacesInBBox` **before** its `export const` declaration.
- This causes a `ReferenceError` during ES module evaluation, preventing the entire module from loading.
- The error manifests as: *"The requested module does not provide an export named 'getPlacesInBBox'"* — but the export syntax is correct.
- This is a module evaluation order issue, not a missing export issue.

**Requirements:**
1. **Remove or relocate** any top-level code that references exported functions before their definition.
2. **Ensure `getPlacesInBBox` is properly exported** at the bottom of the file (after all dependencies).
3. **Do not modify** the function implementation, import statements, or other exports.
4. **If debugging is needed**, add a dev-only log **after all exports are declared**, like:
   ```js
   if (import.meta.env.DEV) console.log('API exports ready');
   ```
5. **Preserve all existing functionality** — this is purely a module evaluation order fix.

**File:** `frontend/src/services/api.js`  
**Target export:** `export const getPlacesInBBox = async (minLon, minLat, maxLon, maxLat) => { ... }`

**Verification after fix:**
- No top-level references to `getPlacesInBBox` before its export
- The full `getPlacesInBBox` function definition is present and exported
- All other exports remain unchanged

---

## Why This Prompt Works

✅ **Prevents overreach**: Cursor won't rename functions, change APIs, or refactor unnecessarily  
✅ **Acknowledges the real issue**: Focuses on *evaluation order*, not export syntax  
✅ **Matches root cause analysis**: Aligns with verified finding that premature reference breaks module init  
✅ **Safe for production**: No runtime side effects; pure module semantics fix  
✅ **Specific file/export**: Clear target prevents confusion  

---

## After Applying the Fix

1. **Verify the saved file** contains:
   - ✅ No top-level references to `getPlacesInBBox` before its export
   - ✅ The full `getPlacesInBBox` function definition and export

2. **Save the file**

3. **Refresh the browser** (or restart dev server if HMR is stuck)

4. **Confirm the error is resolved** - `MapView.jsx` should successfully import `getPlacesInBBox`

