import { Tab, Tabs } from "@nextui-org/react";
import ActionPostsAndStories from "../../tab-mkt/action-post-and-stories-mkt/ActionPostsAndStoriesMkt";
import MonthlyContentPlanMkt from "../../tab-mkt/monthly-plan-mkt/MonthlyPlanMkt";
import ValueStoriesMkt from "../../tab-mkt/value-stories-mkt/ValueStoriesMkt";
import SmsAndWhatsAppMkt from "../../tab-mkt/sms-and-whatsapp-mkt/SmsAndWhatsAppMkt";
import VideosMkt from "../../tab-mkt/videos-mkt/VideosMkt";
import { useEffect, useState } from "react";

function DigitalcalContentTabsMkt({
  marketingSalonContent,
}: {
  marketingSalonContent: any;
}) {
  const [content, setContent] = useState(marketingSalonContent);

  useEffect(() => {
    setContent(marketingSalonContent);

    return () => {};
  }, [content, marketingSalonContent]);

  console.log(content);

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
          {marketingSalonContent.monthlyContentPlan.es[0] && (
            <Tab key="monthlyContentPlan" title="Plan Mensual">
              <MonthlyContentPlanMkt
                list={marketingSalonContent.monthlyContentPlan.es}
              />
            </Tab>
          )}
          {(marketingSalonContent.actionPosts.es[0] ||
            marketingSalonContent.actionPosts.ca[0]) && (
            <Tab key="actionPosts" title="Post de Acción">
              <div className="flex w-full flex-col items-center mb-0">
                <Tabs aria-label="Options">
                  <Tab key="es" title="Español">
                    <ActionPostsAndStories
                      list={marketingSalonContent.actionPosts.es}
                      lang={"es"}
                    />
                  </Tab>
                  <Tab key="ca" title="Catalán">
                    <ActionPostsAndStories
                      list={marketingSalonContent.actionPosts.ca}
                      lang={"ca"}
                    />
                  </Tab>
                </Tabs>
              </div>
            </Tab>
          )}
          {(marketingSalonContent.actionStories.es[0] ||
            marketingSalonContent.actionStories.ca[0]) && (
            <Tab key="actionStories" title="Story de Acción">
              <div className="flex w-full flex-col items-center mb-0">
                <Tabs aria-label="Options">
                  <Tab key="es" title="Español">
                    <ActionPostsAndStories
                      list={marketingSalonContent.actionStories.es}
                      lang={"es"}
                      story
                    />
                  </Tab>
                  <Tab key="ca" title="Catalán">
                    <ActionPostsAndStories
                      list={marketingSalonContent.actionStories.ca}
                      lang={"ca"}
                      story
                    />
                  </Tab>
                </Tabs>
              </div>
            </Tab>
          )}
          {marketingSalonContent.valueStories.es[0] && (
            <Tab key="valueStories" title="Stories de Valor">
              <ValueStoriesMkt list={marketingSalonContent.valueStories.es}  lang={"es"}/>
            </Tab>
          )}
          {(marketingSalonContent.videos.es[0] ||
            marketingSalonContent.videos.ca[0]) && (
            <Tab key="videos" title="Videos">
              <div className="flex w-full flex-col items-center mb-0">
                <Tabs aria-label="Options">
                  <Tab key="es" title="Español">
                    <VideosMkt
                      list={marketingSalonContent.videos.es}
                      lang={"es"}
                    />
                  </Tab>
                  <Tab key="ca" title="Catalán">
                    <VideosMkt
                      list={marketingSalonContent.videos.ca}
                      lang={"ca"}
                    />
                  </Tab>
                </Tabs>
              </div>
            </Tab>
          )}
          {marketingSalonContent.smsAndWhatsApp.es[0] && (
            <Tab key="smsAndWhatsApp" title="SMS & WhatsApp">
              <div className="flex w-full flex-col items-center mb-0">
                <SmsAndWhatsAppMkt
                  list={marketingSalonContent.smsAndWhatsApp.es}
                />
              </div>
            </Tab>
          )}
          {!marketingSalonContent.monthlyContentPlan.es[0] &&
            !marketingSalonContent.actionPosts.es[0] &&
            !marketingSalonContent.actionPosts.ca[0] &&
            !marketingSalonContent.actionStories.es[0] &&
            !marketingSalonContent.actionStories.ca[0] &&
            !marketingSalonContent.actionPosts.es[0] &&
            !marketingSalonContent.actionPosts.ca[0] &&
            !marketingSalonContent.valueStories.es[0] &&
            !marketingSalonContent.videos.es[0] &&
            !marketingSalonContent.videos.ca[0] &&
            !marketingSalonContent.smsAndWhatsApp.es[0] && (
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

export default DigitalcalContentTabsMkt;
