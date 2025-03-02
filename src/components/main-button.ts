import { Message } from "@/utils/message-utils";

export function setupMainButton(element: HTMLButtonElement) {
  let doStop: boolean;
  const setDoStop = async (newDoStop: boolean) => {
    doStop = newDoStop;
    const [tab] = await browser.tabs.query({ active: true });
    if (doStop) {
      element.innerHTML = "Start";
      browser.tabs.sendMessage(tab.id!, {
        type: Message.STOP
      });
    }
    else {
      element.innerHTML = "Stop";
      browser.tabs.sendMessage(tab.id!, {
        type: Message.START
      });
    }
  }
  element.addEventListener('click', () => setDoStop(!doStop));
  setDoStop(true);
}