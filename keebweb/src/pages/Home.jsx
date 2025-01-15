import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners';
import Carousel from '../components/Carousel';
import { database } from '../firebase'; // Import Firebase database instance
import { ref, get } from 'firebase/database'; // Import Firebase database functions

export default function Home() {
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    let isMounted = true; // Track if the component is still mounted

    const fetchData = async () => {
      try {
        const sectionsRef = ref(database, 'home'); // Reference to the 'home' node in the database
        const snapshot = await get(sectionsRef);

        if (isMounted) {
          if (snapshot.exists()) {
            const data = snapshot.val();
            if (!Array.isArray(data.sections)) {
              throw new Error('Invalid data structure: "sections" must be an array.');
            }
            setSections(data.sections);
            toast.success('Data loaded successfully!');
          } else {
            toast.warn('No data found in the database.');
          }
        }
      } catch (error) {
        if (isMounted) {
          toast.error(`Error fetching data: ${error.message}`);
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
    <main id="main-home" role="main">
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
        sections.map((section) => (
          <section
            key={section.id}
            className="scroll-section"
            id={section.id}
            aria-labelledby={`${section.id}-heading`}
            aria-live="polite"
          >
            <h2 id={`${section.id}-heading`}>{section.heading}</h2>
            <p id={`${section.id}-description`}>{section.description}</p>
            {section.images && <Carousel images={section.images} />}
          </section>
        ))
      )}
    </main>
  );
}
