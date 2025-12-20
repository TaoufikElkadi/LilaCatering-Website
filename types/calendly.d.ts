declare global {
  interface Window {
    Calendly?: {
      initInlineWidget(options: {
        url: string;
        parentElement: Element | null;
        prefill?: Record<string, any>;
        utm?: Record<string, any>;
      }): void;
    };
  }
}

export {};

