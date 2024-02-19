import { Tab, Tabs } from "@nextui-org/react";
import PostersMkt from "../../tab-mkt/posters-mkt/PostersMkt";
import StoppersMkt from "../../tab-mkt/stoppers-mkt/StoppersMkt";
import CardsMkt from "../../tab-mkt/cards-mkt/CardsMkt";
import TestsMkt from "../../tab-mkt/tests-mkt/TestMkt";
import { useEffect, useState } from "react";

function PhysicalContentTabsMkt({
  marketingSalonContent,
}: {
  marketingSalonContent: any;
}) {
  const [content, setContent] = useState(marketingSalonContent);

  useEffect(() => {
    setContent(marketingSalonContent);

    return () => {};
  }, [content, marketingSalonContent]);

  console.log(marketingSalonContent)
  return (
    <div className="flex w-full flex-col items-center justify-center content-center  [&>*]:w-full ">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Tabs
          aria-label="Options"
          className={`max-w-full  [&>*]:flex-wrap md:[&>*]:flex-nowrap `}
        >
          {(marketingSalonContent.posters.es[0] ||
            marketingSalonContent.posters.ca[0]) && (
            <Tab key="posters" title="Cartelería">
              <div className="flex w-full flex-col items-center mb-0">
                <Tabs aria-label="Options">
                  <Tab key="es" title="Español">
                    <PostersMkt
                      list={marketingSalonContent.posters.es}
                      lang={"es"}
                    />
                  </Tab>
                  <Tab key="ca" title="Catalán">
                    <PostersMkt
                      list={marketingSalonContent.posters.ca}
                      lang={"ca"}
                    />
                  </Tab>
                </Tabs>
              </div>
            </Tab>
          )}
          {(marketingSalonContent.stoppers.es[0] ||
            marketingSalonContent.stoppers.ca[0]) && (
            <Tab key="stoppers" title="Stopper">
              <div className="flex w-full flex-col items-center mb-0">
                <Tabs aria-label="Options">
                  <Tab key="es" title="Español">
                    <StoppersMkt
                      list={marketingSalonContent.stoppers.es}
                      lang={"es"}
                    />
                  </Tab>
                  <Tab key="ca" title="Catalán">
                    <StoppersMkt
                      list={marketingSalonContent.stoppers.ca}
                      lang={"ca"}
                    />
                  </Tab>
                </Tabs>
              </div>
            </Tab>
          )}
          {(marketingSalonContent.tests.es[0] ||
            marketingSalonContent.tests.ca[0]) && (
            <Tab key="tests" title="Tests">
              <div className="flex w-full flex-col items-center mb-0">
                <Tabs aria-label="Options">
                  <Tab key="es" title="Español">
                    <TestsMkt
                      list={marketingSalonContent.tests.es}
                      lang={"es"}
                    />
                  </Tab>
                  <Tab key="ca" title="Catalán">
                    <TestsMkt
                      list={marketingSalonContent.tests.ca}
                      lang={"ca"}
                    />
                  </Tab>
                </Tabs>
              </div>
            </Tab>
          )}
          {(marketingSalonContent.cards.es[0] ||
            marketingSalonContent.cards.ca[0]) && (
            <Tab key="cards" title="Tarjetas">
              <div className="flex w-full flex-col items-center mb-0">
                <Tabs aria-label="Options">
                  <Tab key="es" title="Español">
                    <CardsMkt
                      list={marketingSalonContent.cards.es}
                      lang={"es"}
                    />
                  </Tab>
                  <Tab key="ca" title="Catalán">
                    <CardsMkt
                      list={marketingSalonContent.cards.ca}
                      lang={"ca"}
                    />
                  </Tab>
                </Tabs>
              </div>
            </Tab>
          )}
          {(!marketingSalonContent.posters.es[0] &&
            !marketingSalonContent.posters.ca[0] &&
            !marketingSalonContent.stoppers.es[0] &&
            !marketingSalonContent.stoppers.ca[0] &&
            !marketingSalonContent.tests.es[0] &&
            !marketingSalonContent.tests.ca[0] &&
            !marketingSalonContent.cards.es[0] &&
            !marketingSalonContent.cards.ca[0]) && (
            <Tab
              key="comingSoon"
              title="Muy Pronto"
              className="cursor-default"
            />
          )}
        </Tabs>
      </div>
    </div>
  );
}

export default PhysicalContentTabsMkt;
