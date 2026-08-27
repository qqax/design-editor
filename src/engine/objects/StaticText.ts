import { Textbox, classRegistry } from "fabric"
import type { TextboxProps } from "fabric"

export type StaticTextOptions = TextboxProps & { text: string; fontURL?: string }

export class StaticText extends Textbox {
  static type = "StaticText"

  set type(_value: string) {
    // fixed value — intentional no-op
  }

  public fontURL?: string

  constructor(options: StaticTextOptions) {
    const { text, ...textOptions } = options
    super(text, { ...textOptions } as any)
    if (options.fontURL) {
      this.fontURL = options.fontURL
    }
  }

  // @ts-ignore
  toObject(propertiesToInclude: string[] = []): any {
    return {
      ...super.toObject(propertiesToInclude as any),
      fontURL: this.fontURL,
    }
  }

  // @ts-ignore
  toJSON(propertiesToInclude: string[] = []): any {
    return {
      ...super.toObject(propertiesToInclude as any),
      fontURL: this.fontURL,
    }
  }

  static async fromObject(options: StaticTextOptions) {
    return new StaticText(options)
  }
}

classRegistry.setClass(StaticText, StaticText.type)

declare module "fabric" {
  export interface StaticText {}
}
