import api from "@/lib/apiService";

export const ratingAPI = {
  // Add a new rating
addRating: async (gameId: string, rating: number, name: string) => {
    try {
      const response = await api.post('/ratings/add', {
        gameId,
        rating,
        name 
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to add rating');
    }
  },

  // Get rating statistics for a game
  getRatingStats: async (gameId: string) => {
    try {
      const response = await api.get(`/ratings/stats/${gameId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch rating stats');
    }
  },

  // Check if user has rated
  checkUserRating: async (gameId: string) => {
    try {
      const response = await api.get(`/ratings/check/${gameId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to check user rating');
    }
  }
};