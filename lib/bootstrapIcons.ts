/**
 * Curated subset of Bootstrap Icons grouped by category.
 * Full list: https://icons.getbootstrap.com/ (2000+ icons)
 * To use any other icon, the user can type its name in the picker's manual entry field.
 */

export const BOOTSTRAP_ICON_CATEGORIES: Record<string, string[]> = {
  Common: [
    'house', 'house-fill', 'house-door', 'gear', 'gear-fill', 'person', 'person-fill', 'person-circle',
    'people', 'people-fill', 'search', 'plus', 'plus-lg', 'plus-circle', 'plus-circle-fill', 'dash',
    'dash-lg', 'check', 'check-lg', 'check-circle', 'check-circle-fill', 'check2', 'check2-circle',
    'x', 'x-lg', 'x-circle', 'x-circle-fill', 'three-dots', 'three-dots-vertical',
    'list', 'grid', 'grid-3x3-gap', 'grid-fill', 'filter', 'sort-down', 'sort-up',
  ],
  Arrows: [
    'arrow-up', 'arrow-down', 'arrow-left', 'arrow-right',
    'arrow-up-circle', 'arrow-down-circle', 'arrow-left-circle', 'arrow-right-circle',
    'arrow-up-right', 'arrow-up-left', 'arrow-down-right', 'arrow-down-left',
    'arrow-return-left', 'arrow-return-right', 'arrow-clockwise', 'arrow-counterclockwise',
    'chevron-up', 'chevron-down', 'chevron-left', 'chevron-right',
    'chevron-double-up', 'chevron-double-down', 'chevron-double-left', 'chevron-double-right',
    'arrow-bar-up', 'arrow-bar-down', 'arrow-bar-left', 'arrow-bar-right',
  ],
  Communication: [
    'envelope', 'envelope-fill', 'envelope-open', 'envelope-paper',
    'chat', 'chat-fill', 'chat-dots', 'chat-text', 'chat-square', 'chat-left',
    'telephone', 'telephone-fill', 'telephone-outbound', 'telephone-inbound',
    'megaphone', 'megaphone-fill', 'broadcast', 'bell', 'bell-fill', 'bell-slash',
    'send', 'send-fill', 'reply', 'reply-fill', 'inbox', 'inbox-fill',
  ],
  Media: [
    'play', 'play-fill', 'play-circle', 'play-circle-fill',
    'pause', 'pause-fill', 'pause-circle', 'pause-circle-fill',
    'stop', 'stop-fill', 'stop-circle', 'skip-forward', 'skip-backward',
    'volume-up', 'volume-down', 'volume-mute', 'volume-off',
    'music-note', 'music-note-beamed', 'film', 'camera', 'camera-video',
    'image', 'images', 'card-image',
  ],
  Files: [
    'file', 'file-fill', 'file-text', 'file-earmark', 'file-earmark-text', 'file-earmark-pdf',
    'file-earmark-image', 'file-earmark-zip', 'file-earmark-spreadsheet', 'file-earmark-code',
    'folder', 'folder-fill', 'folder2', 'folder-plus', 'folder-x',
    'download', 'upload', 'cloud-download', 'cloud-upload', 'paperclip', 'archive',
  ],
  Edit: [
    'pencil', 'pencil-fill', 'pencil-square', 'pen', 'pen-fill',
    'eraser', 'scissors', 'clipboard', 'clipboard-data', 'clipboard-check',
    'trash', 'trash-fill', 'trash2', 'trash3',
    'copy', 'files', 'save', 'save-fill',
    'card-checklist', 'list-check', 'check-square', 'square',
  ],
  Social: [
    'facebook', 'twitter', 'twitter-x', 'instagram', 'linkedin', 'github', 'youtube',
    'whatsapp', 'telegram', 'slack', 'discord', 'tiktok', 'pinterest', 'reddit',
    'twitch', 'medium', 'dribbble', 'behance', 'snapchat', 'wordpress', 'spotify',
  ],
  Commerce: [
    'cart', 'cart-fill', 'cart-plus', 'cart-check', 'cart-dash', 'cart-x',
    'bag', 'bag-fill', 'bag-check', 'bag-plus',
    'shop', 'shop-window', 'box', 'box-seam',
    'credit-card', 'credit-card-2-front', 'credit-card-2-back', 'currency-dollar',
    'cash', 'cash-coin', 'piggy-bank', 'wallet', 'wallet2', 'receipt',
    'tag', 'tag-fill', 'tags', 'tags-fill', 'gift', 'gift-fill',
  ],
  Devices: [
    'phone', 'phone-fill', 'phone-vibrate', 'tablet', 'laptop', 'pc-display',
    'pc', 'display', 'tv', 'tv-fill', 'mouse', 'keyboard', 'headphones',
    'headset', 'speaker', 'webcam', 'mic', 'mic-fill', 'mic-mute',
  ],
  Data: [
    'graph-up', 'graph-up-arrow', 'graph-down', 'graph-down-arrow',
    'bar-chart', 'bar-chart-fill', 'bar-chart-line', 'bar-chart-steps',
    'pie-chart', 'pie-chart-fill',
    'table', 'columns', 'columns-gap', 'database', 'database-fill', 'hdd',
    'speedometer', 'speedometer2', 'activity', 'kanban',
  ],
  Weather: [
    'sun', 'sun-fill', 'moon', 'moon-fill', 'moon-stars', 'cloud', 'cloud-fill',
    'cloud-sun', 'cloud-moon', 'cloud-rain', 'cloud-snow', 'cloud-lightning',
    'umbrella', 'thermometer', 'thermometer-half', 'wind', 'snow',
  ],
  Security: [
    'lock', 'lock-fill', 'unlock', 'unlock-fill', 'shield', 'shield-fill',
    'shield-check', 'shield-lock', 'shield-exclamation', 'key', 'key-fill',
    'fingerprint', 'incognito', 'eye', 'eye-fill', 'eye-slash', 'eye-slash-fill',
  ],
  UI: [
    'star', 'star-fill', 'star-half', 'heart', 'heart-fill', 'heart-pulse',
    'hand-thumbs-up', 'hand-thumbs-down', 'emoji-smile', 'emoji-neutral', 'emoji-frown',
    'flag', 'flag-fill', 'bookmark', 'bookmark-fill', 'bookmark-star',
    'lightbulb', 'lightbulb-fill', 'lightning', 'lightning-fill',
    'info', 'info-circle', 'info-circle-fill', 'question-circle', 'exclamation-triangle',
    'exclamation-circle', 'exclamation-circle-fill', 'patch-check', 'patch-exclamation',
  ],
  Time: [
    'clock', 'clock-fill', 'clock-history', 'stopwatch', 'stopwatch-fill',
    'calendar', 'calendar-fill', 'calendar-event', 'calendar-week', 'calendar-month',
    'calendar-check', 'calendar-plus', 'calendar-date', 'hourglass', 'hourglass-split',
  ],
  Layout: [
    'layout-sidebar', 'layout-sidebar-inset', 'layout-sidebar-reverse',
    'layout-text-sidebar', 'layout-three-columns', 'layout-split',
    'columns-gap', 'window', 'window-fullscreen', 'window-stack',
    'arrows-fullscreen', 'arrows-collapse', 'arrows-expand',
    'aspect-ratio', 'border', 'border-all', 'border-outer',
  ],
}

export const BOOTSTRAP_ICONS: string[] = Array.from(
  new Set(Object.values(BOOTSTRAP_ICON_CATEGORIES).flat())
).sort()
