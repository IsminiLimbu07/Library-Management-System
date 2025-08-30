import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const homePage = () => {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [books] = useState([
    {
      _id: '1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '978-0-7432-7356-5',
      category: 'Fiction',
      available: 3,
      quantity: 5,
      image: null
    },
    {
      _id: '2',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      isbn: '978-0-06-112008-4',
      category: 'Fiction',
      available: 2,
      quantity: 4,
      image: null
    },
    {
      _id: '3',
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      isbn: '978-0-262-03384-8',
      category: 'Computer Science',
      available: 1,
      quantity: 3,
      image: null
    }
  ]);
  const [myBorrows] = useState([
    {
      _id: 'b1',
      bookId: {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        isbn: '978-0-13-235088-4',
        category: 'Programming'
      },
      dueDate: '2025-09-15T00:00:00.000Z'
    }
  ]);

  const router = useRouter();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      router.replace("/auth/login");
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleBorrowBook = (bookId) => {
    Alert.alert('Demo', 'Book borrowing functionality coming soon!');
  };

  const handleReturnBook = (borrowId) => {
    Alert.alert('Demo', 'Book return functionality coming soon!');
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isLibrarian = user?.role === 'librarian';

  return (
    <View className="flex-1" style={{ backgroundColor: '#F5F6F5' }}>
      {/* Header */}
      <View className="w-full h-[100px] flex flex-row p-5" style={{ backgroundColor: '#2C4A7E' }}>
        <View className="flex-1 items-center justify-center">
          <Text className='text-white font-bold text-2xl'>📚 BookSphere</Text>
        </View>
        <TouchableOpacity
          onPress={handleLogout}
          className="px-3 py-1 rounded"
          style={{ backgroundColor: '#D4A017' }}
        >
          <Text className="text-white text-sm font-medium">Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Welcome Message */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-center" style={{ color: '#2C4A7E' }}>
            Welcome, {user?.name}
          </Text>
          <Text className="text-base text-center mt-2" style={{ color: '#6B7280' }}>
            {isLibrarian ? 'Librarian Dashboard' : 'Borrower Dashboard'}
          </Text>
        </View>

        {/* Search Section */}
        <View className="bg-white rounded-lg p-5 mb-6 shadow-sm">
          <Text className="text-lg font-semibold mb-3" style={{ color: '#2C4A7E' }}>
            Search Books
          </Text>
          <View className="flex-row">
            <TextInput
              className="flex-1 border rounded-l-md px-3 py-3"
              placeholder="Search books..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              style={{
                fontSize: 16,
                borderColor: '#D8DBD8',
                backgroundColor: '#FFFFFF',
                color: '#2C4A7E',
              }}
            />
            <TouchableOpacity
              className="px-6 py-3 rounded-r-md items-center justify-center"
              style={{ backgroundColor: '#D4A017' }}
            >
              <Text className="text-white font-medium">Search</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* My Borrowed Books Section (for borrowers) */}
        {!isLibrarian && myBorrows.length > 0 && (
          <View className="bg-white rounded-lg p-5 mb-6 shadow-sm">
            <Text className="text-lg font-semibold mb-4" style={{ color: '#2C4A7E' }}>
              My Borrowed Books
            </Text>
            {myBorrows.map((borrow) => (
              <View key={borrow._id} className="border rounded-lg p-4 mb-3" style={{ borderColor: '#D8DBD8' }}>
                <Text className="text-lg font-semibold" style={{ color: '#2C4A7E' }}>
                  {borrow.bookId?.title}
                </Text>
                <Text className="text-base mb-2" style={{ color: '#6B7280' }}>
                  by {borrow.bookId?.author}
                </Text>
                <Text className="text-sm mb-2" style={{ color: '#8A94A6' }}>
                  ISBN: {borrow.bookId?.isbn}
                </Text>
                <View className="flex-row items-center justify-between mb-3">
                  <View className="bg-library-primary px-3 py-1 rounded-full">
                    <Text className="text-white text-xs font-medium uppercase">
                      {borrow.bookId?.category}
                    </Text>
                  </View>
                </View>
                <Text className="text-sm mb-3" style={{ color: '#6B7280' }}>
                  Due: {new Date(borrow.dueDate).toLocaleDateString()}
                </Text>
                <TouchableOpacity
                  onPress={() => handleReturnBook(borrow._id)}
                  className="w-full py-2 rounded items-center"
                  style={{ backgroundColor: '#8A94A6' }}
                >
                  <Text className="text-white font-medium">Return Book</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Available Books Section */}
        <View className="bg-white rounded-lg p-5 shadow-sm">
          <Text className="text-lg font-semibold mb-4" style={{ color: '#2C4A7E' }}>
            Available Books
          </Text>
          
          {filteredBooks.length === 0 ? (
            <View className="py-12 items-center">
              <Text className="text-base" style={{ color: '#8A94A6' }}>
                {searchTerm ? 'No books found matching your search.' : 'No books available.'}
              </Text>
            </View>
          ) : (
            <View>
              {filteredBooks.map((book) => (
                <View key={book._id} className="border rounded-lg p-4 mb-4" style={{ borderColor: '#D8DBD8' }}>
                  {/* Book Cover Placeholder */}
                  <View className="w-full h-32 bg-gray-100 rounded mb-3 items-center justify-center">
                    <Text className="text-gray-400">No Image</Text>
                  </View>
                  
                  <Text className="text-lg font-semibold" style={{ color: '#2C4A7E' }}>
                    {book.title}
                  </Text>
                  <Text className="text-base mb-2" style={{ color: '#6B7280' }}>
                    by {book.author}
                  </Text>
                  <Text className="text-sm mb-2" style={{ color: '#8A94A6' }}>
                    ISBN: {book.isbn}
                  </Text>
                  
                  {/* Category Badge */}
                  <View className="flex-row mb-4">
                    <View className="bg-library-primary px-3 py-1 rounded-full">
                      <Text className="text-white text-xs font-medium uppercase">
                        {book.category}
                      </Text>
                    </View>
                  </View>
                  
                  {/* Availability */}
                  <View className="flex-row justify-between items-center p-3 rounded mb-4" style={{ backgroundColor: '#F5F6F5', borderColor: '#D8DBD8', borderWidth: 1 }}>
                    <Text className="text-lg font-semibold" style={{ color: '#2C4A7E' }}>
                      {book.available} / {book.quantity}
                    </Text>
                    <View className="flex-row items-center px-2 py-1 rounded" style={{ backgroundColor: '#0F7B0F' }}>
                      <Text className="text-white text-xs font-medium">✓ Available</Text>
                    </View>
                  </View>
                  
                  {/* Borrow Button */}
                  <TouchableOpacity
                    onPress={() => handleBorrowBook(book._id)}
                    className="w-full py-3 rounded items-center"
                    style={{
                      backgroundColor: book.available === 0 || isLibrarian ? '#C1C6C1' : '#D4A017',
                    }}
                    disabled={book.available === 0 || isLibrarian}
                  >
                    <Text className="font-medium" style={{ 
                      color: book.available === 0 || isLibrarian ? '#8A94A6' : '#FFFFFF' 
                    }}>
                      {isLibrarian ? 'Librarian View' : 'Borrow Book'}
                    </Text>
                  </TouchableOpacity>

                  {/* Librarian Actions */}
                  {isLibrarian && (
                    <View className="flex-row mt-2 gap-2">
                      <TouchableOpacity
                        className="flex-1 py-2 rounded items-center"
                        style={{ backgroundColor: '#5E87B0' }}
                        onPress={() => Alert.alert('Demo', 'Edit book functionality coming soon!')}
                      >
                        <Text className="text-white text-sm font-medium">Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="flex-1 py-2 rounded items-center"
                        style={{ backgroundColor: '#D9534F' }}
                        onPress={() => Alert.alert('Demo', 'Delete book functionality coming soon!')}
                      >
                        <Text className="text-white text-sm font-medium">Delete</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default homePage;