# Workspace Popovers Guide

## Scope
This guide covers popover and contextual dropdown behavior for all pages under `/workspaces/*`.

## Implemented Popovers

### Workspace List (`/workspaces`)
- `View Options` popover in page header.
- Sections:
  - Status filter: All, Active, Archived.
  - Sort field: Last updated, Created date, Name.
  - Sort order: Descending, Ascending.
- Search field next to popover for name/description filtering.
- A quick `Clear filters` action appears when a filter is active.

### Workspace Card
- `More` action popover includes labeled actions for edit, member management, settings, and owner delete.
- Context tooltip for metadata (created date with updated timestamp details).

### Workspace Detail (`/workspaces/:id` and `/workspaces/:id/members`)
- Members tab now has:
  - Search field.
  - `Member Filters` popover with role filtering and sort mode.
- Invitations tab now has:
  - Search field.
  - `Invitation Filters` popover with status filtering and sort mode.

### Member Card
- `Member actions` popover with role-change and remove actions.
- Tooltip on role badge and active/invited status indicator.

### Invitation Card
- Unified `Invitation actions` popover replaces scattered action buttons.
- Menu supports copy email, resend invitation (active only), and cancel invitation.
- Tooltip on invited-role badge for context.

### Branding / Logo Upload
- Workspace branding uses the existing logo upload popover pattern rather than a plain file picker.
- The trigger should remain visually close to a workspace avatar/logo card.
- The popover should keep the familiar `Upload` / `Presets` / `Library` tabs, with preset logo/avatar samples available for quick selection.
- Preview and remove actions should stay visible so users can confirm the change before saving.

## UX Rules
- Keep one primary contextual trigger per card (`More` icon button).
- Use labels in dropdowns when there are grouped actions.
- Show selection state with check icons for filter/sort popovers.
- Avoid destructive actions without explicit red styling.
- For branding uploads, prefer the established popover-and-gallery pattern over a bare file input.

## Extension Notes
If a new block is added under `/workspaces/*` and requires contextual actions:
1. Use existing `DropdownMenu` primitives first.
2. Add a trigger button using `ghost` or `outline` variant to match the current style.
3. Add a concise label (`DropdownMenuLabel`) when menu has 2+ groups.
4. Add tooltips only for icons or compact metadata where intent is not obvious.
