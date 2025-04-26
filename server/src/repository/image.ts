import { db } from "../data/db.js";
import { ImageTable } from "../data/models/models.js";
import { throwErrorException } from "../util/error.js";

export async function getAllImages(): Promise<ImageTable[]> {
    const images = await db
        .selectFrom("images")
        .selectAll()
        .execute();
    if (images === undefined) throwErrorException(`[repository.image.getAllImages] cannot get images`, 'Images is undefined', 404);
    return images;
}

export async function uploadImage(imgBuffer: Buffer, imageId: string): Promise<void> {
    await db
        .updateTable('images')
        .set({
            image_data: imgBuffer
        })
        .where('image_id', '=', imageId)
        .executeTakeFirstOrThrow();
}

export async function getImageById(image_id: string): Promise<ImageTable> {
    const image = await db
        .selectFrom("images")
        .selectAll()
        .where("image_id", "=", image_id)
        .executeTakeFirst();
    if (!image || image === undefined) throwErrorException(`[repository.image.getImageById] cannot find image with ID ${image_id}`, 'Image not found', 404);
    return image!;
}

export async function createImage(image: ImageTable): Promise<ImageTable> {
    const newImage = await db
        .insertInto("images")
        .values({
            image_id: image.image_id,
            image_text: image.image_text,
            image_data: image.image_data,
            created_at: image.created_at,
            updated_at: image.updated_at,
        })
        .returningAll()
        .executeTakeFirst();
    if (!newImage || newImage === undefined) throwErrorException(`[repository.image.createImage] cannot create image`, 'Cannot create image', 500);
    return newImage!;
}

export async function updateImage(image_id: string, image: Omit<ImageTable, 'image_id' | 'created_at' | 'updated_at'>): Promise<ImageTable> {
    const updatedImage = await db
        .updateTable("images")
        .set({
            image_text: image.image_text,
            image_data: image.image_data,
            updated_at: new Date()
        })
        .where("image_id", "=", image_id)
        .returningAll()
        .executeTakeFirst();
    if (!updatedImage || updatedImage === undefined) throwErrorException(`[repository.image.updateImage] cannot update image`, 'Cannot update image', 500);
    return updatedImage!;
}

export async function deleteImage(image_id: string): Promise<void> {
    await db
        .deleteFrom("images")
        .where("image_id", "=", image_id)
        .executeTakeFirstOrThrow();
}
