# Module 3 - Testing & Verification Guide

**Phase**: 5 - Testing & Verification  
**Status**: IN PROGRESS  
**Estimated Duration**: 1 hour

---

## 🧪 Testing Objectives

✅ Verify all CRUD operations work with backend  
✅ Confirm error handling works properly  
✅ Validate loading states display correctly  
✅ Ensure type safety throughout  
✅ Test responsive design on all devices  

---

## 📋 Pre-Testing Checklist

### Environment Setup
- [ ] Node.js v18+ installed
- [ ] Backend API running on `http://localhost:8000`
- [ ] Frontend dependencies installed (`npm install`)
- [ ] No uncommitted changes in git
- [ ] All previous build tests passing

### Code Readiness
- [ ] `npm run build` passes with 0 errors
- [ ] No TypeScript errors detected
- [ ] All console logs clean (no warnings)
- [ ] Git commits are clean

---

## 🚀 Running Tests

### Test Environment Setup

```bash
# 1. Navigate to frontend directory
cd e:\Workspace\project\pronaflow\apps\frontend

# 2. Verify build still passes
npm run build

# 3. Start development server (backend mode)
npm run dev:backend
```

Expected output:
```
  VITE v5.4.21  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Browser Access
Open: http://localhost:5173/

---

## ✅ Manual Testing Procedures

### Test 1: Page Load & Initial Data Fetch

**Steps:**
1. Navigate to Projects page
2. Observe loading spinner
3. Wait for projects list to load

**Expected Results:**
- ✅ Loading spinner shows
- ✅ Projects list appears (from API)
- ✅ No console errors
- ✅ Page renders without TypeError

**Failure Indicators:**
- ❌ Spinner doesn't appear
- ❌ Projects don't load
- ❌ Console has errors
- ❌ Blank/broken page

---

### Test 2: Create Project

**Steps:**
1. Click "Tạo dự án mới" button
2. Fill form:
   - Name: "Test Project 2026"
   - Description: "Testing React Query integration"
   - Type: Select "Agile"
   - Priority: Select "High"
3. Click "Tạo"

**Expected Results:**
- ✅ Modal closes
- ✅ Success toast shows: "Project created successfully"
- ✅ New project appears in list
- ✅ Project data persists (refresh page, still there)

**Failure Indicators:**
- ❌ Modal stays open or throws error
- ❌ No toast notification
- ❌ Project appears then disappears
- ❌ Console API errors

---

### Test 3: Update Project Status

**Steps:**
1. Find any project in list
2. Click status badge (e.g., "Not Started")
3. Select new status from dropdown (e.g., "In Progress")

**Expected Results:**
- ✅ Status updates immediately
- ✅ Toast shows: "Project status updated"
- ✅ Status persists after refresh
- ✅ Backend reflected change

**Failure Indicators:**
- ❌ Status doesn't change
- ❌ No notification
- ❌ Reverts to old status
- ❌ API error in console

---

### Test 4: Delete Project

**Steps:**
1. Find a test project
2. Click three-dot menu (more options)
3. Click "Delete" or "Xóa"
4. Confirm deletion

**Expected Results:**
- ✅ Project removed from list
- ✅ Toast shows: "Project deleted successfully"
- ✅ Project doesn't reappear on refresh
- ✅ API delete confirmed

**Failure Indicators:**
- ❌ Project stays in list
- ❌ No notification
- ❌ Project reappears on refresh

---

### Test 5: Error Handling - Network Failure

**Steps:**
1. Stop backend API (kill server)
2. Try to load projects page (or refresh)
3. Observe error handling

**Expected Results:**
- ✅ Error UI appears with message
- ✅ "Có lỗi xảy ra" header shows
- ✅ "Thử lại" button is clickable
- ✅ Graceful degradation (no crashes)

**Failure Indicators:**
- ❌ Blank page or TypeError
- ❌ No error message visible
- ❌ Retry button doesn't work
- ❌ Console has unhandled errors

---

### Test 6: Error Handling - API Error Response

**Steps:**
1. Start backend again
2. Try to create project with invalid data (empty name)
3. Observe how error is handled

**Expected Results:**
- ✅ Form validation works
- ✅ If backend rejects: error toast shows
- ✅ User can retry/fix
- ✅ No page crash

---

### Test 7: Loading States

**Steps:**
1. Create a project with deliberate delay
2. Observe button states during creation
3. Note loading feedback

**Expected Results:**
- ✅ Button disables during operation
- ✅ Loading indicator shows (spinner/text)
- ✅ User can't double-submit
- ✅ Feedback is clear and visible

---

### Test 8: Search & Filter

**Steps:**
1. Use search box to filter projects
2. Try status filter dropdown
3. Try priority filter dropdown

**Expected Results:**
- ✅ Search filters list in real-time
- ✅ Status filter works
- ✅ Priority filter works
- ✅ Filters combine correctly

---

### Test 9: View Modes

**Steps:**
1. Click view mode selector (Grid/List/Kanban icons)
2. Switch between each mode
3. Verify data shows in each view

**Expected Results:**
- ✅ Grid view shows cards
- ✅ List view shows table
- ✅ Kanban view shows columns
- ✅ Same data in all views
- ✅ Mode preference works

---

### Test 10: Responsive Design

**Steps:**
1. Open DevTools (F12)
2. Test on different viewport sizes:
   - Mobile: 375px
   - Tablet: 768px
   - Desktop: 1920px
3. Verify layout adapts

**Expected Results:**
- ✅ Mobile: Single column, readable
- ✅ Tablet: 2-3 columns
- ✅ Desktop: Full grid
- ✅ Touch targets large enough
- ✅ No horizontal scroll on mobile

---

## 🔍 Component-Level Tests

### ProjectCard Component
```
✅ Renders project info correctly
✅ Status badge shows correct color
✅ Progress bar updates
✅ Member avatars display
✅ Hover effects work
✅ Click handler fires
```

### ProjectList Component
```
✅ Handles empty state
✅ Loading state shows spinner
✅ Grid view spacing correct
✅ List view columns aligned
✅ Kanban columns show projects
```

### AllProjectPage Component
```
✅ useProjects hook fetches data
✅ useCreateProject mutation works
✅ useUpdateProjectStatus mutation works
✅ Stats update after operations
✅ Error/loading states show
```

---

## 🐛 Common Issues & Fixes

### Issue: "Cannot find module" errors

**Cause**: Missing imports or circular dependencies  
**Solution**:
```bash
npm install
npm cache clean --force
npm run build
```

### Issue: "useProjects is not defined"

**Cause**: Missing React Query setup  
**Solution**: Check QueryClientProvider is in parent component  
```tsx
// Check App.tsx has:
<QueryClientProvider client={queryClient}>
  <BrowserRouter>
    {/* routes */}
  </BrowserRouter>
</QueryClientProvider>
```

### Issue: Toast notifications don't show

**Cause**: Sonner provider missing  
**Solution**: Verify Toaster component in layout:
```tsx
import { Toaster } from 'sonner';

export function App() {
  return (
    <>
      <Toaster position="top-right" />
      {/* routes */}
    </>
  );
}
```

### Issue: Backend returns 404 or 401

**Cause**: API endpoints/auth not configured  
**Solution**: Verify:
1. Backend running on :8000
2. API prefix is `/api/v1`
3. Authentication token in headers
4. CORS configured

---

## 📊 Test Results Template

After running tests, fill this out:

```
# Test Results - Module 3

Date: __________
Tester: __________
Environment: Development / Staging / Production

## Automated Tests
- npm run build: [✅ PASS / ❌ FAIL]
- TypeScript check: [✅ 0 errors / ❌ X errors]

## Manual Tests
- Test 1 (Page Load): [✅ PASS / ❌ FAIL]
- Test 2 (Create): [✅ PASS / ❌ FAIL]
- Test 3 (Update): [✅ PASS / ❌ FAIL]
- Test 4 (Delete): [✅ PASS / ❌ FAIL]
- Test 5 (Error Handling): [✅ PASS / ❌ FAIL]
- Test 6 (API Error): [✅ PASS / ❌ FAIL]
- Test 7 (Loading): [✅ PASS / ❌ FAIL]
- Test 8 (Search): [✅ PASS / ❌ FAIL]
- Test 9 (View Modes): [✅ PASS / ❌ FAIL]
- Test 10 (Responsive): [✅ PASS / ❌ FAIL]

## Browser Compatibility
- Chrome/Edge: [✅ YES / ❌ NO]
- Firefox: [✅ YES / ❌ NO]
- Safari: [✅ YES / ❌ NO]
- Mobile (iOS): [✅ YES / ❌ NO]
- Mobile (Android): [✅ YES / ❌ NO]

## Performance
- Page load time: _________ ms
- Project search time: _________ ms
- Create operation time: _________ ms

## Issues Found
1. ___________________________________
2. ___________________________________
3. ___________________________________

## Overall Result
[✅ PASS - READY FOR PRODUCTION]
[⚠️  PASS WITH ISSUES]
[❌ FAIL - NEEDS FIXES]

## Sign-Off
Tested by: _______________
Date: _______________
```

---

## 🚀 Performance Benchmarks

### Target Metrics
- Page load: < 3 seconds
- Search filter: < 500ms response
- Project creation: < 2 seconds
- Status update: < 1 second
- Delete operation: < 1.5 seconds

### Profiling Steps
```bash
# 1. Build production version
npm run build

# 2. Test with DevTools Performance tab
# 3. Record 30 seconds of usage
# 4. Analyze results
```

---

## 📱 Browser Compatibility Matrix

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | Latest | ✅ REQUIRED | Primary target |
| Firefox | Latest | ✅ REQUIRED | Regular testing |
| Safari | Latest | ✅ REQUIRED | Mobile critical |
| Edge | Latest | ✅ REQUIRED | Windows users |
| Mobile Safari | iOS 14+ | ✅ REQUIRED | iPad/iPhone |
| Chrome Mobile | Latest | ✅ REQUIRED | Android devices |

---

## 🔒 Security Testing

### Checklist
- [ ] No console errors exposing sensitive info
- [ ] API key/token not in network tab
- [ ] No plaintext passwords in transit
- [ ] CORS headers correct
- [ ] XSS protection (no eval/innerHTML)
- [ ] CSRF tokens on mutation endpoints
- [ ] Rate limiting tested
- [ ] Input validation working

---

## 📈 Success Criteria

### For Test Phase Completion
- ✅ All 10 manual tests passing
- ✅ 0 unhandled console errors
- ✅ All CRUD operations work
- ✅ Error handling graceful
- ✅ Loading states visible
- ✅ Type safety maintained
- ✅ Performance acceptable
- ✅ Mobile responsive
- ✅ Browser compatibility verified
- ✅ Documentation complete

### For Production Deployment
- ✅ All success criteria met
- ✅ No critical bugs found
- ✅ Team sign-off obtained
- ✅ Rollback plan ready
- ✅ Monitoring configured
- ✅ Deployment checklist complete

---

## 📞 Support & Troubleshooting

### Getting Help
1. Check console for error messages
2. Review error logs in DevTools
3. Consult troubleshooting section above
4. Check git commit for recent changes
5. Run `npm run build` to verify compilation

### Reporting Issues
Include:
- Browser & version
- Steps to reproduce
- Expected vs actual behavior
- Console error messages (screenshot)
- Network tab shows (if API-related)

---

## ✅ Final Verification Checklist

Before declaring COMPLETE:

- [ ] All 10 tests passing
- [ ] No TypeScript errors
- [ ] Build artifact created successfully
- [ ] Performance metrics acceptable
- [ ] Browser compatibility verified
- [ ] Mobile responsive verified
- [ ] Error scenarios handled
- [ ] Documentation reviewed
- [ ] Team sign-off obtained
- [ ] No blocking issues remaining

---

**Testing Guide Created**: March 29, 2026  
**For**: Module 3 Context Management  
**By**: GitHub Copilot  
**Duration**: ~1 hour for complete testing  

**Next Step**: Execute all tests and document results
