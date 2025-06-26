import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import wishlistService from '../lib/services/wishlist';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const Wishlist = ({ navigation }) => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResources() {
      try {
        await Font.loadAsync({
          'MyFont-Regular': require('../assets/font/PTSerif-Regular.ttf'),
        });
        setFontLoaded(true);

        const items = await wishlistService.fetchWishlist();
        setWishlistItems(items);
      } catch (error) {
        console.error('Error loading resources:', error);
      } finally {
        setLoading(false);
      }
    }
    loadResources();
  }, []);

  const removeFromWishlist = async (itemId) => {
    const success = await wishlistService.removeFromWishlist(itemId);
    if (success) {
      setWishlistItems(wishlistItems.filter(item => item.id !== itemId));
    }
  };

  const navigateToProductDetail = (product) => {
    navigation.navigate('Home', { screen: 'ProductDetail', params: { product } });
  };

  const renderRightActions = (itemId) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => removeFromWishlist(itemId)}
    >
      <Ionicons name="trash-outline" size={24} color="#fff" />
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(item.id)}
      overshootRight={false}
    >
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => navigateToProductDetail(item.product)}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.product.imageUrl || 'https://via.placeholder.com/60' }}
            style={styles.itemImage}
          />
        </View>
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.product.name}</Text>
          <Text style={styles.itemPrice}>RM {item.product.price.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  if (!fontLoaded || loading) {
    return null;
  }

  return (
    <View style={styles.container}>
      {wishlistItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your wishlist is empty</Text>
        </View>
      ) : (
        <FlatList
          data={wishlistItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8d7d6',
  },
  listContent: {
    padding: 20,
    paddingBottom: 100, 
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 5,
    marginRight: 15,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D2D2D',
    fontFamily: 'MyFont-Regular',
  },
  itemPrice: {
    fontSize: 14,
    color: '#AD1457',
    fontWeight: '600',
    marginTop: 5,
    fontFamily: 'MyFont-Regular',
  },
  deleteButton: {
    backgroundColor: '#AD1457',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 'auto',
    borderRadius: 10,
    marginBottom: 15,
    paddingVertical: 15,
    marginLeft: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'MyFont-Regular',
  },
});

export default Wishlist;