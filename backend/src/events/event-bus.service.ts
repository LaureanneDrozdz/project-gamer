import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';

@Injectable()
export class EventBusService {
  private emitter = new EventEmitter();

  emit(event: string, payload?: any) {
    this.emitter.emit(event, payload);
  }

  on(event: string, listener: (...args: any[]) => void) {
    this.emitter.on(event, listener);
  }

  once(event: string, listener: (...args: any[]) => void) {
    this.emitter.once(event, listener);
  }
}
