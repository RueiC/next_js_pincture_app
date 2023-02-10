import ClipLoader from 'react-spinners/ClipLoader';

const Spinner = () => {
  return (
    <div className='z-10 flex items-center justify-center w-screen h-screen'>
      <ClipLoader color='#ff5656' size={100} speedMultiplier={0.8} />
    </div>
  );
};

export default Spinner;
