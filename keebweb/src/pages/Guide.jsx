import { useEffect, useState, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners';
import { database } from '../firebase'; 
import { ref, get } from 'firebase/database';

export default function Guide() {
  const [mods, setMods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const hasNotified = useRef(false); // To prevent duplicate toasts

  useEffect(() => {
    let isMounted = true; // Track if the component is still mounted

    const fetchData = async () => {
      try {
        const dataRef = ref(database, 'guide'); // Reference to the 'guide' node in database
        const snapshot = await get(dataRef);

        if (isMounted) {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setMods(data.mods || []); // Ensure mods are fetched or default to an empty array
            if (!hasNotified.current) {
              toast.success('Keyboard modification guides have been loaded.');
              hasNotified.current = true;
            }
          } else {
            toast.warn('No data available in the database.');
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

    return () => {
      isMounted = false; // Cleanup to prevent state updates if unmounted
    };
  }, []);

  return (
    <main>
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
        <section className="mod-section" role="region" aria-live="polite">
          <h2 id="mod-keyboard-heading">How to Mod a Keyboard</h2>
          {mods.length > 0 ? (
            mods.map((mod) => <ModCard key={mod.heading} mod={mod} />)
          ) : (
            <p>No modification guides available.</p>
          )}
        </section>
      )}
    </main>
  );
}

function ModCard({ mod }) {
  let longClickTimeout;

  const handleLongClick = () => {
    toast.info(`Long-clicked on: ${mod.heading}`);
  };

  return (
    <div
      className="mod-card"
      role="article"
      aria-labelledby={`${mod.heading.toLowerCase().replace(/\s+/g, '-')}-heading`}
      onMouseDown={() => {
        longClickTimeout = setTimeout(handleLongClick, 500);
      }}
      onMouseUp={() => clearTimeout(longClickTimeout)}
      onMouseLeave={() => clearTimeout(longClickTimeout)}
    >
      <h3 id={`${mod.heading.toLowerCase().replace(/\s+/g, '-')}-heading`}>
        {mod.heading}
      </h3>
      <img src={mod.img} alt={mod.heading} />
      <p>{mod.description}</p>
      {mod.benefits && (
        <ol>
          {mod.benefits.map((benefit, index) => (
            <li key={index}>{benefit}</li>
          ))}
        </ol>
      )}
      <ol>
        {mod.steps.map((step, index) => (
          <li key={index}>
            <strong>{step.step}:</strong> {step.description}
          </li>
        ))}
      </ol>
    </div>
  );
}
