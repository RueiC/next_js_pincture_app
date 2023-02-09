import { SanityImageAssetDocument } from '@sanity/client';
import { useEffect, useState } from 'react';

interface Props {
  sanityImage: SanityImageAssetDocument | null;
  imageFile: File | null;
}

const useObjectURL = ({ sanityImage, imageFile }: Props) => {
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (!sanityImage || !imageFile) return;

    // create the preview
    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [sanityImage, imageFile]);

  return imagePreview;
};

export default useObjectURL;
