import { useEffect, useState, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners';
import { database } from '../firebase'; 
import { ref, get } from 'firebase/database'; 

export default function More() {
  const [aspects, setAspects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const hasNotified = useRef(false); // Prevent duplicate notifications

  useEffect(() => {
    let isMounted = true; // To avoid updating state if the component is unmounted

    const fetchData = async () => {
      try {
        const dataRef = ref(database, 'more'); // Reference to the 'more' node in Firebase database
        const snapshot = await get(dataRef);

        if (isMounted) {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setAspects(data.aspects || []); // Set aspects or an empty array if not found
            if (!hasNotified.current) {
              toast.success('Data loaded successfully!');
              hasNotified.current = true;
            }
          } else {
            if (!hasNotified.current) {
              toast.warn('No data found in the database.');
              hasNotified.current = true;
            }
          }
        }
      } catch (error) {
        if (isMounted && !hasNotified.current) {
          toast.error(`Error fetching data: ${error.message}`);
          hasNotified.current = true;
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    // Cleanup function to avoid state updates after unmounting
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main role="main">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        closeOnClick={false}
        draggable
        closeButton={true}
      />
      {isLoading ? (
        <div className="spinner-container">
          <ClipLoader size={50} color="#123abc" loading={isLoading} />
        </div>
      ) : (
        <section aria-labelledby="aspects-heading">
          <h2 id="aspects-heading">Aspects To Consider:</h2>
          <div className="collage" aria-live="polite">
            {aspects.length > 0 ? (
              aspects.map((aspect) => (
                <CollageItem key={aspect.heading} aspect={aspect} />
              ))
            ) : (
              <p>No data available to display.</p>
            )}
          </div>
        </section>
      )}
    </main>
  );
}

function CollageItem({ aspect }) {
  let longClickTimeout;

  const handleLongClick = () => {
    toast.info(`Long-clicked on: ${aspect.heading}`);
  };

  return (
    <div
      className="collage-item"
      role="article"
      aria-labelledby={`${aspect.heading.toLowerCase().replace(/\s+/g, '-')}-heading`}
      onMouseDown={() => {
        longClickTimeout = setTimeout(handleLongClick, 500);
      }}
      onMouseUp={() => clearTimeout(longClickTimeout)}
      onMouseLeave={() => clearTimeout(longClickTimeout)}
    >
      <img src={aspect.img} alt={aspect.heading} />
      <h3 id={`${aspect.heading.toLowerCase().replace(/\s+/g, '-')}-heading`}>
        {aspect.heading}
      </h3>
      <p>{aspect.description || 'Description not available.'}</p>
    </div>
  );
}
