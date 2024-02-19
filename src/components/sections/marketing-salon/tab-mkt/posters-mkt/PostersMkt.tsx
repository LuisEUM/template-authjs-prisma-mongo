// MainComponent.tsx
import CardGroupList from "@/src/components/cards/cards-group/CardGroupList";
import { Button } from "@nextui-org/react";

function PostersMkt({ list, lang }: { list: any[]; lang: string }) {
  const renderButtons = (item: any) => {
    return Object.keys(item.files).map((fileType: string, index: number) => {
      const file = item.files[fileType];

      return (
        <Button
          className={`text-tiny text-white bg-gray-700 m-1  ${
            fileType === "Alup50" && "order-2"
          } ${fileType === "A4" && "order-3"} ${
            fileType === "A5" && "order-4"
          }`}
          variant="flat"
          key={index}
          color="default"
          radius="lg"
          size="sm"
          onClick={() => {
            window.open(file.download, "_blank");
          }}
        >
          {fileType === "Alup50" && "50x70"}
          {fileType === "Alup80" && "80×120"}
          {(fileType === "A4" || fileType == "A5") && fileType}
        </Button>
      );
    });
  };

  return list ? (
    <div className="w-full">
      <CardGroupList
        title={lang === "es" ? "Acciones Principales" : "Accions Principals"}
        list={list.filter((item) => Object.keys(item.files).length === 4)}
        renderButtons={renderButtons}
      />
      <CardGroupList
        title={lang === "es" ? "Acciones Secundarias" : "Accions Secundàries"}
        list={list.filter((item) => Object.keys(item.files).length <= 2)}
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

export default PostersMkt;
