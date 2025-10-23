import { NgClass } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { IListItems } from '../../interface/IListItems.interface';

@Component({
  selector: 'app-input-add-item',
  imports: [NgClass],
  templateUrl: './input-add-item.html',
  styleUrl: './input-add-item.scss',
})
export class InputAddItem {
  #cdr = inject(ChangeDetectorRef);

  @ViewChild('inputText') public inputText!: ElementRef;

  @Input({ required: true }) public inputListItems: IListItems[] = [];

  @Output()
  public ouputAddListItem = new EventEmitter<IListItems>();
  public focusAndAddItem(value: string) {
    if (value) {
      this.#cdr.detectChanges();
      this.inputText.nativeElement.value = '';

      const currentData = new Date();
      const timestamp = currentData.getTime();
      const id = `ID ${timestamp}`;

      this.ouputAddListItem.emit({
        id,
        checked: false,
        value,
      });
      return this.inputText.nativeElement.focus();
    }
  }
}
