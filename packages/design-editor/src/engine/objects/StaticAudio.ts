import { classRegistry, Object as FabricObject } from 'fabric';

import type { FabricObjectProps } from 'fabric';

export interface StaticAudioOptions extends FabricObjectProps {
  id: string;
  name: string;
  src: string;
}

export class StaticAudio extends FabricObject {
  static type = 'StaticAudio';

  get type() {
    return 'StaticAudio';
  }

  set type(_value: string) {
    // fixed value — intentional no-op
  }

  constructor(options: StaticAudioOptions) {
    super({
      width: 0,
      height: 0,
      selectable: false,
      evented: false,
      visible: false,
      ...(options as any),
    });
  }

  // @ts-ignore
  static async fromObject(options: any) {
    return new StaticAudio(options);
  }
}

classRegistry.setClass(StaticAudio, StaticAudio.type);

declare module 'fabric' {
  export interface StaticAudio {}
}
