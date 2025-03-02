import { clickElement } from "@/utils/element-utils";
import { Message } from "@/utils/message-utils";
import { waitForDOMChange, waitForElement } from "@/utils/wait-utils";


export default defineContentScript({
  //matches: ['*://*.discord.com/*'],
  matches: ['*://*/*'],
  main() {
    let doStop = true;

    const getMutuals = async () => {
      console.log("getting mutuals");
      console.log(doStop);

      const members = document.querySelectorAll(".container__91a9d");
      console.log(`members: ${members.length}`);
      for (const member of members) {
        if (doStop) {
          console.log("Stopping");
          return;
        }

        if (member.querySelector(".botTag__5d473") !== null) {
          console.log("Skipping bot");
          continue;
        }
        clickElement(member);

        const moreButton = await waitForElement(
          '.button_fb7f94[aria-label="More"]'
        );
        if (!moreButton) {
          clickElement(member);
          continue;
        }
        clickElement(moreButton);

        const profileButton = await waitForElement(
          '[id="user-profile-overflow-menu-view-profile"]'
        );
        if (!profileButton) {
          break;
        }
        clickElement(profileButton);

        await waitForElement(".item_b3f026");
        const tabItems = document.querySelectorAll(".item_b3f026");

        for (const tabItem of tabItems) {
          if (tabItem.children[0].innerHTML === "About Me") {
            continue;
          }
          clickElement(tabItem);
          await waitForDOMChange();
          const items = document
            .querySelectorAll(".listName__9d78f")
            .values()
            .map((element) => element.innerHTML);

          //items.forEach((item) => console.log(item));
        }

        const backdrop = document.querySelector(".backdrop__78332")!;
        clickElement(backdrop);

        await waitForElement(".outer_c0bea0", false);
      }

      console.log("finished");
    }

    browser.runtime.onMessage.addListener((message) => {
      if (message.type === Message.START) {
        console.log("message start");
        doStop = false;
        getMutuals();
      }
      else if (message.type === Message.STOP) {
        console.log("message stop");
        doStop = true;
      }
    });
    console.log('Hello content.');
  },
});
