declare const preloadImages: (sel?: string) => Promise<unknown>;
declare const sleep: (time: number) => Promise<unknown>;
declare const preventDefaultAndStopBubble: (e: Event) => void;
declare const detectDeviceType: () => "Mobile" | "Desktop";
export { preloadImages, sleep, preventDefaultAndStopBubble, detectDeviceType };
