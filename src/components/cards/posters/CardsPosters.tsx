import {
  Button,
  Card,
  CardFooter,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";
import { EyeFilledIcon } from "@/src/icons/eyes-icon/EyeFilledIcon.jsx";
function CardsPosters({
  item,
  renderButtons,
}: {
  item: any;
  renderButtons: any;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const ImageModal = ({ alt, src }: { alt: string; src: string }) => {
    return (
      <>
        <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">{alt}</ModalHeader>
                <ModalBody>
                  <Image
                    alt={item.name}
                    className="object-cover border-gray-700/20 border-1 shadow-sm w-full"
                    height={200}
                    src={src}
                    width={200}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  {/* <Button color="primary" onPress={onClose}>
                    Action
                  </Button> */}
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  };

  return (
    <Card
      isFooterBlurred
      radius="lg"
      className="border-none gap-2 px-2 py-3 flex items-center justify-center col-span-1 bg-white"
      key={item.name}
    >
      {item.name.replace(/-/g, " ").replace(/.jpg/g, " ")}

      {item.files.Preview && item.files.Preview.imgEmbed && (
        <div className="relative">
          <div className="  absolute right-1 top-1">
            <Tooltip content="+ Zoom" size="sm">
              <Button
                onPress={onOpen}
                isIconOnly
                variant="faded"
                className=" hover:opacity-100 rounded-full"
              >
                <EyeFilledIcon />
              </Button>
            </Tooltip>
            <ImageModal alt={item.name} src={item.files.Preview.imgEmbed} />
          </div>

          <Image
            alt={item.name}
            className="object-cover border-gray-700/20 border-1 shadow-sm w-52"
            height={200}
            src={item.files.Preview.imgEmbed}
            width={200}
          />
        </div>
      )}

      {item.imgEmbed && !item.files.Preview && (
        <div className="relative">
          <div className="absolute right-1 top-1">
            <Tooltip content="+ Zoom" size="sm">
              <Button
                onPress={onOpen}
                isIconOnly
                variant="faded"
                className=" hover:opacity-100 rounded-full"
              >
                <EyeFilledIcon />
              </Button>
            </Tooltip>
            <ImageModal alt={item.name} src={item.imgEmbed} />
          </div>

          <Image
            alt={item.name}
            className="object-cover border-gray-700/20 border-1 shadow-sm w-52"
            height={200}
            src={item.imgEmbed}
            width={200}
          />
        </div>
      )}

      <CardFooter className="flex mx-auto flex-row flex-wrap self-start justify-center before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 before:rounded-xl rounded-large bottom-1 w-52 shadow-small z-10">
        {renderButtons(item)}
      </CardFooter>
    </Card>
  );
}

export default CardsPosters;
