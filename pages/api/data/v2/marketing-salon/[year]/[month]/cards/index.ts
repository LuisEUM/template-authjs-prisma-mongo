import fs from "fs/promises";
import path from "path";

interface GoogleDriveLinks {
  preview: string;
  imgEmbed: string;
  download: string;
}

interface BaseObject {
  title: string;
  url: string; 
  copy?: string;
  groupTitle?: string;
  preview?: PreviewItem[]; 
}

interface PreviewItem {
  id: string;
  order: number;
  title: string;
  url: string; 
  transformedUrl: GoogleDriveLinks; 
}

interface TransformedObject extends BaseObject {
  id: string;
  order: number;
  transformedUrl: GoogleDriveLinks;
  category: string;
  lang: string;
  downloadName: string;
  business: string;
  campaign: string;
  year: number;
  month: number;
  groupOrder: number;
}

// Función para convertir enlaces de Google Drive
function convertGoogleDriveLink(link:string) {
  const fileIdMatch = link.match(/\/d\/(.+?)\//) || link.match(/uc\?id=(.+?)&export=download/);
  const fileId = fileIdMatch ? fileIdMatch[1] : null;
  
  return {
    preview: `https://drive.google.com/file/d/${fileId}/view?usp=drivesdk`,
    imgEmbed: `https://lh3.googleusercontent.com/d/${fileId}`,
    download: `https://drive.google.com/uc?id=${fileId}&export=download`,
  };
}

// Datos de ejemplo
const data = [
  {
    "title": "A-A-2403-0000-01-00-01.pdf",
    "url": "https://drive.google.com/uc?id=1ELt0zElaTASfm-664Pxc8M1Daplw0Sdq&export=download"
  },
  {
    "title": "A-A-2403-0000-01-00-01-P1.jpg",
    "url": "https://drive.google.com/uc?id=1LAJhep7yf-Fkre76s7Y5O7KTIkim9WQw&export=download"
  }
];

// Diccionarios para mapear códigos
const filesCodes = {
  "0000": "Stopper",
  "0080": "Alup80",
  "0050": "Alup50",
  "0004": "A4",
  "0005": "A5",
  "0085": "Tarjeta",
  "0048": "Díptico/Tríptico",
  "0010": "Test",
  "0100": "Revista",
  "0360": "Escaparatismo",
  "0090": "GMB",
  "0216": "Videos",
  "1080": "Post Acción",
  "0108": "Post Mensual",
  "1920": "Story Acción",
  "0192": "Story Mensuel",
  "0002": "Guía",
  "0500": "Filtro de Instagram",
  "6969": "SMS/WhatsApp"
};

// Estructura de configuración para los tipos de contenido
const contentTypes = {
  physicalContent: {
    posters: ["0080","0050","0004","0005",],
    stoppers: ["0000"],
    tests: ["0010"],
    cards: ["0085"],
    extras: ["0360","0100","0048"],
  },
  digitalContent: {
    actionPosts: ["1080"],
    actionStories: ["1920"],
    monthlyPost: ["1080"],
    monthlyStories: ["0192"],
    smsAndWhatsApp: ["6969"],
    videos: ["0216"],
    extras: ["0500"],
  },
};

const langCodes = {
  "01": "ES",
  "02": "CA"
};

const businessCodes = {
  "A": "INSIDE HAIR",
  "B": "SALÓN TORO",
  "C": "TONI&GUY",
  "D": "AH PELUQUEROS"
};


const campaignCodes = {
  "A": "Campaña Mensual",
  "B": "PrimeLady",
  "C": "Start Marketing"
};


// Función para crear una lista de tarjetas (objetos transformados) a partir de los datos originales.
function createMarketingCardsList(objects: BaseObject[]): TransformedObject[] {
  const grouped: { [key: string]: TransformedObject } = {};

  objects.forEach(obj => {
    const baseIdMatch = obj.title.match(/^(.+?)-P\d+/) || obj.title.match(/^(.+?)(\.\w+)$/);
    const baseId = baseIdMatch ? baseIdMatch[1] : obj.title;
    const transformedUrl = convertGoogleDriveLink(obj.url);

    // Extracción de componentes del título para asignación de valores.
    const [businessCode, campaignCode, yearAndMonth, fileCode, langCode, family, version] = obj.title.split(/[-_]/);
    const business = businessCodes[businessCode.substring(0, 4) as keyof typeof businessCodes] || "Desconocido";
    const campaign = campaignCodes[campaignCode as keyof typeof campaignCodes] || "Desconocido";
    const category = filesCodes[fileCode.substring(0, 4) as keyof typeof filesCodes] || "Desconocido";
    const lang = langCodes[langCode as keyof typeof langCodes] || "Desconocido";
    const downloadName = `${category}-${lang}-${version}`;

    if (!grouped[baseId]) {
      grouped[baseId] = {
        id: baseId,
        order: Number(version?.substring(0, 2)) || Number(version),
        title:  `${category}: ${lang}-${version?.substring(0, 2)}`,
        url: obj.url,
        copy: obj.copy || "",
        transformedUrl: transformedUrl,
        category: category,
        lang: lang,
        downloadName: downloadName,
        business: business,
        campaign: campaign,
        year: Number(yearAndMonth?.substring(0, 2)),
        month: Number(yearAndMonth?.substring(2, 4)),
        groupOrder: Number(family), 
        groupTitle: obj.groupTitle || "",
        preview: [],
      };
    }

    if (obj.title.includes("-P")) {
      const orderMatch = obj.title.split("-P")[1].match(/\d+/);
      const order = orderMatch ? Number(orderMatch[0]) : 0;
      const previewItem: PreviewItem = {
        id: obj.title.substring(0, 25),
        order: order,
        title: `${category}-${version?.substring(0, 2)}: P-${order}`,
        url: obj.url,
        transformedUrl: transformedUrl,
      };

      grouped[baseId]?.preview.push(previewItem);
    }
  });

  return Object.values(grouped);
}

// Función para crear una lista de agrupadas por categorias y lenguajes.
function filterAndGroupByCategoriesAndLanguages(items, filesCodes, langCodes) {
  // Convertir el objeto filesCodes a un array de códigos de categoría válidos
  const categoryCodes = Object.keys(filesCodes);

  // Filtrar items por el cuarto parámetro del ID que esté dentro de los categoryCodes
  const filteredItems = items.filter(item => {
    const parts = item.id.split('-');
    return categoryCodes.includes(parts[3]);
  });

  // Agrupar los items filtrados primero por código de categoría y luego por idioma
  const groupedByCategoryAndLanguage = filteredItems.reduce((acc, item) => {
    const parts = item.id.split('-');
    const categoryCode = parts[3];
    const languageCode = parts[4];
    const language = langCodes[languageCode] || "Desconocido"; // Traducir el código de idioma a su valor textual

    // Asegurarse de que exista la estructura de código de categoría -> idioma
    if (!acc[categoryCode]) {
      acc[categoryCode] = {};
    }
    if (!acc[categoryCode][language]) {
      acc[categoryCode][language] = [];
    }

    // Añadir el item al grupo correspondiente
    acc[categoryCode][language].push(item);
    return acc;
  }, {});

  return groupedByCategoryAndLanguage;
}

export default async function handler(req, res) {
  const { year, month } = req.query;

  try {
    const filePath = path.resolve(
      "./db/marketing-salon/v2/campaign/marketing-cards/",
      `${year}.json`
    );
    const data = await fs.readFile(filePath, "utf8");
    const jsonData = JSON.parse(data);

    const fullMonthMarketingCards = await createMarketingCardsList(
      jsonData[month]
    );
    const groupedItemsByCategory = filterAndGroupByCategoriesAndLanguages(fullMonthMarketingCards, filesCodes, langCodes);
    //console.log(groupedItemsByCategory);
    
    if (groupedItemsByCategory) {
      res.status(200).json(groupedItemsByCategory);
    } else {
      res.status(404).json({ message: "Something went wrong" });
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      res.status(404).json({ message: "Year data not found." });
    } else {
      res.status(500).json({ message: "Error reading file." });
    }
  }
}