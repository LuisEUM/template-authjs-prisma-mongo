import VideoPlayer from "@/src/components/video-player/VideoPlayer";
import { Button, Tab, Tabs } from "@nextui-org/react";
import { useEffect, useState } from "react";

function MarketingPlanTabsMkt({ contentData }: { contentData: any }) {
  const [content, setContent] = useState(contentData);

  useEffect(() => {
    setContent(contentData);
    return () => {};
  }, [content, contentData]);

  return (
    <div
      className="flex w-full flex-col items-center justify-center content-center  [&>*]:w-full "
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        {content && content.formButton.active && (
          <Button
            variant="faded"
            className="flex bg-gray-700 mb-4 text-white"
            onClick={() => {
              window.open(content && content.formButton.url, "_blank");
            }}
          >
            {content && content.formButton.title}
          </Button>
        )}
        <Tabs
          aria-label="Options"
          className={`max-w-full  [&>*]:flex-wrap md:[&>*]:flex-nowrap `}
        >
          {content &&
            content.tabs.map((tab: any) => (
              <Tab
                key={tab.id}
                title={tab.title}
                className="[&>*]:items-center [&>*]:flex-col [&>*]:justify-center [&>*]:content-center [&>*]:flex [&>*]:w-full w-full"
              >
                <div className="flex w-full flex-col items-center self-center  ">
                  {tab.type === "video" && (
                    <VideoPlayer title={tab.title} url={tab.url} />
                  )}
                  {tab.type === "button" && (
                    <Button
                      variant="faded"
                      className="flex bg-gray-700 text-white mt-4"
                      onClick={() => {
                        window.open(tab.url, "_blank");
                      }}
                    >
                      {tab.title}
                    </Button>
                  )}
                </div>
              </Tab>
            ))}
        </Tabs>
        <h3 className="text-center w-full font-bold text-4xl mt-10 mb-5">
          Diapositivas
        </h3>
        {content && content.slides.active ? (
          <iframe
            src={content.slides.url}
            className="border-5 rounded-2xl border-black overflow-hidden max-w-full bg-zinc-300 "
            width="750"
            height="460"
            allowFullScreen={true}
          ></iframe>
        ) : (
          <div>Muy Pronto</div>
        )}
      </div>
    </div>
  );
}

export default MarketingPlanTabsMkt;
