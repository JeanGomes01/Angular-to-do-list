import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-time-title',
  imports: [],
  templateUrl: './time-title.html',
  styleUrl: './time-title.scss',
})
export class TimeTitle {
  public currentTime = signal(this.#getCurrentTime());
  public greeting = signal(this.#getGreeting());
  #intervalId!: ReturnType<typeof setInterval>;

  ngOnInit() {
    this.#intervalId = setInterval(() => {
      this.currentTime.set(this.#getCurrentTime());
      this.greeting.set(this.#getGreeting());
    }, 1000);
  }
  ngOnDestroy() {
    clearInterval(this.#intervalId);
  }

  #getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}h: ${minutes} ${seconds}s`;
  }

  #getGreeting(): string {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) return 'Olá, 🌤️ Bom dia !';
    if (hour >= 12 && hour < 18) return 'Olá, 🌞 Boa tarde !';
    return 'Olá,🌙 Boa noite !';
  }
}
