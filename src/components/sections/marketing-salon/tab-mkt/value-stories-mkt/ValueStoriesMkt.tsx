// MainComponent.tsx
import CardGroupList from "@/src/components/cards/cards-group/CardGroupList";
import { Button } from "@nextui-org/react";

function ValueStoriesMkt({ list, lang }: { list: any[]; lang: string }) {
  const renderButtons = (item: any) => {
    return Object.keys(item.files).map((fileType: string, index: number) => {
      const file = item.files[fileType];

      return (
        <>
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
            Descargar Imagen
          </Button>
        </>
      );
    });
  };

  // Obtén un conjunto único de nombres de grupo
  const groupNames = new Set(list?.map((item) => item.groupName));

  return list ? (
    <div className="w-full">
      {Array.from(groupNames).map((groupName) => (
        <CardGroupList
          key={groupName}
          title={groupName}
          list={list.filter((item) => item.groupName === groupName)}
          renderButtons={renderButtons}
        />
      ))}
    </div>
  ) : (
    <div>
      {lang === "es" && "Muy Pronto"}
      {lang === "ca" && "Molt Aviat"}
    </div>
  );
}

export default ValueStoriesMkt;
