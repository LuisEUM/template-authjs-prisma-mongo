import { Button } from "@nextui-org/react";
import VideosPlayers from "../videos-players/videos-players";
import Slides from "../slides/slides";
import TabsAnimated from "../tabs/tabs-animated";
import MarketingTabCardsList from "../../aaa/marketing-tab-cards-list";

type ComponentsProps = {
  index: number;
  dataMarketingCards: any;
  item: {
    id?: string;
    order?: number;
    type:
      | "slider"
      | "video"
      | "button"
      | "tabs"
      | "tab"
      | "tabsCardsList"
      | string;
    title?: string;
    name?: string;
    classType?: string | "default";
    url: string;
    active: boolean | true;
    available?: { startDateTime?: string; endDateTime?: string };
  };
};

export default function ComponentsSelector({
  index,
  item,
  dataMarketingCards,
}: ComponentsProps) {
  console.log(dataMarketingCards);

  return (
    <>
      {item.type === "video" && item.active === true && (
        <VideosPlayers item={{ ...item }} index={index} />
      )}
      {item.type === "button" && item.active === true && (
        <Button
          variant="faded"
          className="flex bg-gray-700 text-white"
          style={{ order: item.order || index }}
          onClick={() => {
            window.open(item && item.url, "_blank");
          }}
        >
          {item && item.title}
        </Button>
      )}
      {item.type === "slider" && item.active === true && (
        <Slides item={{ ...item }} index={index}></Slides>
      )}
      {item.type === "tabs" && item.active === true && (
        <TabsAnimated
          item={{ ...item }}
          index={index}
          dataMarketingCards={dataMarketingCards}
        />
      )}

      {item.type === "tabsCardsList" && item.active === true && (
        <MarketingTabCardsList
          dataMarketingCards={dataMarketingCards}
          item={{ ...item }}
          index={index}
        />
      )}
    </>
  );
}
