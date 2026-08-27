import React from 'react'
import { Image as ImageIcon, Type, Video, Shapes, Folder } from 'lucide-react'

export interface LayerItem {
  id: string
  type: string
  name: string
  visible: boolean
  children?: LayerItem[]
}

export const TYPE_ICONS: Record<string, React.ReactNode> = {
  StaticImage: React.createElement(ImageIcon, { size: 14 }),
  BackgroundImage: React.createElement(ImageIcon, { size: 14 }),
  StaticText: React.createElement(Type, { size: 14 }),
  DynamicText: React.createElement(Type, { size: 14 }),
  StaticVideo: React.createElement(Video, { size: 14 }),
  StaticPath: React.createElement(Shapes, { size: 14 }),
  StaticVector: React.createElement(Shapes, { size: 14 }),
  Group: React.createElement(Folder, { size: 14 }),
}

export const ICON_BTN: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--color-text)',
  borderRadius: 4,
  transition: 'background 0.1s',
}

export interface LayerCallbacks {
  onSelect: (id: string, multi: boolean) => void
  onVisibilityChange: (id: string, visible: boolean) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onRename: (id: string, name: string) => void
}
