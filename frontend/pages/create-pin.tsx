import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth/core/types';
import { SanityImageAssetDocument } from '@sanity/client';
import { SessionUser, FileUploadMessage, SubmitState } from '../types';
import { schema } from '../utils/schema';
import { categories } from '../utils/data';
import { client } from '../utils/client';
import { Redirect } from '../types';
import Images from '../assets/index';
import useObjectURL from '../hooks/useObjectURL';

interface ServerSideProps {
  props: { session: Session };
}

interface Props {
  session: SessionUser;
}

type FormValues = {
  title: string;
  about: string;
  destination: string;
  category: string;
};

export const getServerSideProps: GetServerSideProps = async (
  context,
): Promise<Redirect | ServerSideProps> => {
  const session: Session | null = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
      },
      props: {},
    };
  } else {
    return {
      props: { session },
    };
  }
};

const CreatePin: NextPage<Props> = ({ session }) => {
  const router = useRouter();
  const [sanityImage, setSanityImage] =
    useState<SanityImageAssetDocument | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileUploadMessage, setFileUploadMessage] = useState<FileUploadMessage>(
    { style: 'text-black', message: '點擊上傳' },
  );
  const [submitState, setSubmitState] = useState<SubmitState>({
    style: 'bg-red-500',
    text: '儲存',
    state: 'none',
  });
  const imagePreview = useObjectURL({ sanityImage, imageFile });

  const handleUploadingMsg = (state: string, payload: string): void => {
    if (state === 'uploading') {
      setFileUploadMessage((prevVal) => {
        return {
          style: prevVal.style,
          message: payload,
        };
      });
    }

    if (state === 'success') {
      setFileUploadMessage({
        style: 'text-green-500 text-medium',
        message: payload,
      });
    }
  };

  const handleImageUploaded = async (file: File): Promise<void> => {
    const uploadedFile = file;

    setImageFile(uploadedFile);
    // uploading asset to sanity
    if (
      file.type === 'image/png' ||
      file.type === 'image/svg' ||
      file.type === 'image/jpeg' ||
      file.type === 'image/gif' ||
      file.type === 'image/tiff'
    ) {
      const document = await client.assets.upload('image', uploadedFile, {
        contentType: uploadedFile.type,
        filename: uploadedFile.name,
      });

      handleUploadingMsg('success', document.originalFilename as string);
      setSanityImage(document);
    } else {
      toast('圖片格式錯誤', { type: 'error' });
    }
  };

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files) return;
    handleUploadingMsg('uploading', '上傳中...');
    const selectedFile: File = e.target.files[0];
    handleImageUploaded(selectedFile);
  };

  const checkSubmit = (values: FormValues): boolean => {
    if (!sanityImage) {
      toast('未上傳圖片', { type: 'error' });
      setFileUploadMessage({
        style: 'text-red-400 text-medium',
        message: '未上傳圖片',
      });
      return false;
    }

    if (
      !values.title ||
      !values.about ||
      !values.destination ||
      !values.category
    ) {
      return false;
    } else {
      return true;
    }
  };

  const onSubmit = async (
    values: FormValues,
    actions: { resetForm: () => void },
  ): Promise<void> => {
    const isSuccess = checkSubmit(values);

    if (!isSuccess) return;

    setSubmitState({
      style: 'bg-gray-300',
      text: '上傳中',
      state: 'uploading',
    });

    const doc = {
      _type: 'pin',
      title: values.title,
      about: values.about,
      destination: values.destination,
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: sanityImage?._id,
        },
      },
      userId: session.id,
      postedBy: {
        _type: 'postedBy',
        _ref: session.id,
      },
      category: values.category,
    };

    try {
      await client.create(doc);

      toast('上傳成功!', { type: 'success' });

      setImageFile(null);
      actions.resetForm();

      window.setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      console.log(err);
      toast('上傳失敗', { type: 'error' });
    }

    setSubmitState({
      style: 'bg-red-500',
      text: '儲存',
      state: 'success',
    });
  };

  const formikConfig = {
    initialValues: {
      title: '',
      about: '',
      destination: '',
      category: '',
    },
    validationSchema: schema,
    onSubmit,
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik(formikConfig);

  return (
    <main className='flex items-start justify-center w-full h-full sm:px-[6rem] sm:py-[3rem]'>
      <div className='bg-white sm:rounded-[1rem] w-full h-full sm:shadow-xl'>
        <form
          className='flex flex-col sm:flex-row items-center justify-center gap-[2.5rem] px-[2.5rem] py-[2.5rem] w-full h-full'
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div
            className={`relative bg-gray-100 flex flex-col items-center justify-center ${
              !sanityImage && 'w-full sm:w-[70%] h-[10rem] sm:h-[55vh]'
            } rounded-[1rem]`}
          >
            {sanityImage ? (
              <img
                className='rounded-[1rem] shadow-md'
                src={imagePreview}
                alt='uploaded image'
              />
            ) : (
              <div className='flex flex-col items-center justify-center'>
                <div className='flex flex-col items-center justify-center'>
                  <p className='font-bold text-[1.5rem]'>
                    <FaCloudUploadAlt />
                  </p>
                  <p className={`text-[1rem] ${fileUploadMessage.style}`}>
                    {fileUploadMessage.message}
                  </p>
                </div>
              </div>
            )}

            <input
              className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
              type='file'
              name='upload-image'
              autoComplete='off'
              onChange={uploadImage}
            />
          </div>

          <div className='flex flex-col justify-between w-full h-full gap-[2.5rem]'>
            <div>
              <input
                className='outline-none text-[1.2rem] font-bold border-gray-200 py-[0.5rem] sm:py-0 border-b-2 sm:border-none'
                id='title'
                type='text'
                placeholder='新增標題'
                autoComplete='off'
                value={values.title}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <p className='text-red-400 text-[0.5rem] font-medium'>
                {errors.title && touched?.title ? errors.title : ''}
              </p>
            </div>
            <div>
              <div className='flex items-center gap-[1rem] mb-[1.5rem]'>
                <Image
                  className='rounded-full'
                  src={!session ? Images.userImage : session!.user!.image!}
                  alt='user image'
                  width={35}
                  height={35}
                />
                <p className='font-medium text-text-1'>{session!.user!.name}</p>
              </div>

              <div className='flex flex-col gap-[1.5rem]'>
                <div>
                  <input
                    className='outline-none text-base border-gray-200 py-[0.5rem] sm:py-0 border-b-2 sm:border-none'
                    id='about'
                    type='text'
                    placeholder='關於你的Pin'
                    autoComplete='off'
                    value={values.about}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  <p className='text-red-400 text-[0.5rem] font-medium'>
                    {errors.about && touched?.about ? errors.about : ''}
                  </p>
                </div>
                <div>
                  <input
                    className='outline-none text-base border-gray-200 py-[0.5rem] sm:py-0 border-b-2 sm:border-none'
                    id='destination'
                    type='text'
                    placeholder='新增連結'
                    autoComplete='off'
                    value={values.destination}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  <p className='text-red-400 text-[0.5rem] font-medium'>
                    {errors.destination && touched?.destination
                      ? errors.destination
                      : ''}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className='mb-[1.2rem] text-text-1 font-medium'>選擇Pin類型</p>

              <div>
                <select
                  className='outline-none w-[10rem] text-base border-gray-200 px-[1rem] py-[0.5rem] rounded-[0.5rem] cursor-pointer shadow-md text-text-1'
                  id='category'
                  value={values.category}
                  onBlur={handleBlur}
                  onChange={handleChange}
                >
                  <option className='bg-white' value=''>
                    選擇類型
                  </option>
                  {categories.map((item) => (
                    <option
                      className='text-base text-black capitalize bg-white border-0 outline-none'
                      value={item.name}
                      key={item.name}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
                <p className='text-red-400 text-[0.5rem] font-medium mt-[1rem]'>
                  {errors.category && touched?.category ? errors.category : ''}
                </p>
              </div>
            </div>
            <div className='flex items-center justify-start transition-all duration-300 ease-in-out hover:-translate-y-1'>
              <button
                className={`${submitState.style} px-[1.2rem] py-[0.5rem] rounded-[0.5rem] text-white`}
                type='submit'
                disabled={submitState.state === 'uploading' ? true : false}
              >
                {submitState.text}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreatePin;
