export const calculateStats = (workouts, exerciseName) => {
    const filtered = workouts.filter(
        w => w.exercise.toLowerCase() === exerciseName.toLowerCase()
    );

    if (filtered.length === 0) return null;

    const maxWeight = Math.max(...filtered.map(w => {
        if (Array.isArray(w.sets)) {
            return Math.max(...w.sets.map(s => s.weight));
        }
        return w.weight;
    }));

    const totalVolume = filtered.reduce((sum, w) => {
        if (Array.isArray(w.sets)) {
            return sum + w.sets.reduce((setSum, s) => setSum + (s.reps * s.weight), 0);
        }
        return sum + (w.sets * w.reps * w.weight);
    }, 0);

    const avgWeight = totalVolume / filtered.reduce((sum, w) => {
        if (Array.isArray(w.sets)) {
            return sum + w.sets.reduce((setSum, s) => setSum + s.reps, 0);
        }
        return sum + (w.sets * w.reps);
    }, 0);

    return {
        maxWeight,
        totalVolume,
        avgWeight: Math.round(avgWeight * 10) / 10,
        count: filtered.length
    };
};

export const getUniqueExercises = (workouts) => {
    return [...new Set(workouts.map(w => w.exercise))];
};

export const getWorkoutsByDateRange = (workouts, startDate, endDate) => {
    return workouts.filter(w => {
        const workoutDate = new Date(w.date);
        return workoutDate >= startDate && workoutDate <= endDate;
    });
};

export const getTotalVolume = (workouts) => {
    return workouts.reduce((sum, w) => {
        if (Array.isArray(w.sets)) {
            return sum + w.sets.reduce((setSum, s) => setSum + (s.reps * s.weight), 0);
        }
        return sum + (w.sets * (w.reps || 0) * (w.weight || 0));
    }, 0);
};

export const getChartData = (workouts, exerciseName) => {
    const filtered = workouts
        .filter(w => w.exercise.toLowerCase() === exerciseName.toLowerCase())
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (filtered.length === 0) return null;

    return {
        labels: filtered.map(w => {
            const date = new Date(w.date);
            return `${date.getMonth() + 1}/${date.getDate()}`;
        }),
        datasets: [
            {
                data: filtered.map(w => {
                    if (Array.isArray(w.sets)) {
                        return Math.max(...w.sets.map(s => s.weight));
                    }
                    return w.weight;
                })
            }
        ]
    };
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export const formatNumber = (number) => {
    if (number === undefined || number === null) {
        return '0';
    }
    if (number >= 1000) {
        return `${(number / 1000).toFixed(1)}k`;
    }
    return number.toString();
};