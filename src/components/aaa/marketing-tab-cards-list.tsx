"use client";
import { Tab, Tabs } from "@nextui-org/react";
import { useEffect, useState } from "react";

type ComponentsProps = {
  dataMarketingCards: any;
  index: number;
  item: {
    childrensCode?: any;
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
    content?: Array<any>;
    childrensType?:
      | "downloadCarouselCards"
      | "copyTextCards"
      | "downloadImageAndCopyTextCards"
      | "downloadImageCards"
      | string;
  };
};

export default function MarketingTabCardsList({
  item,
  index,
  dataMarketingCards,
}: ComponentsProps) {
  const [content, setContent] = useState(item);

  useEffect(() => {
    setContent(item);

    // Filtrar el objeto para obtener solo las claves que están en el array de códigos
    const filteredObject: { [key: string]: any } = Object.keys(dataMarketingCards)
      .filter((key) => item.childrensCode.includes(key))
      .reduce((obj, key) => {
        obj[key] = dataMarketingCards[key];
        return obj;
      }, {} as { [key: string]: any });

    console.log("filteredObject", filteredObject);

    // console.log(item.childrensCode);
    // console.log(dataMarketingCards);
  }, [item, dataMarketingCards]);

  console.log("content", content);

  // const contentKeys = content.childrensCode; // Ejemplo: ['posters', 'stoppers', 'tests', 'cards']

  switch (content.childrensType) {
    case "downloadCarouselCards":
      return (
        <div className="flex w-full flex-col items-center justify-center content-center  [&>*]:w-full ">
          <Tabs
            aria-label="Options"
            className={`max-w-full  [&>*]:flex-wrap md:[&>*]:flex-nowrap `}
          >
            {/* {contentKeys.map((key) => {
              const contentItem = content.childrensCode[key];
              // Asegúrate de que hay contenido para al menos un idioma
              if (contentItem.es[0] || contentItem.ca[0]) {
                return (
                  <Tab
                    key={key}
                    title={key.charAt(0).toUpperCase() + key.slice(1)}
                  >
                    <Tabs aria-label="Options">
                      <Tab key="es" title="Español">
                        <GenericContentTab list={contentItem.es} lang={"es"} />
                      </Tab>
                      <Tab key="ca" title="Catalán">
                        <GenericContentTab list={contentItem.ca} lang={"ca"} />
                      </Tab>
                    </Tabs>
                  </Tab>
                );
              }
              return null;
            })} */}
          </Tabs>
        </div>
      );
    case "copyTextCards":
      return <div>copyTextCards</div>;
    case "downloadImageAndCopyTextCards":
      return <div>downloadImageAndCopyTextCards</div>;
    case "downloadImageCards":
      return <div>downloadImageCards</div>;
    default:
      return <div>FALLASTEEEEEE</div>;
  }
}

const GenericContentTab = ({ list, lang }: { list: any[], lang: string }) => {
  // Renderiza tu contenido aquí, dependiendo del tipo de contenido que tengas
  return (
    <div>
      {list.map((item, index) => (
        <div key={index}>
          {/* Asumiendo que tienes un componente Card genérico */}
          {/* <Card item={item} lang={lang} /> */}
          Item {index} en {lang}
        </div>
      ))}
    </div>
  );
};
