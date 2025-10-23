import { Component, signal } from '@angular/core';
import Swal from 'sweetalert2';
import { InputAddItem } from '../../components/input-add-item/input-add-item';
import { InputListItem } from '../../components/input-list-item/input-list-item';
import { ELocalStorage } from '../../enum/ELocalStorage.enum';
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
    return JSON.parse(localStorage.getItem(ELocalStorage.MY_LIST) || '[]');
  }

  #updateLocalStorage() {
    return localStorage.setItem(ELocalStorage.MY_LIST, JSON.stringify(this.#setListItems()));
  }
  public getInputAndAddItem(value: IListItems) {
    localStorage.setItem(ELocalStorage.MY_LIST, JSON.stringify([...this.#setListItems(), value]));
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

    return this.#updateLocalStorage();
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

  public deleteItem(id: string) {
    Swal.fire({
      title: 'Tem certeza ?',
      text: 'Você não poderá reverter isso !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, delete o item',
    }).then((result) => {
      if (result.isConfirmed) {
        this.#setListItems.update((oldValue: IListItems[]) => {
          return oldValue.filter((response) => response.id !== id);
        });

        return this.#updateLocalStorage();
      }
    });
  }

  public deleteAllItems() {
    Swal.fire({
      title: 'Tem certeza ?',
      text: 'Você não poderá reverter isso !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, delete tudo!',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem(ELocalStorage.MY_LIST);
        return this.#setListItems.set(this.#parseItems());
      }
    });
  }
}
