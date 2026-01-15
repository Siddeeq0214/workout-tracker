import {useState, useEffect, useCallback} from 'react';
import {StorageService} from '../services/storage';

export const useWorkouts = () => {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadWorkouts = useCallback(async () => {
        try {
            setLoading(true);
            const data = await StorageService.getWorkouts();
            setWorkouts(data);
            setError(null);
        }catch (err){
            setError(err.message);

        }finally {
            setLoading(false);
        }
    },[]);

    useEffect(() => {
        loadWorkouts();
    }, [loadWorkouts]);

    const addWorkout = async (workout) => {
        try {
            await StorageService.saveWorkout(workout);
            await loadWorkouts();
        } catch (err){
            setError(err.message);
        }
    };

    const removeWorkout = async (id) => {
        try {
            await StorageService.deleteWorkout(id);
            await loadWorkouts();
        } catch (err){
            setError(err.message);
        }
    };

    const clearAllWorkout = async () => {
        try {
            await StorageService.clearAll();
            await loadWorkouts();
        } catch (err){
            setError(err.message);
        }
    };

    return {
        workouts,
        loading,
        error,
        addWorkout,
        removeWorkout,
        clearAllWorkout,
        refreshWorkouts: loadWorkouts,
    };
};