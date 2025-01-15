import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners';
import { database } from '../firebase'; 
import { ref, get } from 'firebase/database'; 

export default function ChoiceDetails() {
  const { choiceId, subChoiceId } = useParams();
  const [choice, setChoice] = useState(null);
  const [subChoice, setSubChoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasNotified = useRef(false); // To prevent duplicate toasts

  useEffect(() => {
    let isMounted = true; // Track if the component is still mounted

    const fetchData = async () => {
      try {
        const dataRef = ref(database, '2steps'); // Firebase node reference
        const snapshot = await get(dataRef);

        if (isMounted) {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const selectedChoice = data.choices.find(
              (c) => c.id === choiceId
            );
            setChoice(selectedChoice);

            if (subChoiceId) {
              const selectedSubChoice = selectedChoice?.subChoices.find(
                (s) => s.id === parseInt(subChoiceId)
              );
              setSubChoice(selectedSubChoice);
            }

            if (!hasNotified.current) {
              toast.success('Choice details loaded successfully!');
              hasNotified.current = true; // Avoid duplicate toasts
            }
          } else {
            toast.warn('No data available in the database.');
          }
        }
      } catch (error) {
        if (isMounted && !hasNotified.current) {
          toast.error(error.message || 'Failed to load choice details.');
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
  }, [choiceId, subChoiceId]);

  if (isLoading) {
    return (
      <div className="spinner-container">
        <ClipLoader size={50} color="#123abc" loading={isLoading} />
      </div>
    );
  }

  return (
    <main className="choice-details-container">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        closeOnClick={false}
        draggable
        closeButton={true}
      />
      <div className="back-button-container">
        <Link to="/explore" className="back-link">← Back to Explore</Link>
      </div>

      {subChoice ? (
        <DetailsSection subChoice={subChoice} />
      ) : choice ? (
        <>
          <h1>{choice.name}</h1>
          <section id="sub-choices">
            {choice.subChoices.map((sub) => (
              <div key={sub.id} className="sub-choice-item">
                <Link to={`/explore/${choice.id}/${sub.id}`}>{sub.name}</Link>
              </div>
            ))}
          </section>
        </>
      ) : (
        <p>Choice not found</p>
      )}
    </main>
  );
}

function DetailsSection({ subChoice }) {
  return (
    <section id="details-container" className="sub-choice" aria-live="polite">
      <h2>{subChoice.name}</h2>
      <img src={subChoice.img} alt={subChoice.alt} />
      {subChoice.details.map((detail, index) => (
        <div key={index}>
          <h3>{detail.type}</h3>
          <p>{detail.description}</p>
        </div>
      ))}
    </section>
  );
}
