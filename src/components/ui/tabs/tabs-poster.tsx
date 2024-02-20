import { Tab, Tabs } from "@nextui-org/react";
import ComponentSelector from "../components-selector/components-selector";


type ComponentsProps = {
  index: number;
  item: {
    id?: string;
    order?: number;
    type: "slider" | "video" | "button" | "tabs" | "tab" | string;
    title?: string;
    name?: string;
    classType?: string | "default";
    url: string;
    active: boolean | true;
    available?: { startDateTime?: string; endDateTime?: string };
    content?: Array<any>;
  };
  dataMarketingCards: any;
};

export default function TabsAnimated({
  item,
  index,
  dataMarketingCards,
}: ComponentsProps) {
  return (
    <div
      className="max-w-full w-full flex flex-col items-center justify-center content-center"
      style={{
        order: item.order || index,
      }}
    >
      <Tabs
        aria-label="Options"
        className={`max-w-full [&>*]:flex-wrap md:[&>*]:flex-nowrap [&>*]:flex`}
      >
        {item.content &&
          item.content.map(
            (tab: any, index: number) =>
              tab.active === true && (
                <Tab
                  key={tab.id}
                  title={tab.title}
                  className="[&>*]:items-center [&>*]:flex-col [&>*]:justify-center [&>*]:content-center [&>*]:flex [&>*]:w-full w-full"
                  style={{
                    order: tab.order || index,
                  }}
                >
                  <div
                    className="flex w-full flex-col items-center self-center  "
                    style={{
                      order: tab.order || index,
                    }}
                  >
                    {tab.content &&
                      tab.content.map((item: any, index: number) => (
                        <ComponentSelector
                          item={{ ...item }}
                          index={index}
                          key={item.id}
                          dataMarketingCards={dataMarketingCards}
                        />
                      ))}
                  </div>
                </Tab>
              )
          )}
      </Tabs>
    </div>
  );
}
