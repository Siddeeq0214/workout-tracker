import {useState, useEffect, useCallback} from 'react';
import {StorageService} from '../services/storage';

export const useWorkouts = () => {
    const [workouts, setWorkouts] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [workoutData, sessionData] = await Promise.all([
                StorageService.getWorkouts(),
                StorageService.getSessions()
            ]);
            setWorkouts(workoutData);
            setSessions(sessionData);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const addWorkout = async (workout) => {
        try {
            await StorageService.saveWorkout(workout);
            await loadData();
        } catch (err) {
            setError(err.message);
        }
    };

    const addSession = async (session) => {
        try {
            await StorageService.saveSession(session);
            await loadData();
        } catch (err) {
            setError(err.message);
        }
    };

    const removeWorkout = async (id) => {
        try {
            await StorageService.deleteWorkout(id);
            await loadData();
        } catch (err) {
            setError(err.message);
        }
    };

    const getExerciseHistory = (exerciseName) => {
        return workouts
            .filter(w => w.exercise.toLowerCase() === exerciseName.toLowerCase())
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    return {
        workouts,
        sessions,
        loading,
        error,
        addWorkout,
        addSession,
        removeWorkout,
        getExerciseHistory,
        refreshData: loadData,
    };
};
