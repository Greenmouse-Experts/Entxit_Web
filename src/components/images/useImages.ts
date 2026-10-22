import { useState } from "react";

export const useImages = (prevImages?: { url: string; path: string }[]) => {
	const [images, setPrev] = useState(prevImages);
	const [newImages, setNew] = useState<File[]>();
	return { images, setPrev, newImages, setNew };
};

export const useImage = (prevImage?: { url: string; path: string }) => {
	const [image, setPrev] = useState(prevImage);
	const [newImage, setNew] = useState<File>();
	return { image, setPrev, newImage, setNew };
};

export const useSelectImage = () => {
	const [image, setImage] = useState<File | null | undefined>(null);
	const image_link = image ? URL.createObjectURL(image) : undefined;
	return { image, setImage, image_link };
};
