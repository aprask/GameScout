import { ImageTable } from "../data/models/models.js";
import * as imageRepo from "../repository/image.js";
import { throwErrorException } from "../util/error.js";
import { v4 as uuidv4, validate } from "uuid";

export function getAllImages(): Promise<ImageTable[]> {
    return imageRepo.getAllImages();
}

export async function getImageById(image_id: string): Promise<ImageTable> {
    if (!validate(image_id)) throwErrorException(`[service.image.getImageById] Invalid UUID: ${image_id}`, 'Invalid image ID', 400);
    return imageRepo.getImageById(image_id);
}

export async function createImage(image_text: string | null, image_data: Buffer | null): Promise<ImageTable> {
    const currentDate = new Date();
    const newImage: ImageTable = {
        image_id: uuidv4(),
        image_text,
        image_data,
        created_at: currentDate,
        updated_at: currentDate
    };

    return imageRepo.createImage(newImage);
}

export async function updateImage(image_id: string, image_text: string | null, image_data: Buffer | null): Promise<ImageTable> {
    let errorMessage = '';
    if (!image_id) errorMessage += "Image ID not given";
    if (!validate(image_id)) errorMessage += "Image ID is invalid";
    if (errorMessage) {
        errorMessage.trim();
        throwErrorException(`[service.image.updateImage] ${errorMessage}`, 'Cannot update image', 400);
    }

    const currentImage = await imageRepo.getImageById(image_id);
    const updatedImage: Omit<ImageTable, 'image_id' | 'created_at' | 'updated_at'> = {
        image_text: image_text ?? currentImage.image_text,
        image_data: image_data ?? currentImage.image_data
    };

    return imageRepo.updateImage(image_id, updatedImage);
}

export async function deleteImage(image_id: string): Promise<void> {
    if (!validate(image_id)) throwErrorException(`[service.image.deleteImage] Invalid UUID: ${image_id}`, 'Invalid image ID', 400);
    return imageRepo.deleteImage(image_id);
}
