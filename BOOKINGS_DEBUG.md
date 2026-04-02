# 🎫 MyBookings - Troubleshooting Guide

## ✅ Status Check

| Component | Status |
|-----------|--------|
| Backend API | ✅ Working |
| Database | ✅ Has bookings (10 bookings found) |
| Authorization | ✅ Working |
| API Response | ✅ Returning data correctly |
| **Frontend Setup** | ❌ Fixed (using localhost:5000) |
| **Frontend Login** | ⚠️ Need to login |

## 🧪 Quick Test Steps

### 1. **Make sure both servers are running:**

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

Backend should show:
```
✅ Connected to MONGODB
✅ Server is running on port 5000
```

Frontend should show:
```
✅ VITE v... ready in ... ms
✅ API Base URL: http://localhost:5000/api
```

### 2. **Open Frontend and Login:**

Navigate to: http://localhost:5173

**Test Credentials:**
- Email: `testuser1775160481503@example.com`
- Password: `TestPassword123!`

### 3. **Check DevTools Console (F12):**

You should see:
```
✅ API Base URL: http://localhost:5000/api
🔐 Attempting login with: testuser1775160481503@example.com
✅ Login response: {...}
✅ Token saved to localStorage
```

### 4. **Go to My Bookings:**

Click on "My Bookings" in the navbar.

**Expected Result:** You should see the test booking for "Beach House"

## 🔍 If Still Not Working

### Check 1: Is localhost serving frontend?
- Open http://localhost:5173 in browser
- Page should load without errors

### Check 2: Can you login?
- Open DevTools (F12) → Console tab
- Try to login
- Look for error messages

### Check 3: Is token saved in localStorage?
- Open DevTools → Application tab → localStorage
- Look for key "token"
- It should have a long JWT string

### Check 4: Check Network Requests
- Open DevTools → Network tab
- Login
- Look for POST `/auth/login` request
- Check response status (should be 200)
- Look for GET `/bookings/my` request
- Check response (should have booking data)

## 💡 Common Issues

| Issue | Solution |
|-------|----------|
| "No bookings yet" message | Make sure you're logged in with correct user |
| Login fails | Check email is correct, password is case-sensitive |
| Token not in localStorage | Check Console for errors, look at login response |
| API URL shows `onrender.com` | Frontend not using updated axiosInstance (fixed now) |

## 📝 What I Fixed

1. ✅ Updated `axiosInstance.ts` to use `localhost:5000` in development
2. ✅ Added error display in MyBookings page
3. ✅ Enhanced Login page with test credentials and debugging
4. ✅ Added better logging to backend controllers

## 🧩 Architecture

```
Frontend (React + TypeScript)
    ↓
axiosInstance (http://localhost:5000/api)
    ↓
Backend (Express)
    ↓
MongoDB Database
```

**Flow:** Login → Token saved → axiosInstance adds token to headers → Fetch bookings → Display

---

**Still stuck?** Make sure:
- [ ] Both servers running (`npm start` in backend, `npm run dev` in frontend)
- [ ] Using test credentials provided
- [ ] Browser console shows no errors
- [ ] Network tab shows successful requests
