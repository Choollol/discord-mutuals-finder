import { clickElement, SELF_PROFILE_SELECTOR, SERVER_NAME_SELECTOR } from "@/utils/element-utils";
import { Message } from "@/utils/message-utils";
import { waitForElement } from "@/utils/wait-utils";
import {
  MEMBER_CONTAINER_SELECTOR,
  BOT_TAG_SELECTOR,
  MORE_BUTTON_SELECTOR,
  PROFILE_BUTTON_SELECTOR,
  TAB_ITEM_SELECTOR,
  MUTUALS_LIST_ITEM_SELECTOR,
  BACKDROP_SELECTOR,
  PROFILE_CARD_SELECTOR,
  NO_MUTUALS_SELECTOR,
  ABOUT_ME_SCROLLER_SELECTOR,
} from "@/utils/element-utils";
import { MutualType } from "@/utils/mutual-utils";


export default defineContentScript({
  //matches: ['*://*.discord.com/*'],
  matches: ['*://*/*'],
  main() {
    let doStop = true;

    const getMutuals = async () => {
      console.log("getting mutuals");

      const serverNameElement = document.querySelector(SERVER_NAME_SELECTOR);
      if (!serverNameElement) {
        console.error("Couldn't find server name!");
        return;
      }
      const serverName = serverNameElement.innerHTML;

      const members = document.querySelectorAll(MEMBER_CONTAINER_SELECTOR);
      console.log(`members: ${members.length}`);
      for (const member of members) {
        // Check for stop
        if (doStop) {
          console.log("Stopping");
          return;
        }

        // Skip bots, i.e. members with bot tag
        if (member.querySelector(BOT_TAG_SELECTOR) !== null) {
          console.log("Skipping bot");
          continue;
        }

        clickElement(member);

        // Go into full profile
        const cardButton = await waitForElement(MORE_BUTTON_SELECTOR, { otherSelectorOptions: [SELF_PROFILE_SELECTOR] });
        if (!cardButton) {
          clickElement(member);
          console.log("No card button!");
          break;
        }
        if (document.querySelector(SELF_PROFILE_SELECTOR)) {
          clickElement(member);
          console.log("Skipping self!");
          await waitForElement(SELF_PROFILE_SELECTOR, { existenceStatusToWaitFor: false });
          continue;
        }
        clickElement(cardButton);
        const profileButton = await waitForElement(PROFILE_BUTTON_SELECTOR);
        if (!profileButton) {
          console.error("No profile button element!");
          break;
        }
        clickElement(profileButton);

        await waitForElement(TAB_ITEM_SELECTOR);
        const tabItems = document.querySelectorAll(TAB_ITEM_SELECTOR).values();

        const aboutMeButton = tabItems.find((tab) => tab.firstElementChild?.innerHTML === "About Me");
        if (!aboutMeButton) {
          console.error("No About Me button!");
          continue;
        }

        for (const tabItem of tabItems) {
          const tabChild = tabItem.firstElementChild;
          if (!tabChild) {
            console.error("Couldn't find tab child!");
            return;
          }
          const tabName = tabChild.innerHTML.toLowerCase();
          if (!tabName.includes("mutual")) {
            continue;
          }

          let mutualType = MutualType.FRIEND;
          if (tabName.includes("server")) {
            mutualType = MutualType.SERVER;
          }

          // Go to About Me section to clear DOM of mutuals list, to be able to wait for mutuals list to appear
          clickElement(aboutMeButton);
          await waitForElement(ABOUT_ME_SCROLLER_SELECTOR);

          clickElement(tabItem);
          await waitForElement(MUTUALS_LIST_ITEM_SELECTOR, { otherSelectorOptions: [NO_MUTUALS_SELECTOR] });

          const mutuals = document
            .querySelectorAll(MUTUALS_LIST_ITEM_SELECTOR)
            .values()
            .map((element) => {
              if (element.firstElementChild === null) {
                return element.innerHTML;
              }
              else {
                return element.firstElementChild.innerHTML;
              }
            })
            .filter((name) => mutualType !== MutualType.SERVER || name !== serverName);

          mutuals.forEach((item) => { console.log(item) });
        }

        const backdrop = document.querySelector(BACKDROP_SELECTOR);
        if (!backdrop) {
          console.error("No backdrop element!");
          break;
        }
        clickElement(backdrop);

        await waitForElement(PROFILE_CARD_SELECTOR, { existenceStatusToWaitFor: false });
      }

      console.log("finished");
    }

    browser.runtime.onMessage.addListener((message) => {
      if (message.type === Message.START) {
        doStop = false;
        getMutuals();
      }
      else if (message.type === Message.STOP) {
        doStop = true;
      }
    });
    console.log('Hello content.');
  },
});
