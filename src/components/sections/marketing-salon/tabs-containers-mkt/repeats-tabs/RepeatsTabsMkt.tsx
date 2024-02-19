import VideoPlayer from "@/src/components/video-player/VideoPlayer";
import { Button, Tab, Tabs } from "@nextui-org/react";
import { useEffect, useState } from "react";

function RepeatsTabsMkt({
  marketingSalonContent,
}: {
  marketingSalonContent: any;
}) {
  const [content, setContent] = useState(marketingSalonContent);

  useEffect(() => {
    setContent(marketingSalonContent);

    return () => {};
  }, [content, marketingSalonContent]);

  return (
    <div className="flex w-full flex-col items-center mb-0">
      <Tabs
        aria-label="Options"
        className={`max-w-full  [&>*]:flex-wrap md:[&>*]:flex-nowrap `}
      >
        {content?.tabs ? (
          content.tabs.map((tab: any) => (
            <Tab
              key={tab.id}
              title={tab.title}
              className="[&>*]:items-center [&>*]:flex-col [&>*]:justify-center [&>*]:content-center [&>*]:flex [&>*]:w-full w-full"
            >
              <div className="flex w-full flex-col items-center self-center  ">
                {tab.type === "video" &&
                  tab.videos.map((video: any) => (
                    <>
                      <h4 className="mb-4 mt-2 font-bold">{video.title}</h4>
                      <VideoPlayer
                        key={video.id}
                        url={video.url}
                        title={video.title}
                      />
                    </>
                  ))}
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
          ))
        ) : (
          <Tab
            key={"commingSoon"}
            title={"Muy Pronto"}
            className="[&>*]:items-center [&>*]:flex-col [&>*]:justify-center [&>*]:content-center [&>*]:flex [&>*]:w-full w-full"
          />
        )}
      </Tabs>
    </div>
  );
}

export default RepeatsTabsMkt;
