import { Directive, ElementRef, Renderer2, effect, inject, input } from '@angular/core';

export type ButtonVariant =
  | 'accent'
  | 'secondary'
  | 'white'
  | 'icon'
  | 'icon-warning';

/**
 * Applies the shared global `.btn` styling to any button/anchor.
 *
 * Usage:
 *   <button appButton>Default</button>
 *   <button appButton variant="accent">Add task</button>
 *   <button appButton variant="secondary" [height]="48">Edit categories</button>
 *
 * The base `.btn` class is always added; `variant` maps to the matching
 * `.btn-*` modifier defined in `src/styles.scss`. `height` defaults to 40px.
 */
@Directive({
  selector: 'button[appButton], a[appButton]',
  standalone: true,
  host: {
    class: 'btn',
    '[style.height.px]': 'height()',
  },
})
export class ButtonDirective {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);

  readonly variant = input<ButtonVariant>();
  readonly height = input<number>(40);

  private appliedClass: string | null = null;

  constructor() {
    effect(() => {
      const next = this.variant() ? `btn-${this.variant()}` : null;

      if (this.appliedClass === next) {
        return;
      }
      if (this.appliedClass) {
        this.renderer.removeClass(this.el.nativeElement, this.appliedClass);
      }
      if (next) {
        this.renderer.addClass(this.el.nativeElement, next);
      }
      this.appliedClass = next;
    });
  }
}
