interface Options {
  existenceStatusToWaitFor?: boolean,
  otherSelectorOptions?: string[],
  maxTimeMilliseconds?: number,
}

export function waitForElement(
  selector: string,
  { existenceStatusToWaitFor = true,
    otherSelectorOptions = [],
    maxTimeMilliseconds = 3000 }: Options = {}
): Promise<Element | null> {
  return new Promise((resolve) => {
    const observer = new MutationObserver((_mutations, me) => {
      let element = document.querySelector(selector);
      let hasElement = element !== null;
      if (!hasElement && otherSelectorOptions.length > 0) {
        for (const selector of otherSelectorOptions) {
          const tempElement = document.querySelector(selector);
          if (tempElement) {
            element = tempElement;
            hasElement = true;
            break;
          }
        }
      }
      if (
        (existenceStatusToWaitFor && hasElement) ||
        (!existenceStatusToWaitFor && !hasElement)
      ) {
        finish(element);
      }
    });


    const timeout = setTimeout(() => {
      console.log("waitForElement() timed out");
      finish(null);
    }, maxTimeMilliseconds);

    function finish(element: Element | null) {
      observer.disconnect();
      resolve(element);
      clearTimeout(timeout);
    }

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

export function waitForMilliseconds(waitTimeMs: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, waitTimeMs);
  });
}