// MainComponent.tsx
import CardGroupList from "@/src/components/cards/cards-group/CardGroupList";
import { Button } from "@nextui-org/react";

function VideosMkt({ list, lang }: { list: any[]; lang: string }) {
  const renderButtons = (item: any) => {
    return Object.keys(item.files).map((fileType: string, index: number) => {
      const file = item.files[fileType];

      return (
        <>
          {fileType !== "Preview" && (
            <Button
              className="text-tiny text-white bg-gray-700 m-1"
              variant="flat"
              key={index}
              color="default"
              radius="lg"
              size="sm"
              onClick={() => {
                window.open(file.download, "_blank");
              }}
            >
              Descargar {fileType}
            </Button>
          )}
        </>
      );
    });
  };

  return list ? (
    <div className="w-full">
      <CardGroupList
        title={lang === "es" ? "Videos en Español" : "Videos en Catalán"}
        list={list.filter((item) => Object.keys(item.files).length >= 0)}
        renderButtons={renderButtons}
      />
    </div>
  ) : (
    <div>
      {lang === "es" && "Muy Pronto"}
      {lang === "ca" && "Molt Aviat"}
    </div>
  );
}

export default VideosMkt;
