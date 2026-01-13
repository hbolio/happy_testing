export const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export const TEST_USER = {
  email: 'test@nutriapp.com',
  password: 'nutriapp123',
};

export const TEST_DATA = {
  // Dish creation test data
  newDish: {
    name: 'Test Pasta Carbonara',
    description: 'Authentic Italian pasta with eggs, guanciale, and pecorino cheese',
    prepTime: '5',
    cookTime: '15',
    calories: '450',
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=400&q=80',
    steps: [
      'Cook pasta in boiling salted water',
      'Fry guanciale or bacon until crispy',
      'Mix eggs with pecorino cheese',
      'Combine pasta with meat and egg mixture',
      'Season with black pepper and serve'
    ]
  },
  // Updated dish data
  updatedDish: {
    name: 'Updated Pasta Carbonara',
    description: 'Updated description for testing edit functionality',
    calories: '500',
  },
  // Test dish for validation
  minimalDish: {
    name: 'Minimal Test Dish',
    description: 'A minimal test',
    prepTime: '1',
    cookTime: '1',
    calories: '100',
  },
  // Quick prep dish
  quickPrepDish: {
    name: 'Quick Test Salad',
    description: 'A quick preparation salad',
    prepTime: '0',
    cookTime: '0',
    calories: '200',
  },
  // Registration test data
  newUser: {
    firstName: 'Test',
    lastName: 'User',
    email: `testuser${Date.now()}@nutriapp.com`,
    nationality: 'Test Country',
    phone: '+1234567890',
    password: 'TestPassword123!',
  },
  // Invalid registration data
  invalidEmail: 'invalid-email',
  invalidPassword: 'weak',
};
