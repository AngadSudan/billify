import ImageKit from "imagekit";
import fs from "fs";
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC!,
  privateKey: process.env.IMAGEKIT_PRIVATE!,
  urlEndpoint: process.env.IMAGEKIT_URL!,
});

export const uploadFile = async (file: any, fileName: string) => {
  if (!file) {
    return null;
  }

  let response;
  try {
    response = await imagekit.upload({
      file: fs.readFileSync(file.path!), // actual file
      fileName: file.originalname!, // desired file name,
      folder: "/uploads", // optional folder path
    });
    console.log("Upload successful:", response);
    fs.unlinkSync(file.path);
    return {
      url: response.url,
      fileId: response.fileId,
      name: response.name,
      size: response.size,
      type: response?.type || "image/jpeg",
    };
  } catch (error) {
    console.error("Upload failed:", error);
    fs.unlinkSync(file.path!);
    return null;
  }
};

export const getFileById = async (fileID: string) => {
  try {
    const response = await imagekit.getFileDetails(fileID);
    return {
      url: response.url,
      fileId: response.fileId,
      name: response.name,
      size: response.size,
      type: response?.type || "image/jpeg",
    };
  } catch (error) {
    console.error("Error fetching file by ID:", error);
    return null;
  }
};

export const deleteFile = async (fileID: string) => {
  try {
    const response = await imagekit.deleteFile(fileID);
    console.log("File deleted successfully:", response);
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
};
