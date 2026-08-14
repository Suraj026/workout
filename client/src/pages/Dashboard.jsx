import { useState, useEffect } from "react";
import api from "../api/axios";

const Dashboard = () => {
  // workout list state
  const [workout, setWorkout] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //form state
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState("");
  const [completed, setCompleted] = useState(false);

  // fetch workout on load
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await api.get("/auth/workout");
        setWorkout(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response.data.message);
        setLoading(false);
      }
    };
    fetchWorkouts();
  }, []);

  const handleCreateWorkout = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const workoutData = {
        exerciseName,
        sets: Number(sets),
        reps: Number(reps),
        completed,
      };

      if (weight !== "") {
        workoutData.weight = Number(weight);
      }
      if (date !== "") {
        workoutData.date = date;
      }

      const response = await api.post("/auth/create", workoutData);

      // add workouts to UI
      setWorkout((prevWorkout) => [...prevWorkout, response.data]);

      // reset form
      setExerciseName("");
      setSets("");
      setReps("");
      setWeight("");
      setDate("");
      setCompleted(false);
    } catch (err) {
      setError(err.response.data.message || "Failed to create workout");
    }
  };

  return (
    <>
      <h1>Dashboard</h1>
      {error && <p>{error}</p>}
      <h2>Create Workout</h2>
      <form onSubmit={handleCreateWorkout}>
        <input
          type="text"
          placeholder="Exercise Name"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Sets"
          value={sets}
          onChange={(e) => setSets(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Reps"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
          />
          Completed
        </label>
        <button type="submit">Add Submit</button>
      </form>
      <h2>My Workouts</h2>

      {loading && <p>Loading ...</p>}

      {/* No workouts */}
      {!loading && workout.length == 0 && <p>No workouts yet</p>}

      {/* Workout list */}
      {!loading && workout.length > 0 && (
        <div>
          {workout.map((item) => (
            <div key={item._id}>
              <h3>{item.exerciseName}</h3>
              <p>Sets: {item.sets}</p>
              <p>Reps: {item.reps}</p>

              {item.weight !== undefined && <p>Weight: {item.weight}</p>}
              {item.date && (
                <p>Date: {new Date(item.date).toLocaleDateString()}</p>
              )}
              <p>Status: {item.completed ? "Done" : "Not Done"}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Dashboard;
