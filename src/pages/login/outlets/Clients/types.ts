interface IClientState {
  ref: (EventTarget & HTMLInputElement) | null;
  value: boolean;
}

interface IClientLocal {
  ref: HTMLInputElement | null;
  value: boolean;
}

export type { IClientState, IClientLocal };
