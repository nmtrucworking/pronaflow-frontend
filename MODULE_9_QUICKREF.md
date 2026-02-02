# Module 9: User Experience Personalization - Quick Reference

## 🚀 Quick Start

### Open Command Palette
```
Cmd/Ctrl + K
```

### View All Shortcuts
```
Press ?
```

### Access Settings
```
Navigate to: /settings
New Tabs: Khả năng tiếp cận | Tùy chỉnh Dashboard | Phím tắt
```

## 📦 Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `CommandPalette` | `src/components/CommandPalette.tsx` | Global command search (Cmd+K) |
| `KeyboardShortcutsModal` | `src/components/KeyboardShortcutsModal.tsx` | Shortcuts cheatsheet (?) |
| `AccessibilityPanel` | `src/features/personalization/components/AccessibilityPanel.tsx` | Accessibility controls |
| `DashboardCustomizer` | `src/features/personalization/components/DashboardCustomizer.tsx` | Widget management |

## 🎹 Keyboard Shortcuts

### Global Navigation
| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Open Command Palette |
| `Cmd/Ctrl + D` | Go to Dashboard |
| `Cmd/Ctrl + T` | Go to Tasks |
| `Cmd/Ctrl + P` | Go to Projects |
| `Cmd/Ctrl + C` | Go to Calendar |
| `Cmd/Ctrl + I` | Go to Inbox |
| `Cmd/Ctrl + ,` | Go to Settings |
| `?` | Show Keyboard Shortcuts |
| `Esc` | Close Dialog/Modal |

### Command Palette Navigation
| Shortcut | Action |
|----------|--------|
| `↑` / `↓` | Navigate items |
| `Enter` | Select item |
| `Esc` | Close palette |

## 🎨 Accessibility Features

### Font Settings
```typescript
fontSize: 12 | 14 | 16 | 18 | 20  // Default: 14px
fontFamily: 'system' | 'dyslexic' | 'monospace'  // Default: 'system'
```

### Color Blindness Modes
```typescript
colorBlindMode: 
  | 'none'           // Default
  | 'deuteranopia'   // Red-green (most common)
  | 'protanopia'     // Red-blind
  | 'tritanopia'     // Blue-yellow
```

### Visual Preferences
```typescript
highContrast: boolean          // Default: false
reducedMotion: boolean         // Default: false
screenReaderOptimized: boolean // Default: false
density: 'comfortable' | 'compact'  // Default: 'comfortable'
```

## 📊 Dashboard Widgets

### Available Widgets (8)

#### Productivity Category
1. **Tasks Overview** - Quick view of tasks (4x3 grid)
2. **Recent Projects** - Recently accessed projects (4x2)
3. **Calendar** - Upcoming events (3x3)

#### Analytics Category
4. **Time Tracking** - Hours logged (3x2)
5. **Productivity Chart** - Task completion trends (6x3)
6. **Project Progress** - Overall completion (4x2)

#### Collaboration Category
7. **Team Activity** - Recent member activities (4x3)
8. **Notifications** - Recent alerts (3x4)

### Widget Actions
```typescript
// Add widget
handleAddWidget(template)

// Toggle visibility
handleToggleWidget(widgetId)

// Remove widget
handleRemoveWidget(widgetId)

// Create layout
handleCreateLayout()

// Set default layout
handleSetDefault(layoutId)
```

## 🔧 API Hooks

### User Settings
```typescript
// Get user settings
const { data, isLoading } = useUserSettings();

// Update settings
const updateSettings = useUpdateUserSettings();
updateSettings.mutate({ 
  accessibility: { fontSize: 16, fontFamily: 'dyslexic' } 
});

// Reset to defaults
const resetSettings = useResetSettings();
resetSettings.mutate();
```

### Dashboard Layouts
```typescript
// Get all layouts
const { data: layouts } = useDashboardLayouts();

// Create new layout
const createLayout = useCreateDashboardLayout();
createLayout.mutate({ 
  name: 'My Dashboard', 
  isDefault: false, 
  widgets: [] 
});

// Update layout
const updateLayout = useUpdateDashboardLayout();
updateLayout.mutate({ 
  id: 'layout-id', 
  widgets: [...updatedWidgets] 
});

// Delete layout
const deleteLayout = useDeleteDashboardLayout();
deleteLayout.mutate('layout-id');
```

### Keyboard Shortcuts
```typescript
// Get shortcuts
const { data: shortcuts } = useKeyboardShortcuts();

// Update shortcuts
const updateShortcuts = useUpdateKeyboardShortcuts();
updateShortcuts.mutate({ key: 'tasks', shortcut: 'Cmd+Shift+T' });

// Reset to defaults
const resetShortcuts = useResetKeyboardShortcuts();
resetShortcuts.mutate();
```

## 🎯 Type Definitions

### UserSettings
```typescript
interface UserSettings {
  theme: ThemeMode;              // 'light' | 'dark' | 'system'
  language: LanguageCode;        // 'en-US' | 'vi-VN'
  timezone: string;              // e.g., 'Asia/Ho_Chi_Minh'
  accessibility: AccessibilitySettings;
  notifications: NotificationPreference;
  doNotDisturb: DoNotDisturbSchedule;
}
```

### DashboardLayout
```typescript
interface DashboardLayout {
  id: string;
  name: string;
  isDefault: boolean;
  widgets: DashboardWidget[];
  createdAt: string;
  updatedAt: string;
}

interface DashboardWidget {
  id: string;
  type: string;                  // 'tasks-overview' | 'calendar' | ...
  position: { x: number; y: number };
  size: { w: number; h: number };
  isVisible: boolean;
  config: Record<string, any>;
}
```

### AccessibilitySettings
```typescript
interface AccessibilitySettings {
  fontSize: 12 | 14 | 16 | 18 | 20;
  fontFamily: FontFamily;        // 'system' | 'dyslexic' | 'monospace'
  colorBlindMode: ColorBlindMode;
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
  density: DensityMode;          // 'comfortable' | 'compact'
}
```

## 🌐 API Endpoints

### Settings Endpoints
```
GET    /api/personalization/settings
PUT    /api/personalization/settings
POST   /api/personalization/settings/reset
GET    /api/personalization/languages
GET    /api/personalization/timezones
```

### Dashboard Endpoints
```
GET    /api/personalization/dashboard-layouts
POST   /api/personalization/dashboard-layouts
PUT    /api/personalization/dashboard-layouts/:id
DELETE /api/personalization/dashboard-layouts/:id
```

### Shortcuts Endpoints
```
GET    /api/personalization/keyboard-shortcuts
PUT    /api/personalization/keyboard-shortcuts
POST   /api/personalization/keyboard-shortcuts/reset
```

## 📱 Responsive Behavior

### Command Palette
- **Desktop**: Full-width modal (max-w-2xl)
- **Mobile**: Responsive padding, touch-friendly

### Accessibility Panel
- **Desktop**: Multi-column grids
- **Tablet**: 2-column layouts
- **Mobile**: Single column stacks

### Dashboard Customizer
- **Desktop**: 3-column widget grid
- **Tablet**: 2-column widget grid
- **Mobile**: Single column list

## 🎨 Styling Classes

### Custom Scrollbar
```css
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
```

### Animation Classes
```css
animate-in fade-in slide-in-from-top-4  /* Modal entrance */
animate-in fade-in zoom-in-95           /* Shortcuts modal */
```

## 🔔 Toast Notifications

All mutations show toast feedback:
```typescript
// Success
toast.success('Settings updated successfully');

// Error
toast.error('Failed to update settings');

// Loading
toast.loading('Updating settings...');
```

## 🧪 Testing Scenarios

1. **Command Palette**
   - Press Cmd/Ctrl + K
   - Type search query
   - Navigate with arrows
   - Press Enter to select
   - Press Esc to close

2. **Accessibility**
   - Change font size (12-20px)
   - Switch font family
   - Toggle color blindness mode
   - Enable high contrast
   - Test reduced motion

3. **Dashboard**
   - Create new layout
   - Add widgets from library
   - Toggle widget visibility
   - Remove widgets
   - Set default layout
   - Delete layout

4. **Shortcuts**
   - Press ? to open modal
   - Review all shortcuts
   - Test navigation shortcuts
   - Test action shortcuts

## 📊 Performance

- React Query caching reduces API calls
- Optimistic updates for instant feedback
- Local storage for immediate theme/font changes
- Debounced search in Command Palette
- Lazy loading for heavy components

## 🔒 Security

- CSRF protection on all mutations
- JWT authentication required
- Input validation on all forms
- XSS protection with sanitization
- Rate limiting on API endpoints

## 🎉 Quick Tips

1. Use `Cmd/Ctrl + K` for fastest navigation
2. Customize font size for better readability
3. Enable high contrast in bright environments
4. Use compact mode for more screen space
5. Create multiple dashboards for different workflows
6. Press `?` to discover new shortcuts
7. Enable reduced motion if animations are distracting
8. Use dyslexic font for improved reading

---

**Module 9 Status**: ✅ **COMPLETE**  
**Lines of Code**: ~1,200  
**Components**: 4  
**Hooks**: 14+  
**Type Definitions**: 12+  
**API Endpoints**: 12  

For detailed documentation, see [MODULE_9_README.md](./MODULE_9_README.md)
