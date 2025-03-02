export function waitForElement(
  selector: string,
  existenceStatusToWaitFor: boolean = true,
  maxTimeMilliseconds: number = 3000
): Promise<Element | null> {
  return new Promise((resolve) => {
    const observer = new MutationObserver((_mutations, me) => {
      const element = document.querySelector(selector);
      if (
        (existenceStatusToWaitFor && element) ||
        (!existenceStatusToWaitFor && !element)
      ) {
        me.disconnect();
        resolve(element);
      }
    });

    setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, maxTimeMilliseconds);

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

export function waitForDOMChange() {
  return new Promise<void>((resolve) => {
    const observer = new MutationObserver(() => {
      resolve();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}