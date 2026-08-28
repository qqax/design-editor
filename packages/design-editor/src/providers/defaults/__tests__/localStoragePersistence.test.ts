import { describe, it, expect, beforeEach } from 'vitest'
import { createLocalStoragePersistence } from '../localStoragePersistence'

describe('localStoragePersistence', () => {
  beforeEach(() => localStorage.clear())

  it('saves and loads a scene', async () => {
    const p = createLocalStoragePersistence()
    const scene: any = { id: 's1', layers: [], width: 100, height: 100 }
    await p.save('test', scene)
    expect(await p.load('test')).toEqual(scene)
  })

  it('returns null for missing scene', async () => {
    const p = createLocalStoragePersistence()
    expect(await p.load('missing')).toBeNull()
  })

  it('lists saved scenes', async () => {
    const p = createLocalStoragePersistence({ prefix: 'pfx_' })
    await p.save('a', { id: 'a' } as any)
    await p.save('b', { id: 'b' } as any)
    const list = await p.list!()
    expect(list.map((s) => s.sceneKey).sort()).toEqual(['a', 'b'])
  })
})
