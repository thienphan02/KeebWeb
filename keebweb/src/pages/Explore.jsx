import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners';
import { database } from '../firebase'; 
import { ref, get } from 'firebase/database';

export default function Explore() {
  const [choices, setChoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const hasNotified = useRef(false); // Track if toast has been shown

  useEffect(() => {
    let isMounted = true; // Track if the component is still mounted

    const fetchData = async () => {
      try {
        const dataRef = ref(database, '2steps'); // fetch data from Firebase 
        const snapshot = await get(dataRef);

        if (isMounted) {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setChoices(data.choices || []); // Ensure choices are an array
            if (!hasNotified.current) {
              toast.success('Data loaded successfully!');
              hasNotified.current = true; // Avoid duplicate toasts
            }
          } else {
            toast.warn('No data available in the database.');
          }
        }
      } catch (error) {
        if (isMounted && !hasNotified.current) {
          toast.error(`Error fetching data: ${error.message}`);
          hasNotified.current = true; // Avoid duplicate error toasts
        }
      } finally {
        if (isMounted) setIsLoading(false); // Stop loading spinner
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
        <section id="main-choices">
          {choices.map((choice) => (
            <Link key={choice.id} to={`/explore/${choice.id}`} className="main-choice">
              {choice.name}
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
