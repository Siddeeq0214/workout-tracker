import AsyncStorage from '@react-native-async-storage/async-storage'; //temp storage solution 

const STORAGE_KEY = '@workout_tracker';

export const StorageService = {
    async saveWorkout(workout) {
        try {
            const workouts = await this.getWorkouts();
            const updatedWorkouts = [workout, ...workouts];
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWorkouts));
            return workout;
        } catch (error) {
            console.error('Error saving workout: ', error);
            throw error;
        }
    },

    async getWorkouts() {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error getting workouts: ', error);
            throw error;
        }
    },

    async deleteWorkout(id) {
        try {
            const workouts = await this.getWorkouts();
            const updatedWorkouts = workouts.filter(w => w.id !== id);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWorkouts));
            return true;
        } catch (error) {
            console.error('Error deleting workout: ', error);
            throw error;
        }
    },

    async clearAll() {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
            return true;
        } catch (error) {
            console.error('Error clearing workouts: ', error);
            throw error;
        }
    }
};
