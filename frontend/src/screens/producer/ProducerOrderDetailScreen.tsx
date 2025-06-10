import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { producerAPI } from '../../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { ProducerOrdersStackParamList } from '../../navigation';

type ProducerOrderDetailScreenProps = {
  navigation: NativeStackNavigationProp<ProducerOrdersStackParamList, 'OrderDetail'>;
  route: RouteProp<ProducerOrdersStackParamList, 'OrderDetail'>;
};

const ProducerOrderDetailScreen: React.FC<ProducerOrderDetailScreenProps> = ({ navigation, route }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await producerAPI.getProducerOrders();
      const foundOrder = response.orders.find((o: any) => o.id === orderId);
      
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        Alert.alert('Błąd', 'Nie znaleziono zamówienia');
      }
    } catch (error) {
      console.error('Błąd pobierania szczegółów zamówienia:', error);
      Alert.alert('Błąd', 'Nie udało się pobrać szczegółów zamówienia');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      setUpdatingStatus(true);
      await producerAPI.updateOrderStatus(orderId, newStatus);
      
      // Odśwież dane zamówienia
      await fetchOrderDetails();
      
      Alert.alert('Sukces', `Status zamówienia został zmieniony na: ${getStatusLabel(newStatus)}`);
    } catch (error) {
      console.error('Błąd aktualizacji statusu zamówienia:', error);
      Alert.alert('Błąd', 'Nie udało się zaktualizować statusu zamówienia');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const calculateTotalPrice = (items: any[]) => {
    return items.reduce((total, item) => total + item.price, 0);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a6ea9" />
        <Text style={styles.loadingText}>Ładowanie szczegółów zamówienia...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Nie znaleziono zamówienia</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Wróć</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Zamówienie #{order.id.substring(0, 8)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={styles.statusText}>{getStatusLabel(order.status)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informacje o zamówieniu</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Data złożenia:</Text>
          <Text style={styles.infoValue}>{formatDate(order.createdAt)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Ostatnia aktualizacja:</Text>
          <Text style={styles.infoValue}>{formatDate(order.updatedAt)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Wartość całkowita:</Text>
          <Text style={styles.infoValue}>{order.totalPrice} zł</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informacje o kliencie</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Imię i nazwisko:</Text>
          <Text style={styles.infoValue}>{order.user?.name || 'Nie podano'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{order.user?.email || 'Nie podano'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Produkty</Text>
        {order.items.map((item: any, index: number) => (
          <View key={item.id} style={styles.productCard}>
            <Text style={styles.productName}>{item.product.name}</Text>
            
            <View style={styles.productDetails}>
              {item.style && (
                <View style={styles.productDetail}>
                  <Text style={styles.detailLabel}>Styl:</Text>
                  <Text style={styles.detailValue}>{item.style.name}</Text>
                </View>
              )}
              
              {item.material && (
                <View style={styles.productDetail}>
                  <Text style={styles.detailLabel}>Materiał:</Text>
                  <Text style={styles.detailValue}>{item.material.name}</Text>
                </View>
              )}
              
              {item.finish && (
                <View style={styles.productDetail}>
                  <Text style={styles.detailLabel}>Wykończenie:</Text>
                  <Text style={styles.detailValue}>{item.finish.name}</Text>
                </View>
              )}
              
              <View style={styles.productDetail}>
                <Text style={styles.detailLabel}>Ilość:</Text>
                <Text style={styles.detailValue}>{item.quantity}</Text>
              </View>
              
              <View style={styles.productDetail}>
                <Text style={styles.detailLabel}>Cena:</Text>
                <Text style={styles.detailValue}>{item.price} zł</Text>
              </View>
            </View>
          </View>
        ))}
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Suma:</Text>
          <Text style={styles.totalValue}>{calculateTotalPrice(order.items)} zł</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aktualizacja statusu</Text>
        <View style={styles.statusButtons}>
          <TouchableOpacity
            style={[
              styles.statusButton,
              { backgroundColor: getStatusColor('processing') },
              order.status === 'processing' && styles.statusButtonDisabled
            ]}
            onPress={() => handleUpdateStatus('processing')}
            disabled={order.status === 'processing' || order.status === 'completed' || order.status === 'cancelled' || updatingStatus}
          >
            <Text style={styles.statusButtonText}>W realizacji</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.statusButton,
              { backgroundColor: getStatusColor('completed') },
              order.status === 'completed' && styles.statusButtonDisabled
            ]}
            onPress={() => handleUpdateStatus('completed')}
            disabled={order.status === 'completed' || order.status === 'cancelled' || updatingStatus}
          >
            <Text style={styles.statusButtonText}>Zrealizowane</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.statusButton,
              { backgroundColor: getStatusColor('cancelled') },
              order.status === 'cancelled' && styles.statusButtonDisabled
            ]}
            onPress={() => handleUpdateStatus('cancelled')}
            disabled={order.status === 'completed' || order.status === 'cancelled' || updatingStatus}
          >
            <Text style={styles.statusButtonText}>Anulowane</Text>
          </TouchableOpacity>
        </View>
        
        {updatingStatus && (
          <View style={styles.updatingContainer}>
            <ActivityIndicator size="small" color="#4a6ea9" />
            <Text style={styles.updatingText}>Aktualizowanie statusu...</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#4a6ea9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    maxWidth: '60%',
    textAlign: 'right',
  },
  productCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  productDetails: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  productDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginTop: 5,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a6ea9',
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  statusButtonDisabled: {
    opacity: 0.5,
  },
  statusButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  updatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  updatingText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
});

export default ProducerOrderDetailScreen;
