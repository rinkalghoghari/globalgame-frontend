import api from "@/lib/apiService";

export const commentAPI = {
  // Add a new comment
  addComment: async (gameId: string, name: string, comment: string) => {
    try {
      const response = await api.post('/comments/add', {
        gameId,
        name,
        comment,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to add comment');
    }
  },

  // Get all comments for a game
  getComments: async (gameId: string) => {
    try {
      const response = await api.get(`/comments/${gameId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch comments');
    }
  },

  // Delete a comment
  deleteComment: async (commentId: string) => {
    try {
      const response = await api.delete(`/comments/${commentId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete comment');
    }
  }
};