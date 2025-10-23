import { Component, signal } from '@angular/core';
import { InputAddItem } from '../../components/input-add-item/input-add-item';
import { InputListItem } from '../../components/input-list-item/input-list-item';
import { IListItems } from '../../interface/IListItems.interface';

@Component({
  selector: 'app-list',
  imports: [InputAddItem, InputListItem],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class List {
  public addItem = signal(false);

  #setListItems = signal<IListItems[]>(this.#parseItems());
  getListItems = this.#setListItems.asReadonly();

  #parseItems() {
    return JSON.parse(localStorage.getItem('@my-list') || '[]');
  }
  public getInputAndAddItem(value: IListItems) {
    localStorage.setItem('@my-list', JSON.stringify([...this.#setListItems(), value]));
    return this.#setListItems.set(this.#parseItems());
  }

  public listItemsStage(value: 'pending' | 'completed') {
    return this.getListItems().filter((response: IListItems) => {
      if (value === 'pending') {
        return !response.checked;
      }

      if (value === 'completed') {
        return response.checked;
      }

      return response;
    });
  }

  public updateItemCheckbox(newItem: { id: string; checked: boolean }) {
    this.#setListItems.update((oldValue: IListItems[]) => {
      oldValue.filter((response) => {
        if (response.id === newItem.id) {
          response.checked = newItem.checked;
          return response;
        }
        return response;
      });
      return oldValue;
    });

    return localStorage.setItem('@my-list', JSON.stringify(this.#setListItems()));
  }

  public updateItemText(newItem: { id: string; value: string }) {
    this.#setListItems.update((oldValue: IListItems[]) => {
      oldValue.filter((response) => {
        if (response.id === newItem.id) {
          response.value = newItem.value;
          return response;
        }
        return response;
      });
      return oldValue;
    });
  }

  public deleteAllItems() {
    localStorage.removeItem('@my-list');
    return this.#setListItems.set(this.#parseItems());
  }
}
