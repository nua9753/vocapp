# Lexi Design System

## Product Character

Lexi is a focused study companion, not a generic dashboard. The interface should feel like a modern study notebook: clear, energetic, calm under pressure, and fast to scan during repeated daily use.

Design principles:

1. The next learning action is always visually obvious.
2. English content is left-to-right; Persian guidance is right-to-left.
3. Review state is communicated by color, icon, and text together.
4. Dense learning tools stay organized without becoming visually heavy.
5. Motion confirms an action; it never delays one.

## Foundation Tokens

### Color

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--bg` | `#F3F6F8` | `#0D1218` | App canvas |
| `--surface` | `#FFFFFF` | `#151C24` | Primary surface |
| `--surface2` | `#EAF0F4` | `#1D2732` | Secondary controls |
| `--text` | `#17202A` | `#F4F7FA` | Primary text |
| `--text2` | `#536170` | `#B6C0CA` | Supporting text |
| `--text3` | `#7F8B97` | `#7F8C99` | Metadata |
| `--accent` | `#155EEF` | `#70A2FF` | Primary action |
| `--coral` | `#F05A47` | `#FF7A68` | Memorable emphasis |
| `--green` | `#16805B` | `#4ED6A0` | Correct and complete |
| `--red` | `#C93C45` | `#FF727B` | Error and destructive |
| `--yellow` | `#A66A00` | `#F3BE55` | Warning and difficult |

Color must not be the only carrier of meaning. Status components include an icon or readable label.

### Typography

- Primary family: Vazirmatn with system sans-serif fallback.
- English vocabulary uses the same family at heavier weight for visual continuity.
- Page title: 20px / 900.
- Section title: 16px / 900.
- Body and controls: 14-16px / 500-800.
- Metadata: 12-13px / 700.
- Line height: 1.65 for Persian body text and 1.55 for English.
- Letter spacing remains zero.

### Space And Shape

- Spacing scale: 4, 8, 12, 16, 24, 32px.
- Control height: minimum 44px; primary controls use 48-52px.
- Corner scale: 8px for small controls, 12px for inputs, 16px for cards, 20px for major learning surfaces.
- Borders provide structure; shadows are reserved for navigation, overlays, and the active study card.

## Layout

- Mobile is the primary canvas, from 320px to 520px.
- The app is centered on larger screens with a maximum width of 520px.
- Header and bottom navigation remain visible while the content panel scrolls.
- Main content uses 16px page gutters and 12-16px vertical rhythm.
- A panel begins with its primary controls, not explanatory or decorative content.

## Components

### Header

- Compact white or dark surface with a 3px accent rail.
- Product name is prominent; progress pills are quiet secondary information.

### Bottom Navigation

- Docked navigation with stable icon and label positions.
- Active destination uses the primary color and a filled icon container.
- Every item keeps a minimum 44px touch target.

### Buttons

- Primary: solid accent, white label, no decorative gradient.
- Secondary: neutral surface with a visible border.
- Destructive: red-tinted surface and red label.
- Icon-only buttons use familiar Lucide symbols and an accessible label.

### Inputs

- Fully bordered neutral field, 12px radius, no material-style underline.
- Focus uses a 3px translucent accent ring.
- English entry is left-aligned and LTR.

### Cards And Lists

- Cards represent one meaningful object only.
- Repeated word and note items use a slim accent marker, strong title, and quiet metadata.
- Page sections remain unframed unless they are an interactive tool.

### Study Card

- The word is the dominant element.
- Review state appears above it as a compact labeled chip.
- Reveal, grading, spelling, and AI actions have distinct visual zones.
- Correct, hard, and repeat actions use green, amber, and red semantics.

### Tabs And Filters

- Modes use segmented controls.
- Categories use horizontally scrollable or wrapping chips based on available space.
- Active state must remain legible in both themes.

### Feedback

- Success, warning, and error messages are concise and placed beside the action that caused them.
- Empty states state what is missing and the next available action.
- Loading states preserve component dimensions to prevent layout shift.

## Motion

- Interaction transitions: 140-220ms with ease-out.
- Press feedback may scale to 0.98.
- Panel transitions use subtle opacity and vertical movement.
- Respect `prefers-reduced-motion` and disable nonessential animation.

## Accessibility And Content

- Maintain readable contrast in light and dark themes.
- Show visible keyboard focus with `:focus-visible`.
- Never rely on placeholder text as the only label.
- Use concise Persian labels and natural English examples.
- Avoid feature-description copy inside the working surface.
- At 200% text size, controls may wrap but must not overlap or clip.

## Governance

New UI should use these tokens and existing component patterns before introducing one-off colors, shadows, radii, or spacing values. Functional behavior and locally stored learning data must remain independent from visual changes.
