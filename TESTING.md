# WaitWise - Comprehensive Testing Guide

## 🧪 Complete Test Checklist

### Phase 1: Backend API Testing

#### Authentication Tests
- [ ] **Signup**: Create new user with all roles
- [ ] **Login**: Test with correct/incorrect credentials
- [ ] **Password Reset**: Generate token, reset password
- [ ] **Profile Update**: Change name, phone, picture
- [ ] **Role Update**: Super admin changes user roles

#### Office Management Tests
- [ ] **Create Office**: With valid lat/lng
- [ ] **Edit Office**: Update all fields
- [ ] **Delete Office**: Verify departments deleted
- [ ] **Nearby Search**: Test geolocation query

#### Department Management Tests
- [ ] **Create Department**: Link to office
- [ ] **Edit Department**: Update name, avg time
- [ ] **Delete Department**: Verify queues deleted
- [ ] **Analytics**: Check today's stats

#### Queue Tests
- [ ] **Join Queue**: Get token number
- [ ] **Next Token**: Increment current token
- [ ] **Previous Token**: Decrement current token
- [ ] **Set Token**: Manual token number
- [ ] **Pause/Resume**: Toggle queue status

---

### Phase 2: Frontend UI Testing

#### Super Admin Dashboard
- [ ] **View Offices**: See all offices with departments
- [ ] **Edit Office**: Inline editing works
- [ ] **Delete Office**: Confirmation dialog appears
- [ ] **Create Office**: Form validation works
- [ ] **Create Department**: Dropdown populated
- [ ] **Edit User Role**: Role change persists
- [ ] **Geolocation Input**: Lat/lng accepts decimals

#### Department Admin Dashboard
- [ ] **View Stats**: Current/total tokens display
- [ ] **Next Button**: Increments token
- [ ] **Previous Button**: Decrements token
- [ ] **Manual Set**: Input validation works
- [ ] **Pause/Resume**: Confirmation dialog
- [ ] **Edit Avg Time**: Inline editor saves
- [ ] **Analytics Panel**: Shows today's data
- [ ] **Real-time Updates**: Socket.io works

#### User Features
- [ ] **Profile Page**: Edit name/phone
- [ ] **User Dashboard**: Shows bookmarks/history
- [ ] **Password Reset**: Full flow works
- [ ] **Nearby Offices**: Geolocation permission
- [ ] **Department View**: See queue status
- [ ] **Get Token**: Receive token number
- [ ] **Notifications**: Browser alerts work
- [ ] **Token Persistence**: Survives refresh
- [ ] **Active Tokens**: Shows all tokens
- [ ] **Token History**: Displays past tokens

---

### Phase 3: Real-Time Features

#### Socket.io Tests
- [ ] **Join Department**: Socket connection
- [ ] **Queue Update**: Broadcast to all clients
- [ ] **Multiple Tabs**: Updates sync
- [ ] **Disconnect/Reconnect**: Handles gracefully

#### Notifications
- [ ] **Permission Request**: Asks on load
- [ ] **3 Tokens Away**: Alert triggers
- [ ] **Your Turn**: Alert with interaction
- [ ] **Multiple Notifications**: No duplicates

---

### Phase 4: AI Features

#### Predictions
- [ ] **ETA Calculation**: Accurate wait time
- [ ] **Pause Status**: Shows -1 when paused
- [ ] **Crowd Forecast**: 8-hour prediction
- [ ] **Peak Time**: Identifies busy hours
- [ ] **Alerts**: Context-aware messages

---

### Phase 5: UI/UX

#### Components
- [ ] **Navbar**: All links work
- [ ] **Mobile Menu**: Opens/closes
- [ ] **Loading Skeletons**: Show while loading
- [ ] **Empty States**: Display when no data
- [ ] **404 Page**: Shows on invalid route
- [ ] **Confirm Dialogs**: Appear before actions

#### Responsive Design
- [ ] **Desktop**: Full layout
- [ ] **Tablet**: Adjusted spacing
- [ ] **Mobile**: Touch-friendly
- [ ] **Small Mobile**: No overflow

#### Transitions
- [ ] **Page Changes**: Smooth fade
- [ ] **Button Hover**: Color transition
- [ ] **Focus States**: Ring appears
- [ ] **Loading**: Pulse animation

---

### Phase 6: Data Persistence

#### localStorage
- [ ] **Token Save**: Stores on get token
- [ ] **Token Load**: Restores on refresh
- [ ] **Multiple Tokens**: Separate storage
- [ ] **Token Remove**: Clears from storage
- [ ] **Active Tokens Page**: Lists all

---

### Phase 7: Security

#### Role-Based Access
- [ ] **Super Admin Routes**: Protected
- [ ] **Dept Admin Routes**: Protected
- [ ] **User Routes**: Public/protected
- [ ] **Unauthorized Access**: Redirects

#### Input Validation
- [ ] **Email Format**: Validates
- [ ] **Password Length**: Min 6 chars
- [ ] **Lat/Lng Range**: Valid coordinates
- [ ] **Token Number**: Positive integer

---

### Phase 8: Performance

#### Load Times
- [ ] **Initial Load**: < 3 seconds
- [ ] **Page Navigation**: < 1 second
- [ ] **API Calls**: < 500ms
- [ ] **Socket Updates**: Instant

#### Optimization
- [ ] **Image Loading**: Lazy load
- [ ] **Code Splitting**: Route-based
- [ ] **Caching**: API responses
- [ ] **Minification**: Production build

---

## 🚀 Test Execution

### Automated Testing
```bash
# Backend
cd server
npm test

# Frontend
cd client
npm test
```

### Manual Testing
1. **Seed Database**: `node seed.js`
2. **Start Servers**: Both dev servers running
3. **Test Each Feature**: Follow checklist above
4. **Document Issues**: Create GitHub issues

### Test Credentials
- **Super Admin**: admin@waitwise.com / password123
- **Dept Admin**: sarah@hospital.com / password123
- **User**: john@example.com / password123

---

## ✅ Success Criteria

All checkboxes must be checked before deployment:
- [ ] All backend routes return correct responses
- [ ] All frontend pages render without errors
- [ ] Real-time updates work across tabs
- [ ] Notifications trigger correctly
- [ ] Data persists in localStorage
- [ ] Mobile responsive on all devices
- [ ] No console errors
- [ ] All role-based access enforced
- [ ] Input validation prevents bad data
- [ ] Performance meets targets

---

## 📝 Test Results Template

```markdown
## Test Session: [Date]
**Tester**: [Name]
**Environment**: [Dev/Staging/Prod]

### Results
- Total Tests: X
- Passed: X
- Failed: X
- Skipped: X

### Issues Found
1. [Issue description]
2. [Issue description]

### Notes
[Any observations]
```

---

## 🎯 Priority Testing

**P0 (Critical)**:
- Authentication flow
- Token generation
- Queue updates
- Role-based access

**P1 (High)**:
- Real-time notifications
- Data persistence
- Analytics
- Mobile responsiveness

**P2 (Medium)**:
- UI polish
- Transitions
- Empty states
- Loading states

**P3 (Low)**:
- Advanced features
- Edge cases
- Performance optimization
