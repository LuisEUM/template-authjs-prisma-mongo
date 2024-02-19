"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import dataMonths from "@/src/db/dates/months.json";
import RepeatsTabsMkt from "@/src/components/sections/marketing-salon/tabs-containers-mkt/repeats-tabs/RepeatsTabsMkt";
import DigitalcalContentTabsMkt from "@/src/components/sections/marketing-salon/tabs-containers-mkt/digital-content-tabs-mkt/DigitalcalContentTabsMkt";
import PhysicalContentTabsMkt from "@/src/components/sections/marketing-salon/tabs-containers-mkt/physical-content-tabs-mkt/PhysicalContentTabsMkt";
import MarketingPlanTabsMkt from "@/src/components/sections/marketing-salon/tabs-containers-mkt/marketing-plan-tabs/MarketingPlanTabsMkt";
import TailwindGrid from "@/src/components/grid/TailwindGrid";

interface VideoTab {
  id: string;
  title: string;
  type: string;
  url: string;
}

interface FormButton {
  title: string;
  active: boolean;
  url: string;
}

interface Slides {
  url: string;
  active: boolean;
}

interface MarketingPlan {
  id: string;
  name: string;
  order: number;
  tabs: VideoTab[];
  formButton: FormButton;
  slides: Slides;
}

interface ContentPlan {
  es: any[]; // Reemplaza any con una interfaz más específica si es necesario
  ca: any[]; // Reemplaza any con una interfaz más específica si es necesario
}

interface DigitalContent {
  id: string;
  name: string;
  order: number;
  monthlyContentPlan: ContentPlan;
  actionStories: ContentPlan;
  valueStories: ContentPlan;
  videos: ContentPlan;
  smsAndWhatsApp: ContentPlan;
}

interface PhysicalContent {
  id: string;
  name: string;
  order: number;
  posters: ContentPlan;
  stoppers: ContentPlan;
  tests: ContentPlan;
  cards: ContentPlan;
}

interface Repeats {
  id: string;
  name: string;
  order: number;
  tabs: any[]; // Reemplaza any con una interfaz más específica si es necesario
}

interface MonthlyData {
  marketingPlan?: MarketingPlan;
  digitalContent?: DigitalContent;
  physicalContent?: PhysicalContent;
  repeats?: Repeats;
}

function Page() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState(searchParams?.get("tab") ?? "marketingPlan");
  const [data, setData] = useState<MonthlyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [year, setYear] = useState<string>(
    (searchParams?.get("year") as string) ?? new Date().getFullYear().toString()
  );
  const [month, setMonth] = useState<string>(
    (searchParams?.get("month") as string) ?? "january"
  );
  const monthTranslations = dataMonths.months.find((item) => item.id === month);
  // Update the type of sideMenu state
  const [sideMenu, setSideMenu] = useState<{ list: any[] } | null>(null);

  useEffect(() => {
    async function fetchData(year: string, month: string) {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/data/marketing-salon/${year}/${month}`
        );
        if (!response.ok) {
          throw new Error(`Data fetch failed: ${response.status}`);
        }
        const newData = await response.json();
        console.log(newData);

        setData(newData);
        const menuItems = generateSideMenu(newData);

        // Set the sideMenu state with the list property
        setSideMenu({ list: menuItems });
      } catch (err) {
        // Ahora TypeScript está de acuerdo con esta asignación
        setError(err instanceof Error ? err : new Error("An error occurred"));
      } finally {
        setLoading(false);
      }
    }

    fetchData(year, month);
  }, [year, month]);

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  // Renderizado condicional basado en los datos
  return data ? (
    <>
      <TailwindGrid fullSize>
        <div className="col-span-1 col-start-1 col-end-2 h-screen fixed w-2/12  top-0 z-30 border-r box-border border-zinc-500 bg-white-950/40 backdrop-blur-lg bg-clip-padding backdrop-filter opacity-75 hidden lg:block">
          <div className="mt-24 flex p-4">
            <ul
              aria-label={`Plan de Marketing ${
                monthTranslations?.name || monthTranslations?.title + " "
              } ${year ?? ""}`}
              className=" z-30 gap-y-0 self-center col-start-1 lg:col-start-3 col-end-5 md:col-end-9 lg:col-end-13 w-full flex flex-col bg-red-300/0 justify-center items-center overflow-hidden border-gray-700/30 border-4 rounded-2xl "
            >
              <strong className="font-bold py-2 bg-gray-900 text-white w-full text-center">
                {monthTranslations?.name || monthTranslations?.title + " "}
                {" " + year}
              </strong>

              {sideMenu &&
                sideMenu.list.map(
                  (
                    item: { id: string; name: string; order: any },
                    index: any
                  ) =>
                    item.name && (
                      <li
                        key={index + item.id}
                        className={`relative cursor-pointer  py-2   first:mt-0 flex items-center justify-center mx-auto text-center hover:font-semibold hover:bg-gray-700/30 w-full ${
                          item.id === tab && "font-semibold bg-gray-700/30  "
                        }}`}
                        style={{ order: item.order }}
                        onClick={(event: React.MouseEvent<HTMLLIElement>) => {
                          if (item.id !== tab) {
                            setTab(item.id);
                          }
                        }}
                      >
                        {item.name}
                      </li>
                    )
                )}
            </ul>
          </div>
        </div>
        <div className="relative col-span-full max-w-full  mt-10 gap-10">
          <TailwindGrid>
            <ul
              aria-label={`Plan de Marketing ${
                monthTranslations?.name || monthTranslations?.title + " "
              } ${year ?? ""}`}
              className="h-full lg:hidden z-30 gap-y-0 self-center col-start-1 lg:col-start-3 col-end-5 md:col-end-9 lg:col-end-13 w-full flex flex-col bg-red-300/0 justify-center items-center overflow-hidden border-gray-700/30 border-4 rounded-2xl "
            >
              <strong className="font-bold py-2 bg-gray-900 text-white w-full text-center">
                {monthTranslations?.name || monthTranslations?.title + " "}
                {" " + year}
              </strong>
              {sideMenu &&
                sideMenu &&
                sideMenu.list.map(
                  (
                    item: { id: string; name: string; order: any },
                    index: any
                  ) =>
                    item.name && (
                      <li
                        key={index + item.id}
                        className={`relative cursor-pointer  py-2   first:mt-0 flex items-center justify-center mx-auto text-center hover:font-semibold hover:bg-gray-700/30 w-full ${
                          item.id === tab && "font-semibold bg-gray-700/30  "
                        }}`}
                        style={{ order: item.order }}
                        onClick={(event: React.MouseEvent<HTMLLIElement>) => {
                          // Solo actualiza el estado si el id del item es diferente al tab actual
                          if (item.id !== tab) {
                            setTab(item.id);
                          }
                        }}
                      >
                        {item.name}
                      </li>
                    )
                )}
            </ul>
          </TailwindGrid>

          <TailwindGrid>
            <main className="self-center col-start-1 lg:col-start-3 col-end-5 md:col-end-9 lg:col-end-13 w-full flex flex-col bg-red-300/0 justify-center items-center">
              <div className="flex-col center gap-4 inline-flex lg:pt-[1.5vw] justify-start items-center min-h-screen w-full">
                <h3 className="text-center w-full font-bold text-4xl mt-10">
                  {sideMenu &&
                    sideMenu &&
                    (sideMenu as { list: any[] }).list.find(
                      (item: { id: string }) => item.id === tab
                    )?.name}
                </h3>
                {data.marketingPlan &&
                  sideMenu &&
                  (sideMenu as { list: any[] }).list.find(
                    (item) => item.id === tab
                  )?.id === data.marketingPlan.id && (
                    <MarketingPlanTabsMkt contentData={data.marketingPlan} />
                  )}
                {data.physicalContent &&
                  sideMenu &&
                  (sideMenu as { list: any[] }).list.find(
                    (item) => item.id === tab
                  )?.id === data.physicalContent.id && (
                    <PhysicalContentTabsMkt
                      marketingSalonContent={data.physicalContent}
                    />
                  )}
                {data.digitalContent &&
                  sideMenu &&
                  (sideMenu as { list: any[] }).list.find(
                    (item) => item.id === tab
                  )?.id === data.digitalContent.id && (
                    <DigitalcalContentTabsMkt
                      marketingSalonContent={data.digitalContent}
                    />
                  )}
                {data.repeats &&
                  sideMenu &&
                  (sideMenu as { list: any[] }).list.find(
                    (item) => item.id === tab
                  )?.id === data.repeats.id && (
                    <RepeatsTabsMkt marketingSalonContent={data.repeats} />
                  )}
              </div>
            </main>
          </TailwindGrid>
        </div>
      </TailwindGrid>
    </>
  ) : (
    <>
      {loading && (
        <div className="h-screen w-screen flex items-center justify-center"></div>
      )}
    </>
  );
}

export default Page;

function generateSideMenu(data: {
  [x: string]: {
    name: any;
    order: any;
  };
}) {
  let menuItems = [];

  for (const key in data) {
    if (data[key]) {
      const name = data[key].name;
      const order = data[key].order || 9999;
      menuItems.push({ name: name, id: key, order: order });
    } else {
      menuItems.push({ name: null, id: null, order: null });
    }
  }

  return menuItems;
}
