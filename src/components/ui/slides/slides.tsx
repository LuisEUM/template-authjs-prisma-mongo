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

export default function Slides({ index, item }: ComponentsProps) {
  return (
    item.active && (
      <iframe
        src={item.url}
        className="border-5 rounded-2xl border-black overflow-hidden max-w-full bg-zinc-300 "
        width="750"
        height="460"
        style={{ order: item.order || index }}
        allowFullScreen={true}
      ></iframe>
    )
  );
}
