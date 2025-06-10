import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { producerAPI } from '../../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProducerOrdersStackParamList } from '../../navigation';

type ProducerOrdersScreenProps = {
  navigation: NativeStackNavigationProp<ProducerOrdersStackParamList, 'OrdersList'>;
};

const ProducerOrdersScreen: React.FC<ProducerOrdersScreenProps> = ({ navigation }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await producerAPI.getProducerOrders();
      setOrders(response.orders || []);
    } catch (error) {
      console.error('Błąd pobierania zamówień:', error);
      Alert.alert('Błąd', 'Nie udało się pobrać listy zamówień');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const handleOrderPress = (orderId: string) => {
    navigation.navigate('OrderDetail', { orderId });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Szkic';
      case 'submitted':
        return 'Złożone';
      case 'processing':
        return 'W realizacji';
      case 'completed':
        return 'Zrealizowane';
      case 'cancelled':
        return 'Anulowane';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return '#999';
      case 'submitted':
        return '#4a6ea9';
      case 'processing':
        return '#f5a623';
      case 'completed':
        return '#7ed321';
      case 'cancelled':
        return '#d0021b';
      default:
        return '#333';
    }
  };

  const renderOrderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => handleOrderPress(item.id)}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>Zamówienie #{item.id.substring(0, 8)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
        </View>
      </View>
      
      <View style={styles.orderInfo}>
        <Text style={styles.orderDate}>Data: {formatDate(item.createdAt)}</Text>
        <Text style={styles.orderCustomer}>
          Klient: {item.user?.name || 'Nieznany'} ({item.user?.email || 'Brak email'})
        </Text>
        <Text style={styles.orderItems}>Liczba produktów: {item.items.length}</Text>
        <Text style={styles.orderTotal}>Wartość: {item.totalPrice} zł</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Zamówienia</Text>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a6ea9" />
          <Text style={styles.loadingText}>Ładowanie zamówień...</Text>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nie masz jeszcze żadnych zamówień</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.ordersList}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  ordersList: {
    padding: 15,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 15,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  orderInfo: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  orderCustomer: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  orderItems: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4a6ea9',
  },
});

export default ProducerOrdersScreen;
