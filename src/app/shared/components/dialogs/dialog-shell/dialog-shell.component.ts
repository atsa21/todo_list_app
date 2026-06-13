import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * Presentational shell for modal dialogs: a fixed header (title + optional
 * subtitle + close button), a scrollable body (projected content) and a fixed
 * footer with Cancel / confirm pills.
 *
 * Relies on the host dialog surface being a flex column with a bounded
 * max-height (see the `*-dialog-panel` rules in `styles.scss`): the body
 * scrolls while the header and footer stay pinned.
 *
 * Use the default footer via `confirmLabel` / `confirmDisabled` and the
 * `(confirm)` / `(cancel)` outputs, or project a custom one with
 * `<div dialogActions>…</div>`.
 */
@Component({
  standalone: true,
  selector: 'app-dialog-shell',
  templateUrl: './dialog-shell.component.html',
  styleUrls: ['./dialog-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogShellComponent {
  public readonly title = input.required<string>();
  public readonly subtitle = input<string>('');
  public readonly cancelLabel = input<string>('Cancel');
  public readonly confirmLabel = input<string>('Save');
  public readonly confirmDisabled = input<boolean>(false);
  public readonly showFooter = input<boolean>(true);

  public readonly cancel = output<void>();
  public readonly confirm = output<void>();
}
