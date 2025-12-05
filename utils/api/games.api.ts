import api from "@/lib/apiService";

export const gamesAPI = {
    getGames: async () => {
        try {
            const response = await api.get(`/games/`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch games');
        }
    },
}


