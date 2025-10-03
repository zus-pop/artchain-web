// Temporary script to set mock auth data for testing
if (typeof window !== 'undefined') {
  // Mock token and user data
  const mockToken = "test-token-123";
  const mockUser = {
    id: "user-123",
    username: "testuser",
    fullName: "Test User",
    email: "test@example.com",
    role: "COMPETITOR"
  };
  
  localStorage.setItem('auth-token', mockToken);
  localStorage.setItem('auth-user', JSON.stringify(mockUser));
  
  console.log("Mock auth data set!");
  console.log("Token:", mockToken);
  console.log("User:", mockUser);
  
  // Reload to apply
  window.location.reload();
}