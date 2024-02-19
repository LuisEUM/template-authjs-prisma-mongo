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
  };
};

function VideosPlayers({ item, index }: ComponentsProps) {
  return (
    <div className="mx-2 md:mx-14 lg:mx-32 aspect-video rounded-3xl overflow-hidden flex w-full  max-w-3xl">
      <iframe
        className="aspect-video"
        width="100%"
        height="100%"
        src={item.url}
        title={item.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

export default VideosPlayers;
