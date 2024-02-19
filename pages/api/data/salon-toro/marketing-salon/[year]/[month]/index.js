import fs from "fs/promises";
import path from "path";

export default async function handler(req, res) {
  const { year, month } = req.query;

  try {
    const filePath = path.resolve(
      "./db/salon-toro/marketing-salon/campaign",
      `${year}.json`
    );
    const data = await fs.readFile(filePath, "utf8");
    const jsonData = JSON.parse(data);

    return res.status(200).json(jsonData[month]);
    const { digitalContent, physicalContent } = processDataForMonth(
      jsonData,
      month
    );

    try {
      digitalContent.id = jsonData[month].digitalContent.id;
      digitalContent.name = jsonData[month].digitalContent.name;
      digitalContent.order = jsonData[month].digitalContent.order;
      jsonData[month].digitalContent = digitalContent;
    } catch (error) {
      jsonData[month].digitalContent = digitalContent;
    }

    try {
      physicalContent.id = jsonData[month].physicalContent.id;
      physicalContent.name = jsonData[month].physicalContent.name;
      physicalContent.order = jsonData[month].physicalContent.order;
      jsonData[month].physicalContent = physicalContent;
    } catch (error) {
      jsonData[month].physicalContent = physicalContent;
    }

    if (jsonData) {
      res.status(200).json(jsonData[month]);
    } else {
      res.status(404).json({ message: "Month data not found." });
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      res.status(404).json({ message: "Year or month data not found." });
    } else {
      res.status(500).json({ message: "Error reading file." });
    }
  }
}

// Función para mapear datos de un mes específico
function mapDataForMonth(data, month, contentType, content, prefix) {
  if (
    data &&
    data[month] &&
    data[month][contentType] &&
    data[month][contentType][content]
  ) {
    return Object.keys(data[month][contentType][content]).reduce(
      (result, lang) => {
        // Check if the data for the specific language is an array
        if (Array.isArray(data[month][contentType][content][lang])) {
          const items = data[month][contentType][content][lang].reduce(
            (acc, item) => {
              // Extracting relevant information from the item
              const id = item.name
                .split("/")[1]
                .split("_")[1]
                .replace(".pdf", "")
                .replace(".jpg", "")
                .replace(".mp4", "")
                .replace(".png", "");

              const name = `${prefix} ${id}`;
              const category = item.name.split("/")[0];
              const groupName = item.groupName;
              const order = item.order;
              const copy = item.copy;

              // If the object with the name already exists, simply add the new category
              const existingItem = acc.find((item) => item.name === name);
              if (existingItem) {
                // Ensure files property exists
                existingItem.files = existingItem.files || {};
                existingItem.files[category] = item.url;
              } else {
                // If it doesn't exist, create a new item object

                const newItem = {
                  id,
                  name,
                  groupName,
                  order,
                  copy,
                  files: { [category]: item.url },
                };
                acc.push(newItem);
              }

              return acc;
            },
            []
          );
          result[`${lang}`] = items;
        } else {
          // Handle the case where the data is not an array
          console.info(
            `Data for ${month}, ${contentType}, ${content}, ${lang} is not an array`
          );
        }

        return result;
      },
      {}
    );
  } else {
    // Handle the case where the necessary data does not exist
    console.info(
      `Data for ${month}, ${contentType}, ${content} does not exist`
    );
    return {};
  }
}

function convertGoogleDriveLink(link) {
  // Ensure that link is defined before trying to match
  if (!link) {
    console.error("Link is undefined or null");
    return null;
  }

  // Try to extract the file ID from the regular link
  const fileIdFromLinkMatch = link.match(/\/d\/(.+?)\//);

  // Try to extract the file ID from the download link
  const fileIdFromDownloadMatch = link.match(/\/uc\?id=(.+?)&export=download/);

  // Try to extract the file ID from the image link
  const fileIdFromImageMatch = link.match(/\/d\/(.+)$/);

  // Get the file ID, prioritizing regular link over download link and image link
  const fileId = fileIdFromLinkMatch
    ? fileIdFromLinkMatch[1]
    : fileIdFromDownloadMatch
    ? fileIdFromDownloadMatch[1]
    : fileIdFromImageMatch
    ? fileIdFromImageMatch[1]
    : null;

  // Construct different types of links
  const previewLink = `https://drive.google.com/file/d/${fileId}/view?usp=drivesdk`;
  const imgEmbedLink = `https://lh3.googleusercontent.com/d/${fileId}`;
  const downloadLink = `https://drive.google.com/uc?id=${fileId}&export=download`;

  return {
    preview: previewLink,
    imgEmbed: imgEmbedLink,
    download: downloadLink,
  };
}

// Function to convert links for all cards
function convertLinks(cards) {
  if (!Array.isArray(cards)) {
    console.error("cards is not an array");
    return /* Algún valor predeterminado o manejo de error */;
  }

  return cards.map((card) => {
    const { id, name, files, groupName, order, copy } = card;
    const convertedFiles = {};
    const categoryList = [];
    // Iterate over the card's file categories
    for (const category in files) {
      const link = files[category];
      // Convert each link using the Google Drive function
      const { preview, imgEmbed, download } = convertGoogleDriveLink(link);
      convertedFiles[category] = { preview, imgEmbed, download };
      categoryList.push(category);
    }

    return {
      id,
      name,
      groupName,
      order,
      copy,
      imgEmbed: convertedFiles[categoryList[0]].imgEmbed,
      files: convertedFiles,
    };
  });
}

// Función principal para obtener datos mapeados y convertir enlaces
function processMonthData(data, month, contentType, content, prefix) {
  const mappedData = mapDataForMonth(data, month, contentType, content, prefix);
  const langCodes = Object.keys(mappedData);

  const convertedData = {};
  for (const langCode of langCodes) {
    convertedData[langCode] = convertLinks(mappedData[langCode]);
  }

  return convertedData;
}

// Estructura de configuración para los tipos de contenido
const contentTypes = {
  physicalContent: {
    posters: "Cartelería:",
    stoppers: "Stopper:",
    tests: "Test:",
    cards: "Tarjeta:",
  },
  digitalContent: {
    actionPosts: "Post A:",
    actionStories: "Story A:",
    monthlyContentPlan: "Post M:",
    smsAndWhatsApp: "SMS & WApp:",
    valueStories: "Story V:",
    videos: "Video:",
  },
};

// Función para procesar todos los contenidos de un mes
function processDataForMonth(data, month) {
  let digitalContent = {};
  let physicalContent = {};

  for (let contentType in contentTypes) {
    for (let content in contentTypes[contentType]) {
      const prefix = contentTypes[contentType][content];
      const processedData = processMonthData(
        data,
        month,
        contentType,
        content,
        prefix
      );

      // Dividir entre contenido digital y físico
      if (contentType === "digitalContent") {
        digitalContent[content] = {};
        for (let langCode in processedData) {
          digitalContent[content][langCode] = processedData[langCode];
        }
      } else if (contentType === "physicalContent") {
        physicalContent[content] = {};
        for (let langCode in processedData) {
          physicalContent[content][langCode] = processedData[langCode];
        }
      }
    }
  }

  return { digitalContent, physicalContent };
}
